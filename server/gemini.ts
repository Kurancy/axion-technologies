import { GoogleGenAI } from "@google/genai";
import { db } from "./db.js";

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export function detectHandoffIntent(
  userMessage: string,
  historyLength: number,
): { isHandoff: boolean; reason: string } {
  const lower = userMessage.toLowerCase().trim();
  const settings = db.getSettings();
  const customKeywords = settings.autoHandoffKeywords || [];

  const handoffPhrases = [
    "human",
    "person",
    "talk to a human",
    "speak with someone",
    "speak to someone",
    "talk to someone",
    "i want to speak",
    "i want to talk",
    "i need a person",
    "i need someone",
    "i want to contact axion",
    "can someone help me",
    "representative",
    "agent",
    "specialist",
    "consultant",
    "call me",
    "pricing estimate",
    "quotation",
    "quote for",
    "become a client",
    "schedule a meeting",
    "schedule a call",
    "frustrated",
    "useless",
    "stop bot",
    ...customKeywords.map((k) => k.toLowerCase()),
  ];

  for (const phrase of handoffPhrases) {
    if (phrase && lower.includes(phrase)) {
      return {
        isHandoff: true,
        reason: `Triggered by keyword/intent: "${phrase}" in message.`,
      };
    }
  }

  // After 6 messages if user seems asking for custom implementation
  if (
    historyLength >= 6 &&
    (lower.includes("price") ||
      lower.includes("cost") ||
      lower.includes("contract") ||
      lower.includes("timeline"))
  ) {
    return {
      isHandoff: true,
      reason:
        "Extended conversation requiring customized commercial quotation.",
    };
  }

  return { isHandoff: false, reason: "" };
}

export async function generateAIResponse(
  conversationId: string,
  userMessage: string,
  history: { role: string; content: string }[],
): Promise<string> {
  const settings = db.getSettings();
  const knowledgeEntries = db.getKnowledgeBase(true);
  const products = db.getProducts();
  const services = db.getServices();
  const industries = db.getIndustries();

  const knowledgeContext = knowledgeEntries
    .map(
      (k) =>
        `[Category: ${k.category}] Title: ${k.title}\nContent: ${k.content}`,
    )
    .join("\n\n");

  const productsContext = products
    .map(
      (p) =>
        `Product: ${p.name} (${p.code}) - Status: ${p.status}\nTagline: ${p.tagline}\nDescription: ${p.description}\nFeatures: ${p.features.join(
          ", ",
        )}`,
    )
    .join("\n\n");

  const servicesContext = services
    .map(
      (s) =>
        `Service: ${s.name}\nSummary: ${s.shortDesc}\nCapabilities: ${s.capabilities.join(", ")}`,
    )
    .join("\n\n");

  const systemInstruction = `
You are Axion AI, the enterprise intelligence representative for AXION TECHNOLOGIES.
Tagline: "Transforming Businesses Through Intelligent Technology"
Target Markets: Nigeria, Africa, Saudi Arabia, and International.

CORE KNOWLEDGE BASE (Strictly adhere to this information. Do NOT invent fake client names, fictitious employee numbers, or unsupported claims):
${knowledgeContext}

PRODUCT SUITE:
${productsContext}

SOLUTIONS & SERVICES:
${servicesContext}

COMPANY PHILOSOPHY:
"Start with the problem. Build the right solution. Measure the value. Scale intelligently."

BEHAVIOR RULES:
1. Always be professional, concise, technically sound, and helpful to business leaders, engineers, and executives.
2. If the user asks what Axion does, explain our 6 core pillars: AI & Automation, ERP & SAP (SAP Business One), Enterprise Software, Axion WMS (Warehouse Management), Data & BI, and Digital Transformation.
3. If the user asks about Axion AI, Axion Vault, or Axion WMS, describe their exact capabilities and their actual status (Axion AI and Axion WMS are Available; Axion Vault is In Development).
4. If the user asks about pricing, specific customized architectures, quotations, or asks to speak with a human specialist, politely offer to connect them immediately to an Axion Solutions Architect via the "Talk to a Human" option or transfer them.
5. NEVER invent awards, fake employee headcounts, or false promises. Keep answers grounded, practical, and enterprise-grade.
6. Support English and Arabic inquiries with natural precision.
`;

  const ai = getGenAI();
  if (!ai) {
    // Grounded fallback if Gemini key is not yet set in environment
    return getFallbackKnowledgeResponse(
      userMessage,
      knowledgeEntries,
      products,
      services,
    );
  }

  try {
    const formattedContents: any[] = [];

    // Add recent history for conversational context (up to last 6 turns)
    const recentHistory = history.slice(-6);
    for (const h of recentHistory) {
      formattedContents.push({
        role: h.role === "visitor" ? "user" : "model",
        parts: [{ text: h.content }],
      });
    }

    // Add current user prompt
    formattedContents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: settings.aiTemperature || 0.3,
      },
    });

    const text = response.text;
    if (text && text.trim().length > 0) {
      return text.trim();
    }
  } catch (error) {
    console.error(
      "Gemini API invocation error, using grounded fallback:",
      error,
    );
  }

  return getFallbackKnowledgeResponse(
    userMessage,
    knowledgeEntries,
    products,
    services,
  );
}

