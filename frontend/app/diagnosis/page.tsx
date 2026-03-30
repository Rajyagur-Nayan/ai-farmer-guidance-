"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import ImageUpload from "@/components/ImageUpload";
import { ReferenceHub } from "@/components/diagnosis/ReferenceHub";
import { Camera, ShieldCheck, Activity, Search, Sprout, Leaf } from "lucide-react";

export default function DiagnosisPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-16 py-4 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4">
        
        {/* Page Header */}
        <div className="text-center space-y-6 mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[9px] font-black uppercase tracking-widest mx-auto shadow-sm">
            <Activity className="w-3" />
            <span className="tracking-[0.3em]">Agri-Vision Protocol v4.2</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-primary-900 tracking-tighter italic uppercase">
            Crop Doctor 🩺
          </h1>
          <p className="text-primary-600 text-lg max-w-2xl mx-auto leading-relaxed font-bold italic">
            Upload clear photos of your crops, leaves, or soil for an instant AI-powered health diagnosis. 
            Detect pests, diseases, and nutrient deficiencies with expert precision.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
           {/* Vision Core */}
           <div className="xl:col-span-7 medical-card p-6 md:p-12 bg-white shadow-2xl rounded-[3rem] border-primary-900 border-4 overflow-hidden hover:shadow-primary-500/10 transition-all duration-700">
               <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-14 bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                       <Sprout className="w-6 h-6 text-white" />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 leading-none mb-1">Analyzer Mode: ON</span>
                       <span className="text-lg font-black text-primary-900 italic tracking-tight">Agricultural Vision Scan</span>
                   </div>
               </div>
               <ImageUpload />
           </div>

           {/* Reference Hub */}
           <div className="xl:col-span-5">
              <ReferenceHub />
           </div>
        </div>

        {/* Trust Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t-4 border-primary-900 opacity-60">
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-900">Secure Farm Ledger</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-800" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-900">Eco-System Optimized</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                    <Search className="w-6 h-6 text-secondary-900" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-900">Pest Trace Analysis</span>
            </div>
        </div>

        <div className="pt-20 text-center opacity-10">
            <p className="text-[9px] font-black uppercase tracking-[1em] text-primary-900 italic">Agri-Vision Neural Core • Matrix Protocol • Rural Integrity</p>
        </div>
      </div>
    </Layout>
  );
}
