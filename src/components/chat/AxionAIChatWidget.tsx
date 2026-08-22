import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  X,
  User,
  Shield,
  Loader2,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Clock,
  ChevronDown,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { ChatMessage, Conversation } from '../../types/index.js';
import { initChatSession, sendChatMessage, requestHumanHandoff, submitOfflineLead } from '../../lib/api.js';
import { realtime } from '../../lib/ws.js';

interface AxionAIChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialTopic?: string;
}

export const AxionAIChatWidget: React.FC<AxionAIChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpen,
  initialTopic,
}) => {
  const [visitorId, setVisitorId] = useState<string>('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // Guard: track whether we've already auto-sent the initialTopic message
  const hasAutoSentTopicRef = useRef(false);

  // Initialize session
  useEffect(() => {
    let savedVisitorId = localStorage.getItem('axion_visitor_id');
    if (!savedVisitorId) {
      savedVisitorId = 'vis_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('axion_visitor_id', savedVisitorId);
    }
    setVisitorId(savedVisitorId);

    const init = async () => {
      try {
        const res = await initChatSession(savedVisitorId, window.location.pathname);
        setConversation(res.conversation);
        setMessages(res.messages || []);

        // Connect WebSocket for this conversation
        realtime.connect('visitor', {
          conversationId: res.conversation.id,
          visitorId: savedVisitorId,
        });
      } catch (e) {
        console.error('Failed to init chat session:', e);
      }
    };

    init();
  }, []);

  // Listen to WebSocket events
  useEffect(() => {
    const unsubNewMessage = realtime.on('new_message', (data: { message: ChatMessage; conversationId: string }) => {
      if (data.message && data.message.conversationId === conversation?.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }
    });

    const unsubStatus = realtime.on('status_change', (data: { conversationId: string; status: any; assignedAdminName?: string }) => {
      if (data.conversationId === conversation?.id) {
        setConversation((prev) => (prev ? { ...prev, status: data.status, assignedAdminName: data.assignedAdminName } : null));
      }
    });

    const unsubTyping = realtime.on('admin_typing', (data: { conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === conversation?.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      unsubNewMessage();
      unsubStatus();
      unsubTyping();
    };
  }, [conversation?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Handle initial topic suggestion if opened from a specific view.
  // Use a ref guard so this fires at most ONCE per widget lifecycle,
  // even if isOpen/initialTopic change multiple times.
  useEffect(() => {
    if (
      isOpen &&
      initialTopic &&
      conversation &&
      messages.length <= 1 &&
      !hasAutoSentTopicRef.current
    ) {
      hasAutoSentTopicRef.current = true;
      handleSend(`Tell me how Axion Technologies handles ${initialTopic}`);
    }
  // We intentionally omit handleSend from deps because it is stable within one session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTopic, conversation, messages.length]);

  const handleSend = async (textToSend?: string) => {
    const content = textToSend || inputVal;
    if (!content.trim() || !conversation || isSending) return;

    if (!textToSend) setInputVal('');
    setIsSending(true);

    try {
      const res = await sendChatMessage({
        conversationId: conversation.id,
        content: content.trim(),
        senderRole: 'visitor',
        senderName: leadForm.name || 'Visitor',
        visitorMetadata: {
          name: leadForm.name,
          email: leadForm.email,
          phone: leadForm.phone,
          company: leadForm.company,
        },
      });

      // Update local messages
      setMessages((prev) => {
        const next = [...prev];
        if (!next.some((m) => m.id === res.userMessage.id)) {
          next.push(res.userMessage);
        }
        if (res.aiMessage && !next.some((m) => m.id === res.aiMessage!.id)) {
          next.push(res.aiMessage);
        }
        if (res.systemMessage && !next.some((m) => m.id === res.systemMessage!.id)) {
          next.push(res.systemMessage);
        }
        return next;
      });

      if (res.conversationStatus) {
        setConversation((prev) => (prev ? { ...prev, status: res.conversationStatus as any } : null));
      }
    } catch (e: any) {
      console.error('Chat error:', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestHandoff = async () => {
    if (!conversation) return;
    try {
      const res = await requestHumanHandoff(conversation.id, 'Visitor clicked Talk to Human');
      setConversation(res.conversation);
      setMessages((prev) => [...prev, res.systemMessage]);
      setShowLeadForm(true);
    } catch (e) {
      console.error('Handoff error:', e);
    }
  };

  const handleOfflineLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return;

    try {
      await submitOfflineLead({
        conversationId: conversation?.id,
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        company: leadForm.company,
        message: 'Lead captured during live chat handoff request',
      });
      setLeadSubmitted(true);
      setShowLeadForm(false);
    } catch (e) {
      console.error('Lead submit error:', e);
    }
  };

  const quickChips = [
    'Tell me about Axion WMS',
    'How do you integrate with SAP?',
    'What AI agents do you build?',
    'Do you support ZATCA / FIRS e-invoicing?',
  ];

  return (
    <div id="axion-chat-widget-wrapper" className="fixed bottom-6 right-6 z-50">
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <button
          id="chat-floating-launcher"
          onClick={onOpen}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#2D96FF] to-[#0284C7] hover:from-[#3B82F6] hover:to-[#0EA5E9] text-white shadow-[0_8px_30px_rgba(45,150,255,0.4)] transition-all transform hover:-translate-y-1"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#46DCDC]" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide">Talk to Axion AI</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div
          id="axion-chat-window"
          className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] rounded-2xl bg-[#07101F] border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-[#0F1D32] to-[#0A182F] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D96FF] to-[#46DCDC] p-[1.5px]">
                <div className="w-full h-full bg-[#07101F] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#46DCDC]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-white tracking-wide">AXION INTELLIGENCE</h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800">
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  {conversation?.status === 'human_active' ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live: {conversation.assignedAdminName || 'Axion Specialist'}
                    </span>
                  ) : conversation?.status === 'human_requested' ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                      Handoff requested...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D96FF] animate-pulse" />
                      Axion AI Assistant • Online
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="chat-talk-human-top-btn"
                onClick={handleRequestHandoff}
                title="Request human specialist handoff"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors text-xs flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#46DCDC]" />
                <span className="hidden sm:inline text-[10px]">Human</span>
              </button>

              <button
                id="chat-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Handoff Contact Bar / Modal */}
          {showLeadForm && !leadSubmitted && (
            <div className="p-3 bg-[#0F1D32] border-b border-slate-700/80 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-white">Leave your details for fastest callback:</span>
                <button onClick={() => setShowLeadForm(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <form onSubmit={handleOfflineLeadSubmit} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="px-2 py-1.5 rounded bg-[#07101F] border border-slate-700 text-white text-[11px] placeholder-slate-500"
                />
                <input
                  type="email"
                  placeholder="Work Email"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="px-2 py-1.5 rounded bg-[#07101F] border border-slate-700 text-white text-[11px] placeholder-slate-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="px-2 py-1.5 rounded bg-[#07101F] border border-slate-700 text-white text-[11px] placeholder-slate-500"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  className="px-2 py-1.5 rounded bg-[#07101F] border border-slate-700 text-white text-[11px] placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="col-span-2 py-1.5 rounded bg-[#2D96FF] text-white font-bold text-[11px] hover:bg-[#1D86EF]"
                >
                  Save & Notify Specialist
                </button>
              </form>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.senderRole === 'visitor';
              const isSystem = msg.senderRole === 'system';
              const isAdmin = msg.senderRole === 'admin';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 text-center max-w-[85%] leading-snug">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-slate-700 text-slate-200'
                        : isAdmin
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2D96FF]/20 text-[#46DCDC] border border-[#2D96FF]/40'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : isAdmin ? <Shield className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 leading-relaxed space-y-1 ${
                      isUser
                        ? 'bg-[#2D96FF] text-white rounded-tr-xs'
                        : isAdmin
                        ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-100 rounded-tl-xs'
                        : 'bg-[#0F1D32] border border-slate-800 text-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 font-mono">
                      <span>{msg.senderName || (isUser ? 'You' : isAdmin ? 'Axion Specialist' : 'Axion AI')}</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {(isSending || isTyping) && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#46DCDC]" />
                <span className="italic text-[11px]">
                  {isTyping ? 'Admin is typing...' : 'Axion AI is analyzing...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips if low message count */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[#0F1D32] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#0F1D32]/90 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                id="chat-message-input"
                placeholder="Ask about AI, WMS, SAP integration, pricing..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isSending}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
              />
              <button
                type="submit"
                id="chat-message-send-btn"
                disabled={!inputVal.trim() || isSending}
                className="p-2.5 rounded-xl bg-[#2D96FF] hover:bg-[#1D86EF] text-white disabled:opacity-40 transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 px-1">
              <span>Axion AI • Grounded in enterprise architecture</span>
              <button onClick={handleRequestHandoff} className="text-[#46DCDC] hover:underline">
                Request human
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
