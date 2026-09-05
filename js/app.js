// Sharod Sathi (শারদ সাথী) - Main Application Controller
import { TRANSIT_HUBS } from './data/hubs.js';
import { FOOD_SPOTS } from './data/food.js';
import { AMENITIES } from './data/amenities.js';
import { pandalManager } from './data/pandalManager.js';
import { optimizeRouteSequence } from './routing/optimizer.js';
import { PujaMapController } from './map.js';
import { PandalChecklist } from './checklist.js';
import { ItineraryView } from './itinerary.js';
import { initPWA } from './pwa.js';

class SharodSathiApp {
  constructor() {
    // Application State
    this.selectedZone = 'all';
    this.startHubId = 'hub_dumdum_jn'; // Default matching user's flagship requirement
    this.endHubId = 'hub_sealdah';     // Default matching user's flagship requirement

    // Initial default selected pandals for the Dum Dum -> Sealdah transit corridor
    this.selectedPandalIds = new Set([
      'pandal_dumdum_tarun_sangha',
      'pandal_sreebhumi',
      'pandal_tala_barowari',
      'pandal_bagbazar',
      'pandal_sovabazar_rajbari',
      'pandal_kumartuli_park',
      'pandal_college_square',
      'pandal_santosh_mitra_sq'
    ]);

    // Store global reference for popup actions
    window._currentPandals = pandalManager.getAll();
    window.togglePandalFromMap = (id) => this.handlePandalToggle(id);

    // Sub-controllers
    this.mapController = null;
    this.checklist = null;
    this.itineraryView = null;

    this.init();
  }

  init() {
    initPWA();
    this.initControllers();
    this.populateHubSelectors();
    this.attachEventListeners();
    this.attachDataModalListeners();
    this.calculateAndRenderRoute();
  }

  initControllers() {
    // 1. Initialize Map
    this.mapController = new PujaMapController('mapContainer', {
      onPandalToggle: (id) => this.handlePandalToggle(id)
    });

    // Render all initial map layers
    this.mapController.renderFood(FOOD_SPOTS);
    this.mapController.renderWashrooms(AMENITIES.washrooms);
    this.mapController.renderMetro(AMENITIES.metroStations);
    this.mapController.renderATMs(AMENITIES.atms);
    this.mapController.renderPolice(AMENITIES.policeBooths);

    // Default layer visibility states
    this.mapController.setLayerVisibility('atms', false);
    this.mapController.setLayerVisibility('police', false);

    // 2. Initialize Checklist
    this.checklist = new PandalChecklist('checklistContainer', pandalManager.getAll(), {
      initialSelected: Array.from(this.selectedPandalIds),
      onSelectionChange: (selectedSet) => {
        this.selectedPandalIds = new Set(selectedSet);
        this.calculateAndRenderRoute();
      },
      onFocusPandal: (pandal) => {
        this.mapController.panToLocation(pandal.lat, pandal.lng, 16);
        document.getElementById('mapSection').scrollIntoView({ behavior: 'smooth' });
      }
    });

    // 3. Initialize Itinerary
    this.itineraryView = new ItineraryView('itineraryContainer', {
      onFocusLocation: (lat, lng) => {
        this.mapController.panToLocation(lat, lng, 16);
        document.getElementById('mapSection').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  attachDataModalListeners() {
    const modal = document.getElementById('dataModal');
    const btnOpen = document.getElementById('btnOpenDataModal');
    const btnClose = document.getElementById('btnCloseModal');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }

    if (btnClose && modal) {
      btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    // Modal Tabs
    const tabBtns = document.querySelectorAll('.modal-tab-btn');
    const tabPanes = document.querySelectorAll('.modal-tab-pane');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.style.display = 'none');
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-modal-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.style.display = 'block';
      });
    });

    // Tab 1: Trigger Remote Sync
    const btnSync = document.getElementById('btnTriggerSync');
    const syncStatus = document.getElementById('syncStatusMsg');
    const syncUrlInput = document.getElementById('remoteSyncUrl');

    if (btnSync) {
      btnSync.addEventListener('click', async () => {
        syncStatus.className = 'status-msg';
        syncStatus.textContent = '⏳ Fetching latest data from internet...';
        try {
          const count = await pandalManager.syncFromRemoteUrl(syncUrlInput.value);
          syncStatus.className = 'status-msg success';
          syncStatus.textContent = `✓ Successfully updated database with ${count} pandals from remote URL!`;
          this.refreshPandalData();
        } catch (err) {
          syncStatus.className = 'status-msg error';
          syncStatus.textContent = `✕ Sync failed: ${err.message}`;
        }
      });
    }

