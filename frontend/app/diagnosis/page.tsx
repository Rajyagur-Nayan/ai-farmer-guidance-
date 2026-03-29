"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import ImageUpload from "@/components/ImageUpload";
import { Camera, ShieldCheck, Activity, Search, Eye } from "lucide-react";

export default function DiagnosisPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-16 py-4 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* Page Header */}
        <div className="text-center space-y-6 mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-medical-green/10 text-medical-green rounded-full text-[9px] font-black uppercase tracking-widest mx-auto">
            <Activity className="w-3" />
            <span className="tracking-[0.3em]">AI-Vision Protocol v4.2</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary-900 tracking-tighter italic">
            Diagnostic Eye 🧿
          </h1>
          <p className="text-medical-textSecondary text-lg max-w-2xl mx-auto leading-relaxed font-bold">
            Upload biological textures, rashes, or wounds for an instant AI-powered visual analysis. 
            Secure, anonymous, and synchronized with your medical records.
          </p>
        </div>

        {/* Vision Core */}
        <div className="medical-card p-6 md:p-12 bg-white shadow-2xl rounded-[3rem] border-none overflow-hidden hover:shadow-primary-500/10 transition-all duration-700">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 leading-none mb-1">Analyzer Mode</span>
                    <span className="text-lg font-black text-primary-900 italic tracking-tight">Clinical Vision Scan</span>
                </div>
            </div>
            <ImageUpload />
        </div>

        {/* Trust Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-medical-border opacity-60">
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-900 font-sans">E2EE Data Logic</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-medical-green/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-medical-green" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-900 font-sans">Edge Optimization</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-medical-warning/10 flex items-center justify-center">
                    <Search className="w-6 h-6 text-medical-warning" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-900 font-sans">Zero-Retention Code</span>
            </div>
        </div>

        <div className="pt-20 text-center opacity-10">
            <p className="text-[9px] font-black uppercase tracking-[1em] text-primary-900 italic">Biological Vision Core • Matrix Protocol • Clinical Integrity</p>
        </div>
      </div>
    </Layout>
  );
}
