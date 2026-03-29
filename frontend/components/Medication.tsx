"use client";

import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Clock, 
  Plus, 
  Bell, 
  BellOff, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Calendar,
  ChevronRight,
  Activity,
  HeartPulse
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';
import { useReminders } from '@/hooks/useReminders';

const Medication: React.FC = () => {
  const [query, setQuery] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { reminders, addReminder, toggleReminder, deleteReminder } = useReminders();
  
  // New reminder form
  const [medName, setMedName] = useState("");
  const [medTime, setMedTime] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleGetAdvice = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAdvice(null);
    try {
      const data = await apiService.getMedicationAdvice(query);
      setAdvice(data.response);
    } catch (err) {
      console.error(err);
      setAdvice("Medical Matrix synchronization fault. Please consult a licensed provider.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (medName.trim() && medTime) {
      addReminder(medName, medTime);
      setMedName("");
      setMedTime("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* AI Medication Advisor Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Search className="text-white w-6 h-6" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-primary-900 italic tracking-tight leading-none">Diagnostic Sync 🧠</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mt-1">OTC Biological Advisor</p>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
                <Input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe symptoms or query (e.g. Headache, Fever)..."
                    className="bg-medical-bg border-none rounded-2xl py-8 pl-12 font-bold text-primary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 transition-all placeholder:text-medical-textSecondary/40 shadow-inner"
                    onKeyPress={(e) => e.key === 'Enter' && handleGetAdvice()}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-200 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
            </div>
            <Button 
                onClick={handleGetAdvice}
                disabled={loading || !query.trim()}
                size="xl"
                className="shadow-2xl shadow-primary-500/10"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "SEEK ADVICE"}
            </Button>
        </div>

        {advice && (
            <Card 
                accent="blue"
                className="bg-white p-10 rounded-[3rem] shadow-2xl border-none animate-in zoom-in-95 duration-700 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Pill className="w-48 h-48 text-primary-900" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                        <HeartPulse className="w-5 h-5 text-primary-600" />
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-900 italic">Verified OTC Protocol</h4>
                </div>
                <div className="text-primary-900 font-bold leading-relaxed whitespace-pre-wrap text-lg italic pr-12">
                    {advice}
                </div>
                <div className="mt-8 pt-8 border-t border-medical-border flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary-300 uppercase tracking-widest">Advisory Status: SYNCHRONIZED</span>
                    <Activity className="w-4 h-4 text-medical-green animate-pulse" />
                </div>
            </Card>
        )}
      </section>

      {/* Medication Reminders Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100">
                    <Clock className="text-primary-500 w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-primary-900 italic tracking-tight leading-none">Schedule 🔔</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mt-1">Bio-Temporal adherence</p>
                </div>
            </div>
            <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`w-14 h-14 rounded-2xl shadow-xl transition-all ${showAddForm ? 'bg-primary-900 rotate-45' : 'bg-primary-500 shadow-primary-500/20'}`}
            >
                <Plus className="w-7 h-7" />
            </Button>
        </div>

        {showAddForm && (
            <Card className="bg-white border-none p-10 rounded-[3rem] shadow-2xl animate-in slide-in-from-top-6 duration-500 border-l-8 border-l-primary-500">
                <form onSubmit={handleAddReminder} className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="flex-1 space-y-3 w-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 ml-2">Medication ID</label>
                        <Input 
                            value={medName}
                            onChange={(e) => setMedName(e.target.value)}
                            placeholder="e.g. Paracetamol 500mg"
                            className="bg-medical-bg border-none rounded-2xl py-7 font-black text-primary-900"
                        />
                    </div>
                    <div className="w-full md:w-64 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 ml-2">Sync Time</label>
                        <Input 
                            type="time"
                            value={medTime}
                            onChange={(e) => setMedTime(e.target.value)}
                            className="bg-medical-bg border-none rounded-2xl py-7 font-black text-primary-900"
                        />
                    </div>
                    <Button type="submit" size="xl" className="w-full md:w-auto h-[60px] shadow-xl shadow-primary-500/20">
                        ADD TO LOG
                    </Button>
                </form>
            </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reminders.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-medical-bg rounded-[3rem] border-4 border-dashed border-medical-border opacity-40 grayscale group hover:grayscale-0 transition-all">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-medical-border">
                        <BellOff className="w-8 h-8 text-primary-900" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-900 italic">No Active Adherence Logs</p>
                </div>
            ) : (
                reminders.map((r) => (
                    <Card 
                        key={r.id} 
                        hoverable={true}
                        className={`
                            p-8 rounded-[2.5rem] border-none transition-all flex items-center justify-between group
                            ${r.isActive ? 'bg-white shadow-xl shadow-primary-500/5' : 'bg-medical-bg opacity-40'}
                        `}
                    >
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => toggleReminder(r.id)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${r.isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 group-hover:scale-105' : 'bg-primary-50 text-primary-200 hover:text-primary-500'}`}
                            >
                                {r.isActive ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
                            </button>
                            <div className="space-y-1">
                                <h4 className="font-black text-primary-900 text-xl italic tracking-tight leading-none group-hover:text-primary-500 transition-colors uppercase">{r.medicineName}</h4>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-primary-200" />
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest leading-none">{r.time}</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => deleteReminder(r.id)}
                            className="w-12 h-12 text-primary-100 hover:text-medical-error hover:bg-medical-error/5 rounded-2xl transition-all flex items-center justify-center group/del"
                        >
                            <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                        </button>
                    </Card>
                ))
            )}
        </div>
      </section>

      <div className="pt-20 text-center opacity-10">
          <p className="text-[9px] font-black uppercase tracking-[1em] text-primary-900 italic">Medication Protocol Module • Clinical adherence 1.0.4</p>
      </div>
    </div>
  );
};

export default Medication;
