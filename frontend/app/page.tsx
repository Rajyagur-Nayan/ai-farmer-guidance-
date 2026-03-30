"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "@/components/layout/Layout";
import { FeatureCard } from "@/components/home/FeatureCard";
import { Button } from "@/components/ui/Button";
import heroImage from "@/images/image.png";
import {
  Mic,
  MessageSquare,
  Camera,
  TrendingUp,
  CloudRain,
  Leaf,
  ShieldCheck,
  ShoppingCart,
  Activity,
  PhoneCall,
  PiggyBank,
  Map as MapIcon,
} from "lucide-react";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";

export default function FarmerHome() {
  const {
    isListening,
    isSpeaking,
    transcribedText,
    error,
    startListening,
    stopListening,
  } = useVoiceAgent();
  const [greetingPlayed, setGreetingPlayed] = useState(false);

  // Provide a localized greeting interaction loop
  const toggleVoiceProtocol = () => {
    if (isListening || isSpeaking) {
      stopListening();
    } else {
      startListening();
      setGreetingPlayed(true);
    }
  };

  const features = [
    {
      title: "Voice Assistant 🎤",
      description:
        "Speak directly with the AI in your native language for instant farming and technical support.",
      icon: Mic,
      route: "/voice",
      accentColor: "bg-blue-500",
    },
    {
      title: "AI Chatbot 💬",
      description:
        "Chat with the intelligent assistant to troubleshoot crop issues or get tailored agricultural advice.",
      icon: MessageSquare,
      route: "/chat",
      accentColor: "bg-emerald-500",
    },
    {
      title: "Image Detection 📸",
      description:
        "Upload photos of diseased crops, pests, or soil anomalies for instant high-fidelity diagnosis.",
      icon: Camera,
      route: "/diagnosis",
      accentColor: "bg-purple-500",
    },
    {
      title: "Live Market Prices 📈",
      description:
        "Access real-time Mandi rates and global commodity trends optimized for local agriculture.",
      icon: TrendingUp,
      route: "/market",
      accentColor: "bg-amber-500",
    },
    {
      title: "Weather Info 🌦",
      description:
        "Sync with LIVE meteorological protocols to predict rainfall, temperature drops, and humidity.",
      icon: CloudRain,
      route: "/weather",
      accentColor: "bg-cyan-500",
    },
    {
      title: "Marketplace 🛒",
      description:
        "Peer-to-peer farmer exchange. Buy and sell crops, livestock, seeds, and heavy machinery.",
      icon: ShoppingCart,
      route: "/marketplace",
      accentColor: "bg-indigo-500",
    },
    {
      title: "Money Advisor 💰",
      description:
        "AI-driven financial strategy synthesis for crop sales and investment analytics.",
      icon: PiggyBank,
      route: "/farmer-tools",
      accentColor: "bg-rose-500",
    },
    {
      title: "Gov Schemes 🛡️",
      description:
        "Find and apply for state and national agricultural support and subsidies.",
      icon: ShieldCheck,
      route: "/gov-schemes",
      accentColor: "bg-emerald-500",
    },
    {
      title: "Mandi Locator 🗺️",
      description:
        "Locate the nearest Mandis, cold storage, and government agricultural offices in real-time.",
      icon: MapIcon,
      route: "/live-location",
      accentColor: "bg-orange-500",
    },
  ];

  return (
    <Layout>
      <div className="space-y-16 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Hero Greeting Panel */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 p-12 md:p-16 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group">
          <Image
            src={heroImage}
            alt="Farmer Hero Image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary-900/60 transition-opacity duration-1000 group-hover:bg-primary-900/50" />

          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-semibold shadow-md">
              <Activity className="w-4 h-4 text-medical-green animate-pulse" />
              <span>Farm System Online</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Welcome <br />
                <span className="text-primary-300">Farmer 👋</span>
              </h1>
              <p className="text-base text-white/80 max-w-xl leading-relaxed">
                Your digital platform for agricultural intelligence, marketplace
                trading, and crop analysis.
              </p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <Button
              onClick={toggleVoiceProtocol}
              className={`w-full lg:w-auto px-6 py-4 rounded-xl shadow-md text-base transition-all duration-300 ${isListening || isSpeaking ? "bg-emergency text-white hover:bg-emergency/90" : "bg-white text-primary-900 hover:bg-primary-50"}`}
            >
              {isListening || isSpeaking ? (
                <>
                  <Activity className="w-6 h-6 mr-3 animate-pulse" />
                  <span className="font-semibold">Stop Protocol</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-6 h-6 mr-3 text-primary-500" />
                  <span className="font-semibold">Speak Your Problem</span>
                </>
              )}
            </Button>
          </div>

          {/* Transcribed Feedback Overlay */}
          {(transcribedText || error) && (
            <div className="absolute top-8 right-8 z-20 max-w-sm w-full bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 shadow-md animate-in zoom-in-95 duration-500">
              {error ? (
                <p className="text-sm font-semibold text-rose-300">
                  Something went wrong. Please try again.
                </p>
              ) : (
                <p className="text-base text-white">
                  <span className="text-sm font-semibold text-white/60 block mb-2">
                    You said:
                  </span>
                  "{transcribedText}"
                </p>
              )}
            </div>
          )}

          {/* Decorative Background Flare */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
        </div>

        {/* Grid Module */}
        <div className="px-2">
          <div className="flex items-center gap-6 mb-6 overflow-hidden">
            <h2 className="text-xl font-semibold text-primary-900 whitespace-nowrap">
              Core Features
            </h2>
            <div className="h-[2px] w-full bg-medical-border border-dashed"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="animate-in fade-in zoom-in-95 fill-mode-both"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationDuration: "700ms",
                }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="text-center pt-20 border-t border-medical-border border-dashed">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400">
            Agricultural Operating System V4.0 • Distributed Network
          </p>
        </div>
      </div>
    </Layout>
  );
}
