"use client";

import React, { useEffect, useState } from "react";
import { History, Search, FileText, Database, ShieldAlert, ChevronRight, Activity } from "lucide-react";

export const DecisionLogPanel: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/ai-agent/ai-logs");
            const data = await response.json();
            // 🛑 CRITICAL FIX: Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setLogs(data);
            } else {
                console.warn("Log data is not an array:", data);
                setLogs([]);
            }
        } catch (err) {
            console.error("Log Fetch Error:", err);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-primary-900/5 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-[2rem] flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                        <History className="text-primary-900 w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black italic uppercase leading-none">Diagnostic Log</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400 mt-2">Historical Reasoning Registry</p>
                    </div>
                </div>
                <button 
                  onClick={fetchLogs}
                  className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <Activity className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
                </button>
            </div>

            <div className="space-y-8 relative z-10">
                {logs.length === 0 ? (
                    <div className="p-20 border-4 border-dashed border-primary-50 rounded-[3rem] text-center opacity-30">
                        <FileText className="w-16 h-16 mx-auto mb-6 text-primary-200" />
                        <h4 className="text-xl font-black italic uppercase italic tracking-tighter">History Empty</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest mt-2 px-10 leading-loose">Initialize an AI agent analysis to populate this ledger</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
                        {logs.map((log, i) => (
                            <div key={i} className="p-8 bg-primary-50 rounded-[3rem] border border-primary-100 group/log hover:border-primary-500 transition-all cursor-default">
                                <div className="flex justify-between items-start mb-6 border-b border-primary-100 pb-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-900">Crop Signature: {log.inputs.crop}</span>
                                        </div>
                                        <span className="text-[9px] font-black text-primary-300 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {log.data_sources.map((s: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-white border border-primary-100 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary-400">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <Database className="w-5 h-5 text-primary-300 mt-1" />
                                        <p className="text-sm font-black text-primary-900 leading-relaxed italic opacity-80 line-clamp-2">
                                            {log.ai_reasoning}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert className="text-emerald-600 w-5 h-5 opacity-40" />
                                            <p className="text-[11px] font-black italic uppercase tracking-tighter text-emerald-800">Final Action: {log.final_decision.final_action.slice(0, 30)}...</p>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-primary-200 group-hover/log:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="pt-20 text-center opacity-5">
                <p className="text-[9px] font-black uppercase tracking-[1em] text-primary-900">Encrypted Diagnostic Ledger • Rural Power</p>
            </div>
        </div>
    );
};
