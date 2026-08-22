import React from 'react';
import { Bot, ArrowRight, Sparkles, Activity, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';
import { NetworkCanvas } from '../ui/NetworkCanvas.js';

interface HeroProps {
  onExploreSolutions: () => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreSolutions, onOpenChat }) => {
  return (
    <section id="hero-section" className="relative bg-[#07101F] overflow-hidden pt-8 pb-16 border-b border-[#0F1D32]">
      {/* Background Interactive Particle Network */}
      <NetworkCanvas density={35} height="100%" />

      {/* Subtle radial ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-br from-[#2D96FF]/15 via-[#46DCDC]/10 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Core Message & Value */}
          <div className="lg:col-span-7 space-y-6">
            {/* Market & Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0F1D32]/90 border border-[#2D96FF]/40 text-xs font-semibold text-[#46DCDC]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#46DCDC] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D96FF]"></span>
              </span>
              <span>Enterprise Systems & Automation</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-normal">Nigeria • Saudi Arabia • Global</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Engineering{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D96FF] via-[#46DCDC] to-cyan-200">
                Intelligent Business.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Axion Technologies helps businesses transform complex operations into intelligent, connected and automated systems.
            </p>

            {/* Secondary Pillar Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#2D96FF] tracking-wide pt-1">
              <span>AI</span>
              <span className="text-slate-600">•</span>
              <span>Automation</span>
              <span className="text-slate-600">•</span>
              <span>Enterprise Software</span>
              <span className="text-slate-600">•</span>
              <span>ERP & SAP</span>
              <span className="text-slate-600">•</span>
              <span>Digital Transformation</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="hero-explore-solutions-btn"
                onClick={onExploreSolutions}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#2D96FF] to-[#0284C7] hover:from-[#3B82F6] hover:to-[#0EA5E9] text-white text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(45,150,255,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Solutions</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-talk-axion-ai-btn"
                onClick={onOpenChat}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0F1D32] hover:bg-slate-800/90 border border-slate-700 hover:border-[#46DCDC]/60 text-slate-200 hover:text-white text-sm font-semibold transition-all"
              >
                <Bot className="w-4 h-4 text-[#46DCDC]" />
                <span>Talk to Axion AI</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              </button>
            </div>

            {/* Trust / Execution Signals */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#0F1D32] max-w-lg">
              <div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">100%</p>
                <p className="text-[11px] text-slate-400">Grounded Architecture</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-[#46DCDC] font-mono">&lt;350ms</p>
                <p className="text-[11px] text-slate-400">Sub-second Latency</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-[#2D96FF] font-mono">24/7</p>
                <p className="text-[11px] text-slate-400">Connected Handoff</p>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Enterprise Architecture Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-5 shadow-2xl backdrop-blur-sm">
              {/* Terminal header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-slate-400 font-mono ml-2">axion-runtime.core.sys</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Architecture Node Diagram */}
              <div className="space-y-3">
                {/* Node 1: AI Agent & OCR Hub */}
                <div className="p-3 rounded-lg bg-[#07101F]/80 border border-[#2D96FF]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-[#2D96FF]/10 text-[#2D96FF]">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Axion AI Agent Engine</h4>
                      <p className="text-[10px] text-slate-400">OCR & Document Intelligence • Workflow Autonomy</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800">
                    Active
                  </span>
                </div>

                {/* Connecting light stream indicator */}
                <div className="flex justify-center -my-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#2D96FF] to-[#46DCDC]" />
                </div>

                {/* Node 2: Axion WMS & SAP Connector */}
                <div className="p-3 rounded-lg bg-[#07101F]/80 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-[#46DCDC]/10 text-[#46DCDC]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Axion WMS & SAP Bridge</h4>
                      <p className="text-[10px] text-slate-400">SAP Business One Two-Way Sync • Handheld Scanner</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                    Synced
                  </span>
                </div>

                {/* Connecting light stream indicator */}
                <div className="flex justify-center -my-1">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-[#46DCDC] to-[#2D96FF]" />
                </div>

                {/* Node 3: Realtime Data & Human Handoff Gateway */}
                <div className="p-3 rounded-lg bg-[#07101F]/80 border border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-blue-500/10 text-blue-400">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Unified Telemetry & Live Handoff</h4>
                      <p className="text-[10px] text-slate-400">Instant Specialist Relay • Zero-Loss Context</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800">
                    Live
                  </span>
                </div>
              </div>

              {/* Bottom live event ticker */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 font-mono">
                  <Database className="w-3 h-3 text-[#2D96FF]" />
                  <span>PostgreSQL / SQLite Core</span>
                </span>
                <span className="font-mono text-slate-400">Node v22 • Express • WSS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
