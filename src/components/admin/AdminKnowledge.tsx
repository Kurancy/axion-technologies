import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Sparkles, X, Tag } from 'lucide-react';
import type { KnowledgeEntry } from '../../types/index.js';
import {
  getKnowledgeBase,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  toggleKnowledgePublish,
  deleteKnowledgeEntry,
} from '../../lib/api.js';

export const AdminKnowledge: React.FC = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Solutions',
    question: '',
    answer: '',
    tags: '',
    isPublished: true,
  });

  const fetchKnowledge = async () => {
    try {
      const res = await getKnowledgeBase(false);
      setEntries(res.knowledge || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormData({
      title: '',
      category: 'Solutions',
      question: '',
      answer: '',
      tags: 'ai, enterprise, automation',
      isPublished: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    const tagsList = (entry.tags || entry.keywords || []).join(', ');
    setFormData({
      title: entry.title,
      category: entry.category,
      question: entry.question || entry.title,
      answer: entry.answer || entry.content || '',
      tags: tagsList,
      isPublished: entry.isPublished,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingEntry) {
        await updateKnowledgeEntry(editingEntry.id, {
          title: formData.title,
          category: formData.category,
          question: formData.question,
          answer: formData.answer,
          tags: tagsArray,
          keywords: tagsArray,
          content: formData.answer,
          isPublished: formData.isPublished,
        });
      } else {
        await createKnowledgeEntry({
          title: formData.title,
          category: formData.category,
          question: formData.question,
          answer: formData.answer,
          tags: tagsArray,
          keywords: tagsArray,
          content: formData.answer,
          isPublished: formData.isPublished,
        });
      }
      setShowModal(false);
      fetchKnowledge();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await toggleKnowledgePublish(id, !current);
      fetchKnowledge();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this AI knowledge entry?')) return;
    try {
      await deleteKnowledgeEntry(id);
      fetchKnowledge();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = entries.filter((entry) => {
    if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const tags = (entry.tags || entry.keywords || []);
      return (
        entry.title.toLowerCase().includes(q) ||
        (entry.question && entry.question.toLowerCase().includes(q)) ||
        (entry.answer && entry.answer.toLowerCase().includes(q)) ||
        (entry.content && entry.content.toLowerCase().includes(q)) ||
        tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const categories = ['Solutions', 'Products', 'SAP & ERP', 'Compliance & Regions', 'Pricing & Engagements', 'Company'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">AI Knowledge Base & Prompt Grounding</h2>
          <p className="text-xs text-slate-400">
            Configure the verified factual facts and enterprise policies that Axion AI uses to answer customer queries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search knowledge topics..."
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
            <span>Add Knowledge Item</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            categoryFilter === 'all' ? 'bg-[#2D96FF] text-white' : 'bg-[#0F1D32] text-slate-400 hover:text-white'
          }`}
        >
          All Categories ({entries.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              categoryFilter === cat ? 'bg-[#2D96FF] text-white' : 'bg-[#0F1D32] text-slate-400 hover:text-white'
            }`}
          >
            {cat} ({entries.filter((e) => e.category === cat).length})
          </button>
        ))}
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-xs text-slate-500 rounded-2xl bg-[#0F1D32]/60 border border-slate-800">
            No knowledge entries found matching filter
          </div>
        ) : (
          filtered.map((entry) => {
            const tags = entry.tags || entry.keywords || [];
            return (
              <div
                key={entry.id}
                className={`rounded-2xl bg-[#0F1D32]/80 border p-5 space-y-3 transition-all ${
                  entry.isPublished ? 'border-slate-800' : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#46DCDC] bg-[#07101F] px-2 py-0.5 rounded border border-slate-800">
                        {entry.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">{entry.title}</h3>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">{entry.question || entry.title}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleTogglePublish(entry.id, entry.isPublished)}
                      title={entry.isPublished ? 'Unpublish from AI model' : 'Publish to AI model'}
                      className={`p-1.5 rounded text-xs font-semibold ${
                        entry.isPublished ? 'text-emerald-400 hover:text-amber-400' : 'text-slate-500 hover:text-emerald-400'
                      }`}
                    >
                      {entry.isPublished ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07101F] border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {entry.answer || entry.content}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-[#0F1D32] border border-slate-700 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingEntry ? 'Edit Knowledge Item' : 'Add Grounded AI Knowledge Topic'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Topic Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Axion WMS SAP B1 Two-Way Sync"
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Typical Visitor Question / Trigger</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. How does Axion WMS connect to SAP Business One?"
                  className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Grounded Factual Answer (AI Response Blueprint)</label>
                <textarea
                  required
                  rows={5}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Exact factual details, technical architecture, and implementation policy..."
                  className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Search Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="sap, wms, erp, inventory, barcode"
                  className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-[#2D96FF] focus:ring-0"
                />
                <label htmlFor="pub-check" className="text-slate-300 font-semibold">
                  Publish immediately (enable for live AI grounding)
                </label>
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
                  Save Knowledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
