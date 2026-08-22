import React from 'react';
import { MapPin, Mail, Phone, ArrowUpRight, Shield, Globe } from 'lucide-react';
import AxionLogo from "./AxionLogo";

interface FooterProps {
  onNavigate: (view: string) => void;
  onGoAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onGoAdmin }) => {
  return (
    <footer id="axion-public-footer" className="bg-[#07101F] border-t border-[#0F1D32] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer w-max"
              onClick={() => onNavigate("home")}
              role="button"
              aria-label="Axion Technologies Ltd."
            >
              <AxionLogo logoSize={40} isDarkMode={true} glow={false} interactive={true} />
            </div>

            <p className="text-[13px] leading-relaxed max-w-sm">
              Africa's trusted enterprise technology partner. We deliver AI automation, SAP ERP solutions, 
              warehouse management systems, and digital transformation strategies to organizations across the continent.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-300">Live Production Systems Active</span>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('solutions')} className="hover:text-[#46DCDC] transition-colors">
                  AI & Intelligent Automation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('solutions')} className="hover:text-[#46DCDC] transition-colors">
                  ERP & SAP Solutions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('solutions')} className="hover:text-[#46DCDC] transition-colors">
                  Enterprise Software
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('solutions')} className="hover:text-[#46DCDC] transition-colors">
                  Warehouse Management (WMS)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('solutions')} className="hover:text-[#46DCDC] transition-colors">
                  Data & Business Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('solutions')} className="hover:text-[#46DCDC] transition-colors">
                  Digital Transformation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Products & Industries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Products & Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-[#46DCDC] transition-colors flex items-center gap-1">
                  <span>Axion AI</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-800">Available</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-[#46DCDC] transition-colors flex items-center gap-1">
                  <span>Axion Vault</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800">In Dev</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-[#46DCDC] transition-colors flex items-center gap-1">
                  <span>Axion WMS</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-800">Available</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('industries')} className="hover:text-[#46DCDC] transition-colors">
                  Manufacturing & Supply Chain
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('industries')} className="hover:text-[#46DCDC] transition-colors">
                  Healthcare & Retail
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional Offices */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Regional Offices</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2D96FF] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Lagos, Nigeria</p>
                  <p className="text-[11px] text-slate-400">Victoria Island Tech Hub</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#46DCDC] mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">Riyadh, Saudi Arabia</p>
                  <p className="text-[11px] text-slate-400">King Fahd Road, Al-Olaya</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">London, UK</p>
                  <p className="text-[11px] text-slate-400">City Road Engineering Node</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#0F1D32] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} AXION TECHNOLOGIES. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact</button>
            <button onClick={onGoAdmin} className="text-slate-400 hover:text-[#46DCDC] flex items-center gap-1 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin OS</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
