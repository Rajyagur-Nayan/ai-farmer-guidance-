"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Video,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Send,
  User,
  MoreVertical,
  Activity,
  ArrowRight,
  Loader2,
  Lock,
  Play,
  HeartPulse,
  ShieldCheck,
  Zap,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Stethoscope,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiService } from "@/utils/api";

interface Patient {
  id: number;
  patient_name: string;
  symptoms: string;
  status: string;
  earnings: number;
  timestamp: string;
}

const DoctorDashboard: React.FC = () => {
  const [queue, setQueue] = useState<Patient[]>([]);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState("");
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [queueData, earningsData] = await Promise.all([
        apiService.getQueue(),
        apiService.getEarnings(),
      ]);
      setQueue(queueData);
      setEarnings(earningsData.total);

      const active = queueData.find((p: Patient) => p.status === "Active");
      if (active) setActivePatient(active);
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (patient: Patient) => {
    try {
      await apiService.startConsultation(patient.id);
      setActivePatient({ ...patient, status: "Active" });
      fetchData();
    } catch (error) {
      console.error("Start Session Error:", error);
    }
  };

  const handleIssuePrescription = async () => {
    if (!activePatient || !prescription.trim()) return;
    setIssuing(true);
    try {
      await apiService.issuePrescription({
        consultation_id: activePatient.id,
        medication_details: prescription,
      });
      setActivePatient(null);
      setPrescription("");
      fetchData();
    } catch (error) {
      console.error("Prescription Error:", error);
    } finally {
      setIssuing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-primary-900 ">
          Initializing Clinical Protocol...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Top Bar: Earnings & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
        <Card className="bg-primary-600 border-none p-10 rounded-3xl shadow-lg flex flex-col justify-between h-56 relative overflow-hidden group">
          <div className="z-10 space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
              <TrendingUp className="w-3 h-3 text-white" />
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60 leading-none">
                Net Professional Revenue
              </p>
            </div>
            <h2 className="text-5xl font-semibold  tracking-tight text-white">
              ₹{earnings.toLocaleString()}
            </h2>
          </div>
          <div className="flex items-center gap-2 z-10">
            <span className="w-2 h-2 bg-medical-green rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
            <span className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Clinical Reconciliation Live
            </span>
          </div>
          <DollarSign className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 text-white rotate-12 transition-transform duration-1000 group-hover:scale-110" />
        </Card>

        <Card className="bg-white border-none p-10 rounded-3xl shadow-xl shadow-primary-500/5 flex flex-col justify-between h-56 hover:border-l-8 hover:border-l-medical-warning transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-medical-warning/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-medical-warning" />
            </div>
            <div>
              <h2 className="text-5xl font-semibold text-primary-900 tracking-tight  leading-none">
                {queue.filter((p) => p.status === "Pending").length}
              </h2>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-400 mt-2">
                Cases Pending Protocol
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-primary-200 group-hover:text-primary-500 transition-colors">
            <Users className="w-5 h-5" />
            <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
          </div>
        </Card>

        <Card className="bg-white border-none p-10 rounded-3xl shadow-xl shadow-primary-500/5 flex flex-col justify-between h-56 hover:border-l-8 hover:border-l-medical-green transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-medical-green/10 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-medical-green" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-primary-900 tracking-tight  leading-tight uppercase truncate">
                {activePatient ? activePatient.patient_name : "STDBY MODE"}
              </h2>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-400 mt-2">
                Active Clinical Session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${activePatient ? "bg-medical-green animate-pulse shadow-[0_0_10px_#10b981]" : "bg-primary-100"}`}
            ></div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary-900">
              {activePatient ? "Protocol Running" : "Awaiting Uplink"}
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-4 md:px-0">
        {/* Left: Patient Queue */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-semibold text-primary-900  tracking-tight leading-none">
                Bio-Registry
              </h3>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary-400 mt-1">
                Localized Queue
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {queue.length === 0 ? (
              <div className="p-12 bg-medical-bg border-4 border-dashed border-medical-border rounded-3xl text-center opacity-30">
                <Clock className="w-10 h-10 mx-auto mb-4 text-primary-900" />
                <p className="text-sm font-semibold uppercase tracking-widest  text-primary-900">
                  Registry Purged • Clear
                </p>
              </div>
            ) : (
              queue.map((p, i) => (
                <Card
                  key={p.id}
                  style={{ animationDelay: `${i * 100}ms` }}
                  className={`
                                p-8 rounded-3xl border-none transition-all group relative overflow-hidden animate-in slide-in-from-left-4
                                ${
                                  activePatient?.id === p.id
                                    ? "bg-primary-900 text-white shadow-lg shadow-primary-900/20"
                                    : "bg-white shadow-xl shadow-primary-500/5 hover:-translate-y-1"
                                }
                            `}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-2xl leading-none  tracking-tight truncate w-[70%] uppercase">
                      {p.patient_name}
                    </h4>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest ${activePatient?.id === p.id ? "bg-white/10 text-primary-200 border border-white/10" : "bg-primary-50 text-primary-500 border border-primary-100"}`}
                    >
                      <Activity className="w-3 h-3" />
                      {p.status}
                    </div>
                  </div>
                  <p
                    className={`text-sm font-bold mb-8 leading-relaxed line-clamp-2 ${activePatient?.id === p.id ? "text-primary-100 opacity-60" : "text-medical-textSecondary"}`}
                  >
                    {p.symptoms}
                  </p>
                  {p.status === "Pending" && (
                    <Button
                      onClick={() => handleStartConsultation(p)}
                      className="w-full bg-primary-500 text-white hover:bg-primary-600 rounded-2xl py-5 font-semibold text-sm uppercase tracking-widest shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 transition-all"
                    >
                      INITIALIZE SESSION <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                  {activePatient?.id === p.id && (
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl"></div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right: Consultation Panel (Main Area) */}
        <div className="lg:col-span-2 space-y-10">
          {!activePatient ? (
            <Card className="h-full min-h-[700px] bg-medical-bg border-4 border-dashed border-medical-border rounded-3xl flex flex-col items-center justify-center text-center p-20 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-700">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border border-medical-border mb-8 shadow-sm group-hover:rotate-12 transition-transform">
                <Lock className="w-12 h-12 text-primary-900" />
              </div>
              <h3 className="text-4xl font-semibold  text-primary-900 mb-4 tracking-tight">
                Diagnostic Matrix Locked
              </h3>
              <p className="text-sm font-semibold uppercase tracking-[0.5em] text-primary-400 max-w-sm leading-relaxed px-10">
                Select an authorized bio-log from the queue to initiate
                high-fidelity clinical protocol
              </p>
            </Card>
          ) : (
            <div className="space-y-10 animate-in zoom-in-95 duration-1000">
              {/* View Area: Video Placeholder + Info */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="aspect-video bg-primary-900 rounded-3xl relative overflow-hidden shadow-lg border-none group">
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-6">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/5">
                      <Video className="w-10 h-10 text-white opacity-20 group-hover:animate-pulse" />
                    </div>
                    <span className="text-sm font-semibold text-white/20 uppercase tracking-[0.5em]">
                      Optical Link Encrypted
                    </span>
                  </div>
                  <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 bg-primary-600/40 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
                    <div className="w-2.5 h-2.5 bg-medical-error rounded-full animate-ping"></div>
                    <span className="text-sm font-semibold text-white uppercase tracking-widest ">
                      BIO-FEED • {activePatient.patient_name}
                    </span>
                  </div>
                  {/* Scanning Animation */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-0.5 bg-primary-500 absolute top-1/3 animate-pulse"></div>
                    <div className="w-0.5 h-full bg-primary-500 absolute left-1/2 animate-pulse delay-500"></div>
                  </div>
                </Card>

                <Card className="bg-white border-none rounded-3xl p-12 shadow-xl shadow-primary-500/5 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                          <HeartPulse className="w-5 h-5 text-primary-500" />
                        </div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-900 ">
                          Vitals Protocol
                        </h4>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-medical-green" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-4xl font-semibold text-primary-900  uppercase tracking-tight scale-x-95 origin-left">
                        {activePatient.patient_name}
                      </h3>
                      <div className="p-6 bg-medical-bg rounded-2xl border border-medical-border">
                        <p className="text-medical-textSecondary font-bold text-sm leading-relaxed ">
                          {activePatient.symptoms}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 flex gap-4">
                    <Button
                      variant="secondary"
                      className="flex-1 rounded-2xl py-6 font-semibold text-sm uppercase tracking-widest shadow-sm"
                    >
                      BIO-ID SYNC
                    </Button>
                    <Button className="flex-1 bg-primary-900 text-white rounded-2xl py-6 font-semibold text-sm uppercase tracking-widest shadow-xl shadow-primary-900/20">
                      LOG HISTORY
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Interaction Area: Consultation + Prescription */}
              <Card className="bg-white border-none rounded-3xl p-12 shadow-lg shadow-primary-500/10 space-y-10 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-medical-green/5 rounded-full blur-[80px]"></div>

                <div className="flex items-center justify-between border-b border-medical-border pb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold  text-primary-900 tracking-tight leading-none">
                        Prescription Suite 💊
                      </h3>
                      <p className="text-sm font-semibold text-primary-400 uppercase tracking-widest mt-2 leading-none">
                        Bio-Logical Adherence Protocol
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-primary-200 uppercase tracking-widest block mb-1">
                      Auth Digital Hash
                    </span>
                    <span className="text-sm font-semibold text-primary-900 uppercase tracking-[0.2em] bg-primary-50 px-3 py-1 rounded-lg">
                      #XG-PRSC-{activePatient.id}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <label className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-400 ml-4 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-medical-warning" />
                    Clinical Logic & Instructions
                  </label>
                  <textarea
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    placeholder="e.g. Tab. Protocol-7 • 500mg • TID for 5 days. Ensure hydration protocol is maintained..."
                    className="w-full bg-medical-bg border-none rounded-3xl p-10 font-bold text-primary-900 min-h-[220px] focus:bg-white focus:outline-none focus:ring-8 focus:ring-primary-500/5 transition-all text-lg placeholder:text-primary-200 shadow-inner "
                  />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 relative z-10">
                  <div className="flex items-center gap-4 p-5 bg-primary-50 rounded-2xl border border-primary-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Stethoscope className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-primary-900 uppercase tracking-widest">
                        Clinical Signature
                      </p>
                      <span className="text-xs font-bold text-primary-300 uppercase tracking-widest">
                        Biological Auth Applied
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleIssuePrescription}
                    disabled={issuing || !prescription.trim()}
                    size="xl"
                    className="w-full md:w-auto px-16 py-8 shadow-lg shadow-primary-500/20 group overflow-hidden relative"
                  >
                    <div className="relative z-10 flex items-center gap-4">
                      {issuing ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : (
                        <Send className="w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                      )}
                      <span>FINALIZE & DISPATCH</span>
                    </div>
                    <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="pt-40 text-center opacity-10">
        <p className="text-sm font-semibold uppercase tracking-[1.5em] text-primary-900 ">
          authorized clinical terminal 4.1.2 • Matrix Integrity System
        </p>
      </div>
    </div>
  );
};

export default DoctorDashboard;
