"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Database, ChevronRight, Calendar, Search, Filter, Loader2, Trash2, Sprout } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';

interface HistoryItem {
  id: number;
  title: string;
  content: string;
  category: string;
  timestamp: string;
}

const History: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiService.getHistory();
        setHistoryItems(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
              <Loader2 className="w-10 h-10 animate-spin text-primary-900" />
              <p className="text-sm font-semibold uppercase tracking-[0.4em]">Synchronizing Records</p>
          </div>
      );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-white p-6 rounded-2xl border border-zinc-50 shadow-sm shadow-zinc-100/50">
        <div className="relative w-full sm:w-96 group">
          <Input 
            placeholder="Search farm records..." 
            className="pl-12 h-14 bg-zinc-50 border-zinc-100 rounded-2xl font-semibold text-sm placeholder: focus:bg-white transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 pointer-events-none group-focus-within:text-primary-900 transition-colors" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none h-14 px-8 bg-primary-600 text-white hover:bg-zinc-800 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-xl shadow-zinc-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
            </Button>
            <Button variant="outline" className="h-14 w-14 border-zinc-100 rounded-2xl flex items-center justify-center hover:bg-zinc-50 transition-colors">
                <Trash2 className="w-5 h-5 text-zinc-300 hover:text-red-500" />
            </Button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyItems.map((item) => (
          <Card 
            key={item.id}
            onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
            className={`
              transition-all cursor-pointer group rounded-2xl p-0 overflow-hidden border-zinc-100 shadow-xl shadow-zinc-100/30
              ${selectedId === item.id 
                ? 'border-black ring-8 ring-zinc-50' 
                : 'hover:border-black/10'}
            `}
          >
            <div className={`p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${selectedId === item.id ? "bg-zinc-50/50" : "bg-white"}`}>
              <div className="flex items-center gap-6 flex-1">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border-2
                  ${item.category === 'Consultation' ? 'bg-primary-600 border-black text-white' : 'bg-white border-zinc-100 text-primary-900'}
                `}>
                  <Sprout className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h4 className="font-semibold text-primary-900 tracking-tight text-lg">{item.title}</h4>
                    <span className={`
                      text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest
                      ${item.category === 'Consultation' ? 'bg-zinc-100 text-primary-900' : 'bg-white text-zinc-400 border border-zinc-100'}
                    `}>
                      {item.category === 'Consultation' ? 'Advisory Session' : item.category}
                    </span>
                  </div>
                  <p className="text-zinc-500 font-bold text-xs truncate max-w-sm  opacity-50">{item.content.split('\n')[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t border-zinc-50 md:border-none pt-4 md:pt-0">
                <div className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(item.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-900 text-sm font-semibold uppercase tracking-widest bg-zinc-100 px-3 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </div>

              <ChevronRight className={`hidden md:block w-8 h-8 text-zinc-200 transition-transform ${selectedId === item.id ? 'rotate-90 text-primary-900' : 'group-hover:translate-x-1 group-hover:text-primary-900'}`} />
            </div>

            {/* Expandable Details */}
            {selectedId === item.id && (
              <div className="px-8 pb-8 pt-0 animate-in slide-in-from-top-2 duration-500 bg-zinc-50/50">
                <div className="h-px bg-zinc-100 w-full mb-6" />
                <div className="bg-white rounded-3xl p-8 space-y-6 shadow-inner border border-zinc-100">
                  <div className="flex items-center justify-between">
                      <h5 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-300">Detailed Transcript</h5>
                      <span className="text-xs font-semibold text-zinc-200">ID: LOG-{item.id}</span>
                  </div>
                  <p className="text-primary-900 text-sm leading-relaxed font-bold whitespace-pre-wrap">
                    {item.content}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-zinc-50">
                    <Button variant="outline" className="flex-1 sm:flex-none border-zinc-100 rounded-xl font-semibold text-sm uppercase tracking-widest hover:bg-zinc-50 py-6">Export PDF</Button>
                    <Button className="flex-1 sm:flex-none bg-primary-600 text-white hover:bg-zinc-900 rounded-xl font-semibold text-sm uppercase tracking-widest py-6 shadow-xl shadow-zinc-100 text-xs">Share With Expert</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {historyItems.length === 0 && (
        <div className="text-center py-32 bg-white rounded-3xl border-4 border-dashed border-zinc-50 animate-in zoom-in-95 duration-700">
          <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-zinc-100">
            <Clock className="w-10 h-10 text-zinc-200" />
          </div>
          <h4 className="text-primary-900 font-semibold text-xl mb-1 ">No Records Found</h4>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest px-8">Activity log is currently empty. Start a chat or analysis to begin.</p>
        </div>
      )}

      <div className="pt-16 text-center opacity-10">
          <p className="text-xs font-semibold uppercase tracking-[1em] text-primary-900">Agricultural Activity Log v4.0</p>
      </div>
    </div>
  );
};

export default History;
