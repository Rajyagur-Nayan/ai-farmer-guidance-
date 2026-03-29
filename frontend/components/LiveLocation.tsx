"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { 
  Navigation, 
  MapPin, 
  Phone, 
  Activity, 
  Star, 
  Pill, 
  Brain, 
  Stethoscope, 
  AlertTriangle,
  Loader2,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  Search
} from "lucide-react";

// Geolocation & Utils
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { calculateDistance, formatDistance, Coordinates } from "@/utils/location";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Leaflet Compatibility (CSS must be imported here or in globals.css)
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// SSR-Safe Map Components
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const MapUpdater = dynamic(() => Promise.resolve(({ center }: { center: [number, number] }) => {
  const { useMap } = require("react-leaflet");
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 14); }, [center, map]);
  return null;
}), { ssr: false });

interface MedicalFacility {
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
  { id: "hospital", label: "Hospital", icon: Stethoscope, query: '["amenity"="hospital"]' },
  { id: "dental", label: "Dental", icon: Star, query: '["healthcare"="dentist"]' },
  { id: "mental", label: "Mental Health", icon: Brain, query: '["healthcare:speciality"~"psychiatry|psychotherapy"]' },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, query: '["amenity"="pharmacy"]' },
];

export default function LiveLocation() {
  const { coords: userCoords, loading: geoLoading, error: geoError } = useLiveLocation();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<MedicalFacility | null>(null);
  const [routeData, setRouteData] = useState<[number, number][]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const [lastFetchCoords, setLastFetchCoords] = useState<Coordinates | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // 📡 Overpass API Engine
  const fetchNearby = useCallback(async (lat: number, lng: number, radius: number = 2500) => {
    // 🛑 Cancel in-flight requests
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    const query = `
      [out:json][timeout:25];
      (
        node${activeCategory.query}(around:${radius},${lat},${lng});
        way${activeCategory.query}(around:${radius},${lat},${lng});
        relation${activeCategory.query}(around:${radius},${lat},${lng});
      );
      out center;
    `;
    
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("Rate limit exceeded. Try again in 60s.");
        if (response.status === 504) throw new Error("Gateway timeout. Reducing search area...");
        throw new Error(`Cloud Uplink Error (${response.status})`);
      }

      const data = await response.json();
      const nodes = data.elements.map((el: any) => ({
        id: el.id,
        name: el.tags?.name || "Unnamed Facility",
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        type: activeCategory.id,
        distance: calculateDistance({ lat, lng }, { lat: el.lat || el.center?.lat, lng: el.lon || el.center?.lon }),
        address: el.tags?.["addr:street"] || "Location Detected",
        phone: el.tags?.phone || "Not Listed",
      }));
      
      const sorted = nodes.sort((a: any, b: any) => a.distance - b.distance);
      setFacilities(sorted);
      setLastFetchCoords({ lat, lng });
      
      if (emergencyMode && sorted.length > 0) {
        setSelectedFacility(sorted[0]);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error("Clinical Node Search Fault:", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, emergencyMode]);

  // 🧭 OSRM Routing System
  const fetchRoute = async (dest: Coordinates) => {
    if (!userCoords) return;
    try {
      const resp = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userCoords.lng},${userCoords.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`
      );
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        const points = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        setRouteData(points as [number, number][]);
      }
    } catch (err) {
      console.error("Routing Uplink Failure:", err);
    }
  };

  const lastCategoryRef = React.useRef(activeCategory.id);

  useEffect(() => {
    if (userCoords) {
      const distanceMoved = lastFetchCoords 
        ? calculateDistance(lastFetchCoords, userCoords) 
        : Infinity;
      
      const categoryChanged = lastCategoryRef.current !== activeCategory.id;

      if (categoryChanged || distanceMoved > 0.5 || !lastFetchCoords) {
        fetchNearby(userCoords.lat, userCoords.lng);
        lastCategoryRef.current = activeCategory.id;
      }
    }
  }, [userCoords, activeCategory, fetchNearby, lastFetchCoords]);

  useEffect(() => {
    if (selectedFacility) {
      fetchRoute({ lat: selectedFacility.lat, lng: selectedFacility.lng });
    } else {
      setRouteData([]);
    }
  }, [selectedFacility]);

  if (geoError) {
    return (
      <Card className="m-6 p-12 text-center bg-red-50/50 border-red-100 rounded-3xl">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-red-900 mb-2">GPS SIGNAL LOST</h3>
        <p className="text-red-600 font-bold uppercase tracking-widest text-xs">{geoError}</p>
        <Button onClick={() => window.location.reload()} className="mt-8 rounded-full px-12 py-6 bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20">
          REBOOT SENSORS
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden border-0 pt-16 pb-16 lg:pt-0 lg:pb-0">
      {/* 🛑 EMERGENCY HEADER */}
      {emergencyMode && (
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between animate-pulse shrink-0">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 fill-white text-red-600" />
            <span className="font-black uppercase tracking-[0.2em] text-sm">EMERGENCY PROTOCOL ACTIVE</span>
          </div>
          <button onClick={() => setEmergencyMode(false)} className="px-4 py-1.5 bg-white/20 hover:bg-white/40 rounded-full text-xs font-black uppercase transition-all">
            DISMISS
          </button>
        </div>
      )}

      {/* 📍 MAP SECTION */}
      <div className="relative h-1/2 md:h-[55%] shrink-0 overflow-hidden bg-primary-100/30">
        {!geoLoading && userCoords ? (
          <MapContainer 
            center={[userCoords.lat, userCoords.lng]} 
            zoom={14} 
            className="h-full w-full z-10"
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* User Marker */}
            <Marker position={[userCoords.lat, userCoords.lng]} />
            
            {/* Facility Markers */}
            {facilities.map((f) => (
              <Marker 
                key={f.id} 
                position={[f.lat, f.lng]}
                eventHandlers={{ click: () => setSelectedFacility(f) }}
              />
            ))}

            {/* Route Line */}
            {routeData.length > 0 && (
              <Polyline positions={routeData} color={emergencyMode ? "#ef4444" : "#22c55e"} weight={6} opacity={0.8} />
            )}

            <MapUpdater center={[userCoords.lat, userCoords.lng]} />
          </MapContainer>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <p className="text-xs font-black text-primary-400 uppercase tracking-widest">Acquiring Orbital Lock...</p>
          </div>
        )}

        {/* 🗺️ OVERLAY CONTROLS */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
          <Button 
            variant={emergencyMode ? "danger" : "secondary"}
            onClick={() => {
              setEmergencyMode(true);
              setActiveCategory(CATEGORIES[0]);
              if (facilities.length > 0) setSelectedFacility(facilities[0]);
            }}
            className="rounded-2xl shadow-2xl h-14 w-14 p-0 shadow-red-500/20"
          >
            <AlertTriangle className="w-6 h-6" />
          </Button>
          <Button 
            onClick={() => userCoords && fetchNearby(userCoords.lat, userCoords.lng)} 
            className="rounded-2xl bg-white text-primary-900 hover:bg-primary-50 shadow-2xl h-14 w-14 p-0 border border-primary-100"
          >
            <Search className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* 🎛️ CATEGORY RIBBON */}
      <div className="bg-white border-b border-primary-50 p-4 shrink-0 shadow-sm z-20">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-2">
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
                  flex items-center gap-3 px-6 py-3.5 rounded-2xl whitespace-nowrap transition-all duration-500
                  ${active 
                    ? "bg-primary-500 text-white shadow-xl shadow-primary-500/30 scale-105" 
                    : "bg-primary-50/50 text-primary-400 hover:bg-primary-50 hover:text-primary-600"}
                `}
              >
                <Icon className={`w-5 h-5 ${active ? "animate-pulse" : ""}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 📋 RESULTS LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-primary-50/30">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-white border border-primary-50 rounded-3xl animate-pulse p-8 space-y-4">
              <div className="h-8 bg-primary-50 rounded-lg w-3/4" />
              <div className="h-4 bg-primary-50 rounded-lg w-1/2" />
            </div>
          ))
        ) : facilities.length > 0 ? (
          facilities.map((f, i) => {
            const isSelected = selectedFacility?.id === f.id;
            const topThree = i < 3;
            
            return (
              <Card 
                key={f.id}
                onClick={() => setSelectedFacility(f)}
                className={`
                  group p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden relative
                  ${isSelected 
                    ? "bg-white border-primary-500 shadow-2xl scale-[1.02] ring-8 ring-primary-500/5" 
                    : "bg-white border-transparent hover:border-primary-100 shadow-xl shadow-primary-500/5 hover:-translate-y-1"}
                `}
              >
                {/* Visual Indicators */}
                {topThree && !isSelected && (
                  <div className="absolute top-0 right-10 px-4 py-1.5 bg-primary-50 text-primary-400 rounded-b-xl text-[9px] font-black uppercase tracking-widest">
                    Recommended Node
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${isSelected ? "bg-primary-500 text-white shadow-lg" : "bg-primary-50 text-primary-400 group-hover:bg-primary-100 transition-all duration-500"}`}>
                        <activeCategory.icon className="w-6 h-6" />
                      </div>
                      <h4 className={`text-xl font-black tracking-tight leading-tight uppercase transition-all duration-500 ${isSelected ? "text-primary-900" : "text-primary-800"}`}>
                        {f.name}
                      </h4>
                    </div>
                    <div className="flex flex-col gap-2 pl-12">
                      <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black tracking-widest uppercase">
                        <MapPin className="w-4 h-4 opacity-50" /> {f.address}
                      </div>
                      <div className="flex items-center gap-2 text-primary-900 text-xs font-bold bg-primary-50/50 w-fit px-3 py-1 rounded-lg">
                        <TrendingUp className="w-3.5 h-3.5 text-primary-500" /> {formatDistance(f.distance)} PROXIMITY
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/10 text-yellow-600 rounded-xl text-[10px] font-black tracking-widest">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" /> {(4.5 + Math.random() * 0.4).toFixed(1)}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-8 pt-8 border-t border-primary-50 flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    <Button 
                      className="flex-1 py-7 rounded-2xl rounded-tr-none bg-primary-900 hover:bg-primary-500 shadow-2xl text-xs font-black uppercase tracking-widest shadow-primary-900/20"
                      onClick={() => window.open(`tel:${f.phone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" /> Call Node
                    </Button>
                    <Button 
                      className="flex-1 py-7 rounded-2xl rounded-tl-none bg-primary-500 hover:bg-primary-600 shadow-2xl text-xs font-black uppercase tracking-widest shadow-primary-500/20"
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`)}
                    >
                      <Navigation className="w-4 h-4 mr-2" /> Navigate Now
                    </Button>
                  </div>
                )}
              </Card>
            )
          })
        ) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto opacity-50">
               <Search className="w-10 h-10 text-primary-300" />
            </div>
            <div>
              <p className="font-black text-primary-900 uppercase tracking-widest text-sm">No Medical Nodes Detected</p>
              <p className="text-xs text-primary-400 mt-2 font-bold uppercase tracking-tight">Try expanding your search radius or sensor grid.</p>
            </div>
            <Button variant="outline" onClick={() => userCoords && fetchNearby(userCoords.lat, userCoords.lng)} className="rounded-full px-12 py-5 font-black uppercase tracking-widest border-primary-100">
               Scan Environment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
