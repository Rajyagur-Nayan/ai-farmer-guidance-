"use client";

import React from "react";
import {
  Home,
  Users,
  MessageSquare,
  User,
  Activity,
  MapPin,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Agent", icon: Brain, path: "/ai-agent" },
    { name: "Voice", icon: MapPin, path: "/voice" },
    { name: "AI Chat", icon: MessageSquare, path: "/chat" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-medical-border lg:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-95 ${isActive ? "text-primary-500" : "text-medical-textSecondary hover:text-primary-400"}`}
            >
              <div
                className={`relative p-1 rounded-xl transition-colors ${isActive ? "bg-primary-50" : "bg-transparent"}`}
              >
                <item.icon className="w-6 h-6" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-sm shadow-primary-500"></span>
                )}
              </div>
              <span
                className={`text-sm font-semibold uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
