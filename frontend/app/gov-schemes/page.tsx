"use client";

import React from 'react';
import Layout from '@/components/layout/Layout';
import SchemePanel from '@/components/newFeatures/SchemePanel';
import { 
  ShieldCheck, 
  Zap, 
  Activity,
  Globe
} from 'lucide-react';

export default function GovSchemesPage() {
    return (
        <Layout>
            <div className="space-y-16 pb-40">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 px-4 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-medical-green/10 text-medical-green rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
                            <Zap className="w-3 h-3 animate-pulse" />
                            <span>National Support Link Active</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-primary-900 tracking-tighter italic leading-[0.9]">
                            Government <br /> <span className="text-medical-green">Schemes 🛡️</span>
                        </h1>
                        <p className="text-lg font-black text-medical-textSecondary max-w-xl italic leading-relaxed tracking-tight group hover:text-primary-900 transition-colors">
                            Centralized repository for state and national agricultural support, subsidies, and insurance protocols.
                        </p>
                    </div>

                    <div className="hidden md:flex bg-white p-6 rounded-[2.5rem] shadow-2xl border border-medical-border items-center gap-6 animate-float">
                        <div className="w-16 h-16 bg-medical-green rounded-3xl flex items-center justify-center shadow-lg">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest leading-none mb-1">Support Status</p>
                            <p className="text-2xl font-black text-primary-900 italic tracking-tighter">Verified V1.0</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="px-4">
                    <div className="animate-in fade-in zoom-in-95 duration-700">
                        <section className="space-y-12">
                            <div className="space-y-2 mb-10">
                                <h2 className="text-3xl font-black text-primary-900 italic tracking-tight uppercase">National Scheme Repository</h2>
                                <p className="text-xs font-black text-primary-400 lowercase tracking-widest">Access government support metadata with personalized profile synthesis.</p>
                            </div>
                            <SchemePanel />
                        </section>
                    </div>
                </div>

                {/* Footer Metrics */}
                <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 border-t border-medical-border border-dashed">
                    {[
                        { label: "Data Integrity", value: "Verified", icon: Activity },
                        { label: "Update Frequency", value: "Real-time", icon: Zap },
                        { label: "Global Reach", value: "Pan-India", icon: Globe }
                    ].map((metric, i) => (
                        <div key={i} className="group flex items-center gap-6 p-8 bg-white/40 rounded-[2rem] border border-white/50 grayscale hover:grayscale-0 transition-all cursor-default">
                             <div className="w-14 h-14 bg-medical-green/10 rounded-2xl flex items-center justify-center group-hover:bg-medical-green group-hover:scale-110 transition-all duration-500">
                                <metric.icon className="w-7 h-7 text-medical-green group-hover:text-white transition-colors" />
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
