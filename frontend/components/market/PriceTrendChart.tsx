"use client";

import React, { useState } from "react";
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
} from "recharts";
import { TrendingUp, Activity, Calendar } from "lucide-react";

interface PriceTrendChartProps {
  data: Array<{ date: string; price: number }>;
  cropName: string;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ data, cropName }) => {
  const [timeRange, setTimeRange] = useState("7D");

  return (
    <div className="bg-white p-10 rounded-[3.5rem] border-4 border-primary-900 shadow-2xl overflow-hidden relative group">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 flex flex-col gap-10">
        {/* Chart Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-900 text-white rounded-3xl flex items-center justify-center shadow-xl rotate-3">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-primary-900 italic tracking-tight uppercase">
                {cropName} Market Intelligence
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mt-1">
                Real-Time Price Trend Analysis
              </p>
            </div>
          </div>

          <div className="flex bg-primary-50 p-2 rounded-2xl gap-1 border border-primary-100">
            {["1D", "7D", "30D"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${timeRange === range ? "bg-primary-900 text-white shadow-lg" : "text-primary-400 hover:text-primary-900"}
                `}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Visuals */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: "#94a3b8" }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderRadius: "24px", 
                  border: "4px solid #1e293b",
                  padding: "15px",
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)"
                }}
                labelStyle={{ fontWeight: 900, color: "#1e293b", marginBottom: "5px", textTransform: "uppercase", fontSize: "10px" }}
                itemStyle={{ color: "#1e293b", fontWeight: 900, fontSize: "14px" }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#1e293b" 
                strokeWidth={5} 
                fillOpacity={1} 
                fill="url(#priceGradient)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Insights */}
        <div className="pt-6 border-t-2 border-primary-50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-900">Period: {timeRange} Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Market Liquidity Optimal</span>
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-primary-400 italic">
            Visualized Data from Agmarknet API • v4.2 Uplink
          </div>
        </div>
      </div>
    </div>
  );
};
