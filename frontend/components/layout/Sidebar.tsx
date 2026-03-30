"use client";

import React from "react";
import {
  Home,
  MessageSquare,
  X,
  MapPin,
  User,
  Pill,
  Camera,
  Stethoscope,
  Activity,
  ChevronRight,
  Mic,
  TrendingUp,
  CloudRain,
  Briefcase,
  ShoppingCart,
  PiggyBank,
  ShieldCheck,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SidebarVoiceAssistant from "./SidebarVoiceAssistant";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Farmer Home", icon: Home, path: "/" },
    { name: "Voice Assistant", icon: Mic, path: "/voice" },
    { name: "AI Advisory Chat", icon: MessageSquare, path: "/chat" },
    { name: "Crop Image Analysis", icon: Camera, path: "/diagnosis" },
    { name: "Market Intelligence", icon: TrendingUp, path: "/market" },
    { name: "Weather Protocol", icon: CloudRain, path: "/weather" },
    { name: "Smart Money Advisor", icon: PiggyBank, path: "/farmer-tools" },
    { name: "Government Schemes", icon: ShieldCheck, path: "/gov-schemes" },
    { name: "Farmer Marketplace", icon: ShoppingCart, path: "/marketplace" },
    { name: "Live Mandi Locator", icon: MapIcon, path: "/live-location" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary-900/20 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-[70] h-full w-72 bg-white border-r border-medical-border transition-all duration-500 ease-in-out shadow-lg lg:shadow-none
          ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0 opacity-100"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Branding Header */}
          <div className="p-8 pb-10">
            <div className="flex items-center justify-between mb-2">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-primary-500/20">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-primary-900 tracking-tight text-xl leading-none">
                    Smart Farmer AI
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400 mt-1">
                    Your Digital Farming Assistant
                  </span>
                </div>
              </Link>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl hover:bg-primary-50 text-medical-textSecondary lg:hidden active:scale-90 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`
                    flex items-center justify-between px-5 py-4 rounded-2xl text-[13px] font-bold transition-all group
                    ${
                      isActive
                        ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                        : "text-medical-textSecondary hover:bg-primary-50/50 hover:text-primary-500"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-white" : "text-primary-200 group-hover:text-primary-500 group-hover:scale-110"}`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-white/50" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
