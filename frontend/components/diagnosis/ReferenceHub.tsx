"use client";

import React from "react";
import { Camera, CheckCircle, AlertTriangle, HelpCircle, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const ReferenceHub: React.FC = () => {
  return (
    <div className="bg-white p-10 rounded-[3.5rem] border-4 border-primary-900 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-100/30 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary-900 italic tracking-tight uppercase">Diagnosis Guide</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mt-1">Perfect Sample Hub</p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Success Sample */}
          <div className="space-y-4">
             <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-900 shadow-xl group/img h-48 bg-emerald-50 flex items-center justify-center">
                <div className="text-emerald-900/20 font-black text-4xl italic uppercase">Perfect</div>
                <div className="absolute bottom-4 left-4 bg-emerald-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <CheckCircle className="w-3 h-3" /> Optimal Angle
                </div>
             </div>
             <p className="text-[9px] font-bold text-center text-primary-400 uppercase tracking-widest">Clear focus on leaf veins & texture</p>
          </div>

          {/* Failure Sample */}
          <div className="space-y-4">
             <div className="relative rounded-3xl overflow-hidden border-4 border-rose-900 shadow-xl group/img h-48 bg-rose-50 flex items-center justify-center">
                <div className="text-rose-900/20 font-black text-4xl italic uppercase">Avoid</div>
                <div className="absolute bottom-4 left-4 bg-rose-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <AlertTriangle className="w-3 h-3" /> Blurry / Low Light
                </div>
             </div>
             <p className="text-[9px] font-bold text-center text-primary-400 uppercase tracking-widest">Too much shadow or distance</p>
          </div>
        </div>

        {/* Steps */}
        <div className="p-8 bg-primary-50 rounded-[2.5rem] border-2 border-primary-100 space-y-6">
           <h4 className="text-sm font-black text-primary-900 uppercase tracking-widest flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary-400" /> Capture Protocol
           </h4>
           <div className="space-y-4">
              {[
                "Position leaf in direct natural sunlight.",
                "Ensure focus is locked on the affected area.",
                "Capture both top and bottom perspectives.",
                "Remove any mud or debris from the surface."
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 group/step transition-all">
                   <span className="w-6 h-6 bg-primary-900 text-white rounded-lg flex items-center justify-center text-[10px] font-black group-hover/step:scale-110 transition-transform">{i+1}</span>
                   <p className="text-xs font-bold text-primary-700 italic">{step}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="text-center pt-4">
           <div className="flex items-center justify-center gap-2 text-primary-200">
              <HelpCircle className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest italic">Analysis powered by Vision Neural Engine v2.0</span>
           </div>
        </div>
      </div>
    </div>
  );
};
