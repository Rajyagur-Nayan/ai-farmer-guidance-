"use client";

import React from "react";
import { TrendingUp, TrendingDown, Clock, MapPin, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface CropPriceCardProps {
  crop: {
    name: string;
    price: number;
    market: string;
    change: number;
    lastUpdated: string;
    category: string;
  };
  onClick?: () => void;
  isSelected?: boolean;
}

export const CropPriceCard: React.FC<CropPriceCardProps> = ({ 
  crop, 
  onClick, 
  isSelected 
}) => {
  const isUp = crop.change > 0;
  const isDown = crop.change < 0;

  return (
    <Card
      onClick={onClick}
      className={`
        group relative p-6 rounded-[2rem] border-[3px] transition-all duration-500 cursor-pointer overflow-hidden
        ${isSelected 
          ? "bg-white border-primary-900 shadow-2xl scale-[1.01]" 
          : "bg-white border-transparent hover:border-primary-100 shadow-xl"}
      `}
    >
      <div className="flex flex-col gap-5">
        {/* Header: Crop & Category */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400">
              {crop.category} protocol
            </span>
            <h4 className="text-xl font-black text-primary-900 italic tracking-tight uppercase truncate max-w-[150px]" title={crop.name}>
              {crop.name}
            </h4>
          </div>
          <div className={`
            px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5
            ${isUp ? "bg-emerald-100 text-emerald-800" : isDown ? "bg-rose-100 text-rose-800" : "bg-primary-50 text-primary-800"}
          `}>
             {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
             {isUp ? "High Demand" : "Falling Price"}
          </div>
        </div>

        {/* Pricing Core */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-primary-900 tracking-tight">₹ {crop.price}</div>
            <div className="text-[9px] font-bold text-primary-400 uppercase tracking-widest mt-0.5">
              Current Rate / Quintal
            </div>
          </div>
          <div className={`
            text-lg font-black italic
            ${isUp ? "text-emerald-600" : "text-rose-600"}
          `}>
            {isUp ? "+" : ""}{crop.change}%
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="pt-5 border-t border-primary-50 space-y-2">
          <div className="flex items-center gap-2.5 text-primary-600 text-[11px] font-bold uppercase tracking-tight truncate">
            <MapPin className="w-3.5 h-3.5" /> {crop.market}
          </div>
          <div className="flex items-center gap-2.5 text-primary-400 text-[9px] font-black uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /> Updated {crop.lastUpdated}
          </div>
        </div>

        {/* Action Animation */}
        <div className={`
          absolute bottom-0 left-0 w-full h-1.5 transition-all duration-700
          ${isUp ? "bg-emerald-500" : "bg-rose-500"}
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}
        `} />
      </div>
    </Card>
  );
};
