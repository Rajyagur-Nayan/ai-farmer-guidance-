/**
 * Healthcare Geolocation Utility 🏥
 * Focused on precision and performance for rural/low-connectivity areas.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates the clinical-grade Haversine distance in KM.
 */
export const calculateDistance = (p1: Coordinates, p2: Coordinates): number => {
  const R = 6371; // Earth's radius in KM
  const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
  const dLng = (p2.lng - p1.lng) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * (Math.PI / 180)) * 
    Math.cos(p2.lat * (Math.PI / 180)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

/**
 * Formats distance for readable clinical display.
 */
export const formatDistance = (km: number): string => {
  if (km < 1) return `${(km * 1000).toFixed(0)}m`;
  return `${km.toFixed(1)}km`;
};

/**
 * Debounce helper for high-frequency geolocation updates.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
