"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import { User, ShieldCheck, MapPin, Calendar, Award, Edit, LogOut, Settings, Bell } from "lucide-react";

export default function ProfilePage() {
  const profileData = {
    name: "Rajesh Kumar",
    location: "Nagpur, Maharashtra",
    memberSince: "March 2024",
    totalCrops: 12,
    successRate: "94%",
    badge: "Master Harvester",
    farmingType: "Organic Cotton & Wheat"
  };

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto py-12 md:py-24 px-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border-4 border-primary-50 relative group">
          <div className="h-48 bg-gradient-to-r from-primary-900 to-black relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             <div className="absolute -bottom-12 right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
          </div>
          
          <div className="px-10 pb-16 relative">
            <div className="flex flex-col md:flex-row items-end gap-8 -mt-20 mb-10">
              <div className="w-40 h-40 rounded-[3rem] bg-white p-2 shadow-2xl relative">
                 <div className="w-full h-full rounded-[2.5rem] bg-primary-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-inner group-hover:scale-105 transition-transform duration-700">
                    <User className="w-20 h-20 text-primary-900 opacity-60" />
                 </div>
                 <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-black transition-all">
                    <Edit className="w-5 h-5" />
                 </button>
              </div>
              
              <div className="flex-1 space-y-2 pb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl font-black italic uppercase tracking-tighter text-primary-900">{profileData.name}</h1>
                  <ShieldCheck className="text-emerald-500 w-8 h-8" />
                </div>
                <div className="flex flex-wrap items-center gap-6 text-primary-400">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                    <MapPin className="w-4 h-4" /> {profileData.location}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                    <Calendar className="w-4 h-4" /> {profileData.memberSince}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                 <button className="px-8 py-4 bg-primary-50 text-primary-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-900 hover:text-white transition-all shadow-sm">
                    <Settings className="w-4 h-4" />
                 </button>
                 <button className="px-8 py-4 bg-primary-50 text-rose-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    <LogOut className="w-4 h-4" />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-primary-50 rounded-[2.5rem] border-2 border-primary-100 space-y-4 group/stat hover:bg-primary-900 hover:border-primary-900 transition-all duration-500">
                  <Award className="w-8 h-8 text-emerald-500 group-hover/stat:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 group-hover/stat:text-white/60">Professional Rank</p>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-primary-900 group-hover/stat:text-white">{profileData.badge}</h3>
                  </div>
               </div>
               
               <div className="p-8 bg-primary-50 rounded-[2.5rem] border-2 border-primary-100 space-y-4 group/stat hover:bg-primary-900 hover:border-primary-900 transition-all duration-500">
                  <div className="w-8 h-8 flex items-center justify-center text-primary-900 font-black text-2xl group-hover/stat:text-emerald-400">94<span className="text-xs">%</span></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 group-hover/stat:text-white/60">Harvest Success Rate</p>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-primary-900 group-hover/stat:text-white">Exceptional</h3>
                  </div>
               </div>

               <div className="p-8 bg-primary-50 rounded-[2.5rem] border-2 border-primary-100 space-y-4 group/stat hover:bg-primary-900 hover:border-primary-900 transition-all duration-500">
                  <div className="w-8 h-8 flex items-center justify-center text-primary-900 font-black text-2xl group-hover/stat:text-emerald-400">{profileData.totalCrops}</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 group-hover/stat:text-white/60">Unique Crop Portfolios</p>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-primary-900 group-hover/stat:text-white">Active Management</h3>
                  </div>
               </div>
            </div>

            <div className="mt-12 space-y-6">
               <h4 className="text-sm font-black italic uppercase tracking-widest text-primary-900 px-2 flex items-center gap-3">
                 <Bell className="w-5 h-5 text-emerald-500" /> Account Protocols
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white border-2 border-primary-50 rounded-3xl flex items-center justify-between hover:border-primary-900 transition-all cursor-pointer shadow-sm">
                     <span className="text-xs font-black uppercase tracking-tight text-primary-900 italic">2-Factor Biometric Auth</span>
                     <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                     </div>
                  </div>
                  <div className="p-6 bg-white border-2 border-primary-50 rounded-3xl flex items-center justify-between hover:border-primary-900 transition-all cursor-pointer shadow-sm">
                     <span className="text-xs font-black uppercase tracking-tight text-primary-900 italic">Data Privacy Mode</span>
                     <div className="w-12 h-6 bg-primary-200 rounded-full flex items-center justify-start px-1">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center opacity-10">
           <p className="text-[9px] font-black uppercase tracking-[1em] text-primary-900 italic">Rural Identity Registry • Decentralized Profile v1.0.4</p>
        </div>
      </div>
    </Layout>
  );
}
