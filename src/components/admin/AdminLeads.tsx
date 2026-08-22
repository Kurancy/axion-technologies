import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  DollarSign,
  X,
  Sparkles,
} from 'lucide-react';
import type { Lead } from '../../types/index.js';
import { getLeads, createLead, updateLead, deleteLead } from '../../lib/api.js';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: 'Nigeria',
    serviceInterest: 'AI & Automation',
    status: 'new' as Lead['status'],
    priority: 'medium' as Lead['priority'],
    estimatedValue: 25000,
    notes: '',
  });

  const fetchLeadsData = async () => {
    try {
      const res = await getLeads();
      setLeads(res.leads || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, []);

  const handleOpenAdd = () => {
    setEditingLead(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      country: 'Nigeria',
      serviceInterest: 'AI & Automation',
      status: 'new',
      priority: 'medium',
      estimatedValue: 25000,
      notes: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      company: lead.company,
      country: lead.country || 'Nigeria',
      serviceInterest: lead.serviceInterest,
      status: lead.status,
      priority: lead.priority,
      estimatedValue: Number(lead.estimatedValue ?? 0),
      notes: lead.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await updateLead(editingLead.id, formData);
      } else {
        await createLead({ ...formData, source: 'manual' });
      }
      setShowModal(false);
      fetchLeadsData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead record?')) return;
    try {
      await deleteLead(id);
      fetchLeadsData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Lead['status']) => {
    try {
      await updateLead(id, { status: newStatus });
      fetchLeadsData();
    } catch (e) {
      console.error(e);
    }
  };

  const stages: { id: Lead['status']; label: string; color: string }[] = [
    { id: 'new', label: 'New / Ingested', color: 'border-blue-500' },
    { id: 'qualified', label: 'Qualified', color: 'border-cyan-500' },
    { id: 'contacted', label: 'Contacted', color: 'border-yellow-500' },
    { id: 'proposal', label: 'Proposal Sent', color: 'border-purple-500' },
    { id: 'won', label: 'Won / Closed', color: 'border-emerald-500' },
    { id: 'lost', label: 'Lost', color: 'border-red-500' },
  ];

  const filtered = leads.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.serviceInterest.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Enterprise Leads & CRM Pipeline</h2>
          <p className="text-xs text-slate-400">Track deal values, technical project requirements, and sales stages.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#0F1D32] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                viewMode === 'pipeline' ? 'bg-[#2D96FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-[#2D96FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#0F1D32] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* View 1: Pipeline Kanban View */}
      {viewMode === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = filtered.filter((l) => l.status === stage.id);
            const totalStageValue = stageLeads.reduce((acc, l) => acc + Number(l.estimatedValue ?? 0), 0);

            return (
              <div
                key={stage.id}
                className="bg-[#0F1D32]/70 border border-slate-800 rounded-2xl p-3 space-y-3 min-w-[220px]"
              >
                {/* Column Header */}
                <div className={`border-t-2 ${stage.color} pt-2 flex items-center justify-between`}>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">{stage.label}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ${totalStageValue.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-[#07101F] text-slate-300 px-2 py-0.5 rounded-full border border-slate-800">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards in this stage */}
                <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 rounded-xl bg-[#07101F] border border-slate-800 hover:border-slate-700 space-y-2 text-xs shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white text-xs">{lead.name}</h4>
                          <p className="text-[11px] text-slate-400 font-semibold">{lead.company}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="text-slate-500 hover:text-white p-1"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#46DCDC]">{lead.serviceInterest}</p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                        <span>${(lead.estimatedValue || 0).toLocaleString()}</span>
                        <span className="uppercase text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {lead.priority}
                        </span>
                      </div>

                      {/* Quick stage advance dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as Lead['status'])}
                        className="w-full text-[10px] py-1 px-1.5 rounded bg-[#0F1D32] border border-slate-700 text-slate-300 focus:outline-none"
                      >
                        {stages.map((s) => (
                          <option key={s.id} value={s.id}>
                            Move to {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View 2: Table View */
        <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#07101F] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Value</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[11px] text-slate-400">{lead.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{lead.company}</td>
                    <td className="p-4 text-[#46DCDC]">{lead.serviceInterest}</td>
                    <td className="p-4 font-mono font-bold">${(lead.estimatedValue || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {lead.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="uppercase text-[10px] font-bold text-slate-400">
                        {lead.priority}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(lead)}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0F1D32] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingLead ? 'Edit Lead Record' : 'Add New Enterprise Lead'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Service Focus</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  >
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="ERP / SAP">ERP / SAP</option>
                    <option value="Enterprise Software">Enterprise Software</option>
                    <option value="Warehouse Management">Warehouse Management</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Digital Transformation">Digital Transformation</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Stage</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Lead['status'] })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  >
                    {stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Lead['priority'] })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Internal Deal Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Requirements, customer timeline, budget..."
                  className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#07101F] text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
