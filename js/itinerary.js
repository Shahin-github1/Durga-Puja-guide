// Itinerary View: Timeline Cards, Multi-Modal Transit Guidance, and Google Maps Navigation

export class ItineraryView {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onFocusLocation = options.onFocusLocation || null;
    this.routeData = null;
    this.visitedSet = new Set(JSON.parse(localStorage.getItem('sharod_visited_stops') || '[]'));
  }

  setRoute(routeData) {
    this.routeData = routeData;
    this.render();
  }

  toggleVisited(pandalId) {
    if (this.visitedSet.has(pandalId)) {
      this.visitedSet.delete(pandalId);
    } else {
      this.visitedSet.add(pandalId);
    }
    localStorage.setItem('sharod_visited_stops', JSON.stringify(Array.from(this.visitedSet)));
    this.render();
  }

  render() {
    if (!this.container) return;

    if (!this.routeData || !this.routeData.orderedStops || this.routeData.orderedStops.length === 0) {
      this.container.innerHTML = `
        <div class="empty-itinerary-state">
          <div class="empty-icon">🗺️</div>
          <h3>No Route Generated Yet</h3>
          <p>Select pandals from the checklist above to generate your sequential, anti-backtracking itinerary.</p>
        </div>
      `;
      return;
    }

    const { startHub, endHub, orderedStops, legs, pandalCount, totalFormattedDistance, totalTourMinutes, totalDistanceKm } = this.routeData;

    const hours = Math.floor(totalTourMinutes / 60);
    const mins = totalTourMinutes % 60;
    const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

    // Google Maps Full Route Deep Link
    const gmapsUrl = this.buildGoogleMapsRouteUrl(orderedStops);

    let html = `
      <div class="itinerary-header-card">
        <div class="itinerary-summary-info">
          <div class="badge-pill">✨ OPTIMIZED TOUR</div>
          <h3 class="itinerary-title">Your Step-by-Step Puja Itinerary</h3>
          <p class="itinerary-subtitle">
            <strong>${pandalCount} Pandals</strong> sequenced from <strong>${startHub.name}</strong> to <strong>${endHub.name}</strong> without backtracking.
          </p>
          <div class="itinerary-metrics-bar">
            <div class="metric-item">
              <span class="metric-icon">🛣️</span>
              <div class="metric-text">
                <span class="metric-value">${totalFormattedDistance}</span>
                <span class="metric-label">Total Distance</span>
              </div>
            </div>
            <div class="metric-item">
              <span class="metric-icon">⏱️</span>
              <div class="metric-text">
                <span class="metric-value">~${durationStr}</span>
                <span class="metric-label">Est. Tour Time</span>
              </div>
            </div>
            <div class="metric-item">
              <span class="metric-icon">✅</span>
              <div class="metric-text">
                <span class="metric-value">${this.visitedSet.size} / ${pandalCount}</span>
                <span class="metric-label">Visited</span>
              </div>
            </div>
          </div>
        </div>

        <div class="itinerary-header-actions">
          <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-gmaps-full" id="btnOpenFullGmaps">
            <span class="btn-icon">🗺️</span>
            <span>Open Full Route in Google Maps</span>
          </a>
        </div>
      </div>

      <div class="itinerary-timeline">
    `;

    // Render timeline stops & connecting transit legs
    orderedStops.forEach((stop, index) => {
      const isStart = stop.type === 'hub_start';
      const isEnd = stop.type === 'hub_end';
      const isPandal = stop.type === 'pandal';
      const isVisited = isPandal && this.visitedSet.has(stop.id);

      let cardClass = 'timeline-stop-card';
      if (isStart) cardClass += ' stop-start';
      if (isEnd) cardClass += ' stop-end';
      if (isVisited) cardClass += ' stop-visited';

      const singleGmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;

      html += `
        <div class="${cardClass}" id="itineraryStop_${index}">
          <div class="stop-node-marker">
            ${isStart ? '🚀' : isEnd ? '🏁' : `<span class="node-num">${stop.pandalIndex}</span>`}
          </div>

          <div class="stop-card-body">
            <div class="stop-header-row">
              <div class="stop-title-wrap">
                <div class="stop-tag">${stop.formattedRole || 'Stop'}</div>
                <h4 class="stop-name ${isVisited ? 'visited-text' : ''}">${stop.name}</h4>
                ${stop.bengaliName ? `<h5 class="stop-bengali">${stop.bengaliName}</h5>` : ''}
              </div>
              <div class="stop-quick-actions">
                ${isPandal ? `
                  <label class="visited-checkbox-label">
                    <input type="checkbox" ${isVisited ? 'checked' : ''} onchange="window.itineraryView.toggleVisited('${stop.id}')" />
                    <span>${isVisited ? '✓ Visited' : 'Mark Visited'}</span>
                  </label>
                ` : ''}
              </div>
            </div>

            ${isPandal ? `
              <div class="pandal-itinerary-meta">
                <p class="pandal-theme">✨ <strong>Theme:</strong> ${stop.famousFor}</p>
                <div class="meta-tags-row">
                  <span class="meta-tag tag-zone zone-${stop.zone}">${stop.zone.toUpperCase()}</span>
                  <span class="meta-tag tag-crowd crowd-${stop.crowdRating.toLowerCase()}">🔥 ${stop.crowdRating} Crowd</span>
                  <span class="meta-tag tag-metro">🚇 ${stop.nearestMetro}</span>
                  ${stop.entryGate ? `<span class="meta-tag tag-gate">🚪 ${stop.entryGate}</span>` : ''}
                </div>
              </div>
            ` : `
              <p class="hub-description">${stop.bengaliName || ''} - Major transit hub connection.</p>
            `}

            <div class="stop-footer-buttons">
              <button class="btn-focus-map" onclick="window.itineraryView.focusStop(${stop.lat}, ${stop.lng})">
                📍 Show on Map
              </button>
              <a href="${singleGmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-gmaps-link">
                🧭 Navigate (GPS)
              </a>
            </div>
          </div>
        </div>
      `;

      // Between stops, display transit guidance card
      if (index < orderedStops.length - 1) {
        const leg = legs[index];
        html += this.renderTransitCard(leg);
      }
    });

    html += `</div>`;
    this.container.innerHTML = html;

    // Attach global reference for onclick handlers
    window.itineraryView = this;
  }

  renderTransitCard(leg) {
    if (!leg) return '';
    const g = leg.transitGuidance || {};
    const walkMins = leg.walkMinutes;
    const distStr = leg.formattedDistance;

    let transitDetailsHtml = '';

    if (g.auto) {
      transitDetailsHtml += `
        <div class="transit-mode-badge auto-badge">
          <span class="transit-icon">🛺</span>
          <div class="transit-info">
            <span class="mode-title">Shared Auto / Toto: <strong>${g.auto.name}</strong></span>
            <span class="mode-desc">Stand: ${g.auto.stand} | Fare: <strong>${g.auto.fare}</strong> (~${g.auto.durationMins} mins)</span>
          </div>
        </div>
      `;
    }

    if (g.bus) {
      transitDetailsHtml += `
        <div class="transit-mode-badge bus-badge">
          <span class="transit-icon">🚌</span>
          <div class="transit-info">
            <span class="mode-title">Bus Corridor: <strong>${g.bus.numbers.join(', ')}</strong></span>
            <span class="mode-desc">Board from ${g.bus.fromStop} (~${g.bus.durationMins} mins)</span>
          </div>
        </div>
      `;
    }

    if (g.metro) {
      transitDetailsHtml += `
        <div class="transit-mode-badge metro-badge">
          <span class="transit-icon">🚇</span>
          <div class="transit-info">
            <span class="mode-title">Metro Link: <strong>${g.metro.fromStation} ➔ ${g.metro.toStation}</strong></span>
            <span class="mode-desc">~${g.metro.durationMins} mins travel time</span>
          </div>
        </div>
      `;
    }

    return `
      <div class="transit-guidance-card">
        <div class="transit-left-indicator">
          <div class="transit-line"></div>
          <div class="transit-summary-badge">
            <span class="leg-dist">🚶 ${distStr}</span>
            <span class="leg-time">~${walkMins}m walk</span>
          </div>
          <div class="transit-line"></div>
        </div>

        <div class="transit-details-box">
          <div class="transit-primary-recommendation">
            <span class="rec-label">Smart Recommendation:</span>
            <span class="rec-text">${g.primaryRecommendation || `Walk ${distStr} (~${walkMins} mins)`}</span>
          </div>

          ${transitDetailsHtml ? `
            <div class="transit-modes-container">
              ${transitDetailsHtml}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  focusStop(lat, lng) {
    if (this.onFocusLocation) {
      this.onFocusLocation(lat, lng);
    }
  }

  buildGoogleMapsRouteUrl(stops) {
    if (!stops || stops.length < 2) return 'https://www.google.com/maps';

    const origin = `${stops[0].lat},${stops[0].lng}`;
    const destination = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;

    // Google Maps allows up to 9 waypoints in standard URL
    const intermediateStops = stops.slice(1, -1);
    let waypointsParam = '';
    if (intermediateStops.length > 0) {
      // Pick up to 9 evenly distributed waypoints
      const maxWaypoints = 9;
      let selectedWaypoints = intermediateStops;
      if (intermediateStops.length > maxWaypoints) {
        const step = intermediateStops.length / maxWaypoints;
        selectedWaypoints = [];
        for (let i = 0; i < maxWaypoints; i++) {
          selectedWaypoints.push(intermediateStops[Math.floor(i * step)]);
        }
      }
      waypointsParam = `&waypoints=${selectedWaypoints.map(s => `${s.lat},${s.lng}`).join('|')}`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=driving`;
  }
}
