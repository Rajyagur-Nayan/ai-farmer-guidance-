"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  PiggyBank, 
  ArrowUpRight, 
  Loader2, 
  PieChart, 
  Target,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';

const MoneyAdvisor: React.FC = () => {
    const [crop, setCrop] = useState('');
    const [landArea, setLandArea] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [advice, setAdvice] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const getAdvice = async () => {
        if (!crop || !landArea) {
            setError("Crop and Land Area are required for high-fidelity analysis.");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // Get location if possible
            let location = { lat: 23.0225, lon: 72.5714 }; // Default Ahmedabad
            
            const data = await apiService.getMoneyAdvice({
                crop,
                land_area: parseFloat(landArea),
                market_price: price ? parseFloat(price) : null,
                location
            });
            setAdvice(data);
        } catch (err) {
            setError("Financial reasoning core timed out. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <Card className="p-10 bg-white rounded-[3.5rem] shadow-2xl border-none">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Input Side */}
                    <div className="flex-1 space-y-10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <PieChart className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-primary-900 italic tracking-tight uppercase">Analyze Field Metrics</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-2">Current Crop Target</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Cotton" 
                                    value={crop}
                                    onChange={(e) => setCrop(e.target.value)}
                                    className="w-full p-6 bg-medical-bg/40 rounded-3xl border-none focus:ring-4 focus:ring-primary-100 font-bold transition-all text-primary-900"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-2">Area Scope (Acres)</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 5" 
                                    value={landArea}
                                    onChange={(e) => setLandArea(e.target.value)}
                                    className="w-full p-6 bg-medical-bg/40 rounded-3xl border-none focus:ring-4 focus:ring-primary-100 font-bold transition-all text-primary-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-2">Real-Time Mandi Price (Optional)</label>
                            <input 
                                type="number" 
                                placeholder="Enter price per quintal relative to your region" 
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-6 bg-medical-bg/40 rounded-3xl border-none focus:ring-4 focus:ring-primary-100 font-bold transition-all text-primary-900"
                            />
                        </div>

                        <Button 
                            onClick={getAdvice} 
                            disabled={loading}
                            className="w-full rounded-3xl h-20 shadow-xl shadow-primary-500/10 group bg-primary-900 hover:bg-black transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="text-lg font-black italic tracking-widest uppercase">DEPLOY FINANCIAL NAVIGATOR</span>
                                    <Target className="w-6 h-6 group-hover:scale-125 transition-transform" />
                                </div>
                            )}
                        </Button>
                        
                        {error && (
                            <div className="p-4 bg-medical-error/5 rounded-2xl flex items-center justify-center gap-3 animate-shake">
                                <AlertCircle className="w-4 h-4 text-medical-error" />
                                <p className="text-[10px] font-black text-medical-error uppercase tracking-widest">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* AI Reasoning Panel */}
                    <div className="flex-1 bg-primary-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden group border-8 border-primary-800 shadow-inner">
                        {!advice ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 relative z-10 py-12">
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-xl animate-pulse border border-white/10">
                                    <TrendingUp className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black italic mb-3 tracking-tighter">AI Financial Core</h4>
                                    <p className="text-sm font-bold text-white/40 leading-relaxed uppercase tracking-[0.2em] max-w-xs mx-auto">
                                        Fill in your field data to deploy the neural advisor for multi-vector market analysis.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10 relative z-10 animate-in fade-in slide-in-from-right-8 duration-1000">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                                        <Zap className="w-3 h-3 text-medical-warning animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-medical-warning">Decision Matrix Finalized</span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white ${advice.price_trend?.toLowerCase().includes('inc') ? 'text-medical-green' : 'text-medical-error'}`}>
                                        {advice.price_trend} trend
                                    </div>
                                </div>

                                <div className="p-10 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl">
                                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 leading-none pl-1">Primary Market Directive</p>
                                    <p className="text-5xl font-black italic tracking-tighter text-white uppercase leading-tight line-clamp-2">{advice.sell_advice}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 group-hover:bg-white/10 transition-colors">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-3">High-Yield Successor</p>
                                        <p className="text-2xl font-black italic tracking-tight">{advice.next_crop_recommendation}</p>
                                    </div>
                                    <div className="p-8 bg-medical-green/10 rounded-[2rem] border border-medical-green/20">
                                        <p className="text-[10px] font-black text-medical-green uppercase tracking-[0.25em] mb-3">Confidence Score</p>
                                        <p className="text-2xl font-black italic tracking-tight">STABLE V4.1</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <TrendingUp className="absolute -right-16 -bottom-16 w-80 h-80 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 select-none pointer-events-none" />
                    </div>
                </div>
            </Card>

            {/* Detailed Advice Section (Only when available) */}
            {advice && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-5 duration-1000">
                    <Card className="p-12 bg-white rounded-[4rem] border-none shadow-2xl flex flex-col gap-8 group hover:translate-y-[-4px] transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-medical-green/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <ArrowUpRight className="w-8 h-8 text-medical-green" />
                            </div>
                            <h5 className="text-xl font-black text-primary-900 italic tracking-tight uppercase">Income Optimization Protocols</h5>
                        </div>
                        <ul className="space-y-6">
                            {advice.income_tips?.map((tip: string, i: number) => (
                                <li key={i} className="flex gap-5 group/item">
                                    <div className="w-2 h-2 bg-medical-green rounded-full mt-2 group-hover/item:scale-150 transition-all shadow-lg shadow-medical-green/40"></div>
                                    <p className="text-md font-bold text-medical-textSecondary leading-relaxed italic tracking-tight">{tip}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card className="p-12 bg-primary-600 rounded-[4rem] border-none shadow-2xl flex flex-col gap-8 text-white group hover:translate-y-[-4px] transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                <PiggyBank className="w-8 h-8 text-white" />
                            </div>
                            <h5 className="text-xl font-black italic tracking-tight uppercase">Investment Guardrail Synthesis</h5>
                        </div>
                        <ul className="space-y-6">
                            {advice.investment_advice?.map((tip: string, i: number) => (
                                <li key={i} className="flex gap-5 group/item">
                                    <div className="w-2 h-2 bg-white/30 rounded-full mt-2 group-hover/item:scale-150 group-hover:bg-white transition-all shadow-lg shadow-white/40"></div>
                                    <p className="text-md font-bold text-white/80 leading-relaxed italic tracking-tight">{tip}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MoneyAdvisor;
