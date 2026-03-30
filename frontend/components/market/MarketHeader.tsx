"use client";

import React from "react";
import { TrendingUp, TrendingDown, Activity, IndianRupee } from "lucide-react";

interface MarketHeaderProps {
  stats: {
    avgPrice: string;
    topGainer: { name: string; change: string };
    topLoser: { name: string; change: string };
  };
}

export const MarketHeader: React.FC<MarketHeaderProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Average Price Today */}
      <div className="relative group bg-white p-6 rounded-[2rem] border-[3px] border-primary-900 shadow-2xl overflow-hidden transition-all hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/30 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-200/50 transition-colors" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-900 text-white rounded-xl flex items-center justify-center shadow-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Yield Index Today</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-primary-900 italic tracking-tighter">₹ {stats.avgPrice}</h3>
            <p className="text-[10px] font-bold text-primary-600 mt-1 uppercase tracking-tight">Avg Market Rate / Quintal</p>
          </div>
        </div>
      </div>

      {/* Top Gainer */}
      <div className="relative group bg-white p-6 rounded-[2rem] border-[3px] border-emerald-900 shadow-2xl overflow-hidden transition-all hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/30 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-200/50 transition-colors" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-900 text-white rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Surge Protocol Active</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-900 italic tracking-tighter truncate max-w-full" title={stats.topGainer.name}>
                {stats.topGainer.name}
            </h3>
            <div className="flex items-center gap-2 text-emerald-600 mt-1">
              <Activity className="w-3 h-3 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Gain: +{stats.topGainer.change}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Loser */}
      <div className="relative group bg-white p-6 rounded-[2rem] border-[3px] border-rose-900 shadow-2xl overflow-hidden transition-all hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/30 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-rose-200/50 transition-colors" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-900 text-white rounded-xl flex items-center justify-center shadow-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Market Correction</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-900 italic tracking-tighter truncate max-w-full" title={stats.topLoser.name}>
                {stats.topLoser.name}
            </h3>
            <div className="flex items-center gap-2 text-rose-600 mt-1">
              <Activity className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Drop: -{stats.topLoser.change}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
