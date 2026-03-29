import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Shield, Activity } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import VoiceAssistant from '@/components/VoiceAssistant';

const VoicePage = () => {
    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-100px)] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <i className="ri-mic-line text-blue-600"></i>
                            Voice Clinical Assistant
                        </h1>
                        <p className="text-slate-500 mt-2">Speak to describe your symptoms or ask medical questions</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="text-sm font-medium">Uplink Active</span>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mb-32 opacity-50 blur-3xl"></div>

                    <div className="relative z-10 w-full lg:max-w-5xl xl:max-w-6xl mx-auto">
                        <VoiceAssistant />
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl relative z-10 mx-auto">
                        <div className="flex items-start gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Mic className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm">Natural Voice</h3>
                                <p className="text-xs text-slate-500">Speak naturally like you would to a doctor.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm">Clinical Guardrails</h3>
                                <p className="text-xs text-slate-500">AI-driven safety protocols for medical advice.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <Volume2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm">Audio Feedback</h3>
                                <p className="text-xs text-slate-500">Real-time speech synthesis for accessibility.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Powered by Groq Cloud & AI Vision
                </div>
            </div>
        </Layout>
    );
};

export default VoicePage;
