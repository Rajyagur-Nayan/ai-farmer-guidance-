"use client";

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import MoneyAdvisor from '@/components/newFeatures/MoneyAdvisor';
import SchemePanel from '@/components/newFeatures/SchemePanel';
import { 
  PiggyBank, 
  ShieldCheck, 
  Zap, 
  Target, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function FarmerToolsPage() {
    const [activeTab, setActiveTab] = useState<'finance' | 'schemes'>('finance');

    return (
        <Layout>
            <div className="space-y-16 pb-40">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 px-4 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
                            <Zap className="w-3 h-3 animate-pulse" />
                            <span>Financial Guard Link Active</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-primary-900 tracking-tighter italic leading-[0.9]">
                            Farmer Intelligence <br /> <span className="text-primary-400">Hub 🛡️</span>
                        </h1>
                        <p className="text-lg font-black text-medical-textSecondary max-w-xl italic leading-relaxed tracking-tight group hover:text-primary-900 transition-colors">
                            Neural-driven financial advisory and government support synthesis for advanced agricultural field deployment.
                        </p>
                    </div>

                    <div className="flex w-full md:w-auto bg-white p-2 md:p-3 rounded-[2rem] shadow-2xl border border-medical-border transition-all hover:scale-105">
                        <div 
                            onClick={() => setActiveTab('finance')}
                            className={`px-4 py-3 md:px-8 md:py-5 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 md:gap-3 w-full md:w-auto ${activeTab === 'finance' ? 'bg-primary-900 text-white shadow-xl' : 'text-primary-400 font-black uppercase tracking-widest text-[11px]'}`}
                        >
                            <PiggyBank className="w-5 h-5" />
                            {activeTab === 'finance' && <span className="font-black italic uppercase text-[10px] md:text-[12px] tracking-widest hidden sm:inline">Money Advisor</span>}
                        </div>
                        <div 
                            onClick={() => setActiveTab('schemes')}
                            className={`px-4 py-3 md:px-8 md:py-5 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 md:gap-3 w-full md:w-auto ${activeTab === 'schemes' ? 'bg-primary-900 text-white shadow-xl' : 'text-primary-400 font-black uppercase tracking-widest text-[11px]'}`}
                        >
                            <ShieldCheck className="w-5 h-5" />
                            {activeTab === 'schemes' && <span className="font-black italic uppercase text-[10px] md:text-[12px] tracking-widest hidden sm:inline">Gov. Schemes</span>}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="px-4">
                    <div className="animate-in fade-in zoom-in-95 duration-700">
                        {activeTab === 'finance' ? (
                            <section className="space-y-12">
                                <div className="space-y-2 mb-10">
                                    <h2 className="text-3xl font-black text-primary-900 italic tracking-tight uppercase">Financial Strategy Engine</h2>
                                    <p className="text-xs font-black text-primary-400 lowercase tracking-widest">Deploy LLM-driven field metrics for market profitability synthesis.</p>
                                </div>
                                <MoneyAdvisor />
                            </section>
                        ) : (
                            <section className="space-y-12">
                                <div className="space-y-2 mb-10">
                                    <h2 className="text-3xl font-black text-primary-900 italic tracking-tight uppercase">National Scheme Repository</h2>
                                    <p className="text-xs font-black text-primary-400 lowercase tracking-widest">Centralized Government support metadata with personalized profile filtering.</p>
                                </div>
                                <SchemePanel />
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer Metrics */}
                <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 border-t border-medical-border border-dashed">
                    {[
                        { label: "Intelligence Sync", value: "Neural V4.1", icon: Activity },
                        { label: "Network Bandwidth", value: "Rural Mode", icon: Zap },
                        { label: "Stability Protocol", value: "Encrypted", icon: ShieldCheck }
                    ].map((metric, i) => (
                        <div key={i} className="group flex items-center gap-6 p-8 bg-white/40 rounded-[2rem] border border-white/50 grayscale hover:grayscale-0 transition-all cursor-default">
                             <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-900 group-hover:scale-110 transition-all duration-500">
                                <metric.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest leading-none mb-1">{metric.label}</p>
                                <p className="text-2xl font-black text-primary-900 italic tracking-tighter">{metric.value}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </Layout>
    );
}
