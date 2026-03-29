"use client";

import React, { useEffect, useState } from 'react';
import { WifiOff, AlertTriangle, RefreshCw, ShieldAlert, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { syncManager } from '@/utils/syncManager';
import { apiService } from '@/utils/api';

const OfflineIndicator: React.FC = () => {
    const isOnline = useOnlineStatus();
    const [isVisible, setIsVisible] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setIsVisible(true);
            setWasOffline(true);
        } else if (isOnline && wasOffline) {
            // Back online - trigger sync
            syncManager.sync(apiService);
            
            // Show "Back Online" briefly
            const timer = setTimeout(() => {
                setIsVisible(false);
                setWasOffline(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, wasOffline]);

    if (!isVisible && isOnline) return null;

    return (
        <div 
            className={`
                fixed top-0 left-0 right-0 z-[60] py-3 px-6 transition-all duration-700
                ${isOnline ? 'bg-black text-white' : 'bg-black text-white border-b border-white/20'}
                animate-in slide-in-from-top-full
            `}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                        {isOnline ? (
                            <Wifi className="w-4 h-4 text-white animate-pulse" />
                        ) : (
                            <WifiOff className="w-4 h-4 text-white animate-bounce" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">
                            {isOnline ? 'Protocol Restored' : 'Offline Protocol Active'}
                        </h4>
                        <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-0.5">
                            {isOnline 
                                ? 'Synchronization engine is reconciling biological data...' 
                                : 'Network Link Severed. Request Queuing Engine is Engaged.'}
                        </p>
                    </div>
                </div>

                {!isOnline && (
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2">
                             <ShieldAlert className="w-3 h-3 text-white/40" />
                             <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Data Integrity Insured via Local Vault</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-white animate-pulse uppercase tracking-[0.2em]">Queue: {syncManager.getQueue().length} Action(s)</span>
                        </div>
                    </div>
                )}

                {isOnline && (
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfflineIndicator;
