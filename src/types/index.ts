export type ConversationStatus = 
  | 'AI_ACTIVE' 
  | 'HUMAN_REQUESTED' 
  | 'HUMAN_ACTIVE' 
  | 'WAITING' 
  | 'CLOSED'
  | 'ai_active'
  | 'human_requested'
  | 'human_active'
  | 'waiting'
  | 'closed';

export type PriorityLevel = 
  | 'LOW' 
  | 'NORMAL' 
  | 'HIGH' 
  | 'URGENT' 
  | 'low' 
  | 'normal' 
  | 'medium' 
  | 'high' 
  | 'urgent';

export type MessageSender = 'visitor' | 'ai' | 'admin' | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: MessageSender;
  senderName: string;
  content: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  visitorCompany?: string;
  visitorCountry?: string;
  status: ConversationStatus;
  priority: PriorityLevel;
  assignedAdminId?: string;
  assignedAdminName?: string;
  pageUrl: string;
  handoffReason?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  unreadAdminCount?: number;
  unreadVisitorCount?: number;
  lastMessage?: string;
  lastMessagePreview?: string;
}

export type LeadStatus = 
  | 'NEW' 
  | 'QUALIFIED' 
  | 'CONTACTED' 
  | 'PROPOSAL' 
  | 'WON' 
  | 'LOST'
  | 'new'
  | 'qualified'
  | 'contacted'
  | 'proposal'
  | 'won'
  | 'lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  country?: string;
  industry?: string;
  source: 'contact_form' | 'ai_chatbot' | 'human_handoff' | 'quote_request' | 'manual' | 'live_chat';
  interest?: string;
  serviceInterest?: string;
  status: LeadStatus;
  priority: PriorityLevel;
  notes?: string;
  estimatedValue?: number | string;
  conversationId?: string;
  contactMessageId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactMessageStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CONVERTED' | 'CLOSED' | 'new' | 'contacted' | 'archived';

export interface ContactMessage {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  country?: string;
  industry?: string;
  serviceInterest: string;
  message: string;
  status: ContactMessageStatus;
  notes?: string;
  leadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  question?: string;
  answer?: string;
  content?: string;
  keywords?: string[];
  tags?: string[];
  isPublished: boolean;
  priority?: number;
  updatedAt: string;
}


export interface ProductItem {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  status: 'Available' | 'In Development' | 'Prototype';
  features: string[];
  targetIndustries: string[];
  specs: string[];
  icon: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  capabilities: string[];
  deliverables: string[];
  icon: string;
}

export interface IndustryItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  challenges: string[];
  solutionsApplied: string[];
  caseExample: string;
  metrics: string;
  icon: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalConversations: number;
  activeChats?: number;
  humanRequests?: number;
  totalLeads: number;
  newLeads?: number;
  totalContactMessages: number;
  contactMessages?: number;
  aiConversations?: number;
  aiResolutionRate: number;
  conversionRate?: string;
  topTopics: { topic: string; count: number }[];
  conversationsOverTime?: { date: string; ai: number; human: number }[];
  leadsOverTime?: { date: string; leads: number }[];
  topQuestions?: { question: string; count: number }[];
  popularPages?: { page: string; views: number }[];
  funnelData?: { stage: string; count: number; percentage: number }[];
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  supportEmail?: string;
  salesEmail?: string;
  contactEmail?: string;
  contactPhone?: string;
  phone?: string;
  address?: string;
  offices?: { city: string; country: string; address: string; phone: string }[];
  aiModel?: string;
  aiTemperature?: number;
  businessHours?: string;
  aiWelcomeMessage?: string;
  aiSystemPrompt?: string;
  autoHandoffMessageThreshold?: number;
  handoffEnabled?: boolean;
  autoHandoffKeywords?: string[];
  chatOnlineStatus?: boolean;
  notificationSoundEnabled?: boolean;
  leadAutoCapture?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  active: boolean;
}
