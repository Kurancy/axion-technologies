import React from 'react';
import { Bot, Layers, Code, Warehouse, BarChart3, Compass, ArrowRight } from 'lucide-react';

interface WhatWeDoProps {
  onSelectSolution: (slug?: string) => void;
}

export const WhatWeDo: React.FC<WhatWeDoProps> = ({ onSelectSolution }) => {
  const cards = [
    {
      slug: 'ai-automation',
      icon: Bot,
      title: 'AI & Intelligent Automation',
      description: 'Autonomous AI agents, document OCR for invoices and customs manifests, and automated process pipelines.',
      tag: 'Agents • OCR • Workflows',
    },
    {
      slug: 'erp-sap',
      icon: Layers,
      title: 'ERP & SAP Solutions',
      description: 'SAP Business One implementation, service layer API extensions, and seamless two-way legacy data bridging.',
      tag: 'SAP B1 • Connectors • GL Sync',
    },
    {
      slug: 'enterprise-software',
      icon: Code,
      title: 'Enterprise Software',
      description: 'Custom B2B portals, internal operations platforms, and mission-critical cloud-native software architectures.',
      tag: 'B2B Portals • Internal Tools • APIs',
    },
    {
      slug: 'warehouse-management',
      icon: Warehouse,
      title: 'Warehouse Management',
      description: 'Axion WMS for multi-depot stock control, handheld barcode/RFID scanning, wave picking, and SAP sync.',
      tag: 'Axion WMS • Barcode • Multi-Site',
    },
    {
      slug: 'data-bi',
      icon: BarChart3,
      title: 'Data & Business Intelligence',
      description: 'Automated data warehousing, real-time executive KPI command centers, and operational throughput monitoring.',
      tag: 'Dashboards • ETL • Predictive KPIs',
    },
    {
      slug: 'digital-transformation',
      icon: Compass,
      title: 'Digital Transformation',
      description: 'Process auditing, system modernization, legacy monolith decoupling, and scalable engineering roadmaps.',
      tag: 'Modernization • Cloud • Audits',
    },
  ];

  return (
    <section id="what-we-do-section" className="py-20 bg-[#07101F] border-b border-[#0F1D32] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#46DCDC] uppercase tracking-widest bg-[#0F1D32] px-3 py-1 rounded-full border border-slate-800">
            What We Do
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technology Built Around Your Business.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            We start with the business problem, identify where time, money and information are being lost, and build practical technology around the workflow.
          </p>
        </div>

        {/* 6 Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.slug}
                id={`what-we-do-card-${card.slug}`}
                onClick={() => onSelectSolution(card.slug)}
                className="group relative rounded-xl bg-[#0F1D32]/70 border border-slate-800/80 hover:border-[#2D96FF]/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(45,150,255,0.15)] cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-lg bg-[#07101F] border border-slate-700/80 flex items-center justify-center text-[#2D96FF] group-hover:text-[#46DCDC] group-hover:border-[#46DCDC]/40 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#46DCDC] transition-colors mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[11px] text-slate-400 font-mono">{card.tag}</span>
                  <span className="text-[#2D96FF] group-hover:text-[#46DCDC] flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
