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

    /**
     * 🧪 Try with Sample Image (Reference Image provided by user)
     */
    const handleTrySample = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        // Reference Sample Image for Testing
        const sampleUrl = "/images/image-copy.png";
        setPreview(sampleUrl);

        try {
            // Fetch the image as a blob
            const response = await fetch(sampleUrl);
            const blob = await response.blob();
            const sampleFile = new File([blob], "sample_crop.png", { type: "image/png" });
            
            setFile(sampleFile);
            
            // Artificial delay for better "Scanning" feel
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const data = await apiService.analyzeImage(sampleFile);
            setResult(data.analysis);
        } catch (err: any) {
            console.error("Sample Analysis Error:", err);
            setError("Sample uplink failed. Please try a manual upload.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Upload Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <Scan className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-primary-900 leading-none uppercase italic">Orbital Scanner 📡</h3>
                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mt-2 overflow-hidden italic">Biometric Crop Analysis v4.2</p>
                            </div>
                        </div>
                        {!preview && !loading && (
                            <button 
                                onClick={handleTrySample}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3 group animate-in zoom-in duration-500 hover:scale-105 active:scale-95"
                            >
                                <div className="p-1 bg-white/20 rounded-lg">
                                    <ImageIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                </div>
                                Try Analysis Sample
                            </button>
                        )}
                    </div>

                    <div 
                        className={`
                            relative h-[520px] border-4 border-dashed rounded-[3.5rem] transition-all duration-700 flex flex-col items-center justify-center overflow-hidden group/upload cursor-pointer
                            ${preview ? 'border-primary-500 shadow-2xl shadow-primary-500/10 bg-white' : 'border-primary-100 bg-primary-50/10 hover:border-primary-300 hover:bg-primary-50/30'}
                        `}
                        onClick={() => !preview && !loading && fileInputRef.current?.click()}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className={`w-full h-full object-cover transition-all duration-1000 ${loading ? 'scale-110 blur-[2px] brightness-75' : 'group-hover/upload:scale-105'}`} />
                                
                                {/* HUD Overlay UI */}
                                <div className="absolute inset-0 z-10 p-10 flex flex-col justify-between pointer-events-none opacity-80">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 border-l-2 border-t-2 border-white/40 rounded-tl-xl w-12 h-12" />
                                        <div className="p-3 border-r-2 border-t-2 border-white/40 rounded-tr-xl w-12 h-12" />
                                    </div>
                                    
                                    <div className="flex flex-col items-center gap-2">
                                        {loading && (
                                            <div className="px-5 py-2 bg-primary-900/40 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-3 animate-pulse">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Processing Visual Matrix...</span>
                                            </div>
                                        )}
                                        <div className="w-full flex justify-between items-end">
                                            <div className="p-3 border-l-2 border-b-2 border-white/40 rounded-bl-xl w-12 h-12" />
                                            <div className="p-3 border-r-2 border-b-2 border-white/40 rounded-br-xl w-12 h-12" />
                                        </div>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                {!loading && (
                                    <div className="absolute inset-0 bg-primary-900/20 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] z-20">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); reset(); }}
                                            className="w-14 h-14 bg-white text-primary-900 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <X className="w-7 h-7" />
                                        </button>
                                    </div>
                                )}

                                {/* Scanning Line */}
                                {loading && (
                                    <div className="absolute inset-0 z-15 pointer-events-none">
                                        <div className="w-full h-[2px] bg-emerald-400 shadow-[0_0_25px_#10b981] absolute top-0 animate-scan-slow"></div>
                                        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center space-y-6 p-10 group-hover:scale-105 transition-transform duration-500">
                                <div className="w-24 h-24 bg-primary-100 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                                    <ImageIcon className="text-primary-400 w-10 h-10" />
                                </div>
                                <div>
                                    <h4 className="font-black text-primary-900 text-xl tracking-tight uppercase italic">No Target Found</h4>
                                    <p className="text-[10px] font-bold text-primary-400 mt-2 max-w-[200px] mx-auto uppercase tracking-widest leading-loose">
                                        Upload crop image or use sample to initialize diagnostic protocol
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <Button variant="secondary" size="sm" className="pointer-events-none border-2 border-primary-900 text-primary-900 bg-white shadow-xl">
                                        Choose Perspective
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
                        className={`w-full group shadow-2xl shadow-primary-500/10 border-4 border-primary-900 h-24 rounded-[2rem]`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-lg font-black italic tracking-tight uppercase text-primary-500">Uplink in Progress...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Activity className="w-8 h-8 group-hover:scale-110 transition-transform text-white" />
                                <span className="text-lg font-black italic tracking-tight uppercase">Analyze Field Target</span>
                            </div>
                        )}
                    </Button>

                    {error && (
                        <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-800 animate-in fade-in slide-in-from-top-4 shadow-xl shadow-rose-900/5">
                            <AlertCircle className="w-6 h-6 flex-shrink-0" />
                            <p className="font-black text-[10px] uppercase tracking-widest leading-relaxed">{error}</p>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                <div className="space-y-8 lg:pt-0">
                     <div className="flex items-center gap-4 px-2">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-lg shadow-emerald-900/5">
                            <Activity className="text-emerald-600 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-primary-900 leading-none uppercase italic">Scan Metadata 📊</h3>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Diagnostic Integrity: High</p>
                        </div>
                    </div>

                    {!result && !loading ? (
                        <div className="h-[520px] bg-primary-50/5 border-4 border-dashed border-primary-100 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center group">
                            <div className="w-24 h-24 rounded-[2.5rem] border border-primary-900/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-white shadow-xl">
                                <Activity className="w-10 h-10 text-primary-200" />
                            </div>
                            <h4 className="text-xl font-black text-primary-900 mb-2 italic uppercase tracking-tighter">Awaiting Matrix...</h4>
                            <p className="text-[10px] font-bold text-primary-400 max-w-[200px] uppercase tracking-widest leading-loose">Initialize analysis to populate diagnostic registry</p>
                        </div>
                    ) : (
                        <div 
                            className={`
                                h-[520px] bg-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col gap-10 animate-in zoom-in-95 duration-700 border-4 border-primary-900 relative overflow-hidden
                                ${loading ? 'opacity-40 grayscale pointer-events-none' : ''}
                            `}
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />

                            <div className="flex items-center justify-between border-b-2 border-primary-50 pb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-900 leading-none">Diagnostic Log</p>
                                        <p className="text-[8px] font-black text-primary-400 uppercase tracking-widest mt-1.5">Signature ID: #{Math.floor(Math.random()*9e5)}</p>
                                    </div>
                                </div>
                                <ShieldCheck className="w-7 h-7 text-primary-900" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between overflow-hidden relative z-10">
                                <div className="overflow-y-auto pr-4 custom-scrollbar">
                                    <ul className="space-y-6">
                                        {result?.map((point, index) => (
                                            <li key={index} className="flex gap-4 items-start animate-in slide-in-from-left duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                                                <div className="mt-1.5 w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-900 text-[10px] font-black">
                                                    {index + 1}
                                                </div>
                                                <p className="text-primary-900 text-[15px] font-black leading-snug italic tracking-tight">
                                                    {point}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="pt-8 border-t-2 border-primary-50 flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <div className="px-5 py-2.5 bg-primary-900 text-white text-[9px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary-900/20">Certified</div>
                                        <div className="px-5 py-2.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-xl uppercase tracking-widest border border-emerald-100">AI Verified</div>
                                    </div>
                                    <button 
                                        onClick={reset}
                                        className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 hover:bg-primary-900 hover:text-white transition-all shadow-sm"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-32 text-center opacity-10">
                <p className="text-[9px] font-black uppercase tracking-[1em] text-primary-900 italic">Field Diagnostic protocol • Matrix Sync 4.2.1 • Rural Power</p>
            </div>

            <style jsx global>{`
                @keyframes scan-slow {
                    0% { top: 0% }
                    100% { top: 100% }
                }
                .animate-scan-slow {
                    animation: scan-slow 2.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ImageUpload;
