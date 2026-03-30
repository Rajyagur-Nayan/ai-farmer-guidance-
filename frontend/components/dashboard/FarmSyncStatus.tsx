"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Cpu, Wifi, WifiOff, Thermometer, Droplets, Zap, RefreshCw, AlertCircle, Loader2, Radio } from "lucide-react";

interface SyncStatus {
  uvIndex: number;
  soilMoisture: number;
  status: "online" | "offline" | "error";
  lastSync: string;
}

export const FarmSyncStatus: React.FC = () => {
  const [data, setData] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const simulateSync = useCallback(async () => {
    setLoading(true);
    setError(false);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random fail simulator (10% chance)
    if (Math.random() < 0.1) {
      setError(true);
      setLoading(false);
      return;
    }

    setData({
      uvIndex: Math.floor(Math.random() * 11),
      soilMoisture: Math.floor(Math.random() * 100),
      status: Math.random() > 0.05 ? "online" : "offline",
      lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    simulateSync();
    const interval = setInterval(simulateSync, 60000); // Sync every 60s
    return () => clearInterval(interval);
  }, [simulateSync]);

  if (loading && !data) {
    return (
      <div className="h-full bg-white p-10 rounded-[3.5rem] border-4 border-primary-900 shadow-2xl flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary-900 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Syncing IoT Uplink...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-rose-50 p-10 rounded-[3.5rem] border-4 border-rose-900 shadow-2xl flex flex-col items-center justify-center gap-6 text-center">
        <WifiOff className="w-16 h-16 text-rose-900" />
        <div>
          <h3 className="text-2xl font-black text-rose-900 italic uppercase">Sync Link Failure</h3>
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1">Communication Failure</p>
        </div>
        <button 
          onClick={simulateSync}
          className="flex items-center gap-3 px-10 h-16 bg-rose-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-black transition-all"
        >
          <RefreshCw className="w-5 h-5" /> Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[3.5rem] border-4 border-primary-900 shadow-2xl relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-100/30 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 transition-colors" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${data?.status === 'online' ? 'bg-emerald-900' : 'bg-rose-900'} text-white rounded-2xl flex items-center justify-center shadow-lg transition-colors`}>
              {data?.status === 'online' ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-primary-900 italic tracking-tight uppercase">IoT Farm Sync</h3>
              <div className="flex items-center gap-2 mt-1">
                 <div className={`w-2 h-2 rounded-full ${data?.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Status: {data?.status}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black uppercase tracking-widest text-primary-100">Last Pulse: {data?.lastSync}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* UV Index Node */}
          <div className="p-8 bg-primary-50 rounded-[2.5rem] border-2 border-primary-100 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-md">
                   <Zap className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">UV Index</span>
             </div>
             <div className="text-4xl font-black text-primary-900 italic">{data?.uvIndex}</div>
             <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-1000" 
                  style={{ width: `${(data?.uvIndex || 0) * 10}%` }} 
                />
             </div>
          </div>

          {/* Soil Moisture Node */}
          <div className="p-8 bg-primary-50 rounded-[2.5rem] border-2 border-primary-100 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-md">
                   <Droplets className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Moisture</span>
             </div>
             <div className="text-4xl font-black text-primary-900 italic">{data?.soilMoisture}%</div>
             <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${data?.soilMoisture || 0}%` }} 
                />
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Radio className="w-5 h-5 text-emerald-500 animate-ping" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Telemetry Uplink Stable</p>
           </div>
           <button onClick={simulateSync} className="p-3 bg-white border-2 border-primary-100 rounded-xl hover:border-primary-900 transition-all shadow-sm">
              <RefreshCw className={`w-4 h-4 text-primary-900 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>
      </div>
    </div>
  );
};
