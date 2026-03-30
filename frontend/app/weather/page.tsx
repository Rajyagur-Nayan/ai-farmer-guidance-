"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import WeatherWidget from '@/components/newFeatures/WeatherWidget';
import { CloudRain, Sun, Activity, RefreshCw, Loader2, ShieldAlert, Sprout } from 'lucide-react';
import { apiService } from '@/utils/api';
import { useLiveLocation } from '@/hooks/useLiveLocation';
import { Button } from '@/components/ui/Button';

export default function WeatherPage() {
  const { coords } = useLiveLocation();
  const [uvData, setUvData] = useState<{ uvIndex: number; level: string; mode?: string } | null>(null);
  const [soilData, setSoilData] = useState<{ moisture: number; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = coords?.lat || 22.3072; // Default to Rajkot if no GPS
      const lon = coords?.lng || 70.8213;

      const [uv, soil] = await Promise.all([
        apiService.getUVIndex(lat, lon),
        apiService.getSoilMoisture()
      ]);

      setUvData(uv);
      setSoilData(soil);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("IoT Sync Error:", err);
      setError("Cloud Link Failure");
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  const getUVColor = (level: string) => {
    switch (level) {
      case "Low": return "text-medical-green bg-medical-green/10";
      case "Moderate": return "text-yellow-500 bg-yellow-500/10";
      case "High": case "Very High": return "text-rose-500 bg-rose-500/10";
      default: return "text-primary-400 bg-primary-50";
    }
  };

  return (
    <Layout>
      <div className="space-y-12 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2 animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    <CloudRain className="w-3 h-3 animate-bounce" />
                    <span>Atmospheric Sync Active</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-primary-900 tracking-tight italic">
                    Weather Forecast 🌤️
                </h1>
                <p className="text-medical-textSecondary font-bold text-lg max-w-xl italic">
                    Real-time meteorological monitoring with integrated agricultural logic for field deployment.
                </p>
                {lastUpdated && (
                  <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest italic flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    Last telemetry sync: {lastUpdated}
                  </p>
                )}
            </div>
            
            <div className="flex gap-4">
                 <div className="p-6 bg-white rounded-3xl shadow-xl border border-medical-border flex items-center gap-4">
                    <div className="w-12 h-12 bg-medical-green/10 rounded-2xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-medical-green" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Protocol</p>
                        <p className="text-lg font-black text-primary-900 italic">V4.2.0-WEATHER</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* Main Widget */}
        <section className="px-2">
            <WeatherWidget />
        </section>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
            {/* UV Index Card */}
            <div className={`p-8 bg-white rounded-[2.5rem] shadow-xl border-2 transition-all duration-700 relative overflow-hidden group ${error ? 'border-rose-100' : 'border-primary-50'}`}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-4">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Syncing Phased Array...</span>
                    </div>
                ) : error ? (
                    <div className="space-y-6">
                        <ShieldAlert className="w-8 h-8 text-rose-500" />
                        <h5 className="font-black text-primary-900 uppercase tracking-widest text-xs">UV Monitor Offline</h5>
                        <Button onClick={fetchData} variant="outline" className="w-full rounded-2xl text-[10px] font-black py-4 border-rose-200 text-rose-600 hover:bg-rose-50">RETRY LINK</Button>
                    </div>
                ) : (
                    <>
                        <Sun className={`w-8 h-8 mb-4 ${uvData?.level === 'High' ? 'text-rose-500 animate-pulse' : 'text-primary-900 animate-spin-slow'}`} />
                        <h5 className="font-black text-primary-900 uppercase tracking-widest text-xs mb-2">UV Index Monitor</h5>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-primary-900 italic tracking-tighter">{uvData?.uvIndex}</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 ${getUVColor(uvData?.level || "")}`}>
                            {uvData?.level}
                          </span>
                        </div>
                        {uvData?.mode === 'estimated' && (
                           <p className="text-[8px] font-black text-primary-300 uppercase tracking-widest mt-4">Estimated via Weather Model</p>
                        )}
                    </>
                )}
            </div>

            {/* Soil Moisture Card */}
            <div className={`p-8 bg-white rounded-[2.5rem] shadow-xl border-2 transition-all duration-700 relative overflow-hidden group ${error ? 'border-rose-100' : 'border-primary-50'}`}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-4">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Acquiring IoT Signal...</span>
                    </div>
                ) : error ? (
                    <div className="space-y-6">
                        <Activity className="w-8 h-8 text-rose-500" />
                        <h5 className="font-black text-primary-900 uppercase tracking-widest text-xs">Soil Sync Offline</h5>
                        <Button onClick={fetchData} variant="outline" className="w-full rounded-2xl text-[10px] font-black py-4 border-rose-200 text-rose-600 hover:bg-rose-50">RECONNECT IOT</Button>
                    </div>
                ) : (
                    <>
                        <Sprout className="w-8 h-8 mb-4 text-medical-green group-hover:scale-110 transition-transform duration-500" />
                        <h5 className="font-black text-primary-900 uppercase tracking-widest text-xs mb-2">Soil Moisture Sync</h5>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-primary-900 italic tracking-tighter">{soilData?.moisture}%</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 ${
                            soilData?.status === 'Optimal' ? 'text-medical-green bg-medical-green/10' : 
                            soilData?.status === 'Dry' ? 'text-amber-500 bg-amber-500/10' : 'text-primary-500 bg-primary-100'
                          }`}>
                            {soilData?.status}
                          </span>
                        </div>
                        <div className="mt-6 h-1.5 w-full bg-primary-50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${soilData?.status === 'Optimal' ? 'bg-medical-green' : 'bg-primary-500'}`}
                              style={{ width: `${soilData?.moisture}%` }}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Field Status Card (Consistent with existing) */}
            <div className="p-8 bg-primary-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <Activity className="w-8 h-8 mb-4 text-medical-green" />
                    <h5 className="font-black uppercase tracking-widest text-xs mb-2 text-white/40">Field Status</h5>
                    <p className="text-xl font-black italic">PROXIMITY SYNC CONFIRMED</p>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mt-4">Autonomous Mesh Established</p>
                </div>
                <Activity className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
            </div>
        </div>
      </div>
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}