function getFallbackKnowledgeResponse(
  query: string,
  kb: any[],
  products: any[],
  services: any[],
): string {
  const lower = query.toLowerCase();

  if (
    lower.includes("what does axion do") ||
    lower.includes("about axion") ||
    lower.includes("who are you") ||
    lower.includes("who is axion")
  ) {
    return "Axion Technologies is an enterprise technology engineering company focused on AI & Intelligent Automation, SAP Business One & ERP Integrations, Custom Enterprise Software, Axion Warehouse Management Systems (WMS), and Data/BI Intelligence. We operate across Nigeria, Africa, Saudi Arabia, and international markets.";
  }

  if (
    lower.includes("wms") ||
    lower.includes("warehouse") ||
    lower.includes("inventory")
  ) {
    return "Axion WMS is our production-ready Warehouse Management System engineered for high-throughput distribution centers and manufacturing plants. It supports multi-site inventory, handheld barcode/RFID scanning, offline warehouse sync, and real-time two-way integration with SAP Business One.";
  }

  if (lower.includes("sap") || lower.includes("erp")) {
    return "Axion specializes in SAP Business One implementations, custom service layer extensions, legacy ERP database connectors, and automated financial/reconciliation pipelines.";
  }

  if (lower.includes("vault")) {
    return "Axion Vault is our enterprise document and knowledge management suite currently in development, designed for automated compliance verification, project documentation, and semantic neural search.";
  }

  if (
    lower.includes("ai") ||
    lower.includes("agent") ||
    lower.includes("ocr")
  ) {
    return "Our AI solutions include autonomous task agents, intelligent OCR for invoice and airway bill parsing, conversational assistants, and bilingual Arabic/English document processing.";
  }

  if (
    lower.includes("office") ||
    lower.includes("location") ||
    lower.includes("contact") ||
    lower.includes("phone") ||
    lower.includes("email")
  ) {
    return "Axion Technologies has operational offices in Lagos (Victoria Island, Nigeria), Riyadh (King Fahd Road, Saudi Arabia), and London (UK). You can reach our team at contact@axiontech.com or submit an inquiry through our Contact page.";
  }

  // Matching with KB keywords
  for (const entry of kb) {
    if (entry.keywords.some((k: string) => lower.includes(k))) {
      return `${entry.content}\n\nWould you like more technical details or to connect with an Axion solutions specialist?`;
    }
  }

  return "Axion Technologies engineers intelligent enterprise systems including AI Agents, SAP & ERP integrations, Axion WMS, and bespoke software. How can we assist your business operations today? You can also request a human specialist at any time.";
}
