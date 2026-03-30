"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import { AIDecisionPanel } from "@/components/aiAgent/AIDecisionPanel";
import { WorkflowPanel } from "@/components/aiAgent/WorkflowPanel";
import { DecisionLogPanel } from "@/components/aiAgent/DecisionLogPanel";
import { SafetyNotice } from "@/components/aiAgent/SafetyNotice";
import { Brain, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";

export default function AIAgentPage() {
  return (
    <Layout>
      <div className="max-w-[1700px] mx-auto space-y-24 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-6">
        
        {/* Hero Section - Agentic Intelligence HUD */}
        <div className="text-center space-y-8 mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary-900/5 text-primary-900 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mx-auto border border-primary-900/10">
            <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Autonomous Intelligence System v4.2</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-black text-primary-900 tracking-tighter italic uppercase leading-[0.9]">
              Central Agent <span className="text-primary-500">🧠</span>
            </h1>
            <p className="text-primary-400 text-xl max-w-4xl mx-auto leading-relaxed font-black uppercase tracking-tight italic opacity-60">
              The neural synthesis of market, weather, and field telemetry for strategic rural decision-making.
            </p>
          </div>

          <div className="max-w-2xl mx-auto h-[2px] bg-gradient-to-r from-transparent via-primary-100 to-transparent" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
           {/* Left Column: Decision & Workflow */}
           <div className="xl:col-span-8 space-y-16">
              <section id="decision-core" className="animate-in slide-in-from-left duration-700">
                <AIDecisionPanel />
              </section>
              
              <section id="workflow-engine" className="animate-in slide-in-from-left duration-1000 delay-200">
                <WorkflowPanel />
              </section>
           </div>

           {/* Right Column: History & Safety */}
           <div className="xl:col-span-4 space-y-12 h-full">
              <section id="safety-disclaimer" className="animate-in slide-in-from-right duration-700">
                <SafetyNotice />
              </section>
              
              <section id="decision-ledger" className="animate-in slide-in-from-right duration-1000 delay-200">
                <DecisionLogPanel />
              </section>

              {/* Technical Stack Summary */}
              <div className="p-10 bg-primary-900 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group hover:bg-black transition-all">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all" />
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                       <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-black italic uppercase tracking-tighter leading-none">Intelligence Protocol</h4>
                 </div>
                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-3">
                        <span className="opacity-40">LLM Backbone</span>
                        <span className="text-emerald-400">Llama-3.3-70B</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-3">
                        <span className="opacity-40">Orchestration</span>
                        <span className="text-emerald-400">Agentic Workflow v4.2</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="opacity-40">Inference Speed</span>
                        <span className="text-emerald-400">&lt; 1500ms</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Dynamic Context Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-20 border-t-2 border-primary-50">
            {[
              { icon: Brain, label: "Decision Engine", detail: "Multi-Source Logic" },
              { icon: Activity, label: "Live Telemetry", detail: "Real-time Field Data" },
              { icon: Sparkles, label: "Strategic AI", detail: "Future Crop Planning" },
              { icon: Zap, label: "Unified Flow", detail: "Zero-Latency Insight" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-4 text-center group cursor-help transition-all duration-500 hover:scale-105">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50 flex items-center justify-center transition-all duration-500 group-hover:bg-primary-900 group-hover:text-white shadow-lg">
                      <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-900">{stat.label}</h5>
                    <p className="text-[9px] font-bold text-primary-400 uppercase tracking-widest">{stat.detail}</p>
                  </div>
              </div>
            ))}
        </div>

        <div className="pt-20 text-center opacity-10">
            <p className="text-[10px] font-black uppercase tracking-[1.5em] text-primary-900 italic leading-relaxed">Agent Intelligence Protocol • rural integrity • matrix protocol 4.2.1 • neural field sync</p>
        </div>
      </div>
    </Layout>
  );
}
