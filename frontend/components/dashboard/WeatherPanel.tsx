"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { apiService } from "@/utils/api";

interface WeatherData {
  temperature: string;
  humidity: string;
  condition: string;
  wind_speed: string;
  rainfall: string;
  advice: string;
}

export const WeatherPanel: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Defaulting to a central region for initial sync
      const response = await apiService.getWeather(22.3072, 70.8213);
      
      // The backend now always returns a display object and advice, 
      // even if an error occurred. We only set error state for UI display 
      // but still update the weather state with the fallback data.
      setWeather(response);
      
      if (response.error) {
          setError(response.fallback || "Weather Sync Failure");
      }
    } catch (err: any) {
      console.error("Weather Sync Error:", err);
      setError("Weather Sync Failure");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Auto-refresh 5 mins
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (loading && !weather) {
    return (
      <div className="h-full bg-white p-10 rounded-[3rem] border-4 border-primary-900 shadow-2xl flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary-900 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Syncing Sky Grids...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-rose-50 p-10 rounded-[3rem] border-4 border-rose-900 shadow-2xl flex flex-col items-center justify-center gap-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-900" />
        <div>
          <h3 className="text-xl font-black text-rose-900 italic uppercase">Weather Sync Failure</h3>
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1">Communication Failure</p>
        </div>
        <button 
          onClick={fetchWeather}
          className="flex items-center gap-3 px-8 h-14 bg-rose-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-black transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Retry Sync
        </button>
      </div>
    );
  }

  const WeatherIcon = () => {
    const condition = weather?.condition.toLowerCase() || "";
    if (condition.includes("rain")) return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (condition.includes("cloud")) return <Cloud className="w-12 h-12 text-slate-400" />;
    return <Sun className="w-12 h-12 text-amber-500 animate-pulse" />;
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] border-4 border-primary-900 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 transition-colors" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-primary-900 italic tracking-tight uppercase">Weather Logic</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mt-1">Real-Time Sky Monitor</p>
            </div>
          </div>
          <button onClick={fetchWeather} className="p-2 text-primary-200 hover:text-primary-900 transition-colors">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-8">
          <div className="p-6 bg-primary-50 rounded-[2.5rem] border-2 border-primary-100">
             <WeatherIcon />
          </div>
          <div>
            <div className="text-5xl font-black text-primary-900 italic tracking-tighter">{weather?.temperature}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">{weather?.condition}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-primary-50/50 rounded-3xl border border-primary-100">
             <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-primary-400" />
                <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest">Humidity</span>
             </div>
             <div className="text-xl font-black text-primary-900">{weather?.humidity}</div>
          </div>
          <div className="p-6 bg-primary-50/50 rounded-3xl border border-primary-100">
             <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-primary-400" />
                <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest">Wind Speed</span>
             </div>
             <div className="text-xl font-black text-primary-900">{weather?.wind_speed}</div>
          </div>
        </div>

        <div className="pt-6 border-t border-primary-50">
           <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center flex-shrink-0">
                 <Thermometer className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-primary-900 italic leading-tight">
                "{weather?.advice}"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
