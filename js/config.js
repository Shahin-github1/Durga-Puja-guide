// Sharod Sathi - Application Configuration & Quota Guard

export const CONFIG = {
  // Stored Google API Key (fallback to localStorage)
  getGoogleApiKey() {
    return localStorage.getItem('sharod_google_api_key') || '';
  },
  setGoogleApiKey(key) {
    localStorage.setItem('sharod_google_api_key', (key || '').trim());
  },

  // Map Provider mode: 'auto' (try Google, fallback to OSM), 'google', 'osm'
  getMapProvider() {
    return localStorage.getItem('sharod_map_provider') || 'auto';
  },
  setMapProvider(provider) {
    localStorage.setItem('sharod_map_provider', provider);
  },

  // Daily Hard Quota Cap (default: 500 requests/day to stay 100% inside Google's free tier)
  getDailyQuotaLimit() {
    const limit = localStorage.getItem('sharod_daily_quota_limit');
    return limit ? parseInt(limit, 10) : 500;
  },
  setDailyQuotaLimit(limit) {
    localStorage.setItem('sharod_daily_quota_limit', parseInt(limit, 10) || 500);
  },

  // Daily Usage Tracker
  getTodayUsage() {
    this.resetQuotaIfNewDay();
    return parseInt(localStorage.getItem('sharod_today_usage') || '0', 10);
  },
  incrementUsage() {
    this.resetQuotaIfNewDay();
    const current = this.getTodayUsage();
    localStorage.setItem('sharod_today_usage', (current + 1).toString());
    return current + 1;
  },
  isQuotaExceeded() {
    this.resetQuotaIfNewDay();
    return this.getTodayUsage() >= this.getDailyQuotaLimit();
  },
  resetQuotaIfNewDay() {
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const recordedDay = localStorage.getItem('sharod_quota_date');
    if (recordedDay !== todayStr) {
      localStorage.setItem('sharod_quota_date', todayStr);
      localStorage.setItem('sharod_today_usage', '0');
    }
  }
};
