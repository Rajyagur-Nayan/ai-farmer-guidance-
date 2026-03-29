"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  Users,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Database,
  Zap,
  Pill,
  Camera,
  History as HistoryIcon,
  User as UserIcon,
  ChevronRight,
  Stethoscope,
  HeartPulse,
  TrendingUp,
  Clock
} from "lucide-react";
import Link from "next/link";
import { apiService } from "@/utils/api";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [pData, hData, qData] = await Promise.all([
          apiService.getProfile(),
          apiService.getHistory(),
          apiService.getQueue()
        ]);
        setProfile(pData);
        setHistory(hData.slice(0, 3));
        setQueue(qData.filter((p: any) => p.status === "Pending"));
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const systemMetrics = [
    { title: "Oxygen Sync", value: "98%", detail: "Optimal", icon: HeartPulse, color: "text-medical-green", bg: "bg-medical-green/10" },
    { title: "Bio-Vault", value: "Secure", detail: "Encrypted", icon: ShieldCheck, color: "text-primary-500", bg: "bg-primary-500/10" },
    { title: "Protocol", value: "V2.1", detail: "Stable", icon: Activity, color: "text-medical-warning", bg: "bg-medical-warning/10" },
    { title: "Network", value: "Live", detail: "Rural Mode", icon: Zap, color: "text-primary-600", bg: "bg-primary-600/10" },
  ];

  return (
    <Layout>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-6 duration-1000">
        <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs font-semibold uppercase tracking-widest">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>Protocol Optimized</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold text-primary-900 tracking-tight ">
                Clinical Core 🩺
            </h1>
            <p className="text-medical-textSecondary font-bold text-lg max-w-xl">
                Unified healthcare protocol. All bio-clinical modules are synchronized for rural medical deployment.
            </p>
        </div>
        <Link href="/chat" className="w-full md:w-auto">
            <Button size="xl" className="w-full md:w-auto shadow-lg shadow-primary-500/20 group">
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500 mr-2" />
                <span>START SESSION</span>
            </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {systemMetrics.map((stat, i) => (
          <Card key={i} className="p-8 border-none hoverable accent-blue" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-sm shadow-primary-500"></div>
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-medical-textSecondary mb-1 font-sans">{stat.title}</h3>
            <div className="flex items-end gap-2">
                <p className="text-3xl font-semibold text-primary-900 tracking-tight  leading-none">{stat.value}</p>
                <span className="text-xs font-semibold text-primary-400 mb-1">{stat.detail}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bio-Profile Summary */}
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Card */}
                <Card className="bg-primary-600 border-none p-10 rounded-3xl shadow-lg relative overflow-hidden group">
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <UserIcon className="w-6 h-6 text-white" />
                            </div>
                            <Link href="/profile" className="text-sm font-semibold uppercase tracking-widest text-white/40 hover:text-white transition-colors">MD Protocol</Link>
                        </div>
                        <div>
                            <h3 className="text-3xl font-semibold  text-white mb-2 tracking-tight">Biological Profile</h3>
                            <div className="flex gap-4">
                                <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest leading-none mb-2">Age</p>
                                    <p className="text-xl font-semibold text-white">{profile?.age || "24"}</p>
                                </div>
                                <div className="px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                    <p className="text-xs font-semibold text-white/40 uppercase tracking-widest leading-none mb-2">Weight</p>
                                    <p className="text-xl font-semibold text-white">{profile?.weight ? `${profile.weight}kg` : "72kg"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <UserIcon className="absolute -right-16 -bottom-16 w-64 h-64 opacity-5 text-white group-hover:scale-110 transition-transform duration-1000" />
                </Card>

                {/* History Quick View */}
                <Card className="bg-white border-medical-border p-10 rounded-3xl shadow-xl flex flex-col justify-between group">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <HistoryIcon className="w-6 h-6 text-primary-500" />
                                <h4 className="text-sm font-semibold uppercase tracking-widest text-medical-textSecondary">Clinical Logs</h4>
                            </div>
                            <TrendingUp className="w-4 h-4 text-medical-green opacity-40" />
                        </div>
                        <div className="space-y-5">
                            {history.length === 0 ? (
                                <p className="text-xs font-bold text-medical-textSecondary ">No historical records synchronized.</p>
                            ) : (
                                history.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group/item cursor-pointer">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-40 group-hover/item:opacity-100 group-hover/item:scale-150 transition-all"></div>
                                        <div className="flex flex-col">
                                            <p className="text-xs font-semibold text-primary-900 uppercase tracking-tight truncate line-clamp-1 group-hover/item:text-primary-500 transition-colors">{item.title || "General Body Scan"}</p>
                                            <span className="text-xs font-bold text-medical-textSecondary uppercase tracking-widest mt-1">LOGID: {item.id || "0x4F"}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <Link href="/history" className="pt-8 flex items-center justify-between group/link">
                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500">Vault Access</span>
                        <ChevronRight className="w-5 h-5 text-primary-200 group-hover/link:translate-x-2 group-hover/link:text-primary-500 transition-all" />
                    </Link>
                </Card>
            </div>

            {/* Diagnostic Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { name: "Imaging", icon: Camera, path: "/diagnosis", desc: "Vision Scan", accent: "bg-medical-green/10", text: "text-medical-green" },
                    { name: "Pharmacy", icon: Pill, path: "/medication", desc: "Digital Rx", accent: "bg-primary-500/10", text: "text-primary-500" }
                ].map((mod, i) => (
                    <Link key={i} href={mod.path}>
                        <Card className="p-8 rounded-2xl border-none hover:border-l-4 hover:border-primary-500 transition-all group h-full flex flex-col items-center text-center gap-4">
                            <div className={`w-16 h-16 ${mod.accent} rounded-2xl flex items-center justify-center group-hover:scale-110 shadow-sm transition-transform duration-500`}>
                                <mod.icon className={`w-7 h-7 ${mod.text}`} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary-900  text-xl leading-none mb-1">{mod.name}</h4>
                                <p className="text-xs font-semibold text-medical-textSecondary uppercase tracking-widest leading-none opacity-60">{mod.desc}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>

        {/* Doctor Dashboard Access (Right Col) */}
        <div className="space-y-8">
            <Card className="bg-primary-600 text-white p-10 rounded-3xl shadow-lg relative overflow-hidden group border-none">
                <div className="relative z-10 space-y-8">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-xl">
                        <Stethoscope className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="w-2 h-2 bg-medical-green rounded-full"></span>
                             <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Authorized Clinical Portal</p>
                        </div>
                        <h3 className="text-3xl font-semibold  tracking-tight text-white mb-4">Doctor Hub</h3>
                        <p className="text-sm font-bold text-white/50 leading-relaxed mb-8">
                            Managing patient queues and issuing verified high-fidelity prescriptions for rural health Protocol 1.
                        </p>
                        <div className="flex items-center justify-between border-t border-white/5 pt-8">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-white/20 uppercase tracking-widest">Queue Status</p>
                                <p className="text-4xl font-semibold tracking-tight">{queue.length}</p>
                            </div>
                            <Link href="/doctor">
                                <Button size="lg" className="bg-white text-primary-900 hover:bg-white/90 shadow-xl shadow-white/5">
                                    <span>ENTER</span>
                                    <ArrowUpRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <Activity className="absolute -left-10 -bottom-10 w-48 h-48 opacity-[0.03] text-white animate-pulse" />
            </Card>

            <Card className="bg-white border-medical-border p-10 rounded-3xl shadow-xl flex flex-col items-center text-center gap-6 group hover:translate-y-[-4px] transition-all">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100">
                    <ShieldCheck className="w-7 h-7 text-primary-600" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.4em] text-primary-900 ">Vault Secured Protocol</h4>
                    <p className="text-sm font-bold text-medical-textSecondary leading-relaxed">
                        End-to-end biological encryption deployed. Your diagnostic logs are processed with zero-retention local compliance.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-primary-200">
                    <div className="w-1 h-1 bg-primary-200 rounded-full"></div>
                    <div className="w-4 h-1 bg-primary-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-primary-200 rounded-full"></div>
                </div>
            </Card>

            {/* Offline Alert Placeholder (Widget) */}
            <Card className="bg-medical-bg border border-dashed border-medical-border p-8 rounded-2xl text-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all group">
                <Clock className="w-6 h-6 mx-auto mb-3 text-medical-textSecondary group-hover:text-primary-500" />
                <p className="text-xs font-semibold text-medical-textSecondary uppercase tracking-widest">Last Protocol Audit</p>
                <p className="text-xs font-semibold text-primary-900 mt-1">20:20:47 Sync Complete</p>
            </Card>
        </div>
      </div>

      <div className="pt-40 pb-20 text-center opacity-10">
          <p className="text-sm font-semibold uppercase tracking-[1.5em] text-primary-900 ">Medical Matrix Core V4.1.2 • Clinical Integrity Active</p>
      </div>
    </Layout>
  );
}
