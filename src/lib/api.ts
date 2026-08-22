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
  AnalyticsSummary,
  CompanySettings,
  AdminUser,
} from '../types/index.js';

const API_BASE = '/api';

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('axion_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

// ---------------- Chat API ----------------
export async function initChatSession(visitorId?: string, pageUrl?: string, name?: string, email?: string) {
  return fetchJson<{ visitorId: string; conversation: Conversation; messages: ChatMessage[] }>('/chat/init', {
    method: 'POST',
    body: JSON.stringify({ visitorId, pageUrl, visitorName: name, visitorEmail: email }),
  });
}

export async function sendChatMessage(payload: {
  conversationId: string;
  content: string;
  senderRole?: 'visitor' | 'admin';
  senderName?: string;
  visitorMetadata?: { name?: string; email?: string; phone?: string; company?: string; country?: string };
}) {
  return fetchJson<{ userMessage: ChatMessage; conversationStatus: string; aiMessage: ChatMessage | null; systemMessage?: ChatMessage }>('/chat/message', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestHumanHandoff(conversationId: string, reason?: string, visitorMetadata?: any) {
  return fetchJson<{ conversation: Conversation; systemMessage: ChatMessage }>('/chat/handoff', {
    method: 'POST',
    body: JSON.stringify({ conversationId, reason, visitorMetadata }),
  });
}

export async function submitOfflineLead(data: {
  conversationId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}) {
  return fetchJson<{ status: string; lead: Lead }>('/chat/offline-lead', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getConversationMessages(conversationId: string) {
  return fetchJson<{ conversation: Conversation; messages: ChatMessage[] }>(`/chat/${conversationId}/messages`);
}

// ---------------- Admin Chat API ----------------
export async function getAdminConversations() {
  return fetchJson<{ conversations: Conversation[] }>('/conversations');
}

export async function getAdminConversation(id: string) {
  return fetchJson<{ conversation: Conversation; messages: ChatMessage[] }>(`/conversations/${id}`);
}

export async function takeOverConversation(id: string, adminName: string, adminId?: string) {
  return fetchJson<{ conversation: Conversation; systemMessage: ChatMessage }>(`/conversations/${id}/takeover`, {
    method: 'POST',
    body: JSON.stringify({ adminName, adminId }),
  });
}

export async function returnConversationToAI(id: string) {
  return fetchJson<{ conversation: Conversation; systemMessage: ChatMessage }>(`/conversations/${id}/return-to-ai`, {
    method: 'POST',
  });
}

export async function sendAdminReply(id: string, content: string, adminName: string) {
  return fetchJson<{ message: ChatMessage }>(`/conversations/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content, adminName }),
  });
}

export async function closeConversation(id: string) {
  return fetchJson<{ conversation: Conversation }>(`/conversations/${id}/close`, {
    method: 'POST',
  });
}

export async function updateConversationMetadata(id: string, updates: { priority?: string; internalNotes?: string }) {
  return fetchJson<{ conversation: Conversation }>(`/conversations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// ---------------- Leads CRM ----------------
export async function getLeads() {
  return fetchJson<{ leads: Lead[] }>('/leads');
}

export async function createLead(lead: Partial<Lead>) {
  return fetchJson<{ lead: Lead }>('/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  });
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  return fetchJson<{ lead: Lead }>(`/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteLead(id: string) {
  return fetchJson<{ success: boolean }>(`/leads/${id}`, {
    method: 'DELETE',
  });
}

// ---------------- Contact Messages ----------------
export async function getContactMessages() {
  return fetchJson<{ messages: ContactMessage[] }>('/contact');
}

export async function submitContactForm(form: {
  name: string;
  company: string;
  email: string;
  phone?: string;
  country?: string;
  industry?: string;
  serviceInterest: string;
  message: string;
}) {
  return fetchJson<{ status: string; contactMessage: ContactMessage; leadId: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(form),
  });
}

export async function updateContactStatus(id: string, status: string, notes?: string) {
  return fetchJson<{ contactMessage: ContactMessage }>(`/contact/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes }),
  });
}

export async function convertContactToLead(id: string) {
  return fetchJson<{ lead: Lead; contactMessage: ContactMessage }>(`/contact/${id}/convert-lead`, {
    method: 'POST',
  });
}

export async function deleteContactMessage(id: string) {
  return fetchJson<{ success: boolean }>(`/contact/${id}`, {
    method: 'DELETE',
  });
}

// ---------------- Knowledge Base ----------------
export async function getKnowledgeBase(publishedOnly = false) {
  return fetchJson<{ knowledge: KnowledgeEntry[] }>(`/knowledge?published=${publishedOnly}`);
}

export async function createKnowledgeEntry(entry: Partial<KnowledgeEntry>) {
  return fetchJson<{ entry: KnowledgeEntry }>('/knowledge', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export async function updateKnowledgeEntry(id: string, entry: Partial<KnowledgeEntry>) {
  return fetchJson<{ entry: KnowledgeEntry }>(`/knowledge/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  });
}

export async function toggleKnowledgePublish(id: string, isPublished: boolean) {
  return fetchJson<{ entry: KnowledgeEntry }>(`/knowledge/${id}/publish`, {
    method: 'PATCH',
    body: JSON.stringify({ isPublished }),
  });
}

export async function deleteKnowledgeEntry(id: string) {
  return fetchJson<{ success: boolean }>(`/knowledge/${id}`, {
    method: 'DELETE',
  });
}

// ---------------- Products, Services, Industries ----------------
export async function getProducts() {
  return fetchJson<{ products: ProductItem[] }>('/products');
}

export async function getServices() {
  return fetchJson<{ services: ServiceItem[] }>('/services');
}

export async function getIndustries() {
  return fetchJson<{ industries: IndustryItem[] }>('/industries');
}

// ---------------- Notifications ----------------
export async function getNotifications() {
  return fetchJson<{ notifications: AdminNotification[] }>('/notifications');
}

export async function markNotificationRead(id: string) {
  return fetchJson<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead() {
  return fetchJson<{ success: boolean }>('/notifications/read-all', { method: 'POST' });
}

export async function clearAllNotifications() {
  return fetchJson<{ success: boolean }>('/notifications/clear', { method: 'POST' });
}

// ---------------- Analytics ----------------
export async function getAnalytics() {
  return fetchJson<{ analytics: AnalyticsSummary }>('/analytics');
}

export async function trackAnalyticsEvent(eventType: string, page: string, visitorId: string, metadata?: any) {
  return fetchJson<{ status: string }>('/analytics/track', {
    method: 'POST',
    body: JSON.stringify({ eventType, page, visitorId, metadata }),
  });
}

// ---------------- Settings ----------------
export async function getSettings() {
  return fetchJson<{ settings: CompanySettings }>('/settings');
}

export async function updateSettings(settings: Partial<CompanySettings>) {
  return fetchJson<{ settings: CompanySettings }>('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

// ---------------- Auth ----------------
export async function loginAdmin(username: string, password: string) {
  return fetchJson<{ token: string; admin: AdminUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function checkAuthMe() {
  return fetchJson<{ admin: AdminUser }>('/auth/me');
}
