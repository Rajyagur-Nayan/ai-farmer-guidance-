"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Loader2, AlertCircle, Search as SearchIcon } from "lucide-react";
import { apiService, MarketData, MarketResponse } from "@/utils/api";
import { MarketHeader } from "./market/MarketHeader";
import { MarketFilters } from "./market/MarketFilters";
import { CropPriceCard } from "./market/CropPriceCard";
import { PriceTrendChart } from "./market/PriceTrendChart";
import { NearbyMarkets } from "./market/NearbyMarkets";
import { MarketInsights } from "./market/MarketInsights";
import { WeatherPanel } from "./dashboard/WeatherPanel";
import { FarmSyncStatus } from "./dashboard/FarmSyncStatus";

export const MarketPrice: React.FC = () => {
  const [data, setData] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCrop, setSelectedCrop] = useState<MarketData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMarketData = useCallback(async (lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);
    try {
      // Use localized prices if coordinates are provided
      const response: MarketResponse = await apiService.getMarketPrices(undefined, lat, lon);
      if (!response || !response.categories) throw new Error("Incomplete market data downlink.");
      setData(response);
      
      // Intelligent First Selection: Find the crop with the highest upward trend or highest price gainer
      const allCropsFlat = Object.entries(response.categories).flatMap(([cat, crops]) => 
        (crops as MarketData[]).map(c => ({ ...c, category: cat }))
      );

      if (allCropsFlat.length > 0) {
        // Preference: 1. Upward Trends, 2. Highest Price, 3. First entry
        const bestSelection = allCropsFlat.find(c => c.trend === "up") || 
                              allCropsFlat.sort((a,b) => parseFloat(b.mandi_price) - parseFloat(a.mandi_price))[0];
        setSelectedCrop(bestSelection);
      }
    } catch (err: any) {
      console.error("Market Sync Error:", err);
      setError(err.message || "Market Uplink Interrupted.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch with location discovery
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchMarketData(pos.coords.latitude, pos.coords.longitude),
        () => fetchMarketData() // Fallback to default
      );
    } else {
      fetchMarketData();
    }
  }, [fetchMarketData]);

  // --- SEARCH DEBOUNCING ---
  
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    // Auto-select match after delay
    searchTimeoutRef.current = setTimeout(() => {
      const match = allCrops.find(c => c.crop.toLowerCase().includes(val.toLowerCase()));
      if (match) setSelectedCrop(match);
    }, 500);
  };

  // --- DERIVED DATA ---
  
  const allCrops = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.categories).flatMap(([cat, crops]) => 
      crops.map(c => ({ ...c, category: cat }))
    );
  }, [data]);

  const filteredCrops = useMemo(() => {
    return allCrops.filter(c => {
      const matchesSearch = c.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.mandi_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "all" || c.category?.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [allCrops, searchTerm, activeCategory]);

  const marketStats = useMemo(() => {
    if (allCrops.length === 0) return { avgPrice: "0", topGainer: { name: "N/A", change: "0%" }, topLoser: { name: "N/A", change: "0%" } };
    
    const prices = allCrops.map(c => parseFloat(c.mandi_price.replace(/[^\d.]/g, "")) || 0);
    const avg = prices.reduce((a, b) => a + b, 0) / (prices.length || 1);
    
    return {
      avgPrice: Math.round(avg).toLocaleString(),
      topGainer: { name: allCrops[0]?.crop || "N/A", change: "5.2%" },
      topLoser: { name: allCrops[allCrops.length - 1]?.crop || "N/A", change: "2.1%" }
    };
  }, [allCrops]);

  // Simulated Insights
  const insights = useMemo(() => {
    if (!selectedCrop) return [];
    const isUp = selectedCrop.trend === "up";
    return [
      {
        type: isUp ? "positive" : ("negative" as any),
        text: isUp 
          ? `${selectedCrop.crop} demand is surging in local nodes. Supply logic suggests upward pressure.` 
          : `${selectedCrop.crop} arrivals are peaking. Prices may stabilize at lower bounds.`,
        suggestion: (isUp ? "WAIT" : "SELL") as "WAIT" | "SELL"
      },
      {
        type: "info" as any,
        text: `Moisture content in ${selectedCrop.crop} harvests is optimal for long-term storage in ${selectedCrop.mandi_name}.`,
        suggestion: "WATCH" as "WATCH"
      }
    ];
  }, [selectedCrop]);

  // Simulated Nearby Markets
  const nearbyMarkets = useMemo(() => {
    if (!selectedCrop) return [];
    const basePrice = parseFloat(selectedCrop.mandi_price.replace(/[^\d.]/g, "")) || 0;
    return [
      { id: "1", name: `${selectedCrop.mandi_name} (Primary)`, distance: 2.4, bestPrice: basePrice, crop: selectedCrop.crop, lat: 22.3, lng: 70.8 },
      { id: "2", name: "Anjar Mega Mandi", distance: 12.8, bestPrice: basePrice + 50, crop: selectedCrop.crop, lat: 23.1, lng: 70.1 }
    ];
  }, [selectedCrop]);

  if (loading && !data) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center gap-6 bg-white rounded-[4rem] border-4 border-primary-900 shadow-2xl">
        <Loader2 className="w-16 h-16 text-primary-900 animate-spin" />
        <p className="font-black text-xs uppercase tracking-[0.4em] text-primary-900 italic animate-pulse">
          Synchronizing Market Grids...
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center gap-6 bg-rose-50 rounded-[4rem] border-4 border-rose-900 shadow-2xl text-center p-12">
        <AlertCircle className="w-20 h-20 text-rose-900" />
        <h3 className="text-3xl font-black text-rose-900 italic uppercase">Market Link Failure</h3>
        <p className="text-rose-600 font-bold max-w-md">{error || "Unable to establish communication with Agmarknet uplink."}</p>
        <button 
          onClick={() => fetchMarketData()}
          className="mt-4 px-10 h-16 bg-rose-900 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
        >
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both space-y-16">
      {/* 🌦️ Live Environment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <WeatherPanel />
        <FarmSyncStatus />
      </div>

      <div className="space-y-12">
        {/* 🚀 Market Intelligence Header */}
        <MarketHeader stats={marketStats} />

        {/* 🔍 Smart Filtering Protocol */}
        <MarketFilters 
          onSearch={handleSearchChange} 
          onCategoryChange={setActiveCategory}
          onLocationClick={() => {}} // Future logic
        />

        {/* 📊 Main Intelligence Matrix */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          {/* Left: Crop Selection Stream */}
          <div className="xl:col-span-4 space-y-6 max-h-[1200px] overflow-y-auto pr-4 custom-scrollbar">
            <div className="sticky top-0 z-20 bg-medical-bg/20 backdrop-blur-md pb-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">Live Crop Feed • {filteredCrops.length} Active Node(s)</span>
            </div>
            {filteredCrops.map((c) => (
              <CropPriceCard 
                key={`${c.crop}-${c.mandi_name}`}
                crop={{
                  name: c.crop,
                  price: parseFloat(c.mandi_price.replace(/[^\d.]/g, "")) || 0,
                  market: c.mandi_name,
                  change: c.trend === "up" ? 5.2 : -2.1,
                  lastUpdated: "10m ago",
                  category: c.category || "General"
                }}
                isSelected={selectedCrop?.crop === c.crop}
                onClick={() => setSelectedCrop(c)}
              />
            ))}
            {filteredCrops.length === 0 && (
               <div className="p-12 text-center border-4 border-dashed border-primary-100 rounded-[3rem]">
                  <p className="text-sm font-black text-primary-400 uppercase tracking-widest italic">No data nodes found for your search.</p>
               </div>
            )}
          </div>

          {/* Right: Deep Analysis Section */}
          <div className="xl:col-span-8 space-y-12">
            {selectedCrop && (
              <>
                {/* Trend Visualization Hub */}
                <PriceTrendChart 
                  cropName={selectedCrop.crop}
                  data={selectedCrop.history}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Decision Insights */}
                   <MarketInsights insights={insights} />

                   {/* Geographical Discovery */}
                   <NearbyMarkets 
                      selectedCrop={selectedCrop.crop}
                      markets={nearbyMarkets}
                   />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};
