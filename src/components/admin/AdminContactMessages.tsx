import React, { useState, useEffect } from 'react';
import { Inbox, Search, CheckCircle2, Trash2, ArrowRight, UserCheck, Mail, Phone, Building, Globe } from 'lucide-react';
import type { ContactMessage } from '../../types/index.js';
import { getContactMessages, updateContactStatus, convertContactToLead, deleteContactMessage } from '../../lib/api.js';

export const AdminContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await getContactMessages();
      setMessages(res.messages || []);
      if (!selectedMsg && res.messages.length > 0) {
        setSelectedMsg(res.messages[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateContactStatus(id, status);
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvert = async (id: string) => {
    try {
      await convertContactToLead(id);
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact message?')) return;
    try {
      await deleteContactMessage(id);
      setSelectedMsg(null);
      fetchMessages();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = messages.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.serviceInterest.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Website Contact Messages</h2>
          <p className="text-xs text-slate-400">Direct technical inquiries submitted from the public Axion website.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search inquiries..."
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
            <option value="all">All Inquiries</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Messages List */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No contact messages found</div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMsg(m)}
                  className={`p-4 cursor-pointer hover:bg-slate-800/40 transition-colors space-y-1.5 ${
                    selectedMsg?.id === m.id ? 'bg-[#2D96FF]/15 border-l-4 border-[#2D96FF]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#46DCDC] font-semibold">{m.company} • {m.serviceInterest}</p>

                  <p className="text-xs text-slate-400 line-clamp-1">{m.message}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        m.status === 'new'
                          ? 'bg-blue-950/70 text-blue-300 border-blue-800'
                          : m.status === 'contacted'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {m.status.toUpperCase()}
                    </span>
                    {m.leadId && (
                      <span className="text-[10px] text-emerald-400 font-semibold">CRM Lead Linked</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Inquiry Detail Card */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 shadow-xl flex flex-col justify-between h-[600px]">
          {selectedMsg ? (
            <>
              <div className="space-y-4 overflow-y-auto pr-1">
                {/* Header */}
                <div className="pb-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedMsg.name}</h3>
                    <p className="text-xs text-[#2D96FF] font-semibold">{selectedMsg.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMsg.status}
                      onChange={(e) => handleUpdateStatus(selectedMsg.id, e.target.value)}
                      className="px-3 py-1 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white"
                    >
                      <option value="new">Status: New</option>
                      <option value="contacted">Status: Contacted</option>
                      <option value="archived">Status: Archived</option>
                    </select>

                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Work Email</span>
                    <p className="text-white font-mono">{selectedMsg.email}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Phone</span>
                    <p className="text-white font-mono">{selectedMsg.phone || 'Not provided'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Country & Industry</span>
                    <p className="text-white">{selectedMsg.country} • {selectedMsg.industry}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Service Interest</span>
                    <p className="text-[#46DCDC] font-semibold">{selectedMsg.serviceInterest}</p>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-300">Message Body</span>
                  <div className="p-4 rounded-xl bg-[#07101F] border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedMsg.message}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Submitted: {new Date(selectedMsg.createdAt).toLocaleString()}
                </span>
                {!selectedMsg.leadId ? (
                  <button
                    onClick={() => handleConvert(selectedMsg.id)}
                    className="px-4 py-2 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Convert to CRM Lead</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Converted to Active Lead</span>
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-xs text-slate-500">
              Select an inquiry from the list to view its complete submission details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
