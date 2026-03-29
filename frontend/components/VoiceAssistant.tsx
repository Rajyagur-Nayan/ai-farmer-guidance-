"use client";

import React, { useEffect, useRef } from "react";
import { Mic, Square, Loader2, Send, Activity, Volume2, AlertCircle } from "lucide-react";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { Button } from "@/components/ui/Button";

const VoiceAssistant: React.FC = () => {
  const {
    isSpeaking,
    isListening,
    isProcessing,
    transcribedText,
    error,
    recordedBlob,
    playGreeting,
    startListening,
    stopListening,
    sendAudioQuery,
  } = useVoiceAgent();

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      playGreeting();
    }
  }, [playGreeting]);

  return (
    <div className="w-full max-w-6xl mx-auto min-h-[600px] flex flex-col lg:flex-row gap-6 p-6">
      {/* AI Agent Panel (Left) */}
      <div className="flex-1 bg-white/50 backdrop-blur-xl rounded-2xl border border-primary-100 shadow-lg p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative background for AI */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-medical-green/10 rounded-full blur-3xl opacity-50" />

        <div className="text-center space-y-4 z-10 w-full">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Activity className={`w-5 h-5 ${isSpeaking ? "text-medical-green animate-pulse" : "text-primary-400"}`} />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400">
              Farming Assistant
            </span>
          </div>

          {/* AI Avatar / Orb */}
          <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
            {/* Outer rings */}
            <div className={`absolute inset-0 rounded-full border-2 ${isSpeaking ? "border-medical-green/30 animate-[spin_4s_linear_infinite]" : "border-primary-100"} transition-colors duration-700`} />
            <div className={`absolute inset-4 rounded-full border border-dashed ${isSpeaking ? "border-medical-green/40 animate-[spin_6s_linear_infinite_reverse]" : "border-primary-100"} transition-colors duration-700`} />
            
            {/* Inner Orb */}
            <div className={`
              w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 shadow-lg
              ${isSpeaking 
                ? "bg-gradient-to-br from-medical-green to-teal-600 scale-110 shadow-medical-green/40 animate-pulse" 
                : isProcessing
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 scale-100 animate-pulse"
                  : "bg-gradient-to-br from-primary-400 to-primary-600 scale-100 shadow-primary-500/20"
              }
            `}>
               {isSpeaking ? (
                 <Volume2 className="w-12 h-12 text-white animate-bounce" />
               ) : isProcessing ? (
                 <Loader2 className="w-12 h-12 text-white animate-spin" />
               ) : (
                 <Activity className="w-12 h-12 text-white opacity-90" />
               )}
            </div>
            
            {/* Audio wave effect when speaking */}
            {isSpeaking && (
              <div className="absolute inset-0 bg-medical-green/20 rounded-full animate-ping scale-150 opacity-20" />
            )}
          </div>

          {/* AI Status Text */}
          <h3 className="text-2xl font-semibold  tracking-tight text-primary-900 uppercase">
            {isSpeaking
              ? "Transmitting..."
              : isProcessing
                ? "Analyzing Matrix..."
                : "Awaiting Input"}
          </h3>

          {/* AI Response Text Box */}
          <div className="w-full mt-6 p-6 bg-primary-50/50 rounded-[1.5rem] border border-primary-100/50 min-h-[120px] flex items-center justify-center relative">
            <p className={`text-base font-bold  text-primary-900 leading-relaxed ${isSpeaking || transcribedText ? "opacity-100" : "opacity-40"}`}>
              {transcribedText ? transcribedText : "The AI's response will appear here."}
            </p>
          </div>
        </div>
      </div>

      {/* User Action Panel (Right) */}
      <div className="flex-1 bg-white/50 backdrop-blur-xl rounded-2xl border border-primary-100 shadow-lg p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="text-center space-y-2 mb-10 z-10">
          <h2 className="text-2xl font-bold tracking-tight text-primary-900">Your Turn</h2>
          <p className="text-base text-medical-textSecondary max-w-sm mx-auto">
            Press record, describe your farming issue clearly, stop the recording, and ask the AI.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center justify-center space-y-8 z-10 w-full max-w-xs mx-auto">
          
          {/* Record / Stop Button */}
          <div className="relative flex justify-center w-full">
            {isListening && (
              <div className="absolute inset-0 mx-auto w-32 h-32 bg-medical-green/40 rounded-full animate-ping scale-150 opacity-60 translate-y-[-16px]" />
            )}
            
            {isListening ? (
              <Button
                size="xl"
                variant="primary"
                onClick={stopListening}
                className="w-32 h-32 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.8)] animate-pulse relative z-10 bg-primary-500 hover:bg-primary-600 border-4 border-medical-green/50"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <Square className="w-10 h-10 fill-current" />
                  <span className="text-sm uppercase tracking-widest leading-none">Stop</span>
                </div>
              </Button>
            ) : (
              <Button
                size="xl"
                variant="primary"
                onClick={startListening}
                disabled={isProcessing || isSpeaking}
                className="w-32 h-32 rounded-full shadow-lg shadow-primary-500/30 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:scale-105 transition-all duration-300 relative z-10"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <Mic className="w-10 h-10" />
                  <span className="text-sm uppercase tracking-widest leading-none">Record</span>
                </div>
              </Button>
            )}
          </div>

          {/* Send Button */}
          <div className={`w-full transition-all duration-500 ${recordedBlob ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
            <Button
              size="lg"
              variant="success"
              onClick={sendAudioQuery}
              disabled={isProcessing || !recordedBlob}
              className="w-full h-16 rounded-2xl flex items-center justify-center gap-3 text-lg group"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  <span>Ask AI</span>
                </>
              )}
            </Button>
          </div>

        </div>

        {/* Error State */}
        {error && (
          <div className="mt-8 flex items-center justify-center gap-3 p-4 bg-medical-error/10 text-medical-error rounded-2xl w-full animate-shake border border-medical-error/20">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold leading-snug">
              Something went wrong. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
