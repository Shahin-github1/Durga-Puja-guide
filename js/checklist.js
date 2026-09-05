// Pandal Checklist & Filter Controller

export class PandalChecklist {
  constructor(containerId, pandals, options = {}) {
    this.container = document.getElementById(containerId);
    this.pandals = pandals;
    this.selectedIds = new Set(options.initialSelected || []);
    this.activeZone = 'all';
    this.searchQuery = '';
    this.onSelectionChange = options.onSelectionChange || null;
    this.onFocusPandal = options.onFocusPandal || null;

    this.render();
  }

  setZone(zone) {
    this.activeZone = zone;
    this.renderList();
  }

  updatePandals(newPandals) {
    this.pandals = newPandals;
    this.renderList();
    this.updateHeaderStats();
  }

  setSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.renderList();
  }

  togglePandal(id) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.updateCardState(id);
    this.updateHeaderStats();
    if (this.onSelectionChange) {
      this.onSelectionChange(this.selectedIds);
    }
  }

  selectAllCurrent() {
    const visible = this.getFilteredPandals();
    visible.forEach(p => this.selectedIds.add(p.id));
    this.renderList();
    this.updateHeaderStats();
    if (this.onSelectionChange) {
      this.onSelectionChange(this.selectedIds);
    }
  }

  clearAll() {
    this.selectedIds.clear();
    this.renderList();
    this.updateHeaderStats();
    if (this.onSelectionChange) {
      this.onSelectionChange(this.selectedIds);
    }
  }

  applyPreset(presetKey) {
    this.selectedIds.clear();

    if (presetKey === 'dumdum_sealdah') {
      // User's flagship route: Dum Dum -> Sreebhumi -> Tala -> Bagbazar -> Sovabazar -> Kumartuli -> College Sq -> Santosh Mitra -> Sealdah
      const ids = [
        'pandal_dumdum_tarun_sangha',
        'pandal_sreebhumi',
        'pandal_tala_barowari',
        'pandal_bagbazar',
        'pandal_sovabazar_rajbari',
        'pandal_kumartuli_park',
        'pandal_college_square',
        'pandal_santosh_mitra_sq'
      ];
      ids.forEach(id => this.selectedIds.add(id));
    } else if (presetKey === 'north_heritage') {
      const ids = [
        'pandal_bagbazar',
        'pandal_sovabazar_rajbari',
        'pandal_kumartuli_park',
        'pandal_kumartuli_sarbojanin',
        'pandal_ahiritola',
        'pandal_hatibagan_sarbojanin',
        'pandal_kashi_bose_lane',
        'pandal_nalin_sarkar'
      ];
      ids.forEach(id => this.selectedIds.add(id));
    } else if (presetKey === 'south_glamour') {
      const ids = [
        'pandal_ekdalia_evergreen',
        'pandal_singhi_park',
        'pandal_ballygunge_cultural',
        'pandal_maddox_square',
        'pandal_tridhara_sammilani',
        'pandal_deshapriya_park',
        'pandal_mudiali_club',
        'pandal_shiv_mandir'
      ];
      ids.forEach(id => this.selectedIds.add(id));
    } else if (presetKey === 'mega_specials') {
      const ids = [
        'pandal_sreebhumi',
        'pandal_college_square',
        'pandal_santosh_mitra_sq',
        'pandal_bagbazar',
        'pandal_maddox_square',
        'pandal_ekdalia_evergreen',
        'pandal_suruchi_sangha',
        'pandal_saltlake_fd_block'
      ];
      ids.forEach(id => this.selectedIds.add(id));
    }

    this.renderList();
    this.updateHeaderStats();
    if (this.onSelectionChange) {
      this.onSelectionChange(this.selectedIds);
    }
  }

  getFilteredPandals() {
    return this.pandals.filter(p => {
      const matchesZone = this.activeZone === 'all' || p.zone === this.activeZone;
      const matchesSearch = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.bengaliName.toLowerCase().includes(this.searchQuery) ||
        p.famousFor.toLowerCase().includes(this.searchQuery) ||
        p.address.toLowerCase().includes(this.searchQuery) ||
        p.nearestMetro.toLowerCase().includes(this.searchQuery);

      return matchesZone && matchesSearch;
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="checklist-wrapper">
        <div class="checklist-header">
          <div class="checklist-title-row">
            <div>
              <h3 class="section-title">
                <span>🪔</span> Curated Pandal Selection Checklist
              </h3>
              <p class="section-subtitle">Select the pandals you wish to visit. The anti-backtracking optimizer will sequence them seamlessly from your start point to end point.</p>
            </div>
            <div class="selection-counter-badge">
              <span id="selectedCountBadge" class="counter-num">${this.selectedIds.size}</span>
              <span class="counter-label">of ${this.pandals.length} Selected</span>
            </div>
          </div>

          <!-- Presets Quick Bar -->
          <div class="presets-row">
            <span class="preset-label">⚡ Quick Presets:</span>
            <button class="preset-btn" data-preset="dumdum_sealdah">🚆 Dum Dum ➔ Sealdah Corridor</button>
            <button class="preset-btn" data-preset="north_heritage">🏛️ North Heritage Walk</button>
            <button class="preset-btn" data-preset="south_glamour">✨ South Glamour Circuit</button>
            <button class="preset-btn" data-preset="mega_specials">🏆 Top 8 Mega Pullers</button>
          </div>

          <!-- Search & Filter Controls -->
          <div class="checklist-controls">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="pandalSearchInput" placeholder="Search pandal name, metro, theme, or locality (e.g. Bagbazar, Sreebhumi)..." />
            </div>

            <div class="bulk-actions">
              <button id="btnSelectAll" class="btn-action btn-select-all">✓ Select All in View</button>
              <button id="btnClearAll" class="btn-action btn-clear">✕ Clear All</button>
            </div>
          </div>

          <!-- Zone Pills -->
          <div class="zone-filter-tabs">
            <button class="zone-tab active" data-zone="all">All Zones (${this.pandals.length})</button>
            <button class="zone-tab" data-zone="north">North Kolkata (${this.countZone('north')})</button>
            <button class="zone-tab" data-zone="central">Central (${this.countZone('central')})</button>
            <button class="zone-tab" data-zone="south">South Kolkata (${this.countZone('south')})</button>
            <button class="zone-tab" data-zone="east">Salt Lake & East (${this.countZone('east')})</button>
            <button class="zone-tab" data-zone="behala">Behala & SW (${this.countZone('behala')})</button>
          </div>
        </div>

        <div id="pandalCardsGrid" class="pandal-cards-grid">
          <!-- Cards rendered dynamically -->
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.renderList();
  }

  countZone(zone) {
    return this.pandals.filter(p => p.zone === zone).length;
  }

  renderList() {
    const grid = document.getElementById('pandalCardsGrid');
    if (!grid) return;

    const items = this.getFilteredPandals();

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="no-results-state">
          <span class="no-results-icon">🔎</span>
          <h4>No pandals found matching "${this.searchQuery}" in ${this.activeZone.toUpperCase()}</h4>
          <p>Try searching for a different keyword or switch to "All Zones".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(p => {
      const isChecked = this.selectedIds.has(p.id);
      const crowdClass = p.crowdRating === 'Extreme' ? 'crowd-extreme' : (p.crowdRating === 'High' ? 'crowd-high' : 'crowd-moderate');

      return `
        <div class="pandal-item-card ${isChecked ? 'is-selected' : ''}" id="card_${p.id}">
          <div class="card-checkbox-col">
            <label class="custom-checkbox">
              <input type="checkbox" data-pandal-id="${p.id}" ${isChecked ? 'checked' : ''} />
              <span class="checkmark"></span>
            </label>
          </div>

          <div class="card-content-col">
            <div class="card-header-row">
              <div class="title-group">
                <h4 class="card-title">${p.name}</h4>
                <div class="card-bengali">${p.bengaliName}</div>
              </div>
              <div class="badge-group">
                <span class="zone-badge zone-${p.zone}">${p.zone.toUpperCase()}</span>
                <span class="crowd-badge ${crowdClass}">${p.crowdRating} Crowd</span>
              </div>
            </div>

            <p class="card-theme">${p.famousFor}</p>

            <div class="card-footer-meta">
              <div class="meta-item">
                <span class="meta-icon">🚇</span>
                <span class="meta-text">${p.nearestMetro}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🕒</span>
                <span class="meta-text">${p.bestTimeToVisit}</span>
              </div>
              <button class="btn-focus-map" data-focus-id="${p.id}" title="Center on Map">
                📍 Show on Map
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card event listeners
    grid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-pandal-id');
        this.togglePandal(id);
      });
    });

    grid.querySelectorAll('.btn-focus-map').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-focus-id');
        const pandal = this.pandals.find(p => p.id === id);
        if (pandal && this.onFocusPandal) {
          this.onFocusPandal(pandal);
        }
      });
    });
  }

  updateCardState(id) {
    const card = document.getElementById(`card_${id}`);
    if (card) {
      const isChecked = this.selectedIds.has(id);
      const cb = card.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = isChecked;
      if (isChecked) {
        card.classList.add('is-selected');
      } else {
        card.classList.remove('is-selected');
      }
    }
  }

  updateHeaderStats() {
    const badge = document.getElementById('selectedCountBadge');
    if (badge) {
      badge.textContent = this.selectedIds.size;
    }
  }

  attachEventListeners() {
    // Zone tab filtering
    const zoneTabs = this.container.querySelectorAll('.zone-tab');
    zoneTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        zoneTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.setZone(tab.getAttribute('data-zone'));
      });
    });

    // Search input
    const searchInput = document.getElementById('pandalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.setSearch(e.target.value);
      });
    }

    // Select all & clear all
    const btnSelectAll = document.getElementById('btnSelectAll');
    if (btnSelectAll) {
      btnSelectAll.addEventListener('click', () => this.selectAllCurrent());
    }

    const btnClearAll = document.getElementById('btnClearAll');
    if (btnClearAll) {
      btnClearAll.addEventListener('click', () => this.clearAll());
    }

    // Presets
    const presetBtns = this.container.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-preset');
        this.applyPreset(key);
      });
    });
  }
}
