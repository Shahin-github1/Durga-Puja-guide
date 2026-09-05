// Anti-Backtracking Sequential Route Optimizer with Multi-Modal Transit Guidance
import {
  calculateDistanceKm,
  formatDistance,
  estimateWalkMinutes,
  estimateTransitMinutes
} from './distance.js?v=6';
import { getTransitGuidance } from '../data/transitRoutes.js?v=6';

/**
 * Optimizes a list of selected pandals from startHub to endHub
 * using forward corridor projection and 2-opt refinement to eliminate backtracking.
 */
export function optimizeRouteSequence(startHub, endHub, pandals = []) {
  if (!pandals || pandals.length === 0) {
    const defaultLegDist = calculateDistanceKm(startHub.lat, startHub.lng, endHub.lat, endHub.lng);
    const orderedStops = [
      { ...startHub, type: 'hub_start', stopName: startHub.name },
      { ...endHub, type: 'hub_end', stopName: endHub.name }
    ];
    const legs = [
      {
        fromIndex: 0,
        toIndex: 1,
        fromStop: orderedStops[0],
        toStop: orderedStops[1],
        distanceKm: defaultLegDist,
        formattedDistance: formatDistance(defaultLegDist),
        walkMinutes: estimateWalkMinutes(defaultLegDist),
        transitMinutes: estimateTransitMinutes(defaultLegDist),
        transitGuidance: getTransitGuidance(orderedStops[0], orderedStops[1], defaultLegDist)
      }
    ];

    return {
      startHub,
      endHub,
      orderedStops,
      legs,
      pandalCount: 0,
      totalDistanceKm: defaultLegDist,
      totalFormattedDistance: formatDistance(defaultLegDist),
      totalTransitMinutes: estimateTransitMinutes(defaultLegDist),
      totalPandalVisitMinutes: 0,
      totalTourMinutes: estimateTransitMinutes(defaultLegDist)
    };
  }

  // 1. Calculate corridor progression vector from startHub to endHub
  const dLat = endHub.lat - startHub.lat;
  const dLng = endHub.lng - startHub.lng;
  const lenSq = dLat * dLat + dLng * dLng || 0.0001;

  // Function to calculate forward projection (progress 0.0 at start, 1.0 at end)
  const getProgress = (point) => {
    return ((point.lat - startHub.lat) * dLat + (point.lng - startHub.lng) * dLng) / lenSq;
  };

  // 2. Greedy Nearest Neighbor with forward progression weight
  const remaining = [...pandals];
  const sequencedPandals = [];
  let currentLoc = { lat: startHub.lat, lng: startHub.lng };
  let currentProgress = 0;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestScore = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const p = remaining[i];
      const dist = calculateDistanceKm(currentLoc.lat, currentLoc.lng, p.lat, p.lng);
      const prog = getProgress(p);

      // Backtracking penalty: if point has significantly lower progress along the corridor
      const backtrackPenalty = prog < currentProgress - 0.15 ? (currentProgress - prog) * 4.5 : 0;
      
      // Attraction to forward movement
      const forwardReward = Math.max(0, prog - currentProgress) * 0.4;

      const score = dist + backtrackPenalty - forwardReward;

      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    const nextPandal = remaining.splice(bestIdx, 1)[0];
    sequencedPandals.push(nextPandal);
    currentLoc = { lat: nextPandal.lat, lng: nextPandal.lng };
    currentProgress = getProgress(nextPandal);
  }

  // 3. 2-opt Refinement pass (if count <= 24) to untangle any crossing edges
  if (sequencedPandals.length >= 3 && sequencedPandals.length <= 24) {
    refineWith2Opt(sequencedPandals, startHub, endHub);
  }

  // 4. Build ordered stops array
  const orderedStops = [
    {
      ...startHub,
      type: 'hub_start',
      stopName: `Start: ${startHub.name}`,
      formattedRole: 'Route Starting Point'
    },
    ...sequencedPandals.map((p, idx) => ({
      ...p,
      type: 'pandal',
      pandalIndex: idx + 1,
      stopName: `${idx + 1}. ${p.name}`,
      formattedRole: `Stop #${idx + 1}`
    })),
    {
      ...endHub,
      type: 'hub_end',
      stopName: `End: ${endHub.name}`,
      formattedRole: 'Route Destination'
    }
  ];

  // 5. Construct legs with transit guidance
  const legs = [];
  let totalDistanceKm = 0;
  let totalTransitMinutes = 0;

  for (let i = 0; i < orderedStops.length - 1; i++) {
    const fromStop = orderedStops[i];
    const toStop = orderedStops[i + 1];
    const dist = calculateDistanceKm(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
    const walkMin = estimateWalkMinutes(dist);
    const transitMin = estimateTransitMinutes(dist);
    const effectiveTravelMin = dist <= 0.9 ? walkMin : transitMin;

    totalDistanceKm += dist;
    totalTransitMinutes += effectiveTravelMin;

    legs.push({
      fromIndex: i,
      toIndex: i + 1,
      fromStop,
      toStop,
      distanceKm: dist,
      formattedDistance: formatDistance(dist),
      walkMinutes: walkMin,
      transitMinutes: transitMin,
      transitGuidance: getTransitGuidance(fromStop, toStop, dist)
    });
  }

  // Estimate pandal darshan & queuing time (average 25-35 mins per pandal)
  const totalPandalVisitMinutes = sequencedPandals.reduce((sum, p) => {
    let visitTime = 25;
    if (p.crowdRating === 'High') visitTime = 35;
    if (p.crowdRating === 'Extreme') visitTime = 45;
    return sum + visitTime;
  }, 0);

  const totalTourMinutes = totalTransitMinutes + totalPandalVisitMinutes;

  return {
    startHub,
    endHub,
    orderedStops,
    legs,
    pandalCount: sequencedPandals.length,
    totalDistanceKm,
    totalFormattedDistance: formatDistance(totalDistanceKm),
    totalTransitMinutes,
    totalPandalVisitMinutes,
    totalTourMinutes
  };
}

/**
 * 2-Opt local search refinement to eliminate path intersections
 */
function refineWith2Opt(points, startHub, endHub) {
  let improved = true;
  let iterations = 0;
  const maxIterations = 30;

  const calculateCost = (arr) => {
    let cost = 0;
    let prev = startHub;
    for (let i = 0; i < arr.length; i++) {
      cost += calculateDistanceKm(prev.lat, prev.lng, arr[i].lat, arr[i].lng);
      prev = arr[i];
    }
    cost += calculateDistanceKm(prev.lat, prev.lng, endHub.lat, endHub.lng);
    return cost;
  };

  let bestDistance = calculateCost(points);

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < points.length - 1; i++) {
      for (let k = i + 1; k < points.length; k++) {
        // Reverse sub-array from i to k
        const reversedChunk = points.slice(i, k + 1).reverse();
        const candidate = [
          ...points.slice(0, i),
          ...reversedChunk,
          ...points.slice(k + 1)
        ];

        const candidateDistance = calculateCost(candidate);
        if (candidateDistance < bestDistance - 0.05) { // Meaningful improvement
          for (let j = 0; j < candidate.length; j++) {
            points[j] = candidate[j];
          }
          bestDistance = candidateDistance;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }
}
