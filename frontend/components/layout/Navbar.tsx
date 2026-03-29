"use client";

import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-healthcare-100 px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-healthcare-50 transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6 text-healthcare-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-healthcare-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-healthcare-700 to-healthcare-500 bg-clip-text text-transparent">
              Smart Farmer AI
            </h1>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-healthcare-400" />
            </span>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-healthcare-200 rounded-xl bg-healthcare-50/50 focus:ring-healthcare-500 focus:border-healthcare-500 text-sm transition-all" 
              placeholder="Search crops, advice..." 
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-healthcare-50 text-healthcare-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-[1px] bg-healthcare-100 hidden sm:block mx-1"></div>
          <button className="flex items-center gap-2 p-1.5 px-3 rounded-full hover:bg-healthcare-50 transition-colors border border-healthcare-100">
            <div className="w-7 h-7 bg-healthcare-100 rounded-full flex items-center justify-center text-healthcare-600">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-healthcare-700 hidden sm:block">Farmer Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
