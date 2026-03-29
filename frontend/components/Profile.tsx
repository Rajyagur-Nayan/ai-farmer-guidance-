"use client";

import React, { useState, useEffect } from 'react';
import { User, Weight, Calendar, Activity, Save, Loader2, CheckCircle, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';

interface ProfileData {
  age: number | string;
  gender: string;
  weight: number | string;
  health_info: string;
}

const Profile: React.FC = () => {
  const [data, setData] = useState<ProfileData>({
    age: '',
    gender: '',
    weight: '',
    health_info: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await apiService.getProfile();
        setData({
          age: profile.age || '',
          gender: profile.gender || '',
          weight: profile.weight || '',
          health_info: profile.health_info || '',
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await apiService.updateProfile({
        age: data.age ? parseInt(data.age.toString()) : null,
        gender: data.gender,
        weight: data.weight ? parseFloat(data.weight.toString()) : null,
        health_info: data.health_info,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-900">Synchronizing Health Identity...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <Card className="bg-white border-none rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-primary-500/5 relative overflow-hidden">
        {/* Visual Decoration Overlay */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
            <HeartPulse className="w-64 h-64 text-primary-900" />
        </div>

        <form onSubmit={handleSave} className="space-y-10 relative z-10">
          <div className="flex items-center gap-6 mb-8 px-2">
            <div className="w-16 h-16 bg-primary-500 rounded-3xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <User className="text-white w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-primary-900 italic tracking-tight leading-none uppercase origin-left">Profile Bio-Log</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mt-2">Matrix Synchronization Active</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 ml-4 italic">Age Index (Years)</label>
              <div className="relative group">
                <Input 
                  type="number" 
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                  placeholder="25"
                  className="bg-medical-bg border-none rounded-[1.5rem] py-7 pl-14 font-black text-primary-900 focus:bg-white focus:ring-8 focus:ring-primary-500/5 transition-all text-lg placeholder:text-primary-100 italic"
                />
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-200 group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 ml-4 italic">Biological Gender</label>
              <div className="relative group">
                <select 
                  value={data.gender}
                  onChange={(e) => setData({ ...data, gender: e.target.value })}
                  className="w-full bg-medical-bg border-none rounded-[1.5rem] py-5 px-14 font-black text-primary-900 appearance-none focus:bg-white focus:outline-none focus:ring-8 focus:ring-primary-500/5 transition-all text-lg shadow-inner italic"
                >
                  <option value="">Select Protocol</option>
                  <option value="Male">Protocol MALE</option>
                  <option value="Female">Protocol FEMALE</option>
                  <option value="Other">Protocol OTHER</option>
                </select>
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-200 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
                <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-200 rotate-90" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 ml-4 italic">Bio-Mass Index (KG)</label>
              <div className="relative group">
                <Input 
                  type="number" 
                  step="0.1"
                  value={data.weight}
                  onChange={(e) => setData({ ...data, weight: e.target.value })}
                  placeholder="70.5"
                  className="bg-medical-bg border-none rounded-[1.5rem] py-7 pl-14 font-black text-primary-900 focus:bg-white transition-all text-lg italic"
                />
                <Weight className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-200 group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 ml-4 italic">Clinical Vitals Code</label>
              <div className="relative group">
                <Input 
                  placeholder="e.g. O+ POSITIVE"
                  className="bg-medical-bg border-none rounded-[1.5rem] py-7 pl-14 font-black text-primary-900 focus:bg-white transition-all text-lg italic uppercase"
                />
                <Activity className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-200 group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 ml-4 italic">Biological Summary Core</label>
            <textarea 
              value={data.health_info}
              onChange={(e) => setData({ ...data, health_info: e.target.value })}
              placeholder="Allergies, chronic biological patterns, or active medication protocols..."
              className="w-full bg-medical-bg border-none rounded-[2.5rem] p-10 font-bold text-primary-900 min-h-[160px] focus:bg-white focus:outline-none focus:ring-8 focus:ring-primary-500/5 transition-all text-lg placeholder:text-primary-100 shadow-inner italic leading-relaxed"
            />
          </div>

          <Button 
            type="submit" 
            disabled={saving}
            size="xl"
            className={`w-full group overflow-hidden relative shadow-2xl flex items-center justify-center gap-4
              ${success ? 'bg-medical-green' : 'bg-primary-900 shadow-primary-900/10'}
            `}
          >
            {saving ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : success ? (
              <>
                <CheckCircle className="w-7 h-7 animate-in zoom-in duration-300" />
                <span>PROTOCOL UPDATED • OK</span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <Save className="w-7 h-7" />
                    <span>SYNC IDENTITY LOG</span>
                </div>
                <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="mt-16 text-center opacity-10">
          <p className="text-[10px] font-black uppercase tracking-[1em] text-primary-900 italic">Advanced Health Identity storage Protocol v4.0.1 • Matrix Encrypted (AES-256)</p>
      </div>
    </div>
  );
};

export default Profile;
