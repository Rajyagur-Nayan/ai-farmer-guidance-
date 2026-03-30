"use client";

import React from "react";
import { MapPin, Navigation, TrendingUp, IndianRupee, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MarketFacility {
  id: string;
  name: string;
  distance: number;
  bestPrice: number;
  crop: string;
  lat: number;
  lng: number;
}

interface NearbyMarketsProps {
  markets: MarketFacility[];
  selectedCrop: string;
}

export const NearbyMarkets: React.FC<NearbyMarketsProps> = ({ markets, selectedCrop }) => {
  return (
    <div className="bg-white p-5 rounded-[2rem] border-2 border-primary-900 shadow-2xl overflow-hidden">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary-900 text-white rounded-lg flex items-center justify-center shadow-lg">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-primary-900 italic tracking-tight uppercase">Nearby Mandi Hubs</h3>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-primary-400 mt-0.5">Geospatial Price Discovery</p>
            </div>
          </div>
          <div className="hidden md:flex px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-[8px] font-black uppercase tracking-widest items-center gap-1">
            <Store className="w-3 h-3" />
            <span>{markets.length} Hubs</span>
          </div>
        </div>

        <div className="space-y-3">
          {markets.map((m) => (
            <div 
              key={m.id}
              className="group p-4 rounded-2xl bg-primary-50/30 border-2 border-transparent hover:border-primary-900 hover:bg-white transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <h4 className="text-sm font-black text-primary-900 italic uppercase truncate" title={m.name}>
                    {m.name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-primary-400 text-[8px] font-black tracking-widest uppercase whitespace-nowrap">
                      <Navigation className="w-3 h-3" /> {m.distance} KM
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 text-[8px] font-black tracking-widest uppercase truncate max-w-[100px]">
                      <TrendingUp className="w-3 h-3" /> {m.crop}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t border-primary-50 md:border-0 justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-lg font-black text-primary-900 tracking-tight leading-none">₹ {m.bestPrice}</div>
                    <div className="text-[7px] font-black text-primary-400 uppercase tracking-widest mt-1">Rate / Quintal</div>
                  </div>
                  <Button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`)}
                    className="h-9 px-5 rounded-xl bg-primary-900 text-white font-black uppercase text-[8px] tracking-widest shadow-lg hover:-translate-y-1 transition-all flex-shrink-0"
                  >
                    Sell Here
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {markets.length === 0 && (
          <div className="py-6 text-center space-y-2 opacity-40">
             <Store className="w-10 h-10 mx-auto text-primary-100" />
             <p className="text-[8px] font-black uppercase tracking-widest text-primary-400">Scanning local mandi grids...</p>
          </div>
        )}
      </div>
    </div>
  );
};
