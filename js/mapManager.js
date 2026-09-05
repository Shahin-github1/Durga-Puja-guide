// Unified Dual-Engine Map Manager (Google Maps + OpenStreetMap with Zero-Downtime Failover)
import { PujaMapController } from './map.js?v=7';
import { GoogleMapController } from './googleMap.js?v=7';
import { CONFIG } from './config.js?v=7';

export class MapManager {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.onPandalToggle = options.onPandalToggle || null;
    this.onLocationUpdate = options.onLocationUpdate || null;
    this.onEngineChange = options.onEngineChange || null;

    this.activeEngine = 'leaflet'; // 'google' or 'leaflet'
    this.controller = null;
    this.cachedData = {
      allPandals: null,
      selectedIds: null,
      orderedStops: null,
      routeData: null,
      amenities: {}
    };

    this.currentUserLocation = null;
    this.currentHeading = 0;

    this.init();
  }

  async init() {
    const preferred = CONFIG.getMapProvider();
    const apiKey = CONFIG.getGoogleApiKey();
    const quotaExceeded = CONFIG.isQuotaExceeded();

    if ((preferred === 'google' || preferred === 'auto') && apiKey && !quotaExceeded) {
      try {
        console.log('[MapManager] Attempting to load Google Maps Engine...');
        const googleCtrl = new GoogleMapController(this.containerId, {
          onPandalToggle: this.onPandalToggle,
          onLocationUpdate: (loc, heading) => this.handleLocationUpdate(loc, heading),
          onError: (err) => this.handleGoogleError(err)
        });

        await googleCtrl.init(apiKey);
        this.controller = googleCtrl;
        this.activeEngine = 'google';
        this.updateEngineBadge();
        console.log('[MapManager] Google Maps Engine loaded successfully!');
        return;
      } catch (err) {
        console.warn('[MapManager] Google Maps failed to load:', err.message);
        this.showEngineNotification(`Switched to free OpenStreetMap: ${err.message}`);
      }
    }

    // Fallback to Leaflet Engine
    this.initLeafletEngine();
  }

  initLeafletEngine() {
    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = '';

    console.log('[MapManager] Initializing Leaflet / OpenStreetMap Engine...');
    this.controller = new PujaMapController(this.containerId, {
      onPandalToggle: this.onPandalToggle,
      onLocationUpdate: (loc, heading) => this.handleLocationUpdate(loc, heading)
    });
    this.activeEngine = 'leaflet';
    this.updateEngineBadge();

    // Replay any cached data
    this.restoreCachedData();
  }

  handleGoogleError(err) {
    console.warn('[MapManager] Google Maps error occurred:', err.message);
    this.showEngineNotification(`🛡️ Protected your quota: ${err.message}. Switched to OpenStreetMap engine.`);
    this.initLeafletEngine();
  }

  async switchEngine(engineName, apiKey = null) {
    if (apiKey) {
      CONFIG.setGoogleApiKey(apiKey);
    }
    CONFIG.setMapProvider(engineName);

    if (engineName === 'google') {
      const key = CONFIG.getGoogleApiKey();
      if (!key) {
        alert('Please enter a valid Google Maps API Key first in the "Manage Data" modal.');
        return;
      }
      try {
        const googleCtrl = new GoogleMapController(this.containerId, {
          onPandalToggle: this.onPandalToggle,
          onLocationUpdate: (loc, heading) => this.handleLocationUpdate(loc, heading),
          onError: (err) => this.handleGoogleError(err)
        });
        await googleCtrl.init(key);
        this.controller = googleCtrl;
        this.activeEngine = 'google';
        this.updateEngineBadge();
        this.restoreCachedData();
        this.showEngineNotification('✓ Google Maps engine activated with live Google traffic and directions!');
      } catch (e) {
        alert(`Google Maps failed to initialize: ${e.message}. Staying on OpenStreetMap.`);
        this.initLeafletEngine();
      }
    } else {
      this.initLeafletEngine();
      this.showEngineNotification('✓ Switched to OpenStreetMap / Leaflet engine (100% Free & Unlimited).');
    }

    if (this.onEngineChange) {
      this.onEngineChange(this.activeEngine);
    }
  }

  handleLocationUpdate(loc, heading) {
    this.currentUserLocation = loc;
    this.currentHeading = heading;
    if (this.onLocationUpdate) {
      this.onLocationUpdate(loc, heading);
    }
  }

  updateEngineBadge() {
    const badge = document.getElementById('mapEngineBadge');
    if (!badge) return;

    if (this.activeEngine === 'google') {
      badge.className = 'engine-badge engine-google';
      badge.innerHTML = `🟢 <strong>Google Maps</strong> (Active)`;
    } else {
      badge.className = 'engine-badge engine-osm';
      badge.innerHTML = `🟠 <strong>OpenStreetMap</strong> (Free Mode)`;
    }
  }

  showEngineNotification(msg) {
    let banner = document.getElementById('engineNoticeBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'engineNoticeBanner';
      banner.className = 'engine-notice-banner';
      const mapSection = document.getElementById('mapSection');
      if (mapSection) mapSection.prepend(banner);
    }

    banner.textContent = msg;
    banner.style.display = 'block';
    setTimeout(() => {
      if (banner) banner.style.display = 'none';
    }, 6000);
  }

  // Unified API forwarding to active controller
  panToLocation(lat, lng, zoom = 16) {
    if (this.controller) this.controller.panToLocation(lat, lng, zoom);
  }

  centerOnUser(zoom = 17) {
    if (this.controller) this.controller.centerOnUser(zoom);
  }

  renderPandals(allPandals, selectedIdsSet, orderedStops = []) {
    this.cachedData.allPandals = allPandals;
    this.cachedData.selectedIds = selectedIdsSet;
    this.cachedData.orderedStops = orderedStops;
    if (this.controller) {
      this.controller.renderPandals(allPandals, selectedIdsSet, orderedStops);
    }
  }

  renderRoute(routeData, selectedIdsSet) {
    this.cachedData.routeData = routeData;
    this.cachedData.selectedIds = selectedIdsSet;
    if (this.controller) {
      this.controller.renderRoute(routeData, selectedIdsSet);
    }
  }

  highlightActiveLeg(fromLoc, toLoc) {
    if (this.controller) this.controller.highlightActiveLeg(fromLoc, toLoc);
  }

  clearActiveNavHighlight() {
    if (this.controller) this.controller.clearActiveNavHighlight();
  }

  setLayerVisibility(layerKey, isVisible) {
    if (this.controller) this.controller.setLayerVisibility(layerKey, isVisible);
  }

  renderFood(items) {
    this.cachedData.amenities.food = items;
    if (this.controller) this.controller.renderFood(items);
  }
  renderWashrooms(items) {
    this.cachedData.amenities.washrooms = items;
    if (this.controller) this.controller.renderWashrooms(items);
  }
  renderMetro(items) {
    this.cachedData.amenities.metro = items;
    if (this.controller) this.controller.renderMetro(items);
  }
  renderATMs(items) {
    this.cachedData.amenities.atms = items;
    if (this.controller) this.controller.renderATMs(items);
  }
  renderPolice(items) {
    this.cachedData.amenities.police = items;
    if (this.controller) this.controller.renderPolice(items);
  }

  restoreCachedData() {
    if (this.cachedData.amenities.food) this.renderFood(this.cachedData.amenities.food);
    if (this.cachedData.amenities.washrooms) this.renderWashrooms(this.cachedData.amenities.washrooms);
    if (this.cachedData.amenities.metro) this.renderMetro(this.cachedData.amenities.metro);
    if (this.cachedData.amenities.atms) this.renderATMs(this.cachedData.amenities.atms);
    if (this.cachedData.amenities.police) this.renderPolice(this.cachedData.amenities.police);

    if (this.cachedData.allPandals && this.cachedData.selectedIds) {
      this.renderPandals(this.cachedData.allPandals, this.cachedData.selectedIds, this.cachedData.orderedStops);
    }
    if (this.cachedData.routeData && this.cachedData.selectedIds) {
      this.renderRoute(this.cachedData.routeData, this.cachedData.selectedIds);
    }
  }
}
