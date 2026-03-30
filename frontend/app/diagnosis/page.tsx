"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import ImageUpload from "@/components/ImageUpload";
import { ReferenceHub } from "@/components/diagnosis/ReferenceHub";
import {
  Camera,
  ShieldCheck,
  Activity,
  Search,
  Sprout,
  Leaf,
  Scan,
} from "lucide-react";

export default function DiagnosisPage() {
  return (
    <Layout>
      <div className="max-w-[1700px] mx-auto space-y-24 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-6">
        {/* Page Header - Ultra Clean & Minimal */}
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary-900/5 text-primary-900 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mx-auto border border-primary-900/10">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Diagnostic Protocol v4.2.1</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-black text-primary-900 tracking-tighter italic uppercase leading-[0.9]">
              Crop Doctor <span className="text-emerald-500">🩺</span>
            </h1>
            <p className="text-primary-400 text-xl max-w-3xl mx-auto leading-relaxed font-black uppercase tracking-tight italic opacity-60">
              High-Fidelity Visual Intelligence for the Modern Field
            </p>
          </div>

          <div className="max-w-2xl mx-auto h-[2px] bg-gradient-to-r from-transparent via-primary-100 to-transparent" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          {/* Vision Core - The Focused Experience */}
          <div className="xl:col-span-8 bg-white shadow-2xl rounded-[4rem] p-2 md:p-4 border-[6px] border-primary-900/5 hover:border-primary-900/10 transition-all duration-1000 relative">
            <div className="absolute top-10 left-10 flex items-center gap-3 opacity-20 pointer-events-none">
              <Scan className="w-5 h-5 text-primary-900" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Active Scan Zone
              </span>
            </div>

            <div className="p-4 md:p-8 bg-white rounded-[3.5rem]">
              <ImageUpload />
            </div>
          </div>

          {/* Reference Hub - Sidebar Mode */}
          <div className="xl:col-span-4 space-y-10">
            <ReferenceHub />

            {/* Secondary Context Card */}
            <div className="p-10 bg-primary-900 rounded-[3rem] text-white space-y-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-lg font-black italic uppercase tracking-tight">
                  Security Protocol
                </h4>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-60 italic">
                All diagnostic signatures are encrypted and logged in your
                private farming history for long-term health tracking and
                subsidy verification.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20 border-t-2 border-primary-50">
          {[
            {
              icon: ShieldCheck,
              label: "Verification Lock",
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              icon: Leaf,
              label: "Eco-Alignment",
              color: "bg-primary-50 text-primary-600",
            },
            {
              icon: Search,
              label: "Signature Audit",
              color: "bg-secondary-50 text-secondary-600",
            },
            {
              icon: Camera,
              label: "Visual Fidelity",
              color: "bg-amber-50 text-amber-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 text-center group cursor-help"
            >
              <div
                className={`w-16 h-16 rounded-[1.5rem] ${stat.color} flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg`}
              >
                <stat.icon className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-900 opacity-40 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-20 text-center opacity-5">
          <p className="text-[10px] font-black uppercase tracking-[1.5em] text-primary-900 italic">
            Neural Field Engine • rural integrity • matrix protocol
          </p>
        </div>
      </div>
    </Layout>
  );
}
