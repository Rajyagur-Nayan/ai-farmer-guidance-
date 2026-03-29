"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Loader2,
  Thermometer,
  Zap,
  Activity,
  Heart,
  Volume2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/utils/api";
import { voiceApi } from "@/utils/voiceApi";

interface WeatherData {
  temperature: string;
  humidity: string;
  condition: string;
  wind_speed: string;
  rainfall: string;
  advice: string;
  error?: string;
  fallback?: string;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAdvice = async () => {
    if (!weather?.advice || isSpeaking) return;

    try {
      setIsSpeaking(true);
      const audioBase64 = await voiceApi.getGreetingTTS(weather.advice);
      if (audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("Speech Error:", err);
      setIsSpeaking(false);
    }
  };

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await apiService.getWeather(latitude, longitude);
          if (data.error) {
            setError(data.fallback || data.error);
          } else {
            setWeather(data);
          }
        } catch (err) {
          setError("Failed to synchronize with meteorological satellites.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(
          "Location access denied. Please enable GPS for local weather.",
        );
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes("rain"))
      return <CloudRain className="w-20 h-20 text-primary-500" />;
    if (c.includes("cloud"))
      return <Cloud className="w-20 h-20 text-primary-400" />;
    if (c.includes("thunder"))
      return <Zap className="w-20 h-20 text-medical-warning" />;
    return <Sun className="w-20 h-20 text-medical-warning animate-spin-slow" />;
  };

  if (loading) {
    return (
      <Card className="p-16 flex flex-col items-center justify-center gap-6 bg-white rounded-[3rem] border-4 border-dashed border-medical-border">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-primary-900 italic">
          Fetching Atmospheric Data...
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center gap-6 bg-medical-error/5 rounded-[3rem] border-2 border-medical-error/20">
        <div className="w-16 h-16 bg-medical-error/10 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-medical-error" />
        </div>
        <div className="text-center">
          <p className="font-black text-primary-900 italic text-xl mb-2">
            Sync Link Failure
          </p>
          <p className="text-xs font-bold text-medical-textSecondary uppercase tracking-widest leading-loose max-w-xs">
            {error}
          </p>
        </div>
        <Button
          onClick={fetchWeather}
          variant="outline"
          className="rounded-full px-8"
        >
          RETRY SYNC
        </Button>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto">
      <Card className="overflow-hidden bg-white rounded-[4rem] shadow-2xl border-none p-12 flex flex-col gap-12">
        {/* Header with Location & Refresh */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center shadow-inner">
              <Navigation className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-400 mb-0.5">
                Live Coordinates
              </p>
              <h4 className="text-lg font-black text-primary-900 italic tracking-tight">
                Field Sector Sync Active
              </h4>
            </div>
          </div>
          <button
            onClick={fetchWeather}
            className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-500 hover:text-white transition-all hover:rotate-180 duration-700 shadow-sm"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        {/* Main Weather Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center gap-10">
            <div className="relative">
              {getWeatherIcon(weather?.condition || "")}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Activity className="w-4 h-4 text-medical-green" />
              </div>
            </div>
            <div>
              <p className="text-8xl font-black text-primary-900 tracking-tighter italic leading-none">
                {weather?.temperature}
              </p>
              <p className="text-lg font-black uppercase tracking-[0.3em] text-primary-400 mt-4 px-1">
                {weather?.condition}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-medical-bg/30 rounded-[2.5rem] border border-primary-50 group hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">
                  Humidity
                </span>
              </div>
              <p className="text-3xl font-black text-primary-900">
                {weather?.humidity}
              </p>
            </div>
            <div className="p-8 bg-medical-bg/30 rounded-[2.5rem] border border-primary-50 group hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">
                  Wind
                </span>
              </div>
              <p className="text-3xl font-black text-primary-900">
                {weather?.wind_speed}
              </p>
            </div>
          </div>
        </div>

        {/* Advice Box */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-medical-green rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative p-10 bg-primary-50/30 border border-white rounded-[3rem] flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl flex-shrink-0 animate-bounce-slow">
              <Heart className="w-10 h-10 text-medical-green" />
            </div>
            <div className="text-center md:text-left flex-1">
              <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.2em] mb-2">
                Agricultural Protocol Advice
              </p>
              <p className="text-3xl font-black text-primary-900 leading-tight italic tracking-tight">
                "{weather?.advice}"
              </p>
            </div>
            <button
              onClick={playAdvice}
              disabled={isSpeaking}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isSpeaking ? "bg-medical-green text-white animate-pulse" : "bg-white text-primary-500 hover:bg-primary-500 hover:text-white"}`}
            >
              <Volume2
                className={`w-8 h-8 ${isSpeaking ? "animate-bounce" : ""}`}
              />
            </button>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherWidget;
