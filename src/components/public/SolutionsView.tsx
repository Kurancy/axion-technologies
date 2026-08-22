import React, { useState } from 'react';
import { Bot, Layers, Code, Warehouse, BarChart3, Compass, CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import type { ServiceItem } from '../../types/index.js';

interface SolutionsViewProps {
  initialSlug?: string;
  onOpenChat: () => void;
  onContactUs: () => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({ initialSlug, onOpenChat, onContactUs }) => {
  const [activeTab, setActiveTab] = useState<string>(initialSlug || 'ai-automation');

  const solutions = [
    {
      slug: 'ai-automation',
      name: 'AI & Intelligent Automation',
      icon: Bot,
      summary: 'Autonomous AI agents, document intelligence, OCR, and automated end-to-end business workflows.',
      description:
        'We build practical AI systems tailored to real business operations. From intelligent OCR document processing to autonomous enterprise agents that monitor systems, route approvals, and resolve complex multi-step workflows.',
      topics: [
        { title: 'AI Agents', desc: 'Autonomous task execution loops that monitor ERPs, process triggers, and perform verified transactions.' },
        { title: 'AI Assistants', desc: 'Enterprise conversational copilots grounded in your organization’s policies, ERP data, and knowledge repositories.' },
        { title: 'Workflow Automation', desc: 'Eliminate repetitive manual approvals, data re-entry, and cross-department delays.' },
        { title: 'OCR & Document Intelligence', desc: 'Sub-second parsing of invoices, airway bills, customs declarations, and medical claim forms in English and Arabic.' },
        { title: 'Business Process Automation', desc: 'End-to-end orchestration connecting legacy databases with modern cloud pipelines.' },
      ],
      deliverables: [
        'Custom AI Agent Pipelines',
        'Document OCR & Extraction API',
        'Workflow Integration Middleware',
        'Real-time Monitoring & Performance Analytics',
      ],
    },
    {
      slug: 'erp-sap',
      name: 'ERP & SAP Solutions',
      icon: Layers,
      summary: 'Certified SAP Business One implementations, legacy integrations, custom add-ons, and data pipelines.',
      description:
        'We bridge enterprise ERP systems with modern front-end applications, mobile tools, and automated pipelines. Whether deploying SAP Business One from scratch or building custom API middleware.',
      topics: [
        { title: 'SAP Business One', desc: 'End-to-end deployment, master data structuring, chart of accounts, and warehouse bin configurations.' },
        { title: 'ERP Integration', desc: 'High-throughput Service Layer connectors bridging SAP B1 with e-commerce, POS, WMS, and banking APIs.' },
        { title: 'Process Automation', desc: 'Automated bank reconciliations, vendor purchase order generation, and recurring invoice runs.' },
        { title: 'ERP Extensions', desc: 'Tailored add-ons for specific regional requirements (Nigeria FIRS e-invoicing, Saudi ZATCA Phase 2 compliance).' },
        { title: 'Business Data Integration', desc: 'Zero-latency bidirectional synchronizers between ERP databases and operational dashboards.' },
      ],
      deliverables: [
        'Full ERP Architecture Blueprint',
        'Custom Integration Connectors',
        'Data Migration & Cleansing Scripts',
        'User Training & 24/7 SLA Support',
      ],
    },
    {
      slug: 'enterprise-software',
      name: 'Enterprise Software',
      icon: Code,
      summary: 'Bespoke customer portals, internal operational systems, and resilient cloud architectures.',
      description:
        'We build high-performance custom business software that eliminates spreadsheets and fragmented tools. Designed for resilience, security, and high transactional throughput.',
      topics: [
        { title: 'Custom Business Applications', desc: 'Engineered from scratch around your unique workflow rather than forcing you into rigid off-the-shelf software.' },
        { title: 'Executive & Operational Dashboards', desc: 'Real-time telemetry and management controls for multi-branch organizations.' },
        { title: 'Client & Supplier Portals', desc: 'Secure self-service portals with role-based access control and live order tracking.' },
        { title: 'Internal Operations Systems', desc: 'Streamlined approval chains, asset tracking, timesheets, and resource allocation.' },
        { title: 'Workflow Applications', desc: 'Mobile-responsive web and native applications for field teams and office staff.' },
      ],
      deliverables: [
        'Production-Ready Enterprise Web & Mobile Apps',
        'Comprehensive Technical Documentation & API Schemas',
        'Automated CI/CD Pipelines & Automated Tests',
      ],
    },
    {
      slug: 'warehouse-management',
      name: 'Warehouse Management (WMS)',
      icon: Warehouse,
      summary: 'High-throughput inventory tracking, multi-depot logistics, barcode/RFID, and fleet visibility.',
      description:
        'Transform warehouse floors from chaotic paper-based tracking into precision digital command centers. Our WMS solutions deliver sub-second inventory visibility, barcode integration, and intelligent picking paths.',
      topics: [
        { title: 'Real-Time Inventory Control', desc: 'Multi-warehouse bin-level inventory tracking with instant stock balance updates.' },
        { title: 'Receiving & Putaway', desc: 'Guided barcode verification against purchase orders to eliminate receiving discrepancies.' },
        { title: 'Stock Movements & Transfers', desc: 'Automated transfer manifests, cross-docking, and inter-depot logistics tracking.' },
        { title: 'Warehouse Operations', desc: 'Wave picking, batch allocation, and packing station verification.' },
        { title: 'Logistics Analytics', desc: 'Heatmaps of high-velocity pick zones, employee picking rates, and inventory turnover ratios.' },
      ],
      deliverables: [
        'Axion WMS Deployment',
        'Barcode / Handheld Hardware Configuration',
        'ERP Master Data Synchronizer',
      ],
    },
    {
      slug: 'data-bi',
      name: 'Data & Business Intelligence',
      icon: BarChart3,
      summary: 'Real-time executive dashboards, data warehousing, KPI monitors, and operational reporting.',
      description:
        'Turn dark enterprise data into actionable executive intelligence. We build automated data pipelines, central data marts, and real-time visualization dashboards.',
      topics: [
        { title: 'Executive Dashboards', desc: 'Holistic command views showing revenue, margin, inventory, and operational health in real time.' },
        { title: 'Data Integration & Pipelines', desc: 'Automated ETL/ELT extraction from ERPs, databases, third-party APIs, and flat files.' },
        { title: 'Operational Analytics', desc: 'Bottleneck detection across production lines, supply chains, and customer fulfillment.' },
        { title: 'KPI Monitoring & Alerts', desc: 'Automated SMS, Telegram, and email thresholds notifying managers of critical anomalies.' },
        { title: 'Management Reporting', desc: 'Scheduled PDF/Excel executive summaries generated automatically on schedule.' },
      ],
      deliverables: [
        'Live Interactive BI Dashboards',
        'Data Warehouse Schemas & Automated Ingestion',
        'Executive KPI Digest Reports',
      ],
    },
    {
      slug: 'digital-transformation',
      name: 'Digital Transformation',
      icon: Compass,
      summary: 'Strategic technology audits, legacy system modernization, and scalable engineering roadmaps.',
      description:
        'We help enterprise leadership navigate complex technical evolutions without disrupting day-to-day operations. From legacy decoupling to cloud migration and change management.',
      topics: [
        { title: 'Process Analysis & Auditing', desc: 'Deep-dive assessments identifying manual friction, data bottlenecks, and redundant systems.' },
        { title: 'System Integration', desc: 'Connecting isolated software tools into a unified, coherent digital ecosystem.' },
        { title: 'Legacy Modernization', desc: 'Decoupling aging monoliths into high-performance cloud microservices.' },
        { title: 'Technology Strategy', desc: 'Pragmatic, step-by-step engineering roadmaps delivering measurable business milestones.' },
      ],
      deliverables: [
        'Strategic Technology Roadmap',
        'Architecture Audit & Risk Report',
        'Migration Execution Plan & Milestones',
      ],
    },
  ];

  const currentSolution = solutions.find((s) => s.slug === activeTab) || solutions[0];
  const CurrentIcon = currentSolution.icon;

  return (
    <div id="solutions-page-container" className="py-16 bg-[#07101F] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D96FF] uppercase tracking-widest bg-[#0F1D32] px-3 py-1 rounded-full border border-slate-800">
            Enterprise Solutions
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Engineered For Business Impact.
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Select a solution area to inspect technical capabilities, architecture patterns, and deliverables.
          </p>
        </div>

        {/* Horizontal Category Nav */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-[#0F1D32]">
          {solutions.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === s.slug;
            return (
              <button
                key={s.slug}
                id={`solution-tab-${s.slug}`}
                onClick={() => setActiveTab(s.slug)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#2D96FF] text-white shadow-[0_0_15px_rgba(45,150,255,0.4)]'
                    : 'bg-[#0F1D32] text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Solution Detail Card */}
        <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-sm space-y-8">
          {/* Title & Overview */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#07101F] border border-slate-700 text-[#46DCDC]">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{currentSolution.name}</h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {currentSolution.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenChat}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold shadow-lg transition-all"
              >
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>Ask AI About This</span>
              </button>
              <button
                onClick={onContactUs}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 hover:border-[#46DCDC] text-slate-200 hover:text-white text-xs font-semibold transition-all"
              >
                <span>Request Technical Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Capabilities Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Core Capabilities & Methodologies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSolution.topics.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#07101F]/80 border border-slate-800/90 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#46DCDC] shrink-0" />
                    <h4 className="text-sm font-bold text-white">{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#07101F] to-[#0A182F] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#46DCDC] uppercase tracking-wide">Enterprise Deliverables</h4>
              <p className="text-xs text-slate-300 mt-1">
                {currentSolution.deliverables.join(' • ')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SLA & Security Backed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
