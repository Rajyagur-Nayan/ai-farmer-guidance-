"use client";

import React from "react";
import { Camera, CheckCircle, AlertTriangle, HelpCircle, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const ReferenceHub: React.FC = () => {
  return (
    <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group border-2 border-primary-900/5">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-900/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-50 transition-all group-hover:bg-primary-900/10" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-2xl rotate-2 group-hover:rotate-0 transition-transform">
            <ImageIcon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary-900 italic tracking-tight uppercase leading-none">Scanning Guide</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mt-2">Optimal Sample Protocol</p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Success Sample */}
          <div className="space-y-4">
             <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-emerald-500/10 shadow-xl group/img h-48 bg-emerald-50/30 flex items-center justify-center transition-all hover:bg-emerald-50/50">
                <div className="text-emerald-900/10 font-black text-5xl italic uppercase tracking-tighter">Optimal</div>
                <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                   <CheckCircle className="w-3.5 h-3.5" /> High Precision
                </div>
             </div>
             <p className="text-[10px] font-bold text-center text-primary-400 uppercase tracking-widest px-4 leading-relaxed">Direct sunlight & centered focus on the affected leaf area</p>
          </div>

          {/* Failure Sample */}
          <div className="space-y-4">
             <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-rose-500/10 shadow-xl group/img h-48 bg-rose-50/30 flex items-center justify-center transition-all hover:bg-rose-50/50">
                <div className="text-rose-900/10 font-black text-5xl italic uppercase tracking-tighter">Avoid</div>
                <div className="absolute bottom-4 left-4 bg-rose-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                   <AlertTriangle className="w-3.5 h-3.5" /> Noise / Blur
                </div>
             </div>
             <p className="text-[10px] font-bold text-center text-primary-400 uppercase tracking-widest px-4 leading-relaxed">Avoid heavy shadows, low light, or extreme camera distance</p>
          </div>
        </div>

        {/* Capture Protocol Steps */}
        <div className="p-8 bg-primary-50/30 rounded-[3rem] border border-primary-900/5 space-y-8">
           <h4 className="text-xs font-black text-primary-900 uppercase tracking-[0.25em] flex items-center gap-3">
              <Camera className="w-5 h-5 text-primary-900 opacity-20" /> Sequence Locked
           </h4>
           <div className="space-y-5">
              {[
                "Position leaf in natural sunlight.",
                "Lock focus on the affected area.",
                "Capture multi-angle perspectives.",
                "Ensure surface is clear of debris."
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-5 group/step">
                   <span className="w-8 h-8 bg-white border border-primary-100 text-primary-900 rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm group-hover/step:bg-primary-900 group-hover/step:text-white transition-all">{i+1}</span>
                   <p className="text-xs font-bold text-primary-800 italic opacity-80">{step}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
            <HelpCircle className="w-3 h-3 text-primary-300" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-300 italic">Neural Engine v4.2.0 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
