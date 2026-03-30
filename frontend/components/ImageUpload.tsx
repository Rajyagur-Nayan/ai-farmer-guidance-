"use client";

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Maximize2,
  Scan,
  Activity,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';

const ImageUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                setError("Something went wrong. Selected file must be an image.");
                return;
            }
            setFile(selectedFile);
            setResult(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const data = await apiService.analyzeImage(file);
            setResult(data.analysis);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Upload Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Upload className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-primary-900 leading-none uppercase italic">Scan Crop Identity 🩺</h3>
                            <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mt-2 overflow-hidden">Agri-Vision Core v4.2</p>
                        </div>
                    </div>

                    <div 
                        className={`
                            relative h-[480px] border-4 border-dashed rounded-[3.5rem] transition-all duration-700 flex flex-col items-center justify-center overflow-hidden group/upload cursor-pointer
                            ${preview ? 'border-primary-500 shadow-2xl shadow-primary-500/10 bg-white' : 'border-medical-border bg-medical-bg/30 hover:border-primary-300 hover:bg-primary-50/10'}
                        `}
                        onClick={() => !preview && fileInputRef.current?.click()}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover/upload:scale-110" />
                                <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); reset(); }}
                                        className="w-16 h-16 bg-white text-primary-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all"
                                    >
                                        <X className="w-8 h-8" />
                                    </button>
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                                    <div className="px-5 py-2.5 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                                        <Maximize2 className="w-4 h-4" />
                                        <span>Field-Lock Active</span>
                                    </div>
                                </div>
                                {/* Scanning Animation Layer */}
                                {loading && (
                                    <div className="absolute inset-0 z-20 pointer-events-none">
                                        <div className="w-full h-1 bg-medical-green shadow-[0_0_20px_#10b981] absolute top-0 animate-scan-slow"></div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center space-y-6 p-10">
                                    <h4 className="font-bold text-primary-900 text-xl tracking-tight">Scan Crop Identity 🩺</h4>
                                    <p className="text-sm text-primary-400 mt-2 max-w-[200px] mx-auto opacity-80 italic">
                                        Identify leaf patterns, pests, or nutrient deficiencies
                                    </p>
                                <div className="pt-4">
                                    <Button variant="secondary" size="sm" className="pointer-events-none">
                                        Choose File
                                    </Button>
                                </div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>

                    <Button 
                        onClick={handleUpload}
                        disabled={!file || loading}
                        size="xl"
                        variant={loading ? "ghost" : "primary"}
                        className={`w-full group shadow-2xl shadow-primary-500/10`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
                                <span>Analyzing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Eye className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                <span>Analyze Crop Image</span>
                            </div>
                        )}
                    </Button>

                    {error && (
                        <div className="p-6 bg-medical-error/10 border border-medical-error/20 rounded-[2rem] flex items-center gap-4 text-medical-error animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <p className="font-black text-xs uppercase tracking-tight">{error}</p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="space-y-8 lg:pt-0">
                     <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 bg-medical-green/10 rounded-2xl flex items-center justify-center border border-medical-green/20">
                            <Activity className="text-medical-green w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-primary-900 leading-none uppercase italic">Field Signature 📝</h3>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Farming Intelligence Hub</p>
                        </div>
                    </div>

                    {!result && !loading ? (
                        <div className="h-[480px] bg-medical-bg border-4 border-dashed border-medical-border rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center opacity-40">
                            <div className="w-20 h-20 rounded-full border-4 border-primary-500/10 flex items-center justify-center mb-6">
                                <Activity className="w-10 h-10 text-primary-900 animate-pulse" />
                            </div>
                            <h4 className="text-lg font-bold text-primary-900 mb-2">No information yet</h4>
                            <p className="text-base text-medical-textSecondary max-w-[220px]">Upload a photo to see the crop analysis results here.</p>
                        </div>
                    ) : (
                        <Card 
                            accent="green"
                            className={`
                                h-[480px] bg-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col gap-10 animate-in zoom-in-95 duration-700
                                ${loading ? 'opacity-40 grayscale' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between border-b border-medical-border pb-8">
                                <div className="flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 bg-medical-green rounded-full animate-pulse shadow-sm shadow-medical-green"></span>
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-900">Crop Analysis</p>
                                </div>
                                <ShieldCheck className="w-6 h-6 text-medical-green" />
                            </div>

                            {loading ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-12 h-12 text-primary-900 animate-spin" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">Pest Signature Audit...</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                                    <div className="overflow-y-auto pr-2 custom-scrollbar">
                                        <ul className="space-y-4">
                                            {result?.map((point, index) => (
                                                <li key={index} className="flex gap-3 items-start animate-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-medical-green flex-shrink-0" />
                                                    <p className="text-primary-900 text-base font-bold leading-tight italic">
                                                        {point}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="pt-8 border-t border-medical-border flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <span className="px-4 py-2 bg-primary-50 text-primary-600 text-[9px] font-black rounded-xl uppercase tracking-widest">Field-Matched</span>
                                            <span className="px-4 py-2 bg-medical-green/10 text-medical-green text-[9px] font-black rounded-xl uppercase tracking-widest">Verified Log</span>
                                        </div>
                                        <button className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-500 hover:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </div>

            <div className="pt-40 text-center opacity-5">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary-900">Field Analysis protocol • Agri matrix sync 4.1.2</p>
            </div>

            <style jsx global>{`
                @keyframes scan-slow {
                    0% { top: 0% }
                    100% { top: 100% }
                }
                .animate-scan-slow {
                    animation: scan-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ImageUpload;
