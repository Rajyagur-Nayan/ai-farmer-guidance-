"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  ArrowRight, 
  Loader2, 
  Globe, 
  MapPin, 
  Wheat, 
  Leaf, 
  Apple, 
  Coins,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';

interface MarketData {
  crop: string;
  mandi_price: string;
  mandi_name: string;
  trend: 'up' | 'down' | 'steady';
  global_price: string;
  advice: string;
  history: Array<{ date: string; price: number }>;
}

interface MarketResponse {
  categories: {
    [key: string]: MarketData[];
  };
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Grains': return <Wheat className="w-5 h-5" />;
    case 'Vegetables': return <Leaf className="w-5 h-5" />;
    case 'Fruits': return <Apple className="w-5 h-5" />;
    case 'Cash Crops': return <Coins className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
};

const MarketPrice: React.FC = () => {
  const [data, setData] = useState<MarketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Grains');
  const [selectedCrop, setSelectedCrop] = useState<MarketData | null>(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getMarketPrices();
      setData(response);
      const firstCat = Object.keys(response.categories)[0];
      setActiveCategory(firstCat);
      setSelectedCrop(response.categories[firstCat][0]);
    } catch (error) {
      console.error("Market Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center gap-4 bg-medical-bg/20 rounded-[3rem] border-4 border-dashed border-medical-border">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-primary-900 italic">Synchronizing Global Mandi Data...</p>
      </div>
    );
  }

  const categories = data ? Object.keys(data.categories) : [];
  const currentCrops = data ? data.categories[activeCategory] : [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/20 rotate-3">
            <TrendingUp className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 leading-none">Check Market Prices 📈</h2>
            <p className="text-sm font-semibold text-primary-400 mt-2">Monitor Crop Prices</p>
          </div>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-xl border border-medical-border overflow-x-auto custom-scrollbar w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedCrop(data!.categories[cat][0]);
              }}
              className={`
                px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-primary-900 text-white shadow-lg' 
                  : 'text-primary-400 hover:text-primary-900 hover:bg-primary-50'}
              `}
            >
              <CategoryIcon category={cat} />
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Crop Selection List */}
        <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
          {currentCrops.map((item) => (
            <div 
              key={item.crop}
              onClick={() => setSelectedCrop(item)}
              className={`
                p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group
                ${selectedCrop?.crop === item.crop 
                  ? 'bg-white border-primary-500 shadow-2xl scale-[1.02]' 
                  : 'bg-medical-bg/40 border-transparent hover:border-primary-200 hover:bg-white'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-black text-primary-900 italic">{item.crop}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-primary-400" />
                    <span className="text-[9px] font-bold text-primary-400 uppercase tracking-tighter">{item.mandi_name}</span>
                  </div>
                </div>
                <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${item.trend === 'up' ? 'bg-medical-green/10 text-medical-green' : 'bg-medical-error/10 text-medical-error'}
                `}>
                  {item.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest mb-1">Current Mandi Price</p>
                  <p className="text-2xl font-black text-primary-900 italic">{item.mandi_price}</p>
                </div>
                <ChevronRight className={`w-6 h-6 text-primary-300 transition-transform duration-300 ${selectedCrop?.crop === item.crop ? 'translate-x-1 text-primary-500' : ''}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Deep Insights View */}
        <div className="lg:col-span-2 space-y-8">
          {selectedCrop && (
            <Card accent={selectedCrop.trend === 'up' ? 'green' : 'red'} className="p-6 md:p-10 bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl h-full flex flex-col gap-6 md:gap-8">
              <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedCrop.trend === 'up' ? 'bg-medical-green/10 text-medical-green' : 'bg-medical-error/10 text-medical-error'}`}>
                            {selectedCrop.trend === 'up' ? 'Upward Trend' : 'Downward Trend'}
                        </span>
                        <span className="px-4 py-1.5 bg-primary-50 text-primary-600 text-[9px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                            <Globe className="w-3 h-3" /> Global: {selectedCrop.global_price}
                        </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-primary-900 italic tracking-tighter">{selectedCrop.crop}</h3>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-primary-900">{selectedCrop.mandi_price}</p>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="flex-1 min-h-[250px] md:min-h-[300px] w-full bg-primary-50/30 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 border border-primary-50">
                <div className="flex items-center justify-between mb-6">
                    <h5 className="text-sm font-semibold text-primary-900">Price History (7 Days)</h5>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                            <span className="text-[9px] font-bold text-primary-400 uppercase">Global Index</span>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedCrop.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}}
                    />
                    <YAxis 
                        hide 
                        domain={['auto', 'auto']}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '20px', 
                            border: 'none', 
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                        animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* AI Insight Box */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-medical-green rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative p-6 md:p-8 bg-medical-bg/10 border border-white rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0 animate-bounce-slow">
                        <Info className="w-6 h-6 md:w-8 md:h-8 text-primary-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1">Farming Advice</p>
                        <p className="text-lg md:text-xl font-bold text-primary-900 leading-tight">
                            "{selectedCrop.advice}"
                        </p>
                    </div>
                    <Button variant="ghost" className="hidden md:flex ml-auto group-hover:translate-x-1 transition-transform">
                        DETAILS <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MarketPrice;
