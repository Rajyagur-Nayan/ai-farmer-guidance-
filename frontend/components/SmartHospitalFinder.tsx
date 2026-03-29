"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Phone,
  AlertCircle,
  Loader2,
  Navigation,
  Activity,
  ChevronRight,
  Stethoscope,
  X,
  Compass,
  Star
} from "lucide-react";
import { apiService } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import AppointmentBooking from "./AppointmentBooking";

const CATEGORIES = [
  { id: "All", label: "General", icon: Activity },
  { id: "Dentist", label: "Dentist", icon: Star },
  { id: "Bone", label: "Bone Specialist", icon: Stethoscope },
  { id: "Mind", label: "Mind Specialist", icon: Activity }
];

// Dynamic import for Leaflet (SSR-Safe)
const HospitalMap = dynamic(() => import("./HospitalMap"), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-primary-50 animate-pulse flex items-center justify-center rounded-[2rem]">
            <Loader2 className="w-12 h-12 text-primary-200 animate-spin" />
        </div>
    )
});

interface Hospital {
  name: string;
  type: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  distance: number;
  rating?: number;
}

const SmartHospitalFinder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; hospitalName: string; specialty?: string }>({ 
    isOpen: false, 
    hospitalName: "" 
  });
  const [error, setError] = useState<string | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  };


  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
        setError("GPS Uplink Offline");
        return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLocation(coords);
            fetchHospitals(coords.lat, coords.lng, activeCategory);
        },
        (err) => {
            setError("GPS signal lost. Enable location.");
            setLoading(false);
        }
    );
  };

  const fetchHospitals = async (lat: number, lng: number, category: string = "All") => {
    setLoading(true);
    try {
        const data = await apiService.getSmartHospitals("general", lat, lng, category);
        if (data.hospitals) {
            setHospitals(data.hospitals.map((h: any) => ({
                ...h,
                distance: calculateDistance(lat, lng, h.lat, h.lng),
                rating: 4 + (Math.random() * 0.9) // Simulating real ratings
            })));
        }
    } catch (err) {
        setError("Biological Node Search Failed.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
        fetchHospitals(userLocation.lat, userLocation.lng, activeCategory);
    }
  }, [activeCategory]);

  const getRoute = async (destLat: number, destLng: number) => {
    if (!userLocation) return;
    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destLng},${destLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes?.[0]) {
            const coords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
            setRoutePoints(coords as [number, number][]);
        }
    } catch (err) {
        console.error("OSRM Routing Error:", err);
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    getRoute(hospital.lat, hospital.lng);
    // Smooth scroll map into view if on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const processedHospitals = useMemo(() => {
    let list = hospitals.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return list.sort((a, b) => {
        if (sortBy === "distance") return a.distance - b.distance;
        return (b.rating || 0) - (a.rating || 0);
    });
  }, [hospitals, searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-medical-bg">
      
      {/* 1. STICKY MAP SECTION (TOP) */}
      <div className="sticky top-0 z-40 h-[50vh] md:h-[60vh] bg-white border-b border-medical-border shadow-lg">
          <HospitalMap 
            userLocation={userLocation}
            hospitals={processedHospitals}
            selectedHospital={selectedHospital}
            routePoints={routePoints}
            onHospitalClick={handleHospitalSelect}
          />
          
          {/* SEARCH OVERLAY */}
          <div className="absolute top-6 left-6 right-6 z-50 max-w-lg mx-auto">
              <div className="flex items-center gap-3 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
                  <Search className="w-5 h-5 text-primary-400 ml-2" />
                  <input 
                    type="text" 
                    placeholder="Search hospitals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-primary-900 font-bold placeholder:text-primary-200"
                  />
                  <button onClick={detectLocation} className="p-2 hover:bg-primary-50 rounded-xl transition-colors">
                      <Compass className="w-5 h-5 text-primary-500" />
                  </button>
              </div>
          </div>

          {/* LOADING OVERLAY */}
          {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-[60] flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              </div>
          )}
      </div>

      {/* 2. FILTER HEADER (STICKY) */}
      <div className="sticky top-[50vh] md:top-[60vh] z-30 bg-white/80 backdrop-blur-md border-b border-primary-50">
          {/* Category Ribbon */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 p-6 px-12 items-center bg-primary-50/10">
              {CATEGORIES.map((cat) => (
                  <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`
                          flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all duration-300
                          ${activeCategory === cat.id 
                              ? "bg-primary-500 text-white shadow-xl shadow-primary-500/10 scale-105" 
                              : "bg-white text-primary-400 hover:bg-primary-50"}
                      `}
                  >
                      <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? "text-white" : "text-primary-300"}`} />
                      <span className="text-xs font-semibold uppercase tracking-widest">{cat.label}</span>
                  </button>
              ))}
          </div>

          <div className="px-12 py-6 border-t border-primary-50 flex items-center justify-between">
              <div className="flex gap-2">
                  <button 
                    onClick={() => setSortBy("distance")}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${sortBy === "distance" ? "bg-primary-500 text-white shadow-lg" : "bg-primary-50 text-primary-400 hover:bg-primary-100"}`}
                  >
                      Nearest
                  </button>
                  <button 
                    onClick={() => setSortBy("rating")}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${sortBy === "rating" ? "bg-primary-500 text-white shadow-lg" : "bg-primary-50 text-primary-400 hover:bg-primary-100"}`}
                  >
                      Top Rated
                  </button>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">
                {loading ? "Searching nodes..." : `${processedHospitals.length} Nodes Online`}
              </p>
          </div>
      </div>

      {/* 3. HOSPITAL LIST SECTION (BOTTOM) */}
      <div className="p-6 md:p-12 space-y-6">
          {loading ? (
              // Loading Skeletons for the list
              Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white border border-primary-50 p-8 rounded-2xl animate-pulse space-y-4">
                      <div className="flex gap-6">
                          <div className="w-48 h-32 bg-primary-50 rounded-xl" />
                          <div className="flex-1 space-y-4 py-2">
                              <div className="h-8 bg-primary-50 rounded-lg w-3/4" />
                              <div className="h-4 bg-primary-50 rounded-lg w-1/2" />
                              <div className="h-4 bg-primary-50 rounded-lg w-1/4" />
                          </div>
                      </div>
                  </div>
              ))
          ) : processedHospitals.length > 0 ? (
              processedHospitals.map((h, i) => (
                  <Card 
                    key={i}
                    onClick={() => handleHospitalSelect(h)}
                    className={`
                        flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-2xl border transition-all cursor-pointer group
                        ${selectedHospital?.name === h.name ? 'bg-white border-primary-500 ring-4 ring-primary-500/5 shadow-2xl' : 'bg-white border-transparent hover:border-primary-100 shadow-xl shadow-primary-500/5'}
                    `}
                  >
                      {/* Image Placeholder */}
                      <div className="w-full md:w-48 h-32 md:h-auto bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                          <Stethoscope className="w-12 h-12 text-primary-200 group-hover:scale-110 transition-transform" />
                          <div className="absolute top-3 left-3 px-3 py-1 bg-white/80 backdrop-blur-md rounded-lg text-xs font-semibold  tracking-widest text-primary-900">
                              {h.type}
                          </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                              <h4 className="text-2xl md:text-3xl font-semibold  tracking-tight text-primary-900 leading-tight uppercase group-hover:text-primary-500 transition-colors">
                                  {h.name}
                              </h4>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-medical-green/10 text-medical-green rounded-xl text-xs font-semibold">
                                  <Star className="w-3.5 h-3.5 fill-medical-green" /> {h.rating?.toFixed(1)}
                              </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-primary-400 text-sm font-bold uppercase tracking-widest">
                                  <MapPin className="w-4 h-4 text-primary-200" /> {h.address}
                              </div>
                              <div className="flex items-center gap-2 text-primary-900 text-sm font-semibold italic">
                                  <Navigation className="w-4 h-4 text-primary-500" /> {h.distance} KM AWAY
                              </div>
                          </div>

                          <div className="flex gap-4 pt-4">
                              <Button 
                                onClick={(e) => { e.stopPropagation(); window.open(`tel:${h.phone}`); }}
                                className="flex-1 py-5 rounded-2xl bg-primary-900 hover:bg-primary-500 shadow-xl shadow-primary-900/10 text-sm font-semibold  tracking-tight"
                              >
                                  <Phone className="w-4 h-4 mr-2" /> CALL CLINIC
                              </Button>
                              <Button 
                                variant="outline"
                                className="flex-1 py-5 rounded-2xl border-primary-100 text-primary-900 text-sm font-semibold  tracking-tight hover:bg-primary-50"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setBookingModal({ isOpen: true, hospitalName: h.name, specialty: activeCategory });
                                }}
                              >
                                  BOOK APPOINTMENT
                              </Button>
                          </div>
                      </div>
                  </Card>
              ))
          ) : (
              <div className="p-24 bg-white rounded-3xl border border-dashed border-primary-100 flex flex-col items-center justify-center text-center">
                  <Activity className="w-12 h-12 text-primary-200 mb-6 animate-pulse" />
                  <p className="font-semibold text-primary-900 uppercase tracking-widest mb-4">
                    {userLocation ? `No ${activeCategory !== "All" ? activeCategory : "Clinical"} Nodes in 50km Radius` : "Acquiring GPS Signal..."}
                  </p>
                  {userLocation && (
                    <Button onClick={detectLocation} variant="outline" className="rounded-full py-6 px-10">
                      RETRY SEARCH
                    </Button>
                  )}
              </div>
          )}
      </div>

      {/* Appointment Modal Overlay */}
      <AppointmentBooking 
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
        hospitalName={bookingModal.hospitalName}
        specialty={bookingModal.specialty}
      />

      {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-medical-error text-white rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <AlertCircle className="w-5 h-5" />
              {error}
          </div>
      )}
    </div>
  );
};


export default SmartHospitalFinder;
