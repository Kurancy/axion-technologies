import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Shield,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  UserCheck,
  RotateCcw,
  XCircle,
  PlusCircle,
  Loader2,
  FileText,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import type { Conversation, ChatMessage, AdminUser } from '../../types/index.js';
import {
  getAdminConversations,
  getAdminConversation,
  takeOverConversation,
  returnConversationToAI,
  sendAdminReply,
  closeConversation,
  updateConversationMetadata,
  createLead,
} from '../../lib/api.js';
import { realtime } from '../../lib/ws.js';

interface AdminLiveChatProps {
  adminUser: AdminUser;
  selectedConversationId?: string;
}

export const AdminLiveChat: React.FC<AdminLiveChatProps> = ({
  adminUser,
  selectedConversationId,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(selectedConversationId || null);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [leadCreatedNotice, setLeadCreatedNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversations
  const refreshConversations = async () => {
    try {
      const res = await getAdminConversations();
      setConversations(res.conversations || []);
      if (!activeConvId && res.conversations.length > 0) {
        setActiveConvId(res.conversations[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshConversations();
  }, []);

  // Load active conversation messages when selected
  useEffect(() => {
    if (!activeConvId) return;

    const loadConv = async () => {
      try {
        const res = await getAdminConversation(activeConvId);
        setActiveConv(res.conversation);
        setMessages(res.messages || []);
        setInternalNotes(res.conversation.internalNotes || '');
      } catch (e) {
        console.error(e);
      }
    };

    loadConv();
  }, [activeConvId]);

  // Real-time updates via WebSocket
  useEffect(() => {
    const unsubNewMsg = realtime.on('new_message', (data: { message: ChatMessage; conversationId: string }) => {
      // Update message stream if current conversation
      if (data.conversationId === activeConvId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }
      // Refresh list to update previews
      refreshConversations();
    });

    const unsubHandoff = realtime.on('human_handoff_requested', () => {
      refreshConversations();
    });

    const unsubStatus = realtime.on('status_change', (data: { conversationId: string; status: any }) => {
      if (data.conversationId === activeConvId) {
        setActiveConv((prev) => (prev ? { ...prev, status: data.status } : null));
      }
      refreshConversations();
    });

    return () => {
      unsubNewMsg();
      unsubHandoff();
      unsubStatus();
    };
  }, [activeConvId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTakeOver = async () => {
    if (!activeConv) return;
    try {
      const res = await takeOverConversation(activeConv.id, adminUser.name, adminUser.id);
      setActiveConv(res.conversation);
      setMessages((prev) => [...prev, res.systemMessage]);
      refreshConversations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReturnToAI = async () => {
    if (!activeConv) return;
    try {
      const res = await returnConversationToAI(activeConv.id);
      setActiveConv(res.conversation);
      setMessages((prev) => [...prev, res.systemMessage]);
      refreshConversations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = async () => {
    if (!activeConv) return;
    try {
      const res = await closeConversation(activeConv.id);
      setActiveConv(res.conversation);
      refreshConversations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv || isSending) return;

    setIsSending(true);
    const content = replyText.trim();
    setReplyText('');

    try {
      const res = await sendAdminReply(activeConv.id, content, adminUser.name);
      setMessages((prev) => [...prev, res.message]);
      refreshConversations();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeConv) return;
    try {
      await updateConversationMetadata(activeConv.id, { internalNotes });
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvertToLead = async () => {
    if (!activeConv) return;
    try {
      await createLead({
        name: activeConv.visitorName || 'Visitor Lead',
        email: activeConv.visitorEmail || `visitor_${activeConv.visitorId.slice(-4)}@lead.axion`,
        phone: activeConv.visitorPhone || '',
        company: activeConv.visitorCompany || 'Direct Chat Enterprise',
        country: activeConv.visitorCountry || 'Nigeria',
        serviceInterest: 'Enterprise Systems',
        status: 'qualified',
        priority: 'high',
        source: 'live_chat',
        conversationId: activeConv.id,
        notes: `Converted from live chat session. Transcript: ${activeConv.lastMessagePreview}`,
      });
      setLeadCreatedNotice(true);
      setTimeout(() => setLeadCreatedNotice(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered conversation list
  const filteredConversations = conversations.filter((c) => {
    if (filter === 'human_requested' && c.status !== 'human_requested') return false;
    if (filter === 'human_active' && c.status !== 'human_active') return false;
    if (filter === 'ai_active' && c.status !== 'ai_active') return false;
    if (filter === 'closed' && c.status !== 'closed') return false;

    if (searchTerm) {
      const matchName = c.visitorName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCompany = c.visitorCompany?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEmail = c.visitorEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPreview = c.lastMessagePreview?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchName && !matchCompany && !matchEmail && !matchPreview) return false;
    }
    return true;
  });

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row rounded-2xl bg-[#0F1D32] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Left Pane: Conversation Queue & Filters */}
      <div className="w-full md:w-80 lg:w-96 bg-[#0F1D32] border-r border-slate-800 flex flex-col">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search visitor, company, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-semibold">
            {[
              { id: 'all', label: 'All' },
              { id: 'human_requested', label: 'Requested', badge: conversations.filter(c => c.status === 'human_requested').length },
              { id: 'human_active', label: 'Live' },
              { id: 'ai_active', label: 'AI' },
              { id: 'closed', label: 'Closed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1.5 transition-colors ${
                  filter === tab.id
                    ? 'bg-[#2D96FF] text-white'
                    : 'bg-[#07101F] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No conversations in this view</div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = activeConvId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected
                      ? 'bg-[#2D96FF]/15 border-l-4 border-[#2D96FF]'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="font-bold text-xs text-white truncate">
                        {c.visitorName || `Visitor #${c.visitorId.slice(-4)}`}
                      </span>
                      {c.visitorCompany && (
                        <span className="text-[10px] text-slate-400 truncate">({c.visitorCompany})</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {c.lastMessagePreview || 'New session created'}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        c.status === 'human_requested'
                          ? 'bg-amber-950/70 text-amber-300 border-amber-800 animate-pulse'
                          : c.status === 'human_active'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                          : c.status === 'ai_active'
                          ? 'bg-blue-950/70 text-blue-300 border-blue-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {c.status.replace('_', ' ').toUpperCase()}
                    </span>

                    {c.priority === 'urgent' && (
                      <span className="text-[9px] font-bold text-red-400 bg-red-950/60 px-1.5 rounded">URGENT</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat Session */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-[#07101F] overflow-hidden">
          {/* Active Chat Header */}
          <div className="p-4 bg-[#0F1D32] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {activeConv.visitorName || `Visitor #${activeConv.visitorId.slice(-4)}`}
                </h3>
                {activeConv.visitorCompany && (
                  <span className="text-xs text-slate-400 bg-[#07101F] px-2 py-0.5 rounded border border-slate-800">
                    {activeConv.visitorCompany}
                  </span>
                )}
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    activeConv.status === 'human_active'
                      ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800'
                      : activeConv.status === 'human_requested'
                      ? 'bg-amber-950/70 text-amber-400 border-amber-800 animate-pulse'
                      : 'bg-blue-950/70 text-blue-400 border-blue-800'
                  }`}
                >
                  {activeConv.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                {activeConv.visitorEmail && <span>Email: {activeConv.visitorEmail}</span>}
                {activeConv.visitorPhone && <span>Phone: {activeConv.visitorPhone}</span>}
                <span>Page: {activeConv.pageUrl || '/'}</span>
              </div>
            </div>

            {/* Operator Actions Bar */}
            <div className="flex items-center gap-2">
              {activeConv.status !== 'human_active' ? (
                <button
                  onClick={handleTakeOver}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Take Over Chat</span>
                </button>
              ) : (
                <button
                  onClick={handleReturnToAI}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0F1D32] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return to AI</span>
                </button>
              )}

              <button
                onClick={handleConvertToLead}
                className="px-3 py-1.5 rounded-lg bg-[#2D96FF]/20 hover:bg-[#2D96FF]/30 border border-[#2D96FF]/40 text-[#46DCDC] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Save Lead</span>
              </button>

              <button
                onClick={handleClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Lead Creation Toast Notice */}
          {leadCreatedNotice && (
            <div className="p-2 bg-emerald-950/80 border-b border-emerald-700 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Contact automatically converted into a Qualified CRM Lead!</span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {messages.map((msg) => {
              const isVisitor = msg.senderRole === 'visitor';
              const isAdmin = msg.senderRole === 'admin';
              const isAI = msg.senderRole === 'ai';
              const isSystem = msg.senderRole === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[11px] text-slate-400">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isAdmin
                        ? 'bg-emerald-600 text-white'
                        : isAI
                        ? 'bg-[#2D96FF]/20 text-[#46DCDC] border border-[#2D96FF]/40'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isAdmin ? <Shield className="w-3.5 h-3.5" /> : isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 leading-relaxed space-y-1 ${
                      isAdmin
                        ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-100 rounded-tr-xs'
                        : isAI
                        ? 'bg-[#0F1D32] border border-[#2D96FF]/30 text-slate-200 rounded-tl-xs'
                        : 'bg-slate-800 border border-slate-700 text-white rounded-tl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 font-mono">
                      <span>{msg.senderName}</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Admin Live Reply Input Bar */}
          <div className="p-4 bg-[#0F1D32] border-t border-slate-800 space-y-3">
            <form onSubmit={handleSendReply} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  activeConv.status === 'human_active'
                    ? 'Type live reply to visitor (sent immediately)...'
                    : 'Take over chat or send direct administrator message...'
                }
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={isSending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || isSending}
                className="px-5 py-2.5 rounded-xl bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center gap-2 shrink-0"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Reply</span>
              </button>
            </form>

            {/* Quick Internal Notes Bar */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wide">Internal Notes:</span>
              <input
                type="text"
                placeholder="Add private operator notes..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                onBlur={handleSaveNotes}
                className="flex-1 px-2.5 py-1 rounded bg-[#07101F] border border-slate-800 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600"
              />
              <button onClick={handleSaveNotes} className="text-[11px] text-[#46DCDC] hover:underline">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
          Select a conversation from the queue to inspect or take over live messaging.
        </div>
      )}
    </div>
  );
};
