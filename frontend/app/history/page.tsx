"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import History from "@/components/History";
import { History as HistoryIcon, Activity } from "lucide-react";

export default function HistoryPage() {
  return (
    <Layout>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-medical-green/10 text-medical-green rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                <Activity className="w-3 h-3" />
                <span>Protocol Logs Verified</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <HistoryIcon className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-primary-900 tracking-tighter italic leading-none">
                        Clinical History 📚
                    </h1>
                    <p className="text-medical-textSecondary font-bold text-sm uppercase tracking-widest">
                        Vault: Secure Bio-Chronology
                    </p>
                </div>
            </div>
            <p className="text-medical-textSecondary font-bold text-lg max-w-2xl mt-2 leading-relaxed">
                Review your chronological health synchronization records. All historical bio-data is encrypted and stored locally with zero-retention cloud compliance.
            </p>
        </div>
        
        <div className="medical-card p-1 bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border-none">
            <History />
        </div>
      </div>
    </Layout>
  );
}
