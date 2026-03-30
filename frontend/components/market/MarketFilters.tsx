"use client";

import React from "react";
import { Search, MapPin, Filter, Wheat, Apple, Carrot } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MarketFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onLocationClick: () => void;
}

export const MarketFilters: React.FC<MarketFiltersProps> = ({ 
  onSearch, 
  onCategoryChange, 
  onLocationClick 
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-5 mb-10 items-stretch lg:items-center">
      {/* Search Input */}
      <div className="flex-1 relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-primary-400 group-focus-within:text-primary-900 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search crop or APMC market..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full h-14 pl-14 pr-6 bg-white border-2 border-primary-100 rounded-2xl outline-none focus:border-primary-900 transition-all font-bold text-primary-900 placeholder:text-primary-300 shadow-xl group-hover:border-primary-200"
        />
      </div>

      {/* Category Selection */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
        {[
          { id: "all", label: "All Crops", icon: Filter },
          { id: "grains", label: "Grains", icon: Wheat },
          { id: "vegetables", label: "Vegetables", icon: Carrot },
          { id: "fruits", label: "Fruits", icon: Apple },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className="flex items-center gap-2.5 px-6 h-14 bg-white border-2 border-primary-100 rounded-2xl hover:border-primary-900 transition-all whitespace-nowrap active:scale-95 group shadow-xl"
          >
            <cat.icon className="w-4.5 h-4.5 text-primary-400 group-hover:text-primary-900 transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-900">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Location Sync */}
      <Button 
        onClick={onLocationClick}
        className="h-14 px-8 rounded-2xl bg-secondary-900 text-white font-black uppercase tracking-widest group shadow-2xl flex items-center gap-2.5 hover:bg-black transition-all"
      >
        <MapPin className="w-4.5 h-4.5 group-hover:animate-bounce" />
        <span className="text-[10px] italic">Nearby Markets</span>
      </Button>
    </div>
  );
};
