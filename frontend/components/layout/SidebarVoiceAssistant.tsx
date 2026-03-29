"use client";

import React from "react";
import { Mic, MicOff, Loader2, Volume2, AlertCircle } from "lucide-react";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";

const SidebarVoiceAssistant: React.FC = () => {
  const {
    isListening,
    isProcessing,
    transcribedText,
    error,
    startListening,
    stopListening,
  } = useVoiceAgent();

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-500 overflow-hidden relative ${isListening ? 'bg-medical-error/10 border-medical-error/20' : 'bg-primary-50/30 border-primary-50 hover:bg-primary-50/50'}`}>
      
      {/* Background Pulse for active state */}
      {isListening && (
        <div className="absolute inset-0 bg-medical-error/10 animate-pulse pointer-events-none" />
      )}

      <div className="flex items-center gap-4 relative z-10">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isProcessing ? 'bg-primary-100' : isListening ? 'bg-medical-error text-white scale-110 shadow-medical-error/20' : 'bg-primary-500 text-white hover:scale-110 shadow-primary-500/20'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
          ) : isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary-900 leading-none mb-1">
            {isProcessing ? "Analyzing..." : isListening ? "Listening..." : "Voice Agent"}
          </p>
          <p className="text-[9px] font-bold text-primary-400 truncate">
            {isListening ? "Matrix is observing..." : "Tap to speak to AI"}
          </p>
        </div>
      </div>

      {/* Mini Transcript or Error */}
      {(transcribedText || error) && (
        <div className="mt-4 pt-3 border-t border-primary-100/50 animate-in fade-in slide-in-from-top-2 duration-300">
          {error ? (
            <div className="flex items-center gap-2 text-medical-error">
              <AlertCircle className="w-3.5 h-3.5" />
              <p className="text-[8px] font-black uppercase tracking-tight">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3 h-3 text-primary-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-primary-400">Response</span>
              </div>
              <p className="text-[11px] font-bold italic text-primary-900 leading-tight line-clamp-2">
                {transcribedText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarVoiceAssistant;
