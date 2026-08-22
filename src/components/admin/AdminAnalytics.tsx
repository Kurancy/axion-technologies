import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Users, MessageSquare, Zap, Target, ArrowUpRight } from 'lucide-react';
import type { AnalyticsSummary } from '../../types/index.js';
import { getAnalytics } from '../../lib/api.js';

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setAnalytics(res.analytics);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading platform analytics...</div>;
  }

  const funnel = [
    { label: 'Website Visitors', count: analytics.totalVisitors, rate: '100%' },
    { label: 'Conversations Started', count: analytics.totalConversations, rate: `${((analytics.totalConversations / Math.max(1, analytics.totalVisitors)) * 100).toFixed(1)}%` },
    { label: 'Leads Ingested', count: analytics.totalLeads, rate: `${((analytics.totalLeads / Math.max(1, analytics.totalVisitors)) * 100).toFixed(1)}%` },
    { label: 'Direct Form Messages', count: analytics.totalContactMessages, rate: `${((analytics.totalContactMessages / Math.max(1, analytics.totalVisitors)) * 100).toFixed(1)}%` },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">Platform Analytics & Intelligence</h2>
        <p className="text-xs text-slate-400">Real-time telemetry on customer engagement, AI autonomy, and conversion velocity.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">Total Unique Visitors</span>
          <p className="text-3xl font-black text-white font-mono">{analytics.totalVisitors}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High-intent B2B traffic</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">Conversations</span>
          <p className="text-3xl font-black text-[#2D96FF] font-mono">{analytics.totalConversations}</p>
          <p className="text-[11px] text-slate-400">AI + Human Handoffs</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">AI Autonomy Rate</span>
          <p className="text-3xl font-black text-emerald-400 font-mono">
            {Math.round(analytics.aiResolutionRate)}%
          </p>
          <p className="text-[11px] text-slate-400">Grounded Knowledge Hits</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">Total Ingested Leads</span>
          <p className="text-3xl font-black text-[#46DCDC] font-mono">{analytics.totalLeads}</p>
          <p className="text-[11px] text-slate-400">Across Chat & Web Forms</p>
        </div>
      </div>

      {/* Conversion Funnel & Topic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Conversion Funnel */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#2D96FF]" />
              <span>Conversion & Engagement Funnel</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">Live Telemetry</span>
          </div>

          <div className="space-y-4">
            {funnel.map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{step.label}</span>
                  <span className="font-mono text-slate-300 font-bold">
                    {step.count} ({step.rate})
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#07101F] overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#2D96FF] to-[#46DCDC] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(8, Math.min(100, (step.count / Math.max(1, analytics.totalVisitors)) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Popular Topics & Solution Inquiries */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#46DCDC]" />
            <span>Top Inquired Solutions</span>
          </h3>

          <div className="space-y-3">
            {analytics.topTopics.map((topic, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#07101F] border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{topic.topic}</span>
                <span className="text-xs font-mono text-[#46DCDC] font-bold bg-slate-900 px-2 py-0.5 rounded">
                  {topic.count} inquiries
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
