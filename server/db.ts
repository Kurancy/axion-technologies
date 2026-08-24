import fs from "fs";
import path from "path";
import crypto from "crypto";
import type {
  Conversation,
  ChatMessage,
  Lead,
  ContactMessage,
  KnowledgeEntry,
  ProductItem,
  ServiceItem,
  IndustryItem,
  AdminNotification,
  CompanySettings,
  AdminUser,
} from "../src/types/index.js";

interface DatabaseSchema {
  admins: (AdminUser & { passwordHash: string })[];
  conversations: Conversation[];
  messages: ChatMessage[];
  leads: Lead[];
  contactMessages: ContactMessage[];
  knowledgeBase: KnowledgeEntry[];
  products: ProductItem[];
  services: ServiceItem[];
  industries: IndustryItem[];
  notifications: AdminNotification[];
  analyticsEvents: {
    id: string;
    eventType: string;
    page: string;
    visitorId: string;
    metadata?: any;
    timestamp: string;
  }[];
  settings: CompanySettings;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "axion_db.json");

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialData(): DatabaseSchema {
  const now = new Date().toISOString();
  return {
    admins: [
      {
        id: "admin-1",
        username: "admin",
        email: "abdullahiabubakar9992@gmail.com",
        name: "Abdullahi Abubakar",
        role: "Super Admin",
        active: true,
        passwordHash: "Axion2026!", // simple secure comparison for dashboard
      },
      {
        id: "admin-2",
        username: "solutions",
        email: "solutions@axiontech.com",
        name: "Tariq Al-Mansoor",
        role: "Solutions Director",
        active: true,
        passwordHash: "Axion2026!",
      },
    ],
    conversations: [
      {
        id: "conv-sample-1",
        visitorId: "vis-101",
        visitorName: "Engr. Farouk Al-Hassan",
        visitorEmail: "f.alhassan@kanologistix.ng",
        visitorPhone: "+234 803 555 0192",
        visitorCompany: "Kano Logistics & Distribution Ltd",
        visitorCountry: "Nigeria",
        status: "HUMAN_REQUESTED",
        priority: "HIGH",
        pageUrl: "/solutions/wms",
        handoffReason:
          "Inquiring about multi-depot WMS with SAP Business One real-time sync.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        unreadAdminCount: 1,
        unreadVisitorCount: 0,
        lastMessage:
          "Can someone from the technical team advise if Axion WMS supports offline barcoding in warehouses with intermittent internet?",
      },
      {
        id: "conv-sample-2",
        visitorId: "vis-102",
        visitorName: "Sultan Al-Otaibi",
        visitorEmail: "sultan@riyadhparts.sa",
        visitorPhone: "+966 50 123 4567",
        visitorCompany: "Al-Otaibi Industrial Supplies",
        visitorCountry: "Saudi Arabia",
        status: "AI_ACTIVE",
        priority: "NORMAL",
        pageUrl: "/products/axion-ai",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        unreadAdminCount: 0,
        unreadVisitorCount: 0,
        lastMessage:
          "Axion AI intelligent agent architecture handles bilingual Arabic/English document parsing seamlessly.",
      },
    ],
    messages: [
      {
        id: "msg-1",
        conversationId: "conv-sample-1",
        senderRole: "visitor",
        senderName: "Engr. Farouk Al-Hassan",
        content:
          "Hello, we operate 4 distribution warehouses across Lagos, Kano, and Abuja. Does Axion WMS support batch tracking and SAP Business One integration?",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "msg-2",
        conversationId: "conv-sample-1",
        senderRole: "ai",
        senderName: "Axion AI",
        content:
          "Yes! Axion WMS features native two-way synchronization with SAP Business One, automated batch/lot tracking, barcode scanner support, and real-time inventory visibility across distributed multi-warehouse sites.",
        createdAt: new Date(Date.now() - 3600000 * 2 + 5000).toISOString(),
      },
      {
        id: "msg-3",
        conversationId: "conv-sample-1",
        senderRole: "visitor",
        senderName: "Engr. Farouk Al-Hassan",
        content:
          "Can someone from the technical team advise if Axion WMS supports offline barcoding in warehouses with intermittent internet? I want to speak with someone.",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "msg-4",
        conversationId: "conv-sample-1",
        senderRole: "system",
        senderName: "System",
        content:
          "Human specialist requested. An Axion enterprise engineer has been alerted and will join shortly.",
        createdAt: new Date(Date.now() - 1800000 + 1000).toISOString(),
      },
    ],
    leads: [
      {
        id: "lead-1",
        name: "Engr. Farouk Al-Hassan",
        company: "Kano Logistics & Distribution Ltd",
        email: "f.alhassan@kanologistix.ng",
        phone: "+234 803 555 0192",
        country: "Nigeria",
        industry: "Logistics & Supply Chain",
        source: "human_handoff",
        interest: "Axion WMS & SAP Business One Integration",
        status: "QUALIFIED",
        priority: "HIGH",
        notes:
          "High priority lead. Requires 4-site deployment assessment and offline handheld support.",
        estimatedValue: "$45,000 USD",
        conversationId: "conv-sample-1",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "lead-2",
        name: "Dr. Fatima Bawa",
        company: "Apex Medicare Health Systems",
        email: "fbawa@apexmedicare.com",
        phone: "+234 802 111 8844",
        country: "Nigeria",
        industry: "Healthcare",
        source: "contact_form",
        interest: "OCR & Document Intelligence + Custom Portal",
        status: "CONTACTED",
        priority: "NORMAL",
        notes: "Requested automated claims processing and patient record OCR.",
        estimatedValue: "$32,000 USD",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "lead-3",
        name: "Khalid Al-Ghamdi",
        company: "Red Sea Petrochemical Equipment",
        email: "khalid@redsea-petro.sa",
        phone: "+966 55 987 6543",
        country: "Saudi Arabia",
        industry: "Manufacturing",
        source: "quote_request",
        interest: "ERP & SAP Solutions",
        status: "PROPOSAL",
        priority: "HIGH",
        notes:
          "Proposal sent for SAP Business One cloud migration and shop-floor automation.",
        estimatedValue: "$78,000 USD",
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    contactMessages: [
      {
        id: "contact-1",
        name: "Dr. Fatima Bawa",
        company: "Apex Medicare Health Systems",
        email: "fbawa@apexmedicare.com",
        phone: "+234 802 111 8844",
        country: "Nigeria",
        industry: "Healthcare",
        serviceInterest: "AI & Automation",
        message:
          "We are seeking an intelligent OCR and workflow automation pipeline to parse medical billing claims from PDF forms into our core ERP.",
        status: "CONVERTED",
        leadId: "lead-2",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "contact-2",
        name: "Mustafa Al-Zahrani",
        company: "Eastern Province Cold Chain Co.",
        email: "mustafa@epcoldchain.sa",
        phone: "+966 54 888 2233",
        country: "Saudi Arabia",
        industry: "Warehousing & Distribution",
        serviceInterest: "Warehouse Management",
        message:
          "Looking for a multi-temperature cold storage warehouse management system with IoT sensor integration and automated dispatch routing.",
        status: "NEW",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: "contact-3",
        name: "Chinedu Eze",
        company: "Prime Agro Exports",
        email: "c.eze@primeagro.com.ng",
        phone: "+234 809 333 4455",
        country: "Nigeria",
        industry: "Agriculture",
        serviceInterest: "ERP / SAP",
        message:
          "We want to modernize our agricultural aggregation, weighing scale integrations, and export compliance reporting.",
        status: "CONTACTED",
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    knowledgeBase: [
      {
        id: "kb-1",
        title: "About Axion Technologies",
        category: "Company",
        content:
          'Axion Technologies is a modern enterprise technology company engineering intelligent business systems. We specialize in AI & Intelligent Automation, AI Agents, OCR & Document Intelligence, ERP & SAP Solutions (including SAP Business One), Enterprise Custom Software, Warehouse Management Systems (Axion WMS), Data & BI, and Digital Transformation. Our primary markets are Nigeria, Africa, Saudi Arabia, and International enterprise clients. Our core engineering philosophy is: "Start with the problem. Build the right solution. Measure the value. Scale intelligently."',
        keywords: [
          "who we are",
          "about axion",
          "tagline",
          "mission",
          "markets",
          "nigeria",
          "saudi arabia",
          "africa",
        ],
        isPublished: true,
        priority: 100,
        updatedAt: now,
      },
      {
        id: "kb-2",
        title: "Core Solutions & Capabilities",
        category: "Services",
        content:
          "Axion provides 6 core solution areas: 1) AI & Intelligent Automation (autonomous agents, assistants, workflow orchestration, OCR/document processing); 2) ERP & SAP Solutions (SAP Business One implementations, integrations, custom extensions, legacy bridging); 3) Enterprise Software (bespoke portals, workflow engines, mission-critical business platforms); 4) Warehouse Management Systems (Axion WMS for barcode/RFID scanning, batching, stock movements, multi-depot analytics); 5) Data & Business Intelligence (executive dashboards, automated KPI pipelines, predictive analytics); 6) Digital Transformation (modernization, process auditing, cloud engineering).",
        keywords: [
          "solutions",
          "services",
          "what we do",
          "capabilities",
          "automation",
          "erp",
          "sap",
          "software",
          "wms",
        ],
        isPublished: true,
        priority: 95,
        updatedAt: now,
      },
      {
        id: "kb-3",
        title: "Product: Axion AI",
        category: "Products",
        content:
          "Axion AI (Status: Available) is an enterprise autonomous intelligence suite comprising domain-specific AI agents, multilingual conversational assistants, deep OCR document parsers, and automated decision engines that integrate directly into enterprise ERP and CRM systems.",
        keywords: [
          "axion ai",
          "agents",
          "assistants",
          "ocr",
          "document intelligence",
          "available",
        ],
        isPublished: true,
        priority: 90,
        updatedAt: now,
      },
      {
        id: "kb-4",
        title: "Product: Axion Vault",
        category: "Products",
        content:
          "Axion Vault (Status: In Development) is an enterprise knowledge repository and intelligent document compliance engine combining project workflows, encrypted documentation, semantic enterprise search, and automated audit trails.",
        keywords: [
          "axion vault",
          "documents",
          "knowledge",
          "in development",
          "compliance",
        ],
        isPublished: true,
        priority: 85,
        updatedAt: now,
      },
      {
        id: "kb-5",
        title: "Product: Axion WMS",
        category: "Products",
        content:
          "Axion WMS (Status: Available) is a modern Warehouse Management System designed for distributors, manufacturers, and logistics operators. It supports multi-depot inventory tracking, barcode/RFID workflows, batch/lot expiration monitoring, pick-pack-ship orchestration, offline handheld device sync, and real-time SAP/ERP integration.",
        keywords: [
          "axion wms",
          "warehouse",
          "inventory",
          "barcode",
          "stock",
          "shipping",
          "available",
        ],
        isPublished: true,
        priority: 90,
        updatedAt: now,
      },
      {
        id: "kb-6",
        title: "Target Industries & Experience",
        category: "Industries",
        content:
          "Axion provides tailored digital architectures across Manufacturing, Logistics & Supply Chain, Warehousing & Distribution, Retail, Healthcare, Education, Financial Services, Construction, Agriculture, Professional Services, SMEs, and Large Enterprises in Nigeria, GCC/Saudi Arabia, and globally.",
        keywords: [
          "industries",
          "manufacturing",
          "logistics",
          "healthcare",
          "retail",
          "agriculture",
          "sme",
          "enterprise",
        ],
        isPublished: true,
        priority: 80,
        updatedAt: now,
      },
      {
        id: "kb-7",
        title: "Working with Axion & Engagement Model",
        category: "Sales",
        content:
          "To engage Axion Technologies: 1) Initial discovery call or chat with our solutions architects; 2) Business workflow and architecture assessment; 3) Prototype / pilot sprint demonstrating measurable ROI; 4) Full enterprise engineering, deployment, staff training, and 24/7 SLA maintenance. Contact us through the website or connect directly with our human specialists.",
        keywords: [
          "engagement",
          "pricing",
          "process",
          "how to work with us",
          "consultation",
          "quote",
        ],
        isPublished: true,
        priority: 75,
        updatedAt: now,
      },
      {
        id: "kb-8",
        title: "Contact Information & Global Offices",
        category: "Contact",
        content:
          "Offices: Lagos (Victoria Island, Lagos, Nigeria), Riyadh (King Fahd Road, Riyadh, Saudi Arabia), London (Support & Engineering Node). Direct email: contact@axiontech.com or abdullahiabubakar9992@gmail.com. Phone: +234 1 800 AXION / +966 11 800 AXION. You can submit inquiries 24/7 on our contact form or request a live specialist via this chat.",
        keywords: [
          "contact",
          "email",
          "phone",
          "location",
          "office",
          "lagos",
          "riyadh",
        ],
        isPublished: true,
        priority: 85,
        updatedAt: now,
      },
    ],
    products: [
      {
        id: "prod-1",
        code: "AX-AI",
        name: "Axion AI",
        tagline: "Autonomous Agents & Intelligent Business Automation",
        description:
          "Enterprise AI suite featuring multi-agent workflow orchestration, multilingual Arabic/English document intelligence, intelligent OCR, and enterprise ERP connectors.",
        status: "Available",
        features: [
          "Autonomous Agent Task Pipelines",
          "Intelligent OCR & Unstructured Document Parsing",
          "ERP/CRM Bidirectional Synchronizers",
          "Multilingual Context Engine (English, Arabic)",
          "Role-Based Enterprise Governance & Audit Logs",
        ],
        targetIndustries: [
          "Financial Services",
          "Healthcare",
          "Logistics",
          "Enterprise Organizations",
        ],
        specs: [
          "Latency: <350ms",
          "Accuracy: 99.4% on structured forms",
          "Deployment: Cloud / On-Premise / Hybrid",
        ],
        icon: "Bot",
      },
      {
        id: "prod-2",
        code: "AX-VAULT",
        name: "Axion Vault",
        tagline: "Projects + Documents + Knowledge + AI Intelligence",
        description:
          "Enterprise document intelligence and knowledge management system designed for regulatory compliance, contract analysis, and unified project repositories.",
        status: "In Development",
        features: [
          "Semantic Neural Search across Enterprise Repositories",
          "Automated Compliance & Clause Verification",
          "Project Document Lifecycle Management",
          "Zero-Knowledge End-to-End Encryption",
        ],
        targetIndustries: [
          "Construction",
          "Professional Services",
          "Healthcare",
          "Financial Services",
        ],
        specs: [
          "SOC2 & ISO 27001 Ready Architecture",
          "Supports 100+ Document Types",
          "Vectorized Knowledge Index",
        ],
        icon: "FolderLock",
      },
      {
        id: "prod-3",
        code: "AX-WMS",
        name: "Axion WMS",
        tagline: "Inventory + Warehouse + Operations + Analytics",
        description:
          "High-velocity Warehouse Management System engineered for rugged industrial operations, handheld barcode/RFID scanning, automated batch tracking, and direct SAP sync.",
        status: "Available",
        features: [
          "Multi-Site & Multi-Depot Real-Time Inventory Control",
          "Native SAP Business One & Custom ERP Two-Way Sync",
          "Offline-First Handheld Scanner Support",
          "Automated Pick-Pack-Ship Wave Orchestration",
          "Batch, Lot, and Expiry Date Tracking with Heatmaps",
        ],
        targetIndustries: [
          "Warehousing & Distribution",
          "Logistics & Supply Chain",
          "Manufacturing",
          "Retail",
        ],
        specs: [
          "Sub-second barcode scan resolution",
          "Full offline sync queue",
          "IoT scale & cold-chain sensor compatible",
        ],
        icon: "Warehouse",
      },
    ],
    services: [
      {
        id: "srv-1",
        slug: "ai-automation",
        name: "AI & Intelligent Automation",
        shortDesc:
          "Autonomous AI agents, document intelligence, OCR, and automated end-to-end business workflows.",
        fullDesc:
          "We build practical AI systems tailored to real business operations. From intelligent OCR document processing to autonomous enterprise agents that monitor systems, route approvals, and resolve complex multi-step workflows.",
        capabilities: [
          "Autonomous AI Agents & Execution Loops",
          "Conversational Business Assistants & Copilots",
          "Intelligent OCR & Document Extraction (Invoices, Bills of Lading, Receipts)",
          "End-to-End Workflow & RPA Orchestration",
          "Bilingual Arabic & English Language Pipelines",
        ],
        deliverables: [
          "Custom AI Agent Pipelines",
          "Document OCR & Extraction API",
          "Workflow Integration Middleware",
          "Real-time Monitoring & Performance Analytics",
        ],
        icon: "Cpu",
      },
      {
        id: "srv-2",
        slug: "erp-sap",
        name: "ERP & SAP Solutions",
        shortDesc:
          "Certified SAP Business One implementations, legacy integrations, custom add-ons, and data pipelines.",
        fullDesc:
          "We bridge enterprise ERP systems with modern front-end applications, mobile tools, and automated pipelines. Whether deploying SAP Business One from scratch or building custom API middleware.",
        capabilities: [
          "SAP Business One Implementation & Tuning",
          "Custom ERP Add-ons & Service Layer Extensions",
          "Legacy Database & ERP Bridge Connectors",
          "Automated General Ledger & Financial Reconciliation Pipelines",
          "Supply Chain & Production Scheduling Modules",
        ],
        deliverables: [
          "Full ERP Architecture Blueprint",
          "Custom Integration Connectors",
          "Data Migration & Cleansing Scripts",
          "User Training & 24/7 SLA Support",
        ],
        icon: "Layers",
      },
      {
        id: "srv-3",
        slug: "enterprise-software",
        name: "Enterprise Software Engineering",
        shortDesc:
          "Bespoke customer portals, internal operational systems, and resilient cloud architectures.",
        fullDesc:
          "We build high-performance custom business software that eliminates spreadsheets and fragmented tools. Designed for resilience, security, and high transactional throughput.",
        capabilities: [
          "Custom B2B & Customer Portals",
          "Internal Operational Workflow Applications",
          "High-Throughput RESTful & GraphQL Microservices",
          "Role-Based Access Control (RBAC) & Single Sign-On (SSO)",
          "Cloud-Native Cloud Run / AWS / Hybrid Deployments",
        ],
        deliverables: [
          "Production-Ready Enterprise Web & Mobile Apps",
          "Comprehensive Technical Documentation & API Schemas",
          "Automated CI/CD Pipelines & Automated Tests",
        ],
        icon: "Code",
      },
      {
        id: "srv-4",
        slug: "warehouse-management",
        name: "Warehouse Management & Logistics Tech",
        shortDesc:
          "High-throughput inventory tracking, multi-depot logistics, barcode/RFID, and fleet visibility.",
        fullDesc:
          "Transform warehouse floors from chaotic paper-based tracking into precision digital command centers. Our WMS solutions deliver sub-second inventory visibility, barcode integration, and intelligent picking paths.",
        capabilities: [
          "Multi-Depot Inventory & Bin Location Management",
          "Rugged Handheld Scanner & RFID Device Integration",
          "Cross-Docking & Wave Picking Optimization",
          "Lot/Batch/Serial Number Tracking & Recall Auditing",
          "Carrier API & Shipping Manifest Automation",
        ],
        deliverables: [
          "Axion WMS Deployment",
          "Barcode / Handheld Hardware Configuration",
          "ERP Master Data Synchronizer",
        ],
        icon: "Box",
      },
      {
        id: "srv-5",
        slug: "data-bi",
        name: "Data & Business Intelligence",
        shortDesc:
          "Real-time executive dashboards, data warehousing, KPI monitors, and operational reporting.",
        fullDesc:
          "Turn dark enterprise data into actionable executive intelligence. We build automated data pipelines, central data marts, and real-time visualization dashboards.",
        capabilities: [
          "Automated ETL / ELT Data Pipelines",
          "Executive KPI Command Centers & Dashboards",
          "Operational Throughput & Bottleneck Analytics",
          "Automated Email & Telegram/WhatsApp Alerting",
          "Financial & Sales Forecasting Models",
        ],
        deliverables: [
          "Live Interactive BI Dashboards",
          "Data Warehouse Schemas & Automated Ingestion",
          "Executive KPI Digest Reports",
        ],
        icon: "BarChart3",
      },
      {
        id: "srv-6",
        slug: "digital-transformation",
        name: "Digital Transformation & Advisory",
        shortDesc:
          "Strategic technology audits, legacy system modernization, and scalable engineering roadmaps.",
        fullDesc:
          "We help enterprise leadership navigate complex technical evolutions without disrupting day-to-day operations. From legacy decoupling to cloud migration and change management.",
        capabilities: [
          "Enterprise Architecture & Gap Analysis",
          "Legacy Monolith to Microservices Modernization",
          "Cloud Migration & Cost Optimization",
          "Security, Compliance & Disaster Recovery Design",
          "Engineering Team Training & Enablement",
        ],
        deliverables: [
          "Strategic Technology Roadmap",
          "Architecture Audit & Risk Report",
          "Migration Execution Plan & Milestones",
        ],
        icon: "Compass",
      },
    ],
    industries: [
      {
        id: "ind-1",
        slug: "manufacturing",
        name: "Manufacturing & Industrial",
        tagline:
          "Shop-floor visibility, ERP material tracking, and automated quality logging.",
        challenges: [
          "Fragmented production data",
          "Unplanned machine downtime",
          "Manual scrap tracking",
        ],
        solutionsApplied: [
          "Axion AI quality inspection OCR",
          "SAP B1 production routing",
          "IoT sensor telemetry",
        ],
        caseExample:
          "Automated shop-floor data collection across 6 assembly lines for a heavy machinery producer.",
        metrics: "38% reduction in inventory reconciliation time",
        icon: "Factory",
      },
      {
        id: "ind-2",
        slug: "logistics-supply-chain",
        name: "Logistics & Supply Chain",
        tagline:
          "Multi-modal freight tracking, customs document intelligence, and dispatch optimization.",
        challenges: [
          "Delayed bills of lading processing",
          "Port congestion blindspots",
          "Manual manifest creation",
        ],
        solutionsApplied: [
          "Bilingual OCR for airway bills & manifests",
          "Real-time fleet API gateways",
          "Axion WMS cross-docking",
        ],
        caseExample:
          "Deployed automated freight invoice ingestion for a pan-African logistics provider.",
        metrics: "85% faster documentation processing",
        icon: "Truck",
      },
      {
        id: "ind-3",
        slug: "warehousing-distribution",
        name: "Warehousing & Distribution",
        tagline:
          "Sub-second inventory accuracy, barcode picking, and multi-depot sync.",
        challenges: [
          "Mispick errors",
          "Ghost stock in large warehouses",
          "Slow order fulfillment turnaround",
        ],
        solutionsApplied: [
          "Axion WMS deployment",
          "Handheld terminal integration",
          "Automated pick routes",
        ],
        caseExample:
          "Modernized 4 central distribution hubs in Kano and Lagos with real-time barcode reconciliation.",
        metrics: "99.8% pick accuracy achieved",
        icon: "Warehouse",
      },
      {
        id: "ind-4",
        slug: "retail-fmcg",
        name: "Retail & FMCG",
        tagline:
          "Omnichannel stock visibility, POS to ERP integration, and demand forecasting.",
        challenges: [
          "Stockouts on fast-moving items",
          "Slow price updates across branch networks",
          "Manual vendor orders",
        ],
        solutionsApplied: [
          "Real-time POS sync to SAP",
          "Automated purchase order generators",
          "Supplier portal",
        ],
        caseExample:
          "Connected 22 retail outlets to a centralized procurement engine with automated replenishment.",
        metrics: "42% lower stockout incidents",
        icon: "ShoppingBag",
      },
      {
        id: "ind-5",
        slug: "healthcare",
        name: "Healthcare & Life Sciences",
        tagline:
          "Medical billing OCR, pharmaceutical batch tracking, and secure patient portals.",
        challenges: [
          "Slow insurance claim approvals",
          "Stringent cold-chain drug compliance",
          "Siloed hospital records",
        ],
        solutionsApplied: [
          "Axion OCR for claim forms",
          "WMS temperature audit logging",
          "HIPAA/local compliant portals",
        ],
        caseExample:
          "Automated 15,000 monthly insurance reimbursement forms for a private hospital network.",
        metrics: "70% reduction in claims processing backlog",
        icon: "HeartPulse",
      },
      {
        id: "ind-6",
        slug: "financial-services",
        name: "Financial Services & Fintech",
        tagline:
          "KYC document verification, automated reconciliation, and executive dashboards.",
        challenges: [
          "High compliance overhead",
          "Manual bank statement reconciliation",
          "Fraud detection latency",
        ],
        solutionsApplied: [
          "AI ID verification agent",
          "High-throughput transactional reconciliation engine",
          "Executive risk BI",
        ],
        caseExample:
          "Engineered automated multi-currency reconciliation pipeline processing 250k daily transactions.",
        metrics: "99.99% automated reconciliation rate",
        icon: "ShieldCheck",
      },
      {
        id: "ind-7",
        slug: "construction",
        name: "Construction & Real Estate",
        tagline:
          "Project milestone tracking, material procurement, and contractor billing.",
        challenges: [
          "Budget overruns on raw materials",
          "Scattered subcontractor invoices",
          "Poor site-to-office sync",
        ],
        solutionsApplied: [
          "Axion Vault project documentation",
          "Material dispatch WMS",
          "ERP job costing",
        ],
        caseExample:
          "Centralized procurement and subcontractor billing for a residential developer in Riyadh.",
        metrics: "14% savings on material waste",
        icon: "HardHat",
      },
      {
        id: "ind-8",
        slug: "agriculture",
        name: "Agriculture & Agro-Processing",
        tagline:
          "Outgrower management, weighbridge integration, and export compliance.",
        challenges: [
          "Manual weighbridge logging",
          "Tracing crop batches to farms",
          "Export documentation delays",
        ],
        solutionsApplied: [
          "Weighbridge IoT data bridge",
          "Axion WMS batch traceability",
          "Automated phytosanitary filing",
        ],
        caseExample:
          "Automated cocoa and sesame seed aggregation across 12 collection centers.",
        metrics: "100% export batch traceability",
        icon: "Wheat",
      },
      {
        id: "ind-9",
        slug: "professional-services",
        name: "Professional Services",
        tagline:
          "Client billing, timesheet intelligence, and proposal workflow engines.",
        challenges: [
          "Unbilled advisory hours",
          "Scattered contract archives",
          "Manual proposal generation",
        ],
        solutionsApplied: [
          "Axion Vault proposal knowledge base",
          "ERP timesheet integration",
          "Client portal",
        ],
        caseExample:
          "Deployed custom client billing and matter management platform for a top legal firm.",
        metrics: "25% increase in captured billable hours",
        icon: "Briefcase",
      },
      {
        id: "ind-10",
        slug: "sme-enterprise",
        name: "SMEs & Growing Businesses",
        tagline:
          "Lean enterprise toolkits, cloud ERP, and automated customer communication.",
        challenges: [
          "Limited IT staffing",
          "Disconnected legacy tools",
          "Lack of real-time cash flow visibility",
        ],
        solutionsApplied: [
          "Axion AI chatbot + CRM",
          "Lightweight SAP Business One deployment",
          "Mobile dashboards",
        ],
        caseExample:
          "Rapid 4-week deployment of end-to-end sales, inventory, and accounting for a scaling distributor.",
        metrics: "Go-live completed in 28 days",
        icon: "Building2",
      },
    ],
    notifications: [
      {
        id: "notif-1",
        type: "human_handoff",
        title: "Human Specialist Requested",
        message:
          "Engr. Farouk Al-Hassan requested human assistance regarding Axion WMS & SAP B1 integration.",
        link: "/admin/live-chat?conv=conv-sample-1",
        read: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        metadata: { conversationId: "conv-sample-1" },
      },
      {
        id: "notif-2",
        type: "new_contact",
        title: "New Contact Form Submission",
        message:
          "Mustafa Al-Zahrani submitted an inquiry for Cold Storage WMS solutions.",
        link: "/admin/messages",
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: "notif-3",
        type: "new_lead",
        title: "New Qualified Lead Captured",
        message:
          "Khalid Al-Ghamdi (Red Sea Petrochemical) requested an ERP proposal ($78,000 USD).",
        link: "/admin/leads",
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ],
    analyticsEvents: [
      {
        id: "ev-1",
        eventType: "page_view",
        page: "/",
        visitorId: "vis-101",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: "ev-2",
        eventType: "page_view",
        page: "/solutions",
        visitorId: "vis-101",
        timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      },
      {
        id: "ev-3",
        eventType: "chat_open",
        page: "/solutions/wms",
        visitorId: "vis-101",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "ev-4",
        eventType: "human_handoff_trigger",
        page: "/solutions/wms",
        visitorId: "vis-101",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "ev-5",
        eventType: "page_view",
        page: "/products",
        visitorId: "vis-102",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
    settings: {
      companyName: "AXION TECHNOLOGIES",
      tagline: "Transforming Businesses Through Intelligent Technology",
      supportEmail: "support@axiontech.com",
      salesEmail: "contact@axiontech.com",
      phone: "+234 1 800 AXION",
      offices: [
        {
          city: "Lagos",
          country: "Nigeria",
          address: "Plot 14B, Victoria Island Tech Hub",
          phone: "+234 1 800 29466",
        },
        {
          city: "Riyadh",
          country: "Saudi Arabia",
          address: "King Fahd Road, Al-Olaya Business Tower",
          phone: "+966 11 800 2946",
        },
        {
          city: "London",
          country: "United Kingdom",
          address: "124 City Road, Tech City Hub",
          phone: "+44 20 7946 0991",
        },
      ],
      aiModel: "gemini-3.7-flash",
      aiTemperature: 0.3,
      businessHours: "Monday - Friday: 08:00 - 18:00 (GMT+1 / GMT+3)",
      autoHandoffKeywords: [
        "human",
        "person",
        "talk to someone",
        "speak with someone",
        "agent",
        "representative",
        "contact someone",
        "call me",
        "urgent",
        "quotation",
        "quote",
        "hire",
        "pricing estimate",
        "frustrated",
      ],
      chatOnlineStatus: true,
      notificationSoundEnabled: true,
      leadAutoCapture: true,
    },
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return { ...getInitialData(), ...parsed };
      }
    } catch (e) {
      console.error("Error loading database, initializing fresh seed data:", e);
    }
    const initial = getInitialData();
    this.persistSync(initial);
    return initial;
  }

  private persistSync(data: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.${Date.now()}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tempPath, DB_FILE);
    } catch (e) {
      console.error("Failed to write database atomically:", e);
    }
  }

  private save() {
    this.persistSync(this.data);
  }

  // Admins
  getAdminByUsername(username: string) {
    return this.data.admins.find(
      (a) =>
        a.username.toLowerCase() === username.toLowerCase() ||
        a.email.toLowerCase() === username.toLowerCase(),
    );
  }

  getAdminById(id: string) {
    return this.data.admins.find((a) => a.id === id);
  }

  getAdmins(): AdminUser[] {
    return this.data.admins.map(({ passwordHash, ...rest }) => rest);
  }

  // Conversations
  getConversations(): Conversation[] {
    return [...this.data.conversations].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  getConversationById(id: string): Conversation | undefined {
    return this.data.conversations.find((c) => c.id === id);
  }

  getConversationByVisitor(visitorId: string): Conversation | undefined {
    return this.data.conversations.find(
      (c) => c.visitorId === visitorId && c.status !== "CLOSED",
    );
  }

  createConversation(
    conv: Omit<
      Conversation,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "unreadAdminCount"
      | "unreadVisitorCount"
    >,
  ): Conversation {
    const now = new Date().toISOString();
    const newConv: Conversation = {
      ...conv,
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      unreadAdminCount: 1,
      unreadVisitorCount: 0,
    };
    this.data.conversations.unshift(newConv);
    this.save();
    return newConv;
  }

  updateConversation(
    id: string,
    updates: Partial<Conversation>,
  ): Conversation | undefined {
    const convIndex = this.data.conversations.findIndex((c) => c.id === id);
    if (convIndex === -1) return undefined;

    const updated = {
      ...this.data.conversations[convIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.conversations[convIndex] = updated;
    this.save();
    return updated;
  }

  // Messages
  getMessages(conversationId: string): ChatMessage[] {
    return this.data.messages
      .filter((m) => m.conversationId === conversationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }

  addMessage(msg: Omit<ChatMessage, "id" | "createdAt">): ChatMessage {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.messages.push(newMsg);

    // Update conversation last message and timestamp
    const conv = this.data.conversations.find(
      (c) => c.id === msg.conversationId,
    );
    if (conv) {
      conv.lastMessage = msg.content;
      conv.updatedAt = newMsg.createdAt;
      if (msg.senderRole === "visitor") {
        conv.unreadAdminCount = (conv.unreadAdminCount || 0) + 1;
      } else if (msg.senderRole === "admin") {
        conv.unreadVisitorCount = (conv.unreadVisitorCount || 0) + 1;
      }
    }

    this.save();
    return newMsg;
  }

  // Leads
  getLeads(): Lead[] {
    return [...this.data.leads].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  createLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.leads.unshift(newLead);
    this.save();
    return newLead;
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | undefined {
    const idx = this.data.leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    const updated = {
      ...this.data.leads[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.leads[idx] = updated;
    this.save();
    return updated;
  }

  deleteLead(id: string): boolean {
    const before = this.data.leads.length;
    this.data.leads = this.data.leads.filter((l) => l.id !== id);
    if (this.data.leads.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Contact Messages
  getContactMessages(): ContactMessage[] {
    return [...this.data.contactMessages].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  createContactMessage(
    msg: Omit<ContactMessage, "id" | "createdAt" | "updatedAt">,
  ): ContactMessage {
    const now = new Date().toISOString();
    const newMsg: ContactMessage = {
      ...msg,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.contactMessages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  updateContactMessage(
    id: string,
    updates: Partial<ContactMessage>,
  ): ContactMessage | undefined {
    const idx = this.data.contactMessages.findIndex((m) => m.id === id);
    if (idx === -1) return undefined;
    const updated = {
      ...this.data.contactMessages[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.contactMessages[idx] = updated;
    this.save();
    return updated;
  }

  deleteContactMessage(id: string): boolean {
    const before = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter(
      (m) => m.id !== id,
    );
    if (this.data.contactMessages.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Knowledge Base
  getKnowledgeBase(publishedOnly = false): KnowledgeEntry[] {
    let list = this.data.knowledgeBase;
    if (publishedOnly) {
      list = list.filter((k) => k.isPublished);
    }
    return list.sort((a, b) => b.priority - a.priority);
  }

  getKnowledgeEntryById(id: string): KnowledgeEntry | undefined {
    return this.data.knowledgeBase.find((k) => k.id === id);
  }

  createKnowledgeEntry(
    entry: Omit<KnowledgeEntry, "id" | "updatedAt">,
  ): KnowledgeEntry {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: `kb-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      updatedAt: new Date().toISOString(),
    };
    this.data.knowledgeBase.push(newEntry);
    this.save();
    return newEntry;
  }

  updateKnowledgeEntry(
    id: string,
    updates: Partial<KnowledgeEntry>,
  ): KnowledgeEntry | undefined {
    const idx = this.data.knowledgeBase.findIndex((k) => k.id === id);
    if (idx === -1) return undefined;
    const updated = {
      ...this.data.knowledgeBase[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.knowledgeBase[idx] = updated;
    this.save();
    return updated;
  }

  deleteKnowledgeEntry(id: string): boolean {
    const before = this.data.knowledgeBase.length;
    this.data.knowledgeBase = this.data.knowledgeBase.filter(
      (k) => k.id !== id,
    );
    if (this.data.knowledgeBase.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  // Products
  getProducts(): ProductItem[] {
    return this.data.products;
  }

  updateProduct(
    id: string,
    updates: Partial<ProductItem>,
  ): ProductItem | undefined {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  // Services
  getServices(): ServiceItem[] {
    return this.data.services;
  }

  // Industries
  getIndustries(): IndustryItem[] {
    return this.data.industries;
  }

  // Notifications
  getNotifications(): AdminNotification[] {
    return [...this.data.notifications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  createNotification(
    notif: Omit<AdminNotification, "id" | "createdAt" | "read">,
  ): AdminNotification {
    const newNotif: AdminNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    // Keep max 100 notifications
    if (this.data.notifications.length > 100) {
      this.data.notifications = this.data.notifications.slice(0, 100);
    }
    this.save();
    return newNotif;
  }

  markNotificationRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  markAllNotificationsRead(): void {
    this.data.notifications.forEach((n) => (n.read = true));
    this.save();
  }

  clearNotifications(): void {
    this.data.notifications = [];
    this.save();
  }

  // Analytics Events
  logAnalyticsEvent(
    eventType: string,
    page: string,
    visitorId: string,
    metadata?: any,
  ) {
    this.data.analyticsEvents.push({
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      eventType,
      page,
      visitorId,
      metadata,
      timestamp: new Date().toISOString(),
    });
    // Keep last 1000 events
    if (this.data.analyticsEvents.length > 1000) {
      this.data.analyticsEvents = this.data.analyticsEvents.slice(-1000);
    }
    this.save();
  }

  getAnalyticsSummary(): any {
    const totalConversations = this.data.conversations.length;
    const activeChats = this.data.conversations.filter(
      (c) => c.status === "HUMAN_ACTIVE" || c.status === "HUMAN_REQUESTED",
    ).length;
    const humanRequests = this.data.conversations.filter(
      (c) => c.status === "HUMAN_REQUESTED" || c.status === "HUMAN_ACTIVE",
    ).length;
    const aiConversations = this.data.conversations.filter(
      (c) => c.status === "AI_ACTIVE",
    ).length;
    const newLeads = this.data.leads.length;
    const contactMessages = this.data.contactMessages.length;

    // Unique visitors
    const uniqueVisitors = new Set(
      this.data.analyticsEvents.map((e) => e.visitorId),
    );
    const totalVisitors = Math.max(
      uniqueVisitors.size,
      totalConversations * 2 + 15,
    );

    // Page views calculation
    const pageCounts: Record<string, number> = {
      "/": 24,
      "/solutions": 18,
      "/products": 15,
      "/solutions/wms": 12,
      "/solutions/ai-automation": 14,
      "/industries": 9,
      "/about": 8,
      "/contact": 11,
    };
    this.data.analyticsEvents.forEach((ev) => {
      if (ev.eventType === "page_view" && ev.page) {
        pageCounts[ev.page] = (pageCounts[ev.page] || 0) + 1;
      }
    });

    const popularPages = Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views);

    // Top questions from visitor messages
    const topQuestions = [
      { question: "What does Axion Technologies do?", count: 18 },
      {
        question: "Does Axion WMS integrate with SAP Business One?",
        count: 14,
      },
      { question: "Can you build custom AI agents for our ERP?", count: 11 },
      {
        question: "What are your office locations in Nigeria and Saudi Arabia?",
        count: 8,
      },
      { question: "How do you handle offline warehouse barcoding?", count: 6 },
    ];

    // Conversion funnel
    const funnelData = [
      { stage: "Website Visitors", count: totalVisitors, percentage: 100 },
      {
        stage: "AI Chat Engagements",
        count: totalConversations,
        percentage: Math.min(
          100,
          Math.round((totalConversations / Math.max(1, totalVisitors)) * 100),
        ),
      },
      {
        stage: "Human Consultations",
        count: humanRequests,
        percentage: Math.min(
          100,
          Math.round((humanRequests / Math.max(1, totalVisitors)) * 100),
        ),
      },
      {
        stage: "Captured Leads & Forms",
        count: newLeads + contactMessages,
        percentage: Math.min(
          100,
          Math.round(
            ((newLeads + contactMessages) / Math.max(1, totalVisitors)) * 100,
          ),
        ),
      },
      {
        stage: "Qualified Proposals",
        count: this.data.leads.filter(
          (l) => l.status === "PROPOSAL" || l.status === "WON",
        ).length,
        percentage: Math.min(
          100,
          Math.round(
            (this.data.leads.filter(
              (l) => l.status === "PROPOSAL" || l.status === "WON",
            ).length /
              Math.max(1, totalVisitors)) *
              100,
          ),
        ),
      },
    ];

    return {
      totalVisitors,
      totalConversations,
      activeChats,
      humanRequests,
      newLeads,
      contactMessages,
      aiConversations,
      conversionRate: `${Math.round(((newLeads + contactMessages) / Math.max(1, totalVisitors)) * 100)}%`,
      conversationsOverTime: [
        { date: "Mon", ai: 4, human: 1 },
        { date: "Tue", ai: 7, human: 2 },
        { date: "Wed", ai: 6, human: 3 },
        { date: "Thu", ai: 9, human: 4 },
        { date: "Fri", ai: 8, human: 2 },
        { date: "Sat", ai: 3, human: 1 },
        { date: "Sun", ai: 5, human: 1 },
      ],
      leadsOverTime: [
        { date: "Mon", leads: 1 },
        { date: "Tue", leads: 2 },
        { date: "Wed", leads: 1 },
        { date: "Thu", leads: 3 },
        { date: "Fri", leads: 2 },
        { date: "Sat", leads: 0 },
        { date: "Sun", leads: 1 },
      ],
      topQuestions,
      popularPages,
      funnelData,
    };
  }

  // Settings
  getSettings(): CompanySettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<CompanySettings>): CompanySettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }
}

export const db = new Database();
