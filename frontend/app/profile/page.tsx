"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import Profile from "@/components/Profile";
import { User, ShieldCheck, Activity } from "lucide-react";

export default function ProfilePage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-12 py-4 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* Page Header */}
        <div className="text-center space-y-6 mb-16 lg:mb-20 px-4 md:px-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm mx-auto">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Profile Core • Matrix v4.2</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-primary-900 tracking-tighter italic">
                Health Identity 🧬
            </h1>
            <p className="text-medical-textSecondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-bold">
                Define your biological parameters to help our Medical AI provide more accurate and personalized health synchronization advice.
            </p>
        </div>

        {/* Profile Component Area */}
        <div className="animate-in zoom-in-95 duration-1000 delay-200">
           <Profile />
        </div>

        {/* System Info */}
        <div className="flex flex-col items-center gap-6 pt-24 border-t border-medical-border opacity-20">
            <div className="flex items-center gap-3 text-primary-900 font-black uppercase text-[10px] tracking-[0.5em] italic">
                <Activity className="w-4 h-4 text-medical-green animate-pulse" />
                Protocol ID: MED-IDENTITY-X1-SECURE
            </div>
        </div>
      </div>
    </Layout>
  );
}
