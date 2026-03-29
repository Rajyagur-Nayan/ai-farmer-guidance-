"use client";

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SellProductForm from '@/components/marketplace/SellProductForm';
import ProductList from '@/components/marketplace/ProductList';
import { ShoppingCart, Zap, Activity, ShieldCheck } from 'lucide-react';

export default function MarketplacePage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Layout>
            <div className="space-y-20 pb-40">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 px-6 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-100 text-primary-600 rounded-full text-[11px] font-black uppercase tracking-[0.35em] shadow-sm">
                            <ShoppingCart className="w-4 h-4 animate-bounce" />
                            <span>Global Trade Protocol Active</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-primary-900 tracking-tighter italic leading-[0.85] uppercase">
                            Farmer <br /> <span className="text-primary-400">Market 🌽</span>
                        </h1>
                        <p className="text-xl font-black text-medical-textSecondary max-w-2xl italic leading-relaxed tracking-tight group hover:text-primary-900 transition-colors">
                            A high-fidelity peer-to-peer exchange for crops, livestock, and machinery. Built on Neon PostgreSQL for industrial field scale deployment.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="p-10 bg-white rounded-[3.5rem] shadow-2xl border border-medical-border border-dashed flex items-center gap-8 transition-all hover:scale-110 hover:rotate-3 group cursor-default">
                            <div className="w-18 h-18 bg-medical-green/10 rounded-[2rem] flex items-center justify-center group-hover:bg-medical-green group-hover:scale-110 transition-all duration-700 shadow-inner">
                                <Activity className="w-9 h-9 text-medical-green group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-primary-400 uppercase tracking-widest leading-none mb-2">Market Liquidity</p>
                                <p className="text-3xl font-black text-primary-900 italic tracking-tighter uppercase leading-none">High-Fidelity</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sell Form Section */}
                <div className="px-6 relative">
                     {/* Decorative background flair */}
                    <div className="absolute inset-0 bg-primary-50/30 rounded-[6rem] -z-10 blur-3xl opacity-50" />
                    <SellProductForm onSuccess={handleSuccess} />
                </div>

                {/* List Section */}
                <div className="px-6 space-y-16">
                    <div className="flex items-center gap-6 px-4 overflow-hidden">
                        <div className="h-0.5 flex-1 bg-primary-900 opacity-5"></div>
                        <h2 className="text-3xl font-black italic text-primary-200 uppercase tracking-[0.6em] shrink-0 text-center">Current Listing Stream</h2>
                        <div className="h-0.5 flex-1 bg-primary-900 opacity-5"></div>
                    </div>
                    
                    <ProductList key={refreshKey} />
                </div>

                {/* Footer Logistics / State Metrics */}
                <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 px-6 border-t border-medical-border border-dashed">
                    {[
                        { label: "Data Integrity", value: "Neon Sync V4", icon: ShieldCheck },
                        { label: "Field Node Hub", value: "Edge Gateway", icon: Zap },
                        { label: "Stability Index", value: "Protocol confirmed", icon: Activity }
                    ].map((metric, i) => (
                        <div key={i} className="group flex items-center gap-8 p-10 bg-white/40 rounded-[3.5rem] border border-white/60 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 hover:bg-white hover:shadow-2xl transition-all duration-1000 cursor-default">
                             <div className="w-18 h-18 bg-primary-100 rounded-[2.5rem] flex items-center justify-center group-hover:bg-primary-900 group-hover:scale-110 transition-all duration-700 shadow-inner group-hover:shadow-primary-500/30">
                                <metric.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                             </div>
                             <div>
                                <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.4em] leading-none mb-2.5">{metric.label}</p>
                                <p className="text-3xl font-black text-primary-900 italic tracking-tighter leading-none uppercase">{metric.value}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
