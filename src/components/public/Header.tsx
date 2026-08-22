import React, { useState } from 'react';
import { Bot, Menu, X, Shield, ArrowRight, Sparkles, Cpu, Layers } from 'lucide-react';
import AxionLogo from "./AxionLogo";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenChat: () => void;
  onGoAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenChat,
  onGoAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'solutions', label: 'SOLUTIONS' },
    { id: 'products', label: 'PRODUCTS' },
    { id: 'industries', label: 'INDUSTRIES' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <header
      id="axion-public-header"
      className="sticky top-0 z-40 bg-[#07101F]/90 backdrop-blur-md border-b border-[#0F1D32] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        
          {/* ── Brand Logo ── */}
          <div
            id="axion-brand-logo"
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => onNavigate("home")}
            role="button"
            aria-label="Axion Technologies Ltd. Home"
          >
            {/* Desktop Logo Height: 44px */}
            <div className="hidden sm:block">
              <AxionLogo logoSize={44} isDarkMode={true} glow={true} interactive={true} />
            </div>
            {/* Mobile Logo Height: 36px */}
            <div className="block sm:hidden">
              <AxionLogo logoSize={36} isDarkMode={true} glow={true} interactive={true} />
            </div>
          </div>

        {/* Center Desktop Navigation */}
        <nav
          id="header-desktop-nav"
          className="hidden md:flex items-center gap-1 bg-[#0F1D32]/60 px-3 py-1.5 rounded-full border border-slate-800/80"
        >
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => onNavigate(link.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2D96FF] text-white shadow-[0_0_12px_rgba(45,150,255,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Area */}
        <div id="header-right-actions" className="flex items-center gap-3">
          <button
            id="talk-to-axion-ai-btn"
            onClick={onOpenChat}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#2D96FF] to-[#0284C7] hover:from-[#3B82F6] hover:to-[#0EA5E9] text-white text-xs font-bold tracking-wide shadow-[0_0_16px_rgba(45,150,255,0.35)] transition-all transform hover:-translate-y-0.5"
          >
            <Bot className="w-4 h-4 text-[#46DCDC]" />
            <span className="hidden sm:inline">Talk to Axion AI</span>
            <span className="sm:hidden">Axion AI</span>
            <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
          </button>

          {/* Admin Link Button */}
          <button
            id="header-admin-portal-btn"
            onClick={onGoAdmin}
            title="Access Axion Operating System / Admin Portal"
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-[#46DCDC] hover:border-slate-700 transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden bg-[#07101F] border-b border-[#0F1D32] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide ${
                currentView === link.id
                  ? 'bg-[#2D96FF]/20 text-[#46DCDC] border border-[#2D96FF]/40'
                  : 'text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                onGoAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-[#46DCDC]"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <span className="text-[11px] text-slate-500">Axion OS v2.6</span>
          </div>
        </div>
      )}
    </header>
  );
};
