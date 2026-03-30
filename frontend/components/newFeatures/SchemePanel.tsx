"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ExternalLink,
  Info,
  Search,
  Loader2,
  ChevronRight,
  Filter,
  Users,
  Briefcase,
  MapPin,
  AlertCircle,
  Target,
  Activity,
  PiggyBank,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/utils/api";

const SchemePanel: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [farmerType, setFarmerType] = useState("small");
  const [state, setState] = useState("Gujarat");
  const [error, setError] = useState<string | null>(null);

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getSchemes({
        state,
        farmer_type: farmerType,
      });
      setData(result);
    } catch (err) {
      setError("Failed to synchronize with Government Scheme Database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [farmerType, state]);

  const Section = ({ title, icon: Icon, schemes, color }: any) => {
    if (!schemes || schemes.length === 0) return null;

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-4">
          <div
            className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-${color}-100`}
          >
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-primary-900 italic tracking-tight">
              {title}
            </h3>
            <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest leading-none mt-1">
              Found {schemes.length} Available Protocols
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {schemes.map((scheme: any, i: number) => (
            <Card
              key={i}
              className="group relative overflow-hidden bg-white rounded-[3rem] border-none shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 p-10 flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-7 h-7 text-primary-600`} />
                </div>
                <div className="px-3 py-1 bg-medical-bg rounded-lg text-[9px] font-black text-primary-400 uppercase tracking-widest shadow-sm">
                  {scheme.state}
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <h5 className="text-xl font-black text-primary-900 italic tracking-tight leading-snug group-hover:text-primary-600 transition-colors">
                  {scheme.name}
                </h5>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-medical-green rounded-full shadow-lg shadow-medical-green/50"></div>
                  <p className="text-[11px] font-black text-medical-green uppercase tracking-[0.2em]">
                    {scheme.benefit}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-medical-bg/40 rounded-2xl border border-primary-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3 h-3 text-primary-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-400">
                      Eligibility & Description
                    </span>
                  </div>
                  <p className="text-xs font-bold text-medical-textSecondary leading-relaxed italic">
                    {scheme.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-primary-100/50">
                    <p className="text-[9px] font-black text-primary-300 uppercase italic">
                      Requirement:{" "}
                      <span className="text-primary-900">
                        {scheme.eligibility}
                      </span>
                    </p>
                  </div>
                </div>

                <a
                  href={scheme.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full rounded-2xl h-14 bg-primary-50 text-primary-900 hover:bg-primary-900 hover:text-white transition-all group/btn shadow-sm">
                    <span className="text-xs font-black italic tracking-widest uppercase">
                      LAUNCH APPLICATION
                    </span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-20">
      {/* Filter Navigation */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg">
            <Filter className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-black text-primary-900 italic tracking-tight uppercase leading-none">
              Intelligence Synthesis
            </h4>
            <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mt-1">
              Multi-Category Filtering Active
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-xl border border-medical-border">
          <select
            value={farmerType}
            onChange={(e) => setFarmerType(e.target.value)}
            className="bg-transparent border-none font-bold text-sm text-primary-900 focus:ring-0 px-4 cursor-pointer"
          >
            <option value="small">Small Farmer</option>
            <option value="medium">Medium Farmer</option>
            <option value="large">Large Farmer</option>
          </select>
          <div className="w-px h-6 bg-medical-border self-center"></div>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="bg-transparent border-none font-bold text-sm text-primary-900 focus:ring-0 px-4 cursor-pointer"
          >
            <option value="Gujarat">Gujarat State</option>
            <option value="National">National Protocols</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
          <p className="font-black text-primary-900 italic uppercase tracking-[0.4em] animate-pulse">
            Synchronizing Data Vault...
          </p>
        </div>
      ) : error ? (
        <Card className="p-16 bg-medical-error/5 text-center flex flex-col items-center gap-6 rounded-[3rem] border-2 border-dashed border-medical-error/20">
          <AlertCircle className="w-12 h-12 text-medical-error" />
          <p className="font-black text-primary-900 italic text-xl uppercase tracking-widest leading-none">
            {error}
          </p>
        </Card>
      ) : (
        <div className="space-y-24">
          {/* Summary Card */}
          {data?.summary && (
            <div className="px-4">
              <div className="p-10 bg-gradient-to-br from-primary-900 to-primary-800 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-300 italic opacity-80">
                      Personalized Support Summary
                    </p>
                    <h3 className="text-3xl font-black italic tracking-tighter leading-none">
                      {data.summary.recommendation}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-primary-300">
                        Total Eligibility
                      </p>
                      <p className="text-3xl font-black italic">
                        {data.summary.total_schemes} Programs
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white text-primary-900 rounded-2xl flex items-center justify-center shadow-xl">
                      <Target className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                <Activity className="absolute -right-10 -bottom-10 w-64 h-64 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000" />
              </div>
            </div>
          )}

          <Section
            title="💰 Subsidies for Farmers"
            icon={PiggyBank}
            schemes={data?.subsidies}
            color="blue"
          />

          <Section
            title="🌾 Crop Insurance"
            icon={ShieldCheck}
            schemes={data?.insurance}
            color="green"
          />

          <Section
            title="🏦 Financial Support"
            icon={Briefcase}
            schemes={data?.financial_help}
            color="purple"
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && data?.message && (
        <div className="text-center py-20 opacity-30">
          <Search className="w-16 h-16 mx-auto mb-6 text-primary-900" />
          <p className="font-black text-primary-900 italic uppercase tracking-[0.4em]">
            {data.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default SchemePanel;
