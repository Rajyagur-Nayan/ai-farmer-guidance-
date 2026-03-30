"use client";

import React from "react";
import dynamic from "next/dynamic";
import Layout from "@/components/layout/Layout";
import { MapPin, Info, Loader2 } from "lucide-react";

// 📡 SSR-Safe Dynamic Import for Leaflet/Window dependencies
const LiveLocation = dynamic(() => import("@/components/LiveLocation"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-6 bg-primary-50/10">
      <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
      <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.4em] animate-pulse italic">
        Syncing Global Positioning...
      </p>
    </div>
  )
});

export default function LiveLocationPage() {
  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
              <MapPin className="text-white w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-primary-900 italic tracking-tighter leading-none">
                Live Mandi Locator 🗺️
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mt-2">
                Real-time Agricultural Hub Discovery
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Info className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-[10px] font-bold text-primary-800 leading-tight">
                Use this grid to find the nearest Mandis, <br/>Agri-shops, and Government Centers.
            </p>
          </div>
        </div>

        {/* Live Location Component */}
        <div className="h-[800px] shadow-2xl shadow-primary-900/10 rounded-[3.5rem] overflow-hidden border-4 border-primary-900/5 transition-all">
          <LiveLocation />
        </div>
      </div>
    </Layout>
  );
}
