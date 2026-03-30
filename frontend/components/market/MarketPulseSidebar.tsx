"use client";

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  AlertTriangle, 
  MapPin, 
  Globe,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useGeolocation } from '@/hooks/useGeolocation';

interface MarketData {
  crop: string;
  mandi_price: string;
  trend: 'up' | 'down' | 'steady';
}

interface MarketPulseSidebarProps {
  allCrops?: MarketData[];
}

const MarketPulseSidebar: React.FC<MarketPulseSidebarProps> = ({ allCrops = [] }) => {
  const { lat, lon, error: geoError } = useGeolocation();

  // Aggregate Market Stats
  const stats = useMemo(() => {
    if (!allCrops.length) return { bullish: 0, bearish: 0, sentiment: 'Stable' };
    
    const up = allCrops.filter(c => c.trend === 'up').length;
    const down = allCrops.filter(c => c.trend === 'down').length;
    
    let sentiment = 'Neutral';
    if (up > down * 1.5) sentiment = 'Bullish';
    if (down > up * 1.5) sentiment = 'Bearish';
    
    return {
      bullish: up,
      bearish: down,
      sentiment
    };
  }, [allCrops]);

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-right-4 duration-700">
      {/* 1. Market Pulse Gauge */}
      <Card className="p-6 bg-primary-900 text-white rounded-[2rem] shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Pulse</span>
          </div>
          <div>
            <h4 className="text-4xl font-black italic tracking-tighter tabular-nums">{stats.sentiment}</h4>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Overall Market Sentiment</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-primary-400 uppercase">Bullish</p>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-lg font-black italic">{stats.bullish}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-rose-400 uppercase">Bearish</p>
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span className="text-lg font-black italic">{stats.bearish}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Regional Intelligence */}
      <Card className="p-6 bg-white border-2 border-primary-100 rounded-[2rem] shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className="text-[10px] font-black text-primary-900 uppercase tracking-widest">Regional Intel</span>
            </div>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </div>
          
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
             {lat && lon ? (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-primary-900">GPS Uplink Active</p>
                    <p className="text-[10px] font-medium text-primary-600 italic">Syncing with nearest Mandi centers for location-specific accuracy.</p>
                </div>
             ) : (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-rose-600">Location Inactive</p>
                    <p className="text-[10px] font-medium text-rose-400 italic">Enable GPS for state-specific price intelligence.</p>
                </div>
             )}
          </div>
        </div>
      </Card>

      {/* 3. Trade Alerts */}
      <Card className="p-6 bg-rose-50 border-2 border-rose-100 rounded-[2rem] shadow-md group hover:bg-rose-100 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Market Alerts</span>
          </div>
          <div className="space-y-3">
             <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-600"></div>
                <p className="text-[11px] font-bold text-rose-900 italic">Possible price volatility in Cash Crops due to heavy monsoon forecast.</p>
             </div>
             <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                <p className="text-[11px] font-bold text-rose-900/70 italic">Global Wheat indices stabilizing; check export protocols.</p>
             </div>
          </div>
        </div>
      </Card>

      {/* 4. Verified Link */}
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100 rounded-[2rem] shadow-sm relative group overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
          <Globe className="w-16 h-16 text-emerald-600" />
        </div>
        <div className="relative z-10 space-y-2">
           <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Farmer Safety</span>
           </div>
           <p className="text-xs font-bold text-emerald-800 italic leading-relaxed">
             Secure your harvest with PMFBY Insurance based on these market trends.
           </p>
           <button className="flex items-center gap-2 text-emerald-700 text-[10px] font-black uppercase mt-4 hover:gap-3 transition-all">
              Consult Advice <ArrowUpRight className="w-3 h-3" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPulseSidebar;
