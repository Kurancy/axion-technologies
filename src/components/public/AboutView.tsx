import React from 'react';
import { Target, Compass, Cpu, Eye, CheckCircle2, ShieldCheck, MapPin, Globe, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onContactUs: () => void;
  onOpenChat: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onContactUs, onOpenChat }) => {
  return (
    <div id="about-page-container" className="py-16 bg-[#07101F] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#46DCDC] uppercase tracking-widest bg-[#0F1D32] px-3 py-1 rounded-full border border-slate-800">
            About Axion Technologies
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Engineering Practical Intelligence.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            We are a serious, modern enterprise technology company focused on building software that solves tangible business challenges across Africa, the Middle East, and global markets.
          </p>
        </div>

        {/* Core Philosophy Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0F1D32] via-[#0D2547] to-[#0F1D32] border border-[#2D96FF]/40 p-8 sm:p-12 text-center shadow-2xl space-y-3">
          <span className="text-xs font-bold text-[#46DCDC] uppercase tracking-widest">
            Our Engineering Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            "Start with the problem. Build the right solution. Measure the value. Scale intelligently."
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto pt-2 font-medium">
            We reject technology for the sake of technology. Every system we architect is mathematically tied to reducing operational cost, speeding up transaction velocity, and eliminating human error.
          </p>
        </div>

        {/* 4 Pillars: Who We Are, Our Mission, Our Approach, Our Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Who We Are */}
          <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#07101F] text-[#2D96FF] border border-slate-800">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Who We Are</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Axion Technologies is an agile, disciplined enterprise software organization specializing in AI agents, ERP & SAP integrations, Warehouse Management Systems (Axion WMS), and custom business platforms. We operate primarily in Nigeria, Saudi Arabia, and international technology hubs.
            </p>
          </div>

          {/* Our Mission */}
          <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#07101F] text-[#46DCDC] border border-slate-800">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To dismantle operational friction by engineering reliable, connected, and automated digital architectures that give business executives immediate visibility, deterministic control, and scalable execution capacity.
            </p>
          </div>

          {/* Our Approach */}
          <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#07101F] text-blue-400 border border-slate-800">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Approach</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We begin on the warehouse floor, in the accounting office, and at the dispatch desk. We map the exact points where time, revenue, or documents are lost, build robust software directly around those workflows, test rigorously in production, and deliver long-term SLA maintenance.
            </p>
          </div>

          {/* Our Vision */}
          <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#07101F] text-cyan-300 border border-slate-800">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              To be the premier enterprise systems partner for high-growth industrial, logistics, and corporate enterprises across the Global South and international markets, renowned for unflinching technical precision and pragmatic business results.
            </p>
          </div>
        </div>

        {/* Global Hubs / Market Presence */}
        <div className="rounded-2xl bg-[#0F1D32]/60 border border-slate-800 p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Global Engineering & Client Hubs</h3>
              <p className="text-xs text-slate-400">Serving commercial and industrial leaders across regions</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800">
              <Globe className="w-3.5 h-3.5" />
              <span>Multi-Region Support Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#07101F] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <MapPin className="w-4 h-4 text-[#2D96FF]" />
                <span>Nigeria & West Africa</span>
              </div>
              <p className="text-xs text-slate-400">
                Victoria Island, Lagos. Focused on WMS, FMCG distribution, SAP Business One, and payment/customs integrations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#07101F] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <MapPin className="w-4 h-4 text-[#46DCDC]" />
                <span>Saudi Arabia & GCC</span>
              </div>
              <p className="text-xs text-slate-400">
                King Fahd Road, Riyadh. Focused on manufacturing telemetry, bilingual Arabic AI/OCR, and ZATCA ERP compliance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#07101F] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>International & UK</span>
              </div>
              <p className="text-xs text-slate-400">
                City Road, London. Providing engineering governance, cloud microservices architecture, and 24/7 client SLA coverage.
              </p>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-[#07101F] border border-slate-800">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Ready to discuss your enterprise operations?</h3>
            <p className="text-xs text-slate-400">Speak directly with an Axion Solutions Director or explore our automated knowledge assistant.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenChat}
              className="px-4 py-2.5 rounded-lg bg-[#0F1D32] hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold transition-all"
            >
              Talk to Axion AI
            </button>
            <button
              onClick={onContactUs}
              className="px-5 py-2.5 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
