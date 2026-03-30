"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  AlertCircle,
  PiggyBank,
  ArrowUpRight,
  Loader2,
  PieChart,
  Target,
  Zap,
  Activity,
  Globe,
  Wheat,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/utils/api";
import { useGeolocation } from "@/hooks/useGeolocation";

const MoneyAdvisor: React.FC = () => {
  const {
    lat,
    lon,
    loading: geoLoading,
    error: geoError,
    retry: retryGeo,
  } = useGeolocation();
  const [crop, setCrop] = useState("");
  const [landSize, setLandSize] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = async () => {
    if (!crop || !monthlyIncome) {
      setError(
        "Crop and Monthly Income are required for personalized financial strategy.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get location if possible
      const location = { lat: lat || 23.0225, lon: lon || 72.5714 }; // Default Ahmedabad if blocked

      const data = await apiService.getMoneyAdvice({
        crop,
        land_size: landSize ? parseFloat(landSize) : null,
        monthly_income: parseFloat(monthlyIncome),
        market_price: price ? parseFloat(price) : null,
        location,
      });
      setAdvice(data);
    } catch (err) {
      setError("Financial reasoning core timed out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <Card className="p-10 bg-white rounded-[3.5rem] shadow-2xl border-none">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Input Side */}
          <div className="flex-1 space-y-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-primary-900 rounded-2xl flex items-center justify-center shadow-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black text-primary-900 italic tracking-tight uppercase">
                Analyze Field Metrics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-2">
                  Current Crop Target
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cotton"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-6 bg-medical-bg/40 rounded-3xl border-none focus:ring-4 focus:ring-primary-100 font-bold transition-all text-primary-900"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-2">
                  Monthly Income (₹){" "}
                  <span className="text-medical-error">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter your income"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full p-6 bg-medical-bg/40 rounded-3xl border-none focus:ring-4 focus:ring-primary-100 font-bold transition-all text-primary-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-2">
                  Land Size (Acres - Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full p-6 bg-medical-bg/40 rounded-3xl border-none focus:ring-4 focus:ring-primary-100 font-bold transition-all text-primary-900"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-2">
                  Local Market Price (₹ - Optional)
                </label>
                <input
                  type="number"
                  placeholder="Current mandi price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-6 bg-medical-bg/40 rounded-3xl border-none focus:ring-4 focus:ring-primary-100 font-bold transition-all text-primary-900"
                />
              </div>
            </div>

            {error && (
              <div className="p-6 bg-rose-50 border-l-8 border-rose-500 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
                <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                <p className="text-rose-900 font-bold">{error}</p>
              </div>
            )}

            {/* Action Area */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button
                onClick={getAdvice}
                disabled={loading || !crop || !monthlyIncome}
                className="flex-1 bg-primary-900 hover:bg-black text-white rounded-3xl py-8 px-10 text-lg font-black italic uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin mr-3" />
                ) : (
                  <Target className="w-6 h-6 mr-3" />
                )}
                Analyze Strategy
              </Button>

              {!lat && !geoLoading && (
                <Button
                  onClick={retryGeo}
                  variant="outline"
                  className="sm:w-auto border-4 border-primary-900 text-primary-900 rounded-3xl py-8 px-10 text-lg font-black italic uppercase tracking-[0.2em] transition-all hover:bg-primary-50"
                >
                  <MapPin className="w-6 h-6 mr-3" />
                  Enable Location
                </Button>
              )}
            </div>

            {geoLoading && (
              <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest animate-pulse mt-4">
                📍 Synchronizing regional coordinates...
              </p>
            )}

            {geoError && (
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-pulse mt-4">
                ⚠️ {geoError}. Falling back to general Indian market
                intelligence.
              </p>
            )}
          </div>

          {/* Stats/Visual Side */}
          <div className="hidden lg:flex flex-1 bg-primary-50 rounded-[2.5rem] p-12 flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-400 italic">
                  Neural Protocol
                </span>
                <h2 className="text-5xl font-black text-primary-900 italic tracking-tighter leading-none">
                  SMART
                  <br />
                  LOAN-FREE
                  <br />
                  GROWTH
                </h2>
              </div>
              <p className="text-primary-800 font-bold leading-relaxed max-w-sm">
                Our AI calculates market volatility, weather shifts, and your
                financial buffer to suggest high-impact farming decisions.
              </p>
              <div className="pt-4 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-primary-50 bg-primary-200"
                    ></div>
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">
                  Trusted by 50k+ Farmers
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {advice && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-[1200ms] fill-mode-both">
          {/* Primary Directive Card */}
          <Card className="overflow-hidden border-[6px] border-primary-900 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] relative group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-40 h-40 text-primary-900" />
            </div>
            <div className="p-12 md:p-16 space-y-10 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em]">
                    <MapPin className="w-3 h-3" />
                    <span>
                      Detected Location:{" "}
                      {advice.location?.state ||
                        advice.location?.district ||
                        "India"}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-primary-400 uppercase tracking-[0.3em]">
                    Market Directive Protocol
                  </h3>
                  <p className="text-6xl md:text-8xl font-black text-primary-900 italic tracking-tighter leading-[0.85]">
                    {advice.sell_advice}
                  </p>
                </div>
                <div className="bg-primary-900 p-10 rounded-[3rem] shadow-2xl skew-x-[-2deg] max-w-xl">
                  <p className="text-xl font-bold italic text-white leading-tight">
                    "{advice.location_based_advice || advice.reason}"
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Intelligence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Next Best Crop Card */}
            <div className="group bg-white border-4 border-primary-900 p-10 rounded-[3rem] hover:bg-primary-900 transition-all duration-700 shadow-xl cursor-default">
              <div className="space-y-8">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:rotate-12 transition-all duration-500">
                  <Wheat className="w-8 h-8 text-primary-600 group-hover:text-primary-900" />
                </div>
                <div>
                  <h5 className="text-sm font-black text-primary-900 italic tracking-tight uppercase group-hover:text-white/60">
                    Next Best Crop 🌾
                  </h5>
                  <p className="text-3xl font-black text-primary-900 italic tracking-tighter leading-tight group-hover:text-white transition-all">
                    {advice.next_crop}
                  </p>
                </div>
                {advice.recommended_crops && (
                  <div className="flex flex-wrap gap-2">
                    {advice.recommended_crops.map((c: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary-50 text-primary-900 text-[10px] font-black uppercase rounded-full border border-primary-200 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Income Tips Card */}
            <div className="group bg-white border-4 border-primary-900 p-10 rounded-[3rem] shadow-xl hover:translate-y-[-8px] transition-all duration-500">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 px-2 flex items-center justify-center rounded-xl">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <h5 className="text-sm font-black text-primary-900 uppercase tracking-tight italic">
                    Optimization Tips
                  </h5>
                </div>
                <div className="space-y-4">
                  {advice.income_tips.map((tip: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start group/tip">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-primary-900 group-hover/tip:scale-150 transition-all"></div>
                      <p className="text-sm font-bold text-primary-800 italic">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment Advice Card */}
            <div className="group bg-primary-100 p-10 rounded-[3rem] shadow-xl hover:bg-black transition-all duration-700">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
                    <Globe className="w-5 h-5 text-primary-900" />
                  </div>
                  <h5 className="text-sm font-black text-primary-900 uppercase tracking-tight italic group-hover:text-white">
                    Smart Investment
                  </h5>
                </div>
                <div className="space-y-4">
                  {advice.investment_advice.map((adv: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <Zap className="w-5 h-5 text-primary-900 flex-shrink-0 group-hover:text-primary-500" />
                      <p className="text-sm font-bold text-primary-800 italic group-hover:text-white/80">
                        {adv}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyAdvisor;
