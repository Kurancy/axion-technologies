import React from 'react';
import { Bot, FolderLock, Warehouse, CheckCircle2, Clock, Sparkles, ArrowRight, Shield } from 'lucide-react';
import type { ProductItem } from '../../types/index.js';

interface ProductsViewProps {
  onOpenChat: (productName?: string) => void;
  onContactUs: (productName?: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onOpenChat, onContactUs }) => {
  const products: ProductItem[] = [
    {
      id: 'prod-1',
      code: 'AX-AI',
      name: 'AXION AI',
      tagline: 'AI Agents, AI Assistants and Intelligent Business Automation',
      description:
        'A production suite of domain-trained autonomous agents, conversational enterprise copilots, and intelligent OCR extraction pipelines built to automate high-friction operational workflows.',
      status: 'Available',
      features: [
        'Autonomous Agent Workflow Loops',
        'Intelligent OCR for Invoices, Waybills & Forms',
        'Enterprise ERP & Database Bidirectional Bridge',
        'Multilingual Arabic and English Processing',
        'Deterministic Role-Based Governance & Audit Logs',
      ],
      targetIndustries: ['Logistics', 'Healthcare', 'Financial Services', 'Manufacturing'],
      specs: ['Response Latency: <350ms', 'Accuracy: 99.4% on structured forms', 'Deployment: Cloud / Hybrid'],
      icon: 'Bot',
    },
    {
      id: 'prod-2',
      code: 'AX-VAULT',
      name: 'AXION VAULT',
      tagline: 'Projects + Documents + Knowledge + AI Intelligence',
      description:
        'An enterprise repository and document intelligence platform currently in active engineering. Unifies unstructured corporate documentation, contract analysis, and compliance search.',
      status: 'In Development',
      features: [
        'Semantic Neural Knowledge Search',
        'Automated Contract & Regulatory Verification',
        'Project Document Lifecycle Management',
        'Zero-Knowledge End-to-End Encryption',
      ],
      targetIndustries: ['Construction', 'Professional Services', 'Healthcare', 'Finance'],
      specs: ['SOC2 / ISO 27001 Ready Architecture', 'Vectorized Knowledge Store', 'Multi-tenant Isolation'],
      icon: 'FolderLock',
    },
    {
      id: 'prod-3',
      code: 'AX-WMS',
      name: 'AXION WMS',
      tagline: 'Inventory + Warehouse + Operations + Analytics',
      description:
        'High-velocity Warehouse Management System engineered for rugged industrial operations, handheld barcode/RFID scanning, automated batch tracking, and direct SAP sync.',
      status: 'Available',
      features: [
        'Multi-Depot Real-Time Inventory Control',
        'Native SAP Business One & Custom ERP Two-Way Sync',
        'Offline-First Handheld Scanner Support',
        'Pick-Pack-Ship Wave Orchestration',
        'Batch, Lot, and Expiry Date Tracking with Heatmaps',
      ],
      targetIndustries: ['Warehousing & Distribution', 'Logistics & Supply Chain', 'Manufacturing', 'Retail'],
      specs: ['Sub-second barcode scan resolution', 'Full offline sync queue', 'IoT scale & sensor compatible'],
      icon: 'Warehouse',
    },
  ];

  const getStatusBadge = (status: ProductItem['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </span>
        );
      case 'In Development':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800">
            <Clock className="w-3 h-3 text-cyan-300" />
            In Development
          </span>
        );
      case 'Prototype':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800">
            Prototype
          </span>
        );
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Bot':
        return <Bot className="w-6 h-6 text-[#2D96FF]" />;
      case 'FolderLock':
        return <FolderLock className="w-6 h-6 text-[#46DCDC]" />;
      case 'Warehouse':
        return <Warehouse className="w-6 h-6 text-[#2D96FF]" />;
      default:
        return <Bot className="w-6 h-6 text-[#2D96FF]" />;
    }
  };

  return (
    <div id="products-page-container" className="py-16 bg-[#07101F] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#46DCDC] uppercase tracking-widest bg-[#0F1D32] px-3 py-1 rounded-full border border-slate-800">
            Axion Product Suite
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Specialized Enterprise Platforms.
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Purpose-built software systems engineered with strict production standards and transparent implementation status.
          </p>
        </div>

        {/* Products Grid */}
        <div className="space-y-12">
          {products.map((product) => (
            <div
              key={product.id}
              id={`product-card-${product.code.toLowerCase()}`}
              className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-sm transition-all hover:border-slate-700"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left col: Info & Overview */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-[#07101F] border border-slate-800">
                        {getIcon(product.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-black text-white tracking-wide">{product.name}</h2>
                          <span className="text-xs font-mono text-slate-400">[{product.code}]</span>
                        </div>
                        <p className="text-xs font-semibold text-[#2D96FF]">{product.tagline}</p>
                      </div>
                    </div>
                    <div>{getStatusBadge(product.status)}</div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    {product.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Key Technical Capabilities:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#46DCDC] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Industries */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400">Industries:</span>
                    {product.targetIndustries.map((ind, i) => (
                      <span key={i} className="text-[11px] text-slate-300 bg-[#07101F] px-2.5 py-0.5 rounded-full border border-slate-800">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right col: Technical Specs & Action Card */}
                <div className="lg:col-span-5 rounded-xl bg-[#07101F]/90 border border-slate-800/90 p-6 space-y-5 flex flex-col justify-between h-full">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                      Technical Specifications & Deployment
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300 font-mono">
                      {product.specs.map((spec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-[#46DCDC]">›</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <button
                      onClick={() => onOpenChat(product.name)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold shadow-md transition-all"
                    >
                      <Bot className="w-3.5 h-3.5 text-cyan-200" />
                      <span>Ask AI About {product.name}</span>
                    </button>
                    <button
                      onClick={() => onContactUs(product.name)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0F1D32] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                    >
                      <span>{product.status === 'Available' ? 'Schedule System Demo' : 'Join Architecture Briefing'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
