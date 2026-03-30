"use client";

import React from "react";
import { Lightbulb, AlertCircle, CheckCircle, TrendingUp, TrendingDown, ArrowRight, Activity } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface MarketInsightsProps {
  insights: Array<{
    type: "positive" | "negative" | "info";
    text: string;
    suggestion: "WAIT" | "SELL" | "WATCH";
  }>;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border-[3px] border-primary-900 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:bg-primary-200/50 transition-colors" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg">
            <Lightbulb className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-primary-900 italic tracking-tight uppercase">Market Intelligence</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400 mt-0.5">Smart Decision Matrix</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {insights.map((insight, i) => (
            <Card 
              key={i}
              className={`
                p-5 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:scale-[1.01]
                ${insight.type === "positive" ? "border-emerald-900 bg-emerald-50/10" : insight.type === "negative" ? "border-rose-900 bg-rose-50/10" : "border-amber-900 bg-amber-50/10"}
              `}
            >
              <div className={`p-3 rounded-xl ${insight.type === "positive" ? "bg-emerald-900 text-white" : insight.type === "negative" ? "bg-rose-900 text-white" : "bg-amber-900 text-white"}`}>
                {insight.suggestion === "SELL" ? <TrendingDown className="w-5 h-5" /> : insight.suggestion === "WAIT" ? <TrendingUp className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 space-y-1.5">
                 <p className="text-primary-900 font-bold text-base leading-tight italic">
                   {insight.text}
                 </p>
                 <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${insight.type === "positive" ? "bg-emerald-100 text-emerald-800" : insight.type === "negative" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                      Protocol: {insight.suggestion}
                    </span>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <ArrowRight className="w-5 h-5 text-primary-200" />
              </div>
            </Card>
          ))}
        </div>

        {insights.length === 0 && (
          <div className="py-8 text-center space-y-3 opacity-40">
             <Activity className="w-12 h-12 mx-auto text-primary-100 animate-pulse" />
             <p className="text-[9px] font-black uppercase tracking-widest text-primary-400">Processing market pulses...</p>
          </div>
        )}

        <div className="pt-5 border-t border-primary-50 text-center">
           <p className="text-[8px] font-bold uppercase tracking-widest text-primary-400">Logic Based on APMC Inflow Data • v4.2 Cognitive Engine</p>
        </div>
      </div>
    </div>
  );
};
