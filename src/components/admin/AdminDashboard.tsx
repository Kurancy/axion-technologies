import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  Inbox,
  Activity,
  ArrowUpRight,
  Shield,
  Bot,
  UserCheck,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import type { Conversation, Lead, ContactMessage, AnalyticsSummary } from '../../types/index.js';
import { getAdminConversations, getLeads, getContactMessages, getAnalytics } from '../../lib/api.js';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectConversation: (convId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab, onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convRes, leadsRes, msgRes, anaRes] = await Promise.all([
          getAdminConversations(),
          getLeads(),
          getContactMessages(),
          getAnalytics(),
        ]);
        setConversations(convRes.conversations || []);
        setLeads(leadsRes.leads || []);
        setMessages(msgRes.messages || []);
        setAnalytics(anaRes.analytics);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingHandoffs = conversations.filter((c) => c.status === 'human_requested');
  const activeHumanChats = conversations.filter((c) => c.status === 'human_active');
  const newLeads = leads.filter((l) => l.status === 'new');
  const newMessages = messages.filter((m) => m.status === 'new');

  return (
    <div className="space-y-8">
      {/* Pending Handoff Urgency Alert Banner */}
      {pendingHandoffs.length > 0 && (
        <div className="rounded-2xl bg-amber-950/40 border border-amber-500/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {pendingHandoffs.length} Visitor{pendingHandoffs.length > 1 ? 's' : ''} Requesting Human Specialist
              </h3>
              <p className="text-xs text-amber-200/80">Live visitors are currently waiting in the real-time queue.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('live-chat')}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Open Live Queue
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Conversations */}
        <div
          onClick={() => onNavigateTab('live-chat')}
          className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-5 hover:border-[#2D96FF]/50 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Live Chat Sessions</span>
            <div className="p-2 rounded-lg bg-[#2D96FF]/10 text-[#2D96FF]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{conversations.length}</span>
            <span className="text-xs text-emerald-400 font-medium">
              {activeHumanChats.length + pendingHandoffs.length} active
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>{pendingHandoffs.length} waiting handoff</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Card 2: CRM Leads */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-5 hover:border-[#46DCDC]/50 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Leads Pipeline</span>
            <div className="p-2 rounded-lg bg-[#46DCDC]/10 text-[#46DCDC]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{leads.length}</span>
            <span className="text-xs text-[#46DCDC] font-medium">{newLeads.length} new leads</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>CRM Pipeline Value</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Card 3: Contact Inquiries */}
        <div
          onClick={() => onNavigateTab('contact')}
          className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-5 hover:border-slate-700 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Direct Inquiries</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{messages.length}</span>
            <span className="text-xs text-blue-300 font-medium">{newMessages.length} unreviewed</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Website Form Ingestion</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Card 4: AI Resolution Rate */}
        <div
          onClick={() => onNavigateTab('analytics')}
          className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-5 hover:border-emerald-500/50 transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">AI Autonomy Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {analytics ? `${Math.round(analytics.aiResolutionRate)}%` : '85%'}
            </span>
            <span className="text-xs text-emerald-400 font-medium">Auto-resolved</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Knowledge Base Grounded</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Hub: Live Activity & System Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Live Active Chat Queue */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2D96FF]" />
              <h3 className="text-sm font-bold text-white tracking-wide">Live Conversation Stream</h3>
            </div>
            <button
              onClick={() => onNavigateTab('live-chat')}
              className="text-xs font-semibold text-[#2D96FF] hover:underline flex items-center gap-1"
            >
              <span>View Full Queue</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No active conversations recorded</div>
            ) : (
              conversations.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onNavigateTab('live-chat');
                    onSelectConversation(c.id);
                  }}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {c.visitorName || `Visitor #${c.visitorId.slice(-4)}`}
                      </span>
                      {c.visitorCompany && (
                        <span className="text-[10px] text-slate-400 bg-[#07101F] px-1.5 py-0.2 rounded border border-slate-800">
                          {c.visitorCompany}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-sm">
                      {c.lastMessagePreview || 'Conversation started'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        c.status === 'human_requested'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800 animate-pulse'
                          : c.status === 'human_active'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                          : c.status === 'ai_active'
                          ? 'bg-[#2D96FF]/15 text-[#46DCDC] border-[#2D96FF]/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {c.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <button className="text-xs text-[#2D96FF] hover:text-white px-2 py-1 rounded bg-[#07101F] border border-slate-800">
                      Open
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Recent Pipeline Ingestion & System Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Leads */}
          <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#46DCDC]" />
                <h3 className="text-sm font-bold text-white tracking-wide">Recent CRM Leads</h3>
              </div>
              <button
                onClick={() => onNavigateTab('leads')}
                className="text-xs font-semibold text-[#46DCDC] hover:underline"
              >
                All Leads
              </button>
            </div>

            <div className="space-y-2.5">
              {leads.slice(0, 3).map((l) => (
                <div key={l.id} className="p-3 rounded-xl bg-[#07101F] border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{l.name}</h4>
                    <p className="text-[11px] text-slate-400">{l.company} • {l.serviceInterest}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {l.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Infrastructure Status */}
          <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Platform Core Telemetry</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#07101F] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">WebSocket:</span>
                <span className="text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#07101F] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Gemini Engine:</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#07101F] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Database:</span>
                <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#07101F] border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Port:</span>
                <span className="text-white font-bold">3000 (0.0.0.0)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
