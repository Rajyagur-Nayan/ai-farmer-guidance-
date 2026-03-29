"use client";

import { useState, useEffect, useCallback } from "react";
import { Coordinates } from "@/utils/location";

interface LiveLocationState {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
  accuracy: number | null;
}

/**
 * Custom hook for live geolocation monitoring. ✅
 * Optimized for high-precision movement tracking. 🎯
 */
export const useLiveLocation = (options: PositionOptions = {}) => {
  const [state, setState] = useState<LiveLocationState>({
    coords: null,
    loading: true,
    error: null,
    accuracy: null,
  });

  const updateLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, loading: false, error: "Geolocation not supported" }));
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          loading: false,
          error: null,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        const errorMsg = 
          err.code === 1 ? "Location Permissions Required" :
          err.code === 2 ? "Position Unavailable" :
          "Detection Timeout";
        
        setState(prev => ({ ...prev, loading: false, error: errorMsg }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000,
        ...options
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [options]);

  useEffect(() => {
    return updateLocation();
  }, []);

  return state;
};
