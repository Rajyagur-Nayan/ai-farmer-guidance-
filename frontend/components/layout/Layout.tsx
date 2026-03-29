"use client";

import React, { useState, useEffect } from 'react';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import Sidebar from './Sidebar';
import OfflineIndicator from '@/components/OfflineIndicator';

const Layout = ({ 
  children, 
  fullWidth = false,
  noPadding = false 
}: { 
  children: React.ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-medical-bg flex font-sans selection:bg-primary-500/20 selection:text-primary-900">
      {/* Global Offline Alerts */}
      <OfflineIndicator />
      
      {/* Desktop Sidebar (Fixed) & Mobile Drawer */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Viewport */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-500">
        
        {/* Mobile-Only Header */}
        <MobileHeader toggleSidebar={toggleSidebar} />
        
        {/* Scrollable Content Area */}
        <main className={`flex-1 ${!noPadding ? 'pt-16 pb-24 lg:pt-0 lg:pb-0' : ''}`}>
          <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'} ${!noPadding ? 'space-y-10' : ''}`}>
            {children}
          </div>
        </main>
        
        {/* Mobile-Only Bottom Navigation */}
        <MobileBottomNav />

        {/* Desktop-Only Footer (Simple) */}
        <footer className="hidden lg:block border-t border-medical-border bg-white py-6 px-8 text-left">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm text-medical-textSecondary font-semibold uppercase tracking-[0.2em]">
                © 2026 Rural AI Health • Clinical Bio-Protocol 1.0.4
            </p>
            <div className="flex items-center gap-4">
                <span className="w-2 h-2 bg-medical-green rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-400">System Secure</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
