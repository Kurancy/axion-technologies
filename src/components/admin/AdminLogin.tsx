import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, Loader2, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { loginAdmin } from '../../lib/api.js';
import type { AdminUser } from '../../types/index.js';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser, token: string) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Axion2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(username, password);
      localStorage.setItem('axion_admin_token', res.token);
      localStorage.setItem('axion_admin_user', JSON.stringify(res.admin));
      onLoginSuccess(res.admin, res.token);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07101F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2D96FF]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl bg-[#0F1D32]/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand & Security Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2D96FF] to-[#46DCDC] p-[1.5px] mx-auto shadow-[0_0_20px_rgba(45,150,255,0.3)]">
            <div className="w-full h-full bg-[#07101F] rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#46DCDC]" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-wider">AXION OPERATING SYSTEM</h2>
          <p className="text-xs text-slate-400 font-mono">Enterprise Administrative Portal • v2.6</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Reminder Helper */}
        <div className="p-3 rounded-lg bg-[#07101F] border border-[#2D96FF]/30 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 text-[#46DCDC] font-semibold">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Pre-Configured Administrator Account:</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400 pl-5">
            Username: <span className="text-white">admin</span> • Password: <span className="text-white">Axion2026!</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Username / Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2D96FF] to-[#0284C7] hover:from-[#3B82F6] hover:to-[#0EA5E9] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(45,150,255,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Management Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            onClick={onBackToSite}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
