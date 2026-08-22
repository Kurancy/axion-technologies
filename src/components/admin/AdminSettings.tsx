import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Bot, Building, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import type { CompanySettings } from '../../types/index.js';
import { getSettings, updateSettings } from '../../lib/api.js';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        setSettings(res.settings);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await updateSettings(settings);
      setSettings(res.settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading company settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Platform Configuration & System Settings</h2>
          <p className="text-xs text-slate-400">Configure global metadata, regional contact info, and AI behavior policies.</p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Company Profile */}
        <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-4 h-4 text-[#2D96FF]" />
            <h3 className="text-sm font-bold text-white">Company Identity & Regional Hubs</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Primary Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Primary Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Headquarters Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Operational Business Hours</label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Engine Configuration */}
        <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bot className="w-4 h-4 text-[#46DCDC]" />
            <h3 className="text-sm font-bold text-white">Axion AI Assistant Policies</h3>
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Default Chat Welcome Message</label>
            <textarea
              rows={2}
              value={settings.aiWelcomeMessage}
              onChange={(e) => setSettings({ ...settings, aiWelcomeMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white leading-relaxed"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold mb-1 block">System Instruction & Behavioral Prompt</label>
            <textarea
              rows={4}
              value={settings.aiSystemPrompt}
              onChange={(e) => setSettings({ ...settings, aiSystemPrompt: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white font-mono leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Auto-Handoff Message Threshold</label>
              <input
                type="number"
                value={settings.autoHandoffMessageThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, autoHandoffMessageThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-lg bg-[#07101F] border border-slate-700 text-white font-mono"
              />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="handoff-check"
                checked={settings.handoffEnabled}
                onChange={(e) => setSettings({ ...settings, handoffEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[#2D96FF] focus:ring-0"
              />
              <label htmlFor="handoff-check" className="text-slate-300 font-semibold">
                Enable Human Live Specialist Handoffs
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
