// Leaflet Map Controller with Festive Markers, Urban Amenities, OSRM Real Road Snapping & Live GPS Navigation

export class PujaMapController {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.onPandalToggle = options.onPandalToggle || null;
    this.onLocationUpdate = options.onLocationUpdate || null;

    // Kolkata Center (around Shyambazar / Central)
    this.defaultCenter = [22.585, 88.375];
    this.defaultZoom = 13;

    // Layer groups
    this.map = null;
    this.routeLayer = null;
    this.activeNavLayer = null;
    this.pandalsLayer = null;
    this.hubsLayer = null;
    this.userLocationLayer = null;
    this.foodLayer = null;
    this.washroomsLayer = null;
    this.metroLayer = null;
    this.atmsLayer = null;
    this.policeLayer = null;

    // GPS & Orientation state
    this.watchId = null;
    this.currentUserLocation = null;
    this.currentHeading = 0;
    this.userMarker = null;
    this.accuracyCircle = null;

    this.initMap();
    this.initOrientationListener();
    this.startLocationWatch();
  }

  initMap() {
    if (!window.L) {
      console.error('Leaflet JS is not loaded.');
      return;
    }

    this.map = L.map(this.containerId, {
      center: this.defaultCenter,
      zoom: this.defaultZoom,
      zoomControl: true,
      maxZoom: 19,
      minZoom: 10
    });

    // CartoDB Voyager festive warm tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Kolkata Puja Guide',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    // Initialize layer groups in z-order
    this.routeLayer = L.layerGroup().addTo(this.map);
    this.activeNavLayer = L.layerGroup().addTo(this.map);
    this.pandalsLayer = L.layerGroup().addTo(this.map);
    this.hubsLayer = L.layerGroup().addTo(this.map);
    this.foodLayer = L.layerGroup().addTo(this.map);
    this.washroomsLayer = L.layerGroup().addTo(this.map);
    this.metroLayer = L.layerGroup().addTo(this.map);
    this.atmsLayer = L.layerGroup().addTo(this.map);
    this.policeLayer = L.layerGroup().addTo(this.map);
    this.userLocationLayer = L.layerGroup().addTo(this.map);
  }

  initOrientationListener() {
    const handleOrientation = (e) => {
      let heading = null;
      if (e.webkitCompassHeading !== undefined) {
        // iOS Safari true compass heading
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android DeviceOrientation (counter-clockwise, convert to clockwise compass)
        heading = 360 - e.alpha;
      }

      if (heading !== null && heading !== undefined) {
        this.currentHeading = Math.round(heading);
        this.updateUserMarkerHeading(this.currentHeading);
      }
    };

    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }

  startLocationWatch() {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    const geoSuccess = (pos) => {
      const { latitude, longitude, accuracy, heading } = pos.coords;
      this.currentUserLocation = { lat: latitude, lng: longitude, accuracy };

      if (heading !== null && heading !== undefined && !isNaN(heading)) {
        this.currentHeading = Math.round(heading);
      }

      this.renderUserLocation(latitude, longitude, accuracy, this.currentHeading);

      if (this.onLocationUpdate) {
        this.onLocationUpdate(this.currentUserLocation, this.currentHeading);
      }
    };

    const geoError = (err) => {
      console.warn('[GPS] Geolocation watch error / permission:', err.message);
    };

    this.watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 10000
    });
  }

  renderUserLocation(lat, lng, accuracy, heading = 0) {
    if (!this.map) return;

    // 1. Update or create accuracy circle
    if (!this.accuracyCircle) {
      this.accuracyCircle = L.circle([lat, lng], {
        radius: accuracy || 25,
        color: '#1a73e8',
        fillColor: '#1a73e8',
        fillOpacity: 0.12,
        weight: 1.5,
        interactive: false
      }).addTo(this.userLocationLayer);
    } else {
      this.accuracyCircle.setLatLng([lat, lng]);
      this.accuracyCircle.setRadius(accuracy || 25);
    }

    // 2. Update or create user marker with directional heading cone
    const markerHtml = `
      <div class="user-gps-marker">
        <div class="gps-heading-beam" style="transform: rotate(${heading}deg);">
          <div class="beam-cone"></div>
        </div>
        <div class="gps-pulse-halo"></div>
        <div class="gps-core-dot"></div>
      </div>
    `;

    if (!this.userMarker) {
      const userIcon = L.divIcon({
        className: 'user-gps-icon-wrap',
        html: markerHtml,
        iconSize: [60, 60],
        iconAnchor: [30, 30]
      });

      this.userMarker = L.marker([lat, lng], {
        icon: userIcon,
        zIndexOffset: 1000,
        interactive: true
      }).bindPopup(`
        <div class="user-loc-popup">
          <h4>📍 Your Current Location</h4>
          <p>Accuracy: ~${Math.round(accuracy || 15)} meters</p>
          <button class="popup-btn-use-start" onclick="window.app.useCurrentLocationAsStart()">
            🚀 Start Tour From Here
          </button>
        </div>
      `).addTo(this.userLocationLayer);
    } else {
      this.userMarker.setLatLng([lat, lng]);
      const el = this.userMarker.getElement();
      if (el) {
        const beam = el.querySelector('.gps-heading-beam');
        if (beam) {
          beam.style.transform = `rotate(${heading}deg)`;
        }
      }
    }
  }

  updateUserMarkerHeading(heading) {
    if (this.userMarker) {
      const el = this.userMarker.getElement();
      if (el) {
        const beam = el.querySelector('.gps-heading-beam');
        if (beam) {
          beam.style.transform = `rotate(${heading}deg)`;
        }
      }
    }
  }

  centerOnUser(zoom = 17) {
    if (this.currentUserLocation) {
      this.panToLocation(this.currentUserLocation.lat, this.currentUserLocation.lng, zoom);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          this.currentUserLocation = { lat: latitude, lng: longitude, accuracy };
          this.renderUserLocation(latitude, longitude, accuracy, this.currentHeading);
          this.panToLocation(latitude, longitude, zoom);
        },
        (err) => {
          alert('Unable to retrieve your current location. Please ensure location permissions are enabled in your browser/device.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }

  setLayerVisibility(layerKey, isVisible) {
    const layerMap = {
      food: this.foodLayer,
      washrooms: this.washroomsLayer,
      metro: this.metroLayer,
      atms: this.atmsLayer,
      police: this.policeLayer
    };

    const targetLayer = layerMap[layerKey];
    if (!targetLayer) return;

    if (isVisible) {
      if (!this.map.hasLayer(targetLayer)) {
        this.map.addLayer(targetLayer);
      }
    } else {
      if (this.map.hasLayer(targetLayer)) {
        this.map.removeLayer(targetLayer);
      }
    }
  }

  panToLocation(lat, lng, zoom = 16) {
    if (this.map) {
      this.map.setView([lat, lng], zoom, { animate: true, duration: 0.8 });
    }
  }

  /**
   * Highlight active leg from current position to next pandal during navigation
   */
  async highlightActiveLeg(fromLoc, toLoc) {
    this.activeNavLayer.clearLayers();
    if (!fromLoc || !toLoc) return;

    // Instant direct polyline
    const directLine = L.polyline([[fromLoc.lat, fromLoc.lng], [toLoc.lat, toLoc.lng]], {
      color: '#00b0ff',
      weight: 6,
      opacity: 0.9,
      dashArray: '6, 6'
    }).addTo(this.activeNavLayer);

    // Try road snapping
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromLoc.lng.toFixed(6)},${fromLoc.lat.toFixed(6)};${toLoc.lng.toFixed(6)},${toLoc.lat.toFixed(6)}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          this.activeNavLayer.clearLayers();

          // Outer glowing route line
          L.polyline(coords, {
            color: '#00e5ff',
            weight: 9,
            opacity: 0.5,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(this.activeNavLayer);

          // Inner solid active navigation line
          L.polyline(coords, {
            color: '#0091ea',
            weight: 6,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(this.activeNavLayer);
        }
      }
    } catch (e) {
      console.warn('Active leg road snap fallback:', e.message);
    }
  }

  clearActiveNavHighlight() {
    this.activeNavLayer.clearLayers();
  }

  /**
   * Render Pandals with numbered badges for selected stops
   */
  renderPandals(allPandals, selectedIdsSet, orderedStops = []) {
    this.pandalsLayer.clearLayers();

    // Map pandal ID to sequence stop number
    const sequenceMap = new Map();
    orderedStops.forEach(stop => {
      if (stop.type === 'pandal') {
        sequenceMap.set(stop.id, stop.pandalIndex);
      }
    });

    allPandals.forEach(p => {
      const isSelected = selectedIdsSet.has(p.id);
      const stopNumber = sequenceMap.get(p.id);

      const markerHtml = `
        <div class="custom-pandal-pin ${isSelected ? 'is-selected' : 'is-unselected'}">
          <div class="pin-inner">
            ${isSelected && stopNumber ? `<span class="pin-num">${stopNumber}</span>` : '🪔'}
          </div>
          <div class="pin-pulse"></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'festive-pin-wrapper',
        html: markerHtml,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -40]
      });

      const gmapsLink = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

      const popupContent = `
        <div class="pandal-popup-card">
          <div class="popup-badge-row">
            <span class="popup-zone-badge zone-${p.zone}">${p.zone.toUpperCase()}</span>
            <span class="popup-crowd-badge crowd-${p.crowdRating.toLowerCase()}">🔥 ${p.crowdRating} Crowd</span>
          </div>
          <h4 class="popup-title">${p.name}</h4>
          <h5 class="popup-bengali">${p.bengaliName || ''}</h5>
          <p class="popup-theme">✨ <em>${p.famousFor}</em></p>
          
          <div class="popup-details-grid">
            <div class="detail-item">🚇 <strong>Metro:</strong> ${p.nearestMetro}</div>
            <div class="detail-item">🚪 <strong>Entry:</strong> ${p.entryGate || 'Main Gate'}</div>
            <div class="detail-item">⏰ <strong>Best Hours:</strong> ${p.bestTimeToVisit}</div>
          </div>

          <div class="popup-actions">
            <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" class="popup-btn popup-btn-gmaps">
              🧭 Navigate (Google Maps)
            </a>
            <button onclick="window.togglePandalFromMap('${p.id}')" class="popup-btn ${isSelected ? 'popup-btn-remove' : 'popup-btn-add'}">
              ${isSelected ? '✕ Remove from Route' : '✓ Add to My Route'}
            </button>
          </div>
        </div>
      `;

      const marker = L.marker([p.lat, p.lng], { icon })
        .bindPopup(popupContent, { maxWidth: 320, className: 'festive-popup' });

      this.pandalsLayer.addLayer(marker);
    });
  }

  /**
   * Renders Start/End hubs and realistic road-snapped polyline
   */
  async renderRoute(routeData, selectedIdsSet) {
    this.routeLayer.clearLayers();
    this.hubsLayer.clearLayers();

    if (!routeData || !routeData.orderedStops || routeData.orderedStops.length === 0) {
      return;
    }

    const { startHub, endHub, orderedStops } = routeData;

    // 1. Render Start Hub Marker
    const startIcon = L.divIcon({
      className: 'hub-pin-wrapper start-pin',
      html: `
        <div class="hub-pin start-hub-marker">
          <span class="hub-icon">🚀</span>
          <span class="hub-label">START</span>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    const startMarker = L.marker([startHub.lat, startHub.lng], { icon: startIcon })
      .bindPopup(`
        <div class="hub-popup">
          <h4>🚀 Starting Node: ${startHub.name}</h4>
          <p>${startHub.bengaliName || ''} - ${startHub.type || 'Corridor Origin'}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${startHub.lat},${startHub.lng}" target="_blank" class="popup-btn-gmaps">🧭 Navigate to Start</a>
        </div>
      `);
    this.hubsLayer.addLayer(startMarker);

    // 2. Render End Hub Marker
    const endIcon = L.divIcon({
      className: 'hub-pin-wrapper end-pin',
      html: `
        <div class="hub-pin end-hub-marker">
          <span class="hub-icon">🏁</span>
          <span class="hub-label">FINISH</span>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    const endMarker = L.marker([endHub.lat, endHub.lng], { icon: endIcon })
      .bindPopup(`
        <div class="hub-popup">
          <h4>🏁 Destination Hub: ${endHub.name}</h4>
          <p>${endHub.bengaliName || ''} - ${endHub.type || 'Destination'}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${endHub.lat},${endHub.lng}" target="_blank" class="popup-btn-gmaps">🧭 Navigate to End</a>
        </div>
      `);
    this.hubsLayer.addLayer(endMarker);

    // 3. Immediately draw a high-visibility route line so it is NEVER blank!
    const waypoints = orderedStops.map(s => [s.lat, s.lng]);
    const fallbackPolyline = L.polyline(waypoints, {
      color: '#ff6600',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.routeLayer);

    // Fit map bounds initially
    if (waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints);
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

    // 4. Fetch real street road geometry from OSRM for curved roads
    const roadCoordinates = await this.fetchAndDrawRealRoads(orderedStops);

    if (roadCoordinates && roadCoordinates.length > 0) {
      this.routeLayer.clearLayers();

      // Outer festive glow under-layer
      L.polyline(roadCoordinates, {
        color: '#ff3d00',
        weight: 9,
        opacity: 0.45,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.routeLayer);

      // Main crisp road path
      L.polyline(roadCoordinates, {
        color: '#ff6600',
        weight: 6,
        opacity: 0.95,
        dashArray: '8, 6',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.routeLayer);
    }
  }

  /**
   * Queries OpenStreetMap OSRM public API to snap path to real Kolkata road curves
   */
  async fetchAndDrawRealRoads(stops) {
    if (!stops || stops.length < 2) return null;

    try {
      // OSRM expects: lng,lat;lng,lat;...
      const coordsString = stops.map(s => `${s.lng.toFixed(6)},${s.lat.toFixed(6)}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) return null;

      const data = await response.json();
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        // GeoJSON coordinates are [lng, lat], Leaflet polyline requires [lat, lng]
        return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      }
    } catch (e) {
      console.warn('OSRM road snapping fallback to direct lines:', e.message);
    }
    return null;
  }

  renderFood(foodSpots) {
    this.foodLayer.clearLayers();
    foodSpots.forEach(f => {
      const icon = L.divIcon({
        className: 'amenity-pin food-pin',
        html: `<div class="amenity-icon">🍽️</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const popup = `
        <div class="amenity-popup">
          <h4>🍽️ ${f.name}</h4>
          <p class="amenity-bengali">${f.bengaliName || ''}</p>
          <p><strong>Specialty:</strong> ${f.famousDishes ? f.famousDishes.join(', ') : f.specialty}</p>
          <p>📍 ${f.locality} | ₹${f.priceRange || 'Moderate'}</p>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.name + ' Kolkata')}" target="_blank" class="popup-btn-gmaps">🧭 Find on Google Maps</a>
        </div>
      `;

      L.marker([f.lat, f.lng], { icon }).bindPopup(popup).addTo(this.foodLayer);
    });
  }

  renderWashrooms(washrooms) {
    this.washroomsLayer.clearLayers();
    washrooms.forEach(w => {
      const icon = L.divIcon({
        className: 'amenity-pin washroom-pin',
        html: `<div class="amenity-icon">🚻</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const popup = `
        <div class="amenity-popup">
          <h4>🚻 Public Washroom / Bio-Toilet</h4>
          <p>📍 ${w.name}</p>
          <p>Cleanliness: ${w.cleanliness || 'Good'} | Type: ${w.type || 'KMC / Pay & Use'}</p>
        </div>
      `;

      L.marker([w.lat, w.lng], { icon }).bindPopup(popup).addTo(this.washroomsLayer);
    });
  }

  renderMetro(stations) {
    this.metroLayer.clearLayers();
    stations.forEach(m => {
      const icon = L.divIcon({
        className: 'amenity-pin metro-pin',
        html: `<div class="amenity-icon">🚇</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const popup = `
        <div class="amenity-popup">
          <h4>🚇 ${m.name} (${m.line || 'Blue Line'})</h4>
          <p>All-night festive metro services operational.</p>
        </div>
      `;

      L.marker([m.lat, m.lng], { icon }).bindPopup(popup).addTo(this.metroLayer);
    });
  }

  renderATMs(atms) {
    this.atmsLayer.clearLayers();
    atms.forEach(a => {
      const icon = L.divIcon({
        className: 'amenity-pin atm-pin',
        html: `<div class="amenity-icon">🏧</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const popup = `
        <div class="amenity-popup">
          <h4>🏧 ${a.bank || 'ATM'}</h4>
          <p>📍 ${a.name}</p>
        </div>
      `;

      L.marker([a.lat, a.lng], { icon }).bindPopup(popup).addTo(this.atmsLayer);
    });
  }

  renderPolice(policeBooths) {
    this.policeLayer.clearLayers();
    policeBooths.forEach(p => {
      const icon = L.divIcon({
        className: 'amenity-pin police-pin',
        html: `<div class="amenity-icon">👮</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const popup = `
        <div class="amenity-popup">
          <h4>👮 Kolkata Police Assistance Booth</h4>
          <p>📍 ${p.name}</p>
          <p>Emergency: 100 / 112 | Kolkata Police Helpline: 1090</p>
        </div>
      `;

      L.marker([p.lat, p.lng], { icon }).bindPopup(popup).addTo(this.policeLayer);
    });
  }
}
