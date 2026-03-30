"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { 
  Navigation, 
  MapPin, 
  Phone, 
  Activity, 
  Star, 
  Truck, 
  Sprout, 
  Warehouse, 
  AlertTriangle,
  Loader2,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  Search,
  PawPrint
} from "lucide-react";

// Geolocation & Utils
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { calculateDistance, formatDistance, Coordinates } from "@/utils/location";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Leaflet Compatibility
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// SSR-Safe Map Component (Isolates Leaflet/Window dependencies)
const MandiMap = dynamic(() => import("./market/MandiMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] animate-pulse">Acquiring Orbital Lock...</p>
    </div>
  )
});

interface FarmerFacility {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  distance: number;
  address?: string;
  phone?: string;
}

const CATEGORIES = [
  { id: "mandi", label: "Local Mandi", icon: Warehouse, query: '["amenity"="market"]' },
  { id: "agri_shop", label: "Agri Shops", icon: Sprout, query: '["shop"="agricultural"]' },
  { id: "logistics", label: "Logistics", icon: Truck, query: '["industrial"="logistics"]' },
  { id: "veterinary", label: "Veterinary", icon: PawPrint, query: '["amenity"="veterinary"]' },
];

export default function LiveLocation() {
  const { coords: userCoords, loading: geoLoading, error: geoError } = useLiveLocation();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [facilities, setFacilities] = useState<FarmerFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<FarmerFacility | null>(null);
  const [routeData, setRouteData] = useState<[number, number][]>([]);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km for rural areas
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const cacheRef = React.useRef<Map<string, FarmerFacility[]>>(new Map());
  const lastFetchRef = React.useRef<{ lat: number; lng: number; cat: string } | null>(null);

  // 📡 Overpass API Engine (Optimized for Rural Discovery)
  const fetchNearby = useCallback(async (lat: number, lng: number, radius: number = 5000, retryCount = 0) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    const query = `
      [out:json][timeout:30];
      (
        node${activeCategory.query}(around:${radius},${lat},${lng});
        way${activeCategory.query}(around:${radius},${lat},${lng});
        relation${activeCategory.query}(around:${radius},${lat},${lng});
      );
      out center;
    `;
    
    // 🧠 Cache Check (Round to 3 decimals ~110m precision)
    const cacheKey = `${activeCategory.id}-${lat.toFixed(3)}-${lng.toFixed(3)}`;
    if (cacheRef.current.has(cacheKey) && retryCount === 0) {
      setFacilities(cacheRef.current.get(cacheKey)!);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        signal: abortControllerRef.current.signal,
      });

      if (response.status === 429) {
        throw new Error("RATE_LIMIT");
      }

      if (response.status === 504 || response.status === 502) {
          if (retryCount < 2) {
              setError(`Retrying Cloud Node... (${retryCount + 1})`);
              const delay = (retryCount + 1) * 3000;
              setTimeout(() => fetchNearby(lat, lng, radius, retryCount + 1), delay);
              return;
          }
          throw new Error("GATEWAY_TIMEOUT");
      }

      if (!response.ok) throw new Error("Cloud Node Link Failure");

      const data = await response.json();
      const nodes = data.elements.map((el: any) => ({
        id: el.id,
        name: el.tags?.name || `${activeCategory.label} Center`,
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        type: activeCategory.id,
        distance: calculateDistance({ lat, lng }, { lat: el.lat || el.center?.lat, lng: el.lon || el.center?.lon }),
        address: el.tags?.["addr:street"] || el.tags?.["addr:full"] || "Rural Sector Identified",
        phone: el.tags?.phone || el.tags?.["contact:phone"] || "N/A",
      }));
      
      const sorted = nodes.sort((a: any, b: any) => a.distance - b.distance);
      setFacilities(sorted);
      cacheRef.current.set(cacheKey, sorted);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      
      if (err.message === "RATE_LIMIT") {
        setError("Network busy. Retrying in 30s...");
        setTimeout(() => fetchNearby(lat, lng, radius), 30000);
      } else if (err.message === "GATEWAY_TIMEOUT") {
        setError("Overpass Node Timeout. Click manual refresh.");
      } else {
        console.error("Discovery Fault:", err);
        setError("Sensor Grid Offline");
      }
    } finally {
      if (retryCount === 0 || !error?.includes("Retrying")) {
          setLoading(false);
      }
    }
  }, [activeCategory]);

  useEffect(() => {
    if (userCoords) {
      // 🚀 Movement Threshold: Only fetch if moved > 200m or category changed
      const hasMovedSignificantly = !lastFetchRef.current || 
        calculateDistance(lastFetchRef.current, userCoords) > 0.2 ||
        lastFetchRef.current.cat !== activeCategory.id;

      if (hasMovedSignificantly) {
        fetchNearby(userCoords.lat, userCoords.lng, searchRadius);
        lastFetchRef.current = { lat: userCoords.lat, lng: userCoords.lng, cat: activeCategory.id };
      }
    }
  }, [userCoords, activeCategory, fetchNearby, searchRadius]);

  if (geoError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-rose-50/30 rounded-[3rem] border-2 border-dashed border-rose-100">
        <AlertTriangle className="w-16 h-16 text-rose-500 mb-6" />
        <h3 className="text-2xl font-black text-rose-900 mb-2 italic">GEOLOCATION FAILURE</h3>
        <p className="text-rose-600 font-bold uppercase tracking-widest text-[10px]">{geoError}</p>
        <Button onClick={() => window.location.reload()} className="mt-8 rounded-3xl px-12 py-6 bg-rose-600 text-white font-black italic shadow-2xl">
          RECALIBRATE GPS
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden rounded-[3.5rem] border-4 border-primary-900 shadow-2xl relative">
      {/* 📍 MAP SECTION */}
      <div className="relative h-1/2 md:h-[60%] shrink-0 overflow-hidden bg-primary-100/30">
        {!geoLoading && userCoords ? (
          <MandiMap 
            userCoords={userCoords}
            facilities={facilities}
            onFacilityClick={(f) => setSelectedFacility(f)}
            routeData={routeData}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.3em] animate-pulse">Acquiring Orbital Lock...</p>
          </div>
        )}

        {/* 🗺️ OVERLAY CONTROLS */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
          <Button 
            onClick={() => userCoords && fetchNearby(userCoords.lat, userCoords.lng)} 
            className="rounded-2xl bg-primary-900 text-white shadow-2xl h-14 w-14 p-0 hover:rotate-12 transition-transform"
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>

        {/* ⚠️ Error Overlay */}
        {error && (
          <div className="absolute top-6 right-6 z-20 bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* 🎛️ CATEGORY RIBBON */}
      <div className="bg-white border-b border-primary-50 p-6 shrink-0 shadow-sm z-20 scrollbar-hide overflow-x-auto">
        <div className="flex gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedFacility(null);
                }}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-3xl whitespace-nowrap transition-all duration-500
                  ${active 
                    ? "bg-primary-900 text-white shadow-2xl scale-105" 
                    : "bg-primary-50/50 text-primary-400 hover:bg-primary-50 hover:text-primary-600"}
                `}
              >
                <Icon className={`w-5 h-5 ${active ? "animate-bounce" : ""}`} />
                <span className="text-[11px] font-black uppercase tracking-widest italic">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 📋 RESULTS LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 bg-primary-50/30">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-white border border-primary-50 rounded-[2.5rem] animate-pulse p-8 space-y-4" />
          ))
        ) : facilities.length > 0 ? (
          facilities.map((f, i) => {
            const isSelected = selectedFacility?.id === f.id;
            return (
              <Card 
                key={f.id}
                onClick={() => setSelectedFacility(f)}
                className={`
                  group p-10 rounded-[2.5rem] border-4 transition-all duration-700 cursor-pointer overflow-hidden relative
                  ${isSelected 
                    ? "bg-white border-primary-900 shadow-2xl scale-[1.02]" 
                    : "bg-white border-transparent hover:border-primary-100 shadow-xl"}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? "bg-primary-900 text-white" : "bg-primary-50 text-primary-400 group-hover:rotate-12 transition-all"}`}>
                        <activeCategory.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-black text-primary-900 italic tracking-tight uppercase">
                        {f.name}
                      </h4>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black tracking-widest uppercase">
                        <MapPin className="w-4 h-4" /> {f.address}
                      </div>
                      <div className="flex items-center gap-2 text-primary-900 text-xs font-black bg-primary-100/50 w-fit px-4 py-2 rounded-xl">
                        <TrendingUp className="w-4 h-4 text-primary-600" /> {formatDistance(f.distance)} PROXIMITY
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-8 h-8 text-primary-200 transition-all ${isSelected ? "translate-x-2 text-primary-900" : ""}`} />
                </div>

                {isSelected && (
                  <div className="mt-8 pt-8 border-t-2 border-primary-50 flex gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    <Button 
                      className="flex-1 py-8 rounded-3xl bg-secondary-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-widest"
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`)}
                    >
                      <Navigation className="w-5 h-5 mr-3" /> Start Navigation
                    </Button>
                    <Button 
                      disabled={f.phone === "N/A"}
                      className="flex-1 py-8 rounded-3xl bg-primary-900 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-widest disabled:opacity-30"
                      onClick={() => window.open(`tel:${f.phone}`)}
                    >
                      <Phone className="w-5 h-5 mr-3" /> Contact Center
                    </Button>
                  </div>
                )}
              </Card>
            )
          })
        ) : (
          <div className="py-24 text-center space-y-6">
            <Warehouse className="w-20 h-20 text-primary-100 mx-auto" />
            <div>
              <p className="font-black text-primary-900 uppercase tracking-widest text-sm italic">No Agricultural Hubs Found</p>
              <p className="text-[10px] text-primary-400 mt-2 font-bold uppercase tracking-widest">Scanning local sensor grids for mandi centers...</p>
            </div>
            <Button onClick={() => userCoords && fetchNearby(userCoords.lat, userCoords.lng)} className="rounded-full px-12 py-5 bg-primary-900 text-white font-black uppercase shadow-xl">
               Expand Scan Radius
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
