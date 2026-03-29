"use client";

import React from 'react';
import { Menu, Activity, Bell, Search, User } from 'lucide-react';
import Link from 'next/link';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-medical-border lg:hidden animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-medical-textSecondary hover:bg-primary-50 hover:text-primary-500 transition-colors active:scale-95"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-primary-900 tracking-tight text-lg">Smart Farmer AI</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl text-medical-textSecondary hover:bg-primary-50 hover:text-primary-500 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-medical-textSecondary hover:bg-primary-50 hover:text-primary-500 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emergency rounded-full"></span>
          </button>
          <Link href="/profile" className="ml-1">
            <div className="w-9 h-9 rounded-full bg-primary-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-600">
              <User className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
