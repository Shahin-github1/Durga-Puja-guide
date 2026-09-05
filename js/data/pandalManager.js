// Pandal Data Manager: Local Storage persistence, Dynamic Online Sync & Custom Additions
import { DURGA_PUJA_PANDALS } from './pandals.js';

const STORAGE_KEY = 'sharod_sathi_custom_pandals_v1';
const SYNC_URL_KEY = 'sharod_sathi_remote_sync_url';

export class PandalDataManager {
  constructor() {
    this.pandals = [];
    this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.pandals = parsed;
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read custom pandals from localStorage:', e);
    }
    // Fallback to default verified dataset
    this.pandals = [...DURGA_PUJA_PANDALS];
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pandals));
    } catch (e) {
      console.error('Failed to save pandals to localStorage:', e);
    }
  }

  getAll() {
    return this.pandals;
  }

  getPandalById(id) {
    return this.pandals.find(p => p.id === id);
  }

  /**
   * Add a new custom pandal
   */
  addPandal(pandal) {
    if (!pandal.id) {
      pandal.id = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }
    this.pandals.unshift(pandal);
    this.saveData();
    return pandal;
  }

  /**
   * Update an existing pandal's theme or details
   */
  updatePandal(id, updates) {
    const idx = this.pandals.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.pandals[idx] = { ...this.pandals[idx], ...updates };
      this.saveData();
      return this.pandals[idx];
    }
    return null;
  }

  /**
   * Delete a pandal
   */
  deletePandal(id) {
    this.pandals = this.pandals.filter(p => p.id !== id);
    this.saveData();
  }

  /**
   * Fetch latest online dataset from a remote URL (e.g. GitHub raw JSON, Google Sheets, or custom API)
   */
  async syncFromRemoteUrl(url) {
    if (!url) {
      throw new Error('Please enter a valid remote JSON URL.');
    }

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Failed to download data from remote URL.`);
    }

    const remoteData = await response.json();
    if (!Array.isArray(remoteData) || remoteData.length === 0) {
      throw new Error('Invalid data format: Expected an array of pandal objects.');
    }

    // Merge or replace
    this.pandals = remoteData;
    this.saveData();
    localStorage.setItem(SYNC_URL_KEY, url);
    return this.pandals.length;
  }

  getSavedSyncUrl() {
    return localStorage.getItem(SYNC_URL_KEY) || '';
  }

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.pandals = [...DURGA_PUJA_PANDALS];
    return this.pandals;
  }

  exportJson() {
    return JSON.stringify(this.pandals, null, 2);
  }

  importJson(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Import failed: JSON must be an array of pandals.');
    }
    this.pandals = parsed;
    this.saveData();
    return this.pandals.length;
  }
}

export const pandalManager = new PandalDataManager();
