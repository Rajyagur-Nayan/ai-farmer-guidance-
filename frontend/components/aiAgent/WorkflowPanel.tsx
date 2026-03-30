"use client";

import React, { useState } from "react";
import { PlayCircle, Globe, CloudSun, BarChart3, Fingerprint, CheckCircle2, Loader2, ArrowRightCircle } from "lucide-react";
import { getApiUrl } from "@/utils/config";

export const WorkflowPanel: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");
    const [step, setStep] = useState(0);
    const [output, setOutput] = useState<any>(null);

    const steps = [
        { icon: CloudSun, label: "Fetching Weather Telemetry", detail: "OpenWeather OneCall Sync" },
        { icon: BarChart3, label: "Aggregating Market Trends", detail: "Mandi Price Protocol v3.0" },
        { icon: Fingerprint, label: "Analyzing Crop Signatures", detail: "Gemini 2.5 Visual Matrix" },
        { icon: Globe, label: "Finalizing Strategic Advisor", detail: "Groq Llama-3.3 Synthesis" }
    ];

    const runFullWorkflow = async () => {
        setStatus("running");
        setStep(0);
        setOutput(null);

        // Simulated Progress for UI impact
        for (let i = 0; i < steps.length; i++) {
            setStep(i);
            await new Promise(resolve => setTimeout(resolve, 1200));
        }

        try {
            const response = await fetch(getApiUrl("ai-agent/ai-workflow"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    crop: "Rice",
                    location: { lat: 18.5204, lon: 73.8567 },
                    monthly_income: 25000
                })
            });
            const data = await response.json();
            setOutput(data.final_output);
            setStatus("completed");
        } catch (err) {
            console.error("Workflow Failure:", err);
            setStatus("idle");
        }
    };

    return (
        <div className="bg-primary-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="grid grid-cols-12 h-full gap-1 border-r border-white/5" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                            <PlayCircle className="text-primary-900 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black italic uppercase italic leading-none">Intelligence Engine</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 mt-2">Autonomous Workflow v4.2</p>
                        </div>
                    </div>
                </div>

                {status === "idle" ? (
                    <div className="p-12 border-4 border-dashed border-white/20 rounded-[3rem] text-center space-y-8 group/empty cursor-pointer hover:border-emerald-500/50 transition-all" onClick={runFullWorkflow}>
                        <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center mx-auto group-hover/empty:scale-110 transition-transform shadow-2xl">
                           <Loader2 className="w-12 h-12 text-emerald-400 animate-pulse" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black italic uppercase tracking-tighter">Full Matrix Analysis</h4>
                            <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-2 px-10">Initialize complete telemetry fetch and AI strategic synthesis</p>
                        </div>
                        <div className="pt-4">
                            <div className="px-8 py-4 bg-emerald-500 text-primary-900 rounded-2xl font-black uppercase tracking-widest text-xs inline-flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
                                <PlayCircle className="w-5 h-5" /> Start Neural Sync
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="flex flex-col gap-8">
                            {steps.map((s, i) => (
                                <div key={i} className={`flex items-center gap-6 transition-all duration-700 ${i > step ? 'opacity-20 translate-x-12 scale-90' : 'opacity-100'}`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ${i === step ? 'bg-emerald-500 scale-110 animate-pulse' : i < step ? 'bg-emerald-900 text-emerald-400' : 'bg-white/10'}`}>
                                        {i < step ? <CheckCircle2 className="w-7 h-7" /> : <s.icon className="w-7 h-7" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-lg font-black italic uppercase tracking-tight ${i === step ? 'text-emerald-400' : 'text-white'}`}>{s.label}</h4>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{s.detail}</p>
                                    </div>
                                    {i === step && <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />}
                                </div>
                            ))}
                        </div>

                        {status === "completed" && output && (
                             <div className="p-10 bg-black/40 backdrop-blur-3xl rounded-[3rem] border-2 border-emerald-500/30 animate-in zoom-in-95 duration-1000 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <ArrowRightCircle className="text-emerald-400 w-8 h-8" />
                                    <h5 className="text-xl font-black italic uppercase tracking-tighter">Workflow Synthesis</h5>
                                </div>
                                <p className="text-sm font-bold text-white leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                                    {output.final_action}
                                </p>
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
