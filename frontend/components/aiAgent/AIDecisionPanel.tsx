"use client";

import React, { useState } from "react";
import { Brain, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight, Loader2, DollarSign, Sprout } from "lucide-react";

export const AIDecisionPanel: React.FC = () => {
  const [crop, setCrop] = useState("Wheat");
  const [income, setIncome] = useState(15000);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<any>(null);

  const handleGetAdvice = async () => {
    setLoading(true);
    setDecision(null);
    try {
      // Direct call to the new Agent Endpoint
      const response = await fetch("http://localhost:8000/ai-agent/ai-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          location: { lat: 21.1458, lon: 79.0882 }, // Mock location for Nagpur
          monthly_income: income,
          image_result: "No disease detected in recent scan."
        }),
      });
      const data = await response.json();
      setDecision(data);
    } catch (err) {
      console.error("AI Decision Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[4rem] shadow-2xl border-4 border-primary-900/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-20" />
      
      <div className="relative z-10 space-y-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary-900 rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
            <Brain className="text-white w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-primary-900 italic uppercase leading-none">Decision Core</h3>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary-400 mt-2">Personalized Intelligence Matrix</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-primary-50 rounded-[3rem] border-2 border-primary-100">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 block px-2 italic">Cultivated Crop</label>
              <div className="relative">
                <Sprout className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300" />
                <input 
                  type="text" 
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full h-16 bg-white rounded-2xl border-2 border-primary-100 pl-16 pr-6 font-black text-primary-900 italic focus:border-primary-500 transition-all outline-none shadow-sm"
                  placeholder="e.g. Rice, Wheat"
                />
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 block px-2 italic">Monthly Target Income (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300" />
                <input 
                  type="number" 
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full h-16 bg-white rounded-2xl border-2 border-primary-100 pl-16 pr-6 font-black text-primary-900 italic focus:border-primary-500 transition-all outline-none shadow-sm"
                />
              </div>
           </div>
        </div>

        <button 
          onClick={handleGetAdvice}
          disabled={loading}
          className="w-full h-24 bg-primary-900 text-white rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl group/btn overflow-hidden relative"
        >
          {loading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xl font-black italic uppercase tracking-widest">Synthesizing Advice...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-8 h-8 group-hover/btn:rotate-12 transition-transform" />
              <span className="text-xl font-black italic uppercase tracking-widest">Generate Strategic Advice</span>
              <ChevronRight className="w-8 h-8 opacity-40 group-hover/btn:translate-x-4 transition-transform" />
            </>
          )}
        </button>

        {/* AI Result Dashboard */}
        {decision && (
          <div className="animate-in zoom-in-95 duration-700 bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-primary-900 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
            
            <div className="flex items-center justify-between mb-10 border-b-2 border-primary-50 pb-8">
               <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg" />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-900">AI Verified Strategy</p>
               </div>
               <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-8">
                  <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3 italic leading-none">Final Recommended Action</h4>
                     <p className="text-[1.4rem] font-black text-primary-900 leading-tight italic tracking-tighter">
                        {decision.final_action}
                     </p>
                  </div>
                  <div className="p-8 bg-primary-50 rounded-[2.5rem] border border-primary-100">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-3 italic leading-none">Sell / Hold Decision</h4>
                     <p className="text-xl font-black text-primary-900 italic tracking-tight">
                        {decision.sell_decision}
                     </p>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100 flex items-start gap-5">
                     <AlertTriangle className="text-rose-600 w-8 h-8 flex-shrink-0" />
                     <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-700 mb-2 italic leading-none">Agentic Risk Alert</h4>
                        <p className="text-xs font-black text-rose-900 uppercase opacity-70 leading-relaxed">
                           {decision.risk_alert || "Low Systemic Threat Level"}
                        </p>
                     </div>
                  </div>
                  <div className="p-8 bg-black rounded-[2.5rem] text-white">
                     <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="text-emerald-400 w-6 h-6" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Future Outlook</h4>
                     </div>
                     <p className="text-base font-black italic tracking-tight">
                        Next Suggested Crop: <span className="text-emerald-400 uppercase">{decision.next_crop}</span>
                     </p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
