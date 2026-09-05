// Leaflet Map Controller with Festive Markers, Urban Amenities, OSRM Real Road Snapping & Google Maps Integration

export class PujaMapController {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.onPandalToggle = options.onPandalToggle || null;

    // Kolkata Center (around Shyambazar / Central)
    this.defaultCenter = [22.585, 88.375];
    this.defaultZoom = 13;

    // Layer groups
    this.map = null;
    this.routeLayer = null;
    this.pandalsLayer = null;
    this.hubsLayer = null;
    this.foodLayer = null;
    this.washroomsLayer = null;
    this.metroLayer = null;
    this.atmsLayer = null;
    this.policeLayer = null;

    this.initMap();
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

    // Initialize layer groups
    this.routeLayer = L.layerGroup().addTo(this.map);
    this.pandalsLayer = L.layerGroup().addTo(this.map);
    this.hubsLayer = L.layerGroup().addTo(this.map);
    this.foodLayer = L.layerGroup().addTo(this.map);
    this.washroomsLayer = L.layerGroup().addTo(this.map);
    this.metroLayer = L.layerGroup().addTo(this.map);
    this.atmsLayer = L.layerGroup().addTo(this.map);
    this.policeLayer = L.layerGroup().addTo(this.map);
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
          <p>${startHub.bengaliName || ''} - ${startHub.type}</p>
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
          <p>${endHub.bengaliName || ''} - ${endHub.type}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${endHub.lat},${endHub.lng}" target="_blank" class="popup-btn-gmaps">🧭 Navigate to End</a>
        </div>
      `);
    this.hubsLayer.addLayer(endMarker);

    // 3. Fetch real road geometry from OSRM for street-snapped curving lines
    const waypoints = orderedStops.map(s => [s.lat, s.lng]);
    const roadCoordinates = await this.fetchAndDrawRealRoads(orderedStops);

    if (roadCoordinates && roadCoordinates.length > 0) {
      // Glow under-layer
      L.polyline(roadCoordinates, {
        color: '#ff4d00',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.routeLayer);

      // Main crisp road path
      L.polyline(roadCoordinates, {
        color: '#ff6600',
        weight: 5,
        opacity: 0.95,
        dashArray: '8, 6',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.routeLayer);
    } else {
      // Graceful fallback: straight dashed path
      L.polyline(waypoints, {
        color: '#ff6600',
        weight: 5,
        opacity: 0.9,
        dashArray: '10, 8'
      }).addTo(this.routeLayer);
    }

    // Fit map bounds to encompass the entire route
    const allPoints = orderedStops.map(s => [s.lat, s.lng]);
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
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
