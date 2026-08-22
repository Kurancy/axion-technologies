import React, { useState } from 'react';
import {
  Factory,
  Truck,
  Warehouse,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  ShieldCheck,
  HardHat,
  Wheat,
  Briefcase,
  Building2,
  Building,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { IndustryItem } from '../../types/index.js';

interface IndustriesViewProps {
  onContactIndustry: (industryName: string) => void;
  onOpenChat: () => void;
}

export const IndustriesView: React.FC<IndustriesViewProps> = ({ onContactIndustry, onOpenChat }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('manufacturing');

  const industries: IndustryItem[] = [
    {
      id: 'ind-1',
      slug: 'manufacturing',
      name: 'Manufacturing',
      tagline: 'Shop-floor telemetry, SAP B1 routing, and automated quality logging.',
      challenges: ['Fragmented production data', 'Unplanned machine downtime', 'Manual scrap & yield tracking'],
      solutionsApplied: ['Axion AI automated inspection OCR', 'SAP Business One production scheduling', 'IoT shop-floor bridges'],
      caseExample: 'Automated shop-floor data collection across 6 assembly lines for a heavy industrial producer.',
      metrics: '38% reduction in inventory reconciliation time',
      icon: 'Factory',
    },
    {
      id: 'ind-2',
      slug: 'logistics-supply-chain',
      name: 'Logistics & Supply Chain',
      tagline: 'Multi-modal freight tracking, customs document intelligence, and dispatch optimization.',
      challenges: ['Delayed airway bills of lading', 'Port customs congestion blindspots', 'Manual manifest creation'],
      solutionsApplied: ['Bilingual OCR for airway bills & manifests', 'Real-time fleet telemetry gateways', 'Axion WMS cross-docking'],
      caseExample: 'Deployed automated freight invoice ingestion for a pan-African logistics provider.',
      metrics: '85% faster documentation processing',
      icon: 'Truck',
    },
    {
      id: 'ind-3',
      slug: 'warehousing-distribution',
      name: 'Warehousing & Distribution',
      tagline: 'Sub-second inventory accuracy, barcode picking, and multi-depot sync.',
      challenges: ['Mispick errors in high-volume hubs', 'Ghost stock across distributed sheds', 'Slow order fulfillment turnaround'],
      solutionsApplied: ['Axion WMS multi-depot deployment', 'Handheld terminal integration', 'Automated wave picking routes'],
      caseExample: 'Modernized 4 central distribution hubs in Kano and Lagos with real-time barcode reconciliation.',
      metrics: '99.8% pick accuracy achieved',
      icon: 'Warehouse',
    },
    {
      id: 'ind-4',
      slug: 'retail-fmcg',
      name: 'Retail',
      tagline: 'Omnichannel stock visibility, POS to ERP integration, and demand replenishment.',
      challenges: ['Stockouts on fast-moving SKUs', 'Slow price updates across retail branches', 'Manual vendor order reconciliation'],
      solutionsApplied: ['Real-time POS sync to SAP ERP', 'Automated purchase order generators', 'Supplier portal integration'],
      caseExample: 'Connected 22 retail outlets to a centralized procurement engine with automated replenishment.',
      metrics: '42% lower stockout incidents',
      icon: 'ShoppingBag',
    },
    {
      id: 'ind-5',
      slug: 'healthcare',
      name: 'Healthcare',
      tagline: 'Medical billing OCR, pharmaceutical batch tracking, and secure patient portals.',
      challenges: ['Slow insurance claim processing', 'Stringent cold-chain pharmaceutical compliance', 'Siloed hospital records'],
      solutionsApplied: ['Axion OCR for claim forms', 'WMS temperature audit logging', 'Secure encrypted medical portals'],
      caseExample: 'Automated 15,000 monthly insurance reimbursement forms for a private hospital network.',
      metrics: '70% reduction in claims backlog',
      icon: 'HeartPulse',
    },
    {
      id: 'ind-6',
      slug: 'education',
      name: 'Education',
      tagline: 'Student information systems, fee reconciliation, and digital credentialing.',
      challenges: ['Scattered tuition payment reconciliation', 'Manual transcript archiving', 'Fragmented admissions workflows'],
      solutionsApplied: ['Automated bank payment reconciler', 'Document intelligence archiver', 'Portal workflows'],
      caseExample: 'Centralized admissions and fee verification for a multi-campus institution.',
      metrics: '95% faster tuition verification',
      icon: 'GraduationCap',
    },
    {
      id: 'ind-7',
      slug: 'financial-services',
      name: 'Financial Services',
      tagline: 'KYC document verification, automated reconciliation, and executive dashboards.',
      challenges: ['High compliance overhead', 'Manual bank statement reconciliation', 'Fraud detection latency'],
      solutionsApplied: ['AI ID verification agent', 'High-throughput transactional reconciliation engine', 'Executive risk BI'],
      caseExample: 'Engineered automated multi-currency reconciliation pipeline processing 250k daily transactions.',
      metrics: '99.99% automated reconciliation rate',
      icon: 'ShieldCheck',
    },
    {
      id: 'ind-8',
      slug: 'construction',
      name: 'Construction',
      tagline: 'Project milestone tracking, material procurement, and contractor billing.',
      challenges: ['Budget overruns on raw materials', 'Scattered subcontractor invoices', 'Poor site-to-office sync'],
      solutionsApplied: ['Axion Vault project documentation', 'Material dispatch WMS', 'ERP job costing'],
      caseExample: 'Centralized procurement and subcontractor billing for a residential developer in Riyadh.',
      metrics: '14% savings on material waste',
      icon: 'HardHat',
    },
    {
      id: 'ind-9',
      slug: 'agriculture',
      name: 'Agriculture',
      tagline: 'Outgrower management, weighbridge integration, and export compliance.',
      challenges: ['Manual weighbridge logging', 'Tracing crop batches to farms', 'Export documentation delays'],
      solutionsApplied: ['Weighbridge IoT data bridge', 'Axion WMS batch traceability', 'Automated phytosanitary filing'],
      caseExample: 'Automated cocoa and sesame seed aggregation across 12 collection centers.',
      metrics: '100% export batch traceability',
      icon: 'Wheat',
    },
    {
      id: 'ind-10',
      slug: 'professional-services',
      name: 'Professional Services',
      tagline: 'Client billing, timesheet intelligence, and proposal workflow engines.',
      challenges: ['Unbilled advisory hours', 'Scattered contract archives', 'Manual proposal generation'],
      solutionsApplied: ['Axion Vault proposal knowledge base', 'ERP timesheet integration', 'Client portal'],
      caseExample: 'Deployed custom client billing and matter management platform for a top legal firm.',
      metrics: '25% increase in captured billable hours',
      icon: 'Briefcase',
    },
    {
      id: 'ind-11',
      slug: 'smes',
      name: 'SMEs',
      tagline: 'Lean enterprise toolkits, cloud ERP, and automated customer communication.',
      challenges: ['Limited IT staffing', 'Disconnected legacy tools', 'Lack of real-time cash flow visibility'],
      solutionsApplied: ['Axion AI chatbot + CRM', 'Lightweight SAP Business One deployment', 'Mobile dashboards'],
      caseExample: 'Rapid 4-week deployment of end-to-end sales, inventory, and accounting for a scaling distributor.',
      metrics: 'Go-live completed in 28 days',
      icon: 'Building2',
    },
    {
      id: 'ind-12',
      slug: 'enterprise-orgs',
      name: 'Enterprise Organizations',
      tagline: 'Complex multi-entity consolidation, custom middleware, and 24/7 SLA governance.',
      challenges: ['Heterogeneous legacy technology stacks', 'Stringent regional regulatory compliance', 'High transaction volume'],
      solutionsApplied: ['Distributed microservice bridges', 'Role-based enterprise access control', 'Enterprise data warehouse'],
      caseExample: 'Architected unified data pipeline across 5 subsidiary operating companies in West Africa.',
      metrics: 'Single pane of glass across all entities',
      icon: 'Building',
    },
  ];

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Factory': return <Factory className="w-5 h-5" />;
      case 'Truck': return <Truck className="w-5 h-5" />;
      case 'Warehouse': return <Warehouse className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'HardHat': return <HardHat className="w-5 h-5" />;
      case 'Wheat': return <Wheat className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      default: return <Building className="w-5 h-5" />;
    }
  };

  const activeInd = industries.find((i) => i.slug === selectedIndustry) || industries[0];

  return (
    <div id="industries-page-container" className="py-16 bg-[#07101F] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#46DCDC] uppercase tracking-widest bg-[#0F1D32] px-3 py-1 rounded-full border border-slate-800">
            Target Industries & Sector Solutions
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tailored Industry Architectures.
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Proven implementations solving operational bottlenecks across key economic sectors in Nigeria, Africa, Saudi Arabia, and International markets.
          </p>
        </div>

        {/* Industry Pills / Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-10">
          {industries.map((ind) => {
            const isSelected = selectedIndustry === ind.slug;
            return (
              <button
                key={ind.slug}
                onClick={() => setSelectedIndustry(ind.slug)}
                className={`flex items-center gap-2 p-3 rounded-xl text-left text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#2D96FF] text-white shadow-[0_0_15px_rgba(45,150,255,0.4)] border border-[#2D96FF]'
                    : 'bg-[#0F1D32] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <div className={isSelected ? 'text-white' : 'text-[#46DCDC]'}>
                  {getIndustryIcon(ind.icon)}
                </div>
                <span className="truncate">{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Deep-Dive */}
        <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#07101F] text-[#46DCDC] border border-slate-700">
                  {getIndustryIcon(activeInd.icon)}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{activeInd.name}</h2>
                  <p className="text-xs text-[#2D96FF] font-semibold">{activeInd.tagline}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onContactIndustry(activeInd.name)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold shadow-lg transition-all"
            >
              <span>Consult on {activeInd.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Operational Challenges */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Sector Operational Challenges</span>
              </h3>
              <div className="space-y-2">
                {activeInd.challenges.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#07101F]/80 border border-slate-800 text-xs text-slate-300">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Axion Applied Solutions */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#46DCDC]" />
                <span>Axion Engineering Solutions</span>
              </h3>
              <div className="space-y-2">
                {activeInd.solutionsApplied.map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#07101F]/80 border border-slate-800 text-xs text-slate-200 font-medium">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Case Metric Highlight */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#07101F] to-[#0D213F] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Implementation Snapshot:</span>
              <p className="text-xs text-white font-medium">{activeInd.caseExample}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#46DCDC] font-mono shrink-0 bg-[#07101F] px-3 py-2 rounded-lg border border-slate-800">
              <TrendingUp className="w-4 h-4 text-[#46DCDC]" />
              <span>{activeInd.metrics}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
