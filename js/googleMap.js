// Google Maps JavaScript API & Directions Controller with Failover Safeguards
import { CONFIG } from './config.js';

export class GoogleMapController {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.onPandalToggle = options.onPandalToggle || null;
    this.onLocationUpdate = options.onLocationUpdate || null;
    this.onError = options.onError || null;

    // Kolkata Center
    this.defaultCenter = { lat: 22.585, lng: 88.375 };
    this.defaultZoom = 13;

    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;

    // Marker collections
    this.pandalMarkers = [];
    this.hubMarkers = [];
    this.amenityMarkers = {
      food: [],
      washrooms: [],
      metro: [],
      atms: [],
      police: []
    };

    this.userMarker = null;
    this.userAccuracyCircle = null;
    this.activeLegPolyline = null;
    this.currentUserLocation = null;
    this.currentHeading = 0;
    this.activeInfoWindow = null;

    this.isLoaded = false;
  }

  async init(apiKey) {
    if (!apiKey) {
      throw new Error('No Google Maps API Key provided.');
    }

    // Intercept Google Maps authentication failure
    window.gm_authFailure = () => {
      console.warn('[Google Maps] Authentication failed. Triggering failover to OpenStreetMap...');
      if (this.onError) {
        this.onError(new Error('Google Maps API authentication failed. Falling back to OpenStreetMap.'));
      }
    };

    await this.loadGoogleMapsScript(apiKey);
    this.initMapInstance();
    this.isLoaded = true;
  }

  loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const scriptId = 'googleMapsScript';
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;

      const timeoutId = setTimeout(() => {
        reject(new Error('Google Maps script load timed out. Falling back to OpenStreetMap.'));
      }, 7000);

      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to load Google Maps script from Google servers.'));
      };

      document.head.appendChild(script);
    });
  }

  initMapInstance() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = '';

    this.map = new google.maps.Map(container, {
      center: this.defaultCenter,
      zoom: this.defaultZoom,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_LEFT
      },
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#ff5722',
        strokeWeight: 6,
        strokeOpacity: 0.95
      }
    });

    this.activeLegPolyline = new google.maps.Polyline({
      map: this.map,
      strokeColor: '#00b0ff',
      strokeWeight: 7,
      strokeOpacity: 0.95,
      zIndex: 100
    });
  }

  panToLocation(lat, lng, zoom = 16) {
    if (this.map) {
      this.map.panTo({ lat, lng });
      if (zoom) this.map.setZoom(zoom);
    }
  }

  centerOnUser(zoom = 17) {
    if (this.currentUserLocation && this.map) {
      this.panToLocation(this.currentUserLocation.lat, this.currentUserLocation.lng, zoom);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          this.currentUserLocation = loc;
          this.renderUserLocation(loc.lat, loc.lng, pos.coords.accuracy, this.currentHeading);
          this.panToLocation(loc.lat, loc.lng, zoom);
        },
        (err) => {
          alert('Could not determine current location. Please enable location permissions.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }

  renderUserLocation(lat, lng, accuracy, heading = 0) {
    if (!this.map) return;
    this.currentUserLocation = { lat, lng };
    this.currentHeading = heading;

    // 1. Accuracy Circle
    if (!this.userAccuracyCircle) {
      this.userAccuracyCircle = new google.maps.Circle({
        map: this.map,
        center: { lat, lng },
        radius: accuracy || 25,
        fillColor: '#1a73e8',
        fillOpacity: 0.15,
        strokeColor: '#1a73e8',
        strokeWeight: 1.5
      });
    } else {
      this.userAccuracyCircle.setCenter({ lat, lng });
      this.userAccuracyCircle.setRadius(accuracy || 25);
    }

    // 2. User Marker with Heading Dot
    if (!this.userMarker) {
      this.userMarker = new google.maps.Marker({
        map: this.map,
        position: { lat, lng },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: '#1a73e8',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        },
        zIndex: 9999,
        title: 'Your Current Location'
      });
    } else {
      this.userMarker.setPosition({ lat, lng });
    }
  }

  renderPandals(allPandals, selectedIdsSet, orderedStops = []) {
    this.clearMarkers(this.pandalMarkers);

    const sequenceMap = new Map();
    orderedStops.forEach(stop => {
      if (stop.type === 'pandal') {
        sequenceMap.set(stop.id, stop.pandalIndex);
      }
    });

    allPandals.forEach(p => {
      const isSelected = selectedIdsSet.has(p.id);
      const stopNumber = sequenceMap.get(p.id);

      const markerColor = isSelected ? '#d32f2f' : '#757575';
      const labelText = isSelected && stopNumber ? stopNumber.toString() : '🪔';

      const marker = new google.maps.Marker({
        map: this.map,
        position: { lat: p.lat, lng: p.lng },
        label: {
          text: labelText,
          color: isSelected ? '#ffd700' : '#ffffff',
          fontWeight: 'bold',
          fontSize: '11px'
        },
        icon: {
          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 Z',
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
          scale: 1.25,
          labelOrigin: new google.maps.Point(0, -30)
        },
        title: p.name
      });

      const gmapsLink = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

      const popupContent = `
        <div style="font-family: Poppins, sans-serif; padding: 4px; max-width: 260px;">
          <div style="font-size: 11px; font-weight: 700; color: #e65100;">${p.zone.toUpperCase()} • 🔥 ${p.crowdRating}</div>
          <h4 style="margin: 2px 0; font-size: 14px; color: #8b0000;">${p.name}</h4>
          <h5 style="margin: 0 0 6px 0; font-size: 12px; color: #e65100;">${p.bengaliName || ''}</h5>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #444;">✨ <em>${p.famousFor}</em></p>
          <div style="font-size: 11px; margin-bottom: 8px;">🚇 <strong>Metro:</strong> ${p.nearestMetro}</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <a href="${gmapsLink}" target="_blank" style="background: #1a73e8; color: #fff; text-align: center; padding: 5px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: bold;">
              🧭 Navigate (Google Maps)
            </a>
            <button onclick="window.togglePandalFromMap('${p.id}')" style="background: ${isSelected ? '#dc3545' : '#28a745'}; color: #fff; border: none; padding: 5px; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">
              ${isSelected ? '✕ Remove from Route' : '✓ Add to Route'}
            </button>
          </div>
        </div>
      `;

      marker.addListener('click', () => {
        if (this.activeInfoWindow) this.activeInfoWindow.close();
        this.activeInfoWindow = new google.maps.InfoWindow({ content: popupContent });
        this.activeInfoWindow.open(this.map, marker);
      });

      this.pandalMarkers.push(marker);
    });
  }

  async renderRoute(routeData, selectedIdsSet) {
    this.clearMarkers(this.hubMarkers);

    if (!routeData || !routeData.orderedStops || routeData.orderedStops.length === 0) {
      if (this.directionsRenderer) this.directionsRenderer.setDirections({ routes: [] });
      return;
    }

    const { startHub, endHub, orderedStops } = routeData;

    // 1. Start Hub Marker
    const startMarker = new google.maps.Marker({
      map: this.map,
      position: { lat: startHub.lat, lng: startHub.lng },
      label: { text: '🚀', fontSize: '13px' },
      title: `Start: ${startHub.name}`
    });
    this.hubMarkers.push(startMarker);

    // 2. End Hub Marker
    const endMarker = new google.maps.Marker({
      map: this.map,
      position: { lat: endHub.lat, lng: endHub.lng },
      label: { text: '🏁', fontSize: '13px' },
      title: `Destination: ${endHub.name}`
    });
    this.hubMarkers.push(endMarker);

    // Check Daily Quota Cap
    if (CONFIG.isQuotaExceeded()) {
      console.warn('[Google Maps] Daily quota limit reached! Failing over to OpenStreetMap...');
      if (this.onError) {
        this.onError(new Error('Daily Google API quota reached. Switched to OpenStreetMap engine to protect your billing.'));
      }
      return;
    }

    // 3. Request Google Directions
    const origin = new google.maps.LatLng(startHub.lat, startHub.lng);
    const destination = new google.maps.LatLng(endHub.lat, endHub.lng);

    // Intermediate waypoints (Google allows up to 23 waypoints)
    const intermediateStops = orderedStops.slice(1, -1);
    const waypoints = intermediateStops.slice(0, 23).map(s => ({
      location: new google.maps.LatLng(s.lat, s.lng),
      stopover: true
    }));

    CONFIG.incrementUsage();

    this.directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
        } else {
          console.warn('[Google Directions] Failed:', status);
          if (status === 'OVER_QUERY_LIMIT' || status === 'REQUEST_DENIED') {
            if (this.onError) {
              this.onError(new Error(`Google Directions status: ${status}. Falling back to OpenStreetMap.`));
            }
          }
        }
      }
    );
  }

  highlightActiveLeg(fromLoc, toLoc) {
    if (!this.map || !this.activeLegPolyline || !fromLoc || !toLoc) return;

    this.activeLegPolyline.setPath([
      new google.maps.LatLng(fromLoc.lat, fromLoc.lng),
      new google.maps.LatLng(toLoc.lat, toLoc.lng)
    ]);
  }

  clearActiveNavHighlight() {
    if (this.activeLegPolyline) {
      this.activeLegPolyline.setPath([]);
    }
  }

  renderFood(foodSpots) {
    this.renderAmenityLayer('food', foodSpots, '🍽️');
  }
  renderWashrooms(washrooms) {
    this.renderAmenityLayer('washrooms', washrooms, '🚻');
  }
  renderMetro(stations) {
    this.renderAmenityLayer('metro', stations, '🚇');
  }
  renderATMs(atms) {
    this.renderAmenityLayer('atms', atms, '🏧');
  }
  renderPolice(policeBooths) {
    this.renderAmenityLayer('police', policeBooths, '👮');
  }

  renderAmenityLayer(key, items, iconText) {
    this.clearMarkers(this.amenityMarkers[key]);
    items.forEach(item => {
      const marker = new google.maps.Marker({
        map: this.map,
        position: { lat: item.lat, lng: item.lng },
        label: { text: iconText, fontSize: '12px' },
        title: item.name
      });
      this.amenityMarkers[key].push(marker);
    });
  }

  setLayerVisibility(key, isVisible) {
    const list = this.amenityMarkers[key] || [];
    list.forEach(m => m.setMap(isVisible ? this.map : null));
  }

  clearMarkers(markerArray) {
    if (!markerArray) return;
    markerArray.forEach(m => m.setMap(null));
    markerArray.length = 0;
  }
}