    // Reset Defaults
    const btnReset = document.getElementById('btnResetDefaults');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Reset pandal database back to the original 45 curated pujas?')) {
          pandalManager.resetToDefaults();
          syncStatus.className = 'status-msg success';
          syncStatus.textContent = '✓ Database reset to original 45 verified pandals.';
          this.refreshPandalData();
        }
      });
    }

    // Tab 2: Add Pandal Form
    const addForm = document.getElementById('addPandalForm');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPandal = {
          name: document.getElementById('newPandalName').value.trim(),
          bengaliName: document.getElementById('newPandalBengali').value.trim() || document.getElementById('newPandalName').value.trim(),
          zone: document.getElementById('newPandalZone').value,
          lat: parseFloat(document.getElementById('newPandalLat').value),
          lng: parseFloat(document.getElementById('newPandalLng').value),
          famousFor: document.getElementById('newPandalTheme').value.trim(),
          nearestMetro: document.getElementById('newPandalMetro').value.trim() || 'Nearby Metro / Auto',
          nearestBusStop: 'Local Bus / Auto Stand',
          crowdRating: document.getElementById('newPandalCrowd').value,
          bestTimeToVisit: 'Evening or Late Night',
          iconicHeritage: false,
          entryGate: 'Main Gate',
          tagline: 'Community Puja'
        };

        pandalManager.addPandal(newPandal);
        this.selectedPandalIds.add(newPandal.id);
        this.refreshPandalData();

        alert(`✓ Added "${newPandal.name}" to your Puja database and route!`);
        addForm.reset();
        modal.style.display = 'none';
      });
    }

    // Tab 3: Export & Import JSON
    const btnExport = document.getElementById('btnExportJsonFile');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(pandalManager.exportJson());
        const a = document.createElement('a');
        a.href = jsonStr;
        a.download = `pandals_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    }

    const importInput = document.getElementById('importJsonInput');
    const importStatus = document.getElementById('importStatusMsg');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const count = pandalManager.importJson(event.target.result);
            importStatus.className = 'status-msg success';
            importStatus.textContent = `✓ Imported ${count} pandals successfully!`;
            this.refreshPandalData();
          } catch (err) {
            importStatus.className = 'status-msg error';
            importStatus.textContent = `✕ Import error: ${err.message}`;
          }
        };
        reader.readAsText(file);
      });
    }
  }

  refreshPandalData() {
    const all = pandalManager.getAll();
    window._currentPandals = all;
    if (this.checklist) {
      this.checklist.updatePandals(all);
    }
    this.calculateAndRenderRoute();
  }

  /**
   * Populates Start & End point dropdowns with zone-aware smart suggestions
   */
  populateHubSelectors(preferredZone = this.selectedZone) {
    const startSelect = document.getElementById('startHubSelect');
    const endSelect = document.getElementById('endHubSelect');
    if (!startSelect || !endSelect) return;

    // Sort hubs: if a preferredZone is active, prioritize hubs from that zone
    const sortedHubs = [...TRANSIT_HUBS].sort((a, b) => {
      if (preferredZone !== 'all') {
        if (a.zone === preferredZone && b.zone !== preferredZone) return -1;
        if (b.zone === preferredZone && a.zone !== preferredZone) return 1;
      }
      return a.name.localeCompare(b.name);
    });

    const generateOptions = (selectedId) => {
      let html = '';
      const zones = ['north', 'central', 'south', 'east', 'behala'];
      const zoneTitles = {
        north: 'North Kolkata & Suburbs',
        central: 'Central Kolkata Transit Nodes',
        south: 'South Kolkata Corridors',
        east: 'Salt Lake & East Kolkata',
        behala: 'Behala & South West'
      };

      const orderedZones = preferredZone !== 'all'
        ? [preferredZone, ...zones.filter(z => z !== preferredZone)]
        : zones;

      orderedZones.forEach(zoneKey => {
        const zoneHubs = sortedHubs.filter(h => h.zone === zoneKey);
        if (zoneHubs.length > 0) {
          html += `<optgroup label="📍 ${zoneTitles[zoneKey]}">`;
          zoneHubs.forEach(hub => {
            const isSelected = hub.id === selectedId;
            html += `<option value="${hub.id}" ${isSelected ? 'selected' : ''}>${hub.name} (${hub.bengaliName || ''})</option>`;
          });
          html += `</optgroup>`;
        }
      });

      return html;
    };

    startSelect.innerHTML = generateOptions(this.startHubId);
    endSelect.innerHTML = generateOptions(this.endHubId);
  }

  attachEventListeners() {
    // Start & End Hub Selection change
    const startSelect = document.getElementById('startHubSelect');
    const endSelect = document.getElementById('endHubSelect');

    startSelect.addEventListener('change', (e) => {
      this.startHubId = e.target.value;
      this.calculateAndRenderRoute();
    });

    endSelect.addEventListener('change', (e) => {
      this.endHubId = e.target.value;
      this.calculateAndRenderRoute();
    });

    // Swap Direction Button
    const btnSwap = document.getElementById('btnSwapDirection');
    if (btnSwap) {
      btnSwap.addEventListener('click', () => {
        const temp = this.startHubId;
        this.startHubId = this.endHubId;
        this.endHubId = temp;
        this.populateHubSelectors();
        this.calculateAndRenderRoute();
      });
    }

    // Main Zone Filter Pills in Header/Control Bar
    const mainZonePills = document.querySelectorAll('.main-zone-pill');
    mainZonePills.forEach(pill => {
      pill.addEventListener('click', () => {
        mainZonePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const zone = pill.getAttribute('data-zone');
        this.handleZoneChange(zone);
      });
    });

    // Map Layer Toggles
    const layerCheckboxes = document.querySelectorAll('.layer-toggle-input');
    layerCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const layerKey = e.target.getAttribute('data-layer');
        this.mapController.setLayerVisibility(layerKey, e.target.checked);
      });
    });

    // Recenter Route button
    const btnRecenter = document.getElementById('btnRecenterRoute');
    if (btnRecenter) {
      btnRecenter.addEventListener('click', () => {
        if (this._latestRoute) {
          this.mapController.renderRoute(this._latestRoute, this.selectedPandalIds);
        }
      });
    }
  }

  handleZoneChange(zone) {
    this.selectedZone = zone;

    if (this.checklist) {
      this.checklist.setZone(zone);
      const checklistTabs = document.querySelectorAll('.zone-tab');
      checklistTabs.forEach(tab => {
        if (tab.getAttribute('data-zone') === zone) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }

    this.suggestHubsForZone(zone);
  }

  suggestHubsForZone(zone) {
    if (zone === 'north') {
      this.startHubId = 'hub_dumdum_jn';
      this.endHubId = 'hub_shyambazar';
    } else if (zone === 'central') {
      this.startHubId = 'hub_howrah';
      this.endHubId = 'hub_sealdah';
    } else if (zone === 'south') {
      this.startHubId = 'hub_gariahata';
      this.endHubId = 'hub_rabindra_sarobar';
    } else if (zone === 'east') {
      this.startHubId = 'hub_ultadanga';
      this.endHubId = 'hub_karunamoyee';
    } else if (zone === 'behala') {
      this.startHubId = 'hub_taratala';
      this.endHubId = 'hub_behala_chowrasta';
    }

    this.populateHubSelectors(zone);
    this.calculateAndRenderRoute();
  }

  handlePandalToggle(id) {
    if (this.checklist) {
      this.checklist.togglePandal(id);
    }
  }

  calculateAndRenderRoute() {
    const startHub = TRANSIT_HUBS.find(h => h.id === this.startHubId) || TRANSIT_HUBS[0];
    const endHub = TRANSIT_HUBS.find(h => h.id === this.endHubId) || TRANSIT_HUBS[5];

    const allPandals = pandalManager.getAll();
    const selectedPandals = allPandals.filter(p => this.selectedPandalIds.has(p.id));

    const optimizedRoute = optimizeRouteSequence(startHub, endHub, selectedPandals);
    this._latestRoute = optimizedRoute;

    this.mapController.renderPandals(allPandals, this.selectedPandalIds, optimizedRoute.orderedStops);
    this.mapController.renderRoute(optimizedRoute, this.selectedPandalIds);
    this.itineraryView.setRoute(optimizedRoute);
    this.updateNavbarStats(optimizedRoute);
  }

  updateNavbarStats(route) {
    const navPandalCount = document.getElementById('navPandalCount');
    const navDistance = document.getElementById('navDistance');
    const navDuration = document.getElementById('navDuration');

    if (navPandalCount) navPandalCount.textContent = `${route.pandalCount} Pandals`;
    if (navDistance) navDistance.textContent = route.totalFormattedDistance;

    if (navDuration) {
      const h = Math.floor(route.totalTourMinutes / 60);
      const m = route.totalTourMinutes % 60;
      navDuration.textContent = h > 0 ? `~${h}h ${m}m` : `~${m}m`;
    }
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SharodSathiApp();
});
