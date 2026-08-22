import React, { useState, useEffect } from 'react';
import { History, Search, Download, Trash2, Eye, Bot, User, Shield, ArrowRight } from 'lucide-react';
import type { Conversation, ChatMessage } from '../../types/index.js';
import { getAdminConversations, getAdminConversation } from '../../lib/api.js';

interface AdminConversationsProps {
  onOpenInLiveChat: (convId: string) => void;
}

export const AdminConversations: React.FC<AdminConversationsProps> = ({ onOpenInLiveChat }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getAdminConversations();
        setConversations(res.conversations || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAll();
  }, []);

  const handleSelectConv = async (conv: Conversation) => {
    setSelectedConv(conv);
    try {
      const res = await getAdminConversation(conv.id);
      setMessages(res.messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = conversations.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        c.visitorName?.toLowerCase().includes(q) ||
        c.visitorCompany?.toLowerCase().includes(q) ||
        c.visitorEmail?.toLowerCase().includes(q) ||
        c.lastMessagePreview?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Conversations Archive & Audit Logs</h2>
          <p className="text-xs text-slate-400">Review full transcripts between visitors, Axion AI, and operators.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search transcripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#0F1D32] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#0F1D32] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#2D96FF]"
          >
            <option value="all">All Statuses</option>
            <option value="ai_active">AI Active</option>
            <option value="human_requested">Human Requested</option>
            <option value="human_active">Human Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Table / List */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No transcripts found matching criteria</div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectConv(c)}
                  className={`p-4 cursor-pointer hover:bg-slate-800/40 transition-colors space-y-2 ${
                    selectedConv?.id === c.id ? 'bg-[#2D96FF]/15 border-l-4 border-[#2D96FF]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {c.visitorName || `Visitor #${c.visitorId.slice(-4)}`}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(c.updatedAt).toLocaleDateString()} {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {c.lastMessagePreview || 'Empty session'}
                  </p>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#07101F] text-slate-300 border border-slate-800">
                      {c.status.toUpperCase()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenInLiveChat(c.id);
                      }}
                      className="text-xs text-[#46DCDC] hover:underline flex items-center gap-1"
                    >
                      <span>Open in Live Room</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Transcript Viewer */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 flex flex-col justify-between h-[600px] shadow-xl">
          {selectedConv ? (
            <>
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Transcript: {selectedConv.visitorName || `Visitor #${selectedConv.visitorId.slice(-4)}`}
                  </h3>
                  <p className="text-xs text-slate-400">Session ID: {selectedConv.id}</p>
                </div>
                <button
                  onClick={() => onOpenInLiveChat(selectedConv.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#2D96FF] text-white text-xs font-bold hover:bg-[#1D86EF]"
                >
                  Live Takeover
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
                {messages.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="font-bold text-[#46DCDC]">{m.senderName} ({m.senderRole})</span>
                      <span>{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                ))}
              </div>

              {selectedConv.internalNotes && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-white">Internal Operator Note:</span> {selectedConv.internalNotes}
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-xs text-slate-500">
              Select a conversation to read the complete audit transcript.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
