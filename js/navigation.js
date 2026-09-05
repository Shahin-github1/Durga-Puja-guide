// Turn-by-Turn GPS Navigation Controller (Google Maps Style In-App Guidance)
import { calculateDistanceKm, formatDistance, estimateWalkMinutes } from './routing/distance.js';

export class TurnByTurnNavigation {
  constructor(options = {}) {
    this.mapController = options.mapController;
    this.onExit = options.onExit || null;
    this.onStopAdvance = options.onStopAdvance || null;

    this.isActive = false;
    this.routeData = null;
    this.orderedStops = [];
    this.currentStopIndex = 1; // 0 is Start Hub, 1 is First Pandal
    this.userLocation = null;
    this.userHeading = 0;
    this.activeSteps = [];
    this.currentStepIndex = 0;

    // UI elements
    this.hudElement = null;
    this.sheetElement = null;

    this.initUI();
  }

  initUI() {
    // Check if containers exist or inject them into DOM
    let hud = document.getElementById('navHudTop');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'navHudTop';
      hud.className = 'nav-hud-top';
      document.body.appendChild(hud);
    }
    this.hudElement = hud;

    let sheet = document.getElementById('navSheetBottom');
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.id = 'navSheetBottom';
      sheet.className = 'nav-sheet-bottom';
      document.body.appendChild(sheet);
    }
    this.sheetElement = sheet;

    // Attach global reference for button onclicks
    window.turnByTurnNav = this;
  }

  start(routeData, initialUserLocation = null) {
    if (!routeData || !routeData.orderedStops || routeData.orderedStops.length < 2) {
      alert('Please select at least 1 pandal to start navigation.');
      return;
    }

    this.routeData = routeData;
    this.orderedStops = routeData.orderedStops;
    this.currentStopIndex = 1; // Begin targeting the first pandal
    this.isActive = true;
    this.userLocation = initialUserLocation;

    // Add navigation active class to body for layout adjustments
    document.body.classList.add('nav-mode-active');

    // Scroll to map
    const mapSection = document.getElementById('mapSection');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }

    this.fetchTurnStepsForCurrentLeg();
    this.updateUI();

    // Zoom into user location or first pandal
    if (this.userLocation) {
      this.mapController.panToLocation(this.userLocation.lat, this.userLocation.lng, 17);
    } else {
      const target = this.getTargetStop();
      this.mapController.panToLocation(target.lat, target.lng, 17);
    }
  }

  stop() {
    this.isActive = false;
    document.body.classList.remove('nav-mode-active');
    if (this.hudElement) this.hudElement.style.display = 'none';
    if (this.sheetElement) this.sheetElement.style.display = 'none';

    if (this.onExit) {
      this.onExit();
    }
  }

  getTargetStop() {
    if (this.currentStopIndex >= this.orderedStops.length) {
      return this.orderedStops[this.orderedStops.length - 1];
    }
    return this.orderedStops[this.currentStopIndex];
  }

  getPreviousStop() {
    const prevIdx = Math.max(0, this.currentStopIndex - 1);
    return this.orderedStops[prevIdx];
  }

  onUserLocationUpdate(loc, heading = null) {
    this.userLocation = loc;
    if (heading !== null && heading !== undefined) {
      this.userHeading = heading;
    }

    if (!this.isActive) return;

    const target = this.getTargetStop();
    if (!target) return;

    // Calculate real-time distance to target pandal
    const distToTarget = calculateDistanceKm(loc.lat, loc.lng, target.lat, target.lng);

    // Auto-arrival detection if within 40 meters
    if (distToTarget <= 0.040) {
      this.handleArrivalAlert(target);
    }

    this.updateUI();
  }

  handleArrivalAlert(target) {
    if (this._lastArrivedStopId === target.id) return;
    this._lastArrivedStopId = target.id;

    // Highlight arrival in UI
    const targetName = target.name || 'Pandal';
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    console.log(`[Nav] Arrived at ${targetName}!`);
  }

  async fetchTurnStepsForCurrentLeg() {
    const target = this.getTargetStop();
    if (!target) return;

    // Origin: user location if available, otherwise previous stop
    const fromLoc = this.userLocation || this.getPreviousStop();

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${fromLoc.lng.toFixed(6)},${fromLoc.lat.toFixed(6)};${target.lng.toFixed(6)},${target.lat.toFixed(6)}?overview=full&geometries=geojson&steps=true`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes[0] && data.routes[0].legs && data.routes[0].legs[0]) {
          const osrmSteps = data.routes[0].legs[0].steps || [];
          this.activeSteps = osrmSteps.map(s => {
            return {
              instruction: this.formatStepInstruction(s),
              modifier: s.maneuver.modifier || 'straight',
              type: s.maneuver.type || 'turn',
              name: s.name || 'Local Street',
              distanceMeters: Math.round(s.distance)
            };
          });
          this.currentStepIndex = 0;
          this.updateUI();
          return;
        }
      }
    } catch (e) {
      console.warn('OSRM steps fallback:', e.message);
    }

    // Synthesized fallback step if OSRM steps unavailable
    this.generateFallbackStep(fromLoc, target);
  }

  generateFallbackStep(fromLoc, target) {
    const distKm = calculateDistanceKm(fromLoc.lat, fromLoc.lng, target.lat, target.lng);
    const distM = Math.round(distKm * 1000);
    const bearing = this.calculateBearing(fromLoc.lat, fromLoc.lng, target.lat, target.lng);
    const directionWord = this.bearingToDirection(bearing);

    this.activeSteps = [
      {
        instruction: `Head ${directionWord} towards ${target.name}`,
        modifier: 'straight',
        type: 'depart',
        name: target.nearestBusStop || 'Street Route',
        distanceMeters: distM
      },
      {
        instruction: `Arrive at ${target.name} (${target.entryGate || 'Main Gate'})`,
        modifier: 'straight',
        type: 'arrive',
        name: target.name,
        distanceMeters: 0
      }
    ];
    this.currentStepIndex = 0;
    this.updateUI();
  }

  formatStepInstruction(step) {
    const maneuver = step.maneuver;
    const street = step.name ? ` onto ${step.name}` : '';
    
    switch (maneuver.type) {
      case 'depart':
        return `Head ${maneuver.modifier || 'straight'}${street}`;
      case 'turn':
        if (maneuver.modifier === 'left') return `Turn left${street}`;
      case 'turn':
        if (maneuver.modifier === 'right') return `Turn right${street}`;
        return `Turn ${maneuver.modifier || 'straight'}${street}`;
      case 'roundabout':
        return `Take exit at roundabout${street}`;
      case 'arrive':
        return `Arrive at destination on the ${maneuver.modifier || 'ahead'}`;
      default:
        return `Continue ${maneuver.modifier || 'straight'}${street}`;
    }
  }

  advanceToNextStop() {
    if (this.currentStopIndex < this.orderedStops.length - 1) {
      this.currentStopIndex++;
      const nextTarget = this.getTargetStop();

      // Pan to new target stop or user
      if (this.userLocation) {
        this.mapController.panToLocation(this.userLocation.lat, this.userLocation.lng, 17);
      } else {
        this.mapController.panToLocation(nextTarget.lat, nextTarget.lng, 17);
      }

      this.fetchTurnStepsForCurrentLeg();
      this.updateUI();

      if (this.onStopAdvance) {
        this.onStopAdvance(nextTarget, this.currentStopIndex);
      }
    } else {
      alert('🎉 Fantastic! You have completed your entire Durga Puja route! Shubho Sharodiya!');
      this.stop();
    }
  }

  updateUI() {
    if (!this.isActive || !this.hudElement || !this.sheetElement) return;

    this.hudElement.style.display = 'flex';
    this.sheetElement.style.display = 'flex';

    const target = this.getTargetStop();
    if (!target) return;

    const fromLoc = this.userLocation || this.getPreviousStop();
    const distKm = calculateDistanceKm(fromLoc.lat, fromLoc.lng, target.lat, target.lng);
    const distStr = formatDistance(distKm);
    const walkMins = estimateWalkMinutes(distKm);

    // 1. Render Top Navigation HUD (Google Maps style green banner)
    const currentStep = this.activeSteps[this.currentStepIndex] || {
      instruction: `Proceed towards ${target.name}`,
      modifier: 'straight',
      distanceMeters: Math.round(distKm * 1000)
    };

    const maneuverIcon = this.getManeuverIcon(currentStep.modifier);
    const stepDistFormatted = currentStep.distanceMeters >= 1000
      ? `${(currentStep.distanceMeters / 1000).toFixed(1)} km`
      : `${currentStep.distanceMeters} m`;

    this.hudElement.innerHTML = `
      <div class="nav-hud-inner">
        <div class="nav-maneuver-icon-wrap">
          <span class="nav-maneuver-icon">${maneuverIcon}</span>
        </div>
        <div class="nav-instruction-wrap">
          <div class="nav-dist-remaining">${stepDistFormatted}</div>
          <div class="nav-step-text">${currentStep.instruction}</div>
        </div>
        <button class="nav-btn-exit" onclick="window.turnByTurnNav.stop()" title="Exit Navigation">
          ✕
        </button>
      </div>
    `;

    // 2. Render Bottom Destination Sheet
    const totalPandalCount = this.orderedStops.filter(s => s.type === 'pandal').length;
    const isLastStop = this.currentStopIndex >= this.orderedStops.length - 1;
    const stopRole = target.type === 'hub_end' ? '🏁 Final Destination' : `Stop #${target.pandalIndex || this.currentStopIndex} of ${totalPandalCount}`;

    const gmapsDeepLink = `https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}&travelmode=driving`;

    this.sheetElement.innerHTML = `
      <div class="nav-sheet-inner">
        <div class="nav-sheet-top-row">
          <div class="nav-destination-meta">
            <span class="nav-stop-badge">${stopRole}</span>
            <h4 class="nav-target-name">${target.name}</h4>
            ${target.bengaliName ? `<h5 class="nav-target-bengali">${target.bengaliName}</h5>` : ''}
          </div>
          <div class="nav-eta-box">
            <span class="nav-eta-time">~${walkMins} min</span>
            <span class="nav-eta-dist">${distStr}</span>
          </div>
        </div>

        ${target.famousFor ? `
          <div class="nav-theme-row">
            <span>✨ <strong>Theme:</strong> ${target.famousFor}</span>
          </div>
        ` : ''}

        <div class="nav-sheet-actions">
          <button class="nav-btn-action btn-nav-arrived" onclick="window.turnByTurnNav.advanceToNextStop()">
            ${isLastStop ? '🏁 Finish Tour' : '✓ Arrived! Next Pandal ➔'}
          </button>
          <a href="${gmapsDeepLink}" target="_blank" rel="noopener noreferrer" class="nav-btn-action btn-nav-gmaps">
            🧭 Open in Google Maps App
          </a>
          <button class="nav-btn-action btn-nav-recenter" onclick="window.turnByTurnNav.recenterMap()">
            🎯 Recenter on Me
          </button>
        </div>
      </div>
    `;
  }

  recenterMap() {
    if (this.userLocation) {
      this.mapController.panToLocation(this.userLocation.lat, this.userLocation.lng, 18);
    } else {
      const target = this.getTargetStop();
      this.mapController.panToLocation(target.lat, target.lng, 17);
    }
  }

  getManeuverIcon(modifier) {
    switch (modifier) {
      case 'left':
      case 'sharp left':
        return '↰';
      case 'slight left':
        return '↖';
      case 'right':
      case 'sharp right':
        return '↱';
      case 'slight right':
        return '↗';
      case 'uturn':
        return '↶';
      default:
        return '⬆';
    }
  }

  calculateBearing(lat1, lon1, lat2, lon2) {
    const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
    const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    return brng;
  }

  bearingToDirection(bearing) {
    const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    const idx = Math.round(bearing / 45) % 8;
    return directions[idx];
  }
}
