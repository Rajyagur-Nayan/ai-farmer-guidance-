"use client";

import React from 'react';
import Layout from '@/components/layout/Layout';
import WeatherWidget from '@/components/newFeatures/WeatherWidget';
import { CloudRain, Sun, Activity } from 'lucide-react';

export default function WeatherPage() {
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
            <div className="p-8 bg-white/50 border-2 border-dashed border-medical-border rounded-[2.5rem] opacity-40 grayscale">
                <Sun className="w-8 h-8 mb-4 text-primary-900" />
                <h5 className="font-black text-primary-900 uppercase tracking-widest text-xs mb-2">UV Index Monitor</h5>
                <p className="text-xs font-bold text-medical-textSecondary uppercase tracking-widest">Hardware Sync Pending...</p>
            </div>
            <div className="p-8 bg-white/50 border-2 border-dashed border-medical-border rounded-[2.5rem] opacity-40 grayscale">
                <CloudRain className="w-8 h-8 mb-4 text-primary-900" />
                <h5 className="font-black text-primary-900 uppercase tracking-widest text-xs mb-2">Soil Moisture Sync</h5>
                <p className="text-xs font-bold text-medical-textSecondary uppercase tracking-widest">IoT Link Offline</p>
            </div>
            <div className="p-8 bg-primary-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <Activity className="w-8 h-8 mb-4 text-medical-green" />
                    <h5 className="font-black uppercase tracking-widest text-xs mb-2 text-white/40">Field Status</h5>
                    <p className="text-xl font-black italic">CLINICAL STABILITY CONFIRMED</p>
                </div>
                <Activity className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
            </div>
        </div>
      </div>
    </Layout>
  );
}
