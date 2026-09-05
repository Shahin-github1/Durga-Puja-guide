// Haversine distance & spatial calculations with Durga Puja crowd factors

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Returns formatted distance string (e.g. "450 m" or "2.3 km").
 */
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Estimates walking time accounting for festive crowd density.
 * Average walking pace: ~4.2 km/h; Festive slowdown multiplier: 1.35x.
 */
export function estimateWalkMinutes(distanceKm) {
  const walkMinutes = (distanceKm / 4.0) * 60 * 1.3;
  return Math.max(2, Math.round(walkMinutes));
}

/**
 * Estimates transit/metro/auto time between distant points.
 */
export function estimateTransitMinutes(distanceKm) {
  if (distanceKm <= 0.8) {
    return estimateWalkMinutes(distanceKm);
  }
  // Base 10 min transit wait/board + 2.5 min per km
  return Math.round(8 + distanceKm * 2.5);
}

/**
 * Finds top N nearest items from a collection to a given coordinate.
 */
export function findNearest(targetLat, targetLng, items, maxCount = 3, maxRadiusKm = 2.5) {
  return items
    .map(item => {
      const dist = calculateDistanceKm(targetLat, targetLng, item.lat, item.lng);
      return { ...item, distanceKm: dist };
    })
    .filter(item => item.distanceKm <= maxRadiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, maxCount);
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}
