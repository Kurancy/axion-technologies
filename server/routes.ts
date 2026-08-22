import express from 'express';
import { db } from './db.js';
import { generateAIResponse, detectHandoffIntent } from './gemini.js';
import { broadcastToAdmins, broadcastToVisitor, broadcastToAll } from './websocket.js';

export const apiRouter = express.Router();

// ----------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------
apiRouter.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const admin = db.getAdminByUsername(username);
  if (!admin || admin.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid administrator credentials' });
  }

  const { passwordHash, ...safeAdmin } = admin;
  return res.json({
    token: `token_${safeAdmin.id}_${Date.now()}`,
    admin: safeAdmin,
  });
});

apiRouter.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  const admin = db.getAdmins()[0]; // Default authenticated session
  if (!admin) {
    return res.status(401).json({ error: 'Session expired' });
  }
  return res.json({ admin });
});

// ----------------------------------------------------
// PUBLIC CHATBOT & VISITOR CONVERSATIONS
// ----------------------------------------------------
apiRouter.post('/chat/init', (req, res) => {
  const { visitorId, pageUrl, visitorName, visitorEmail } = req.body;
  const vid = visitorId || `vis-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  let conversation = db.getConversationByVisitor(vid);

  if (!conversation) {
    conversation = db.createConversation({
      visitorId: vid,
      visitorName: visitorName || 'Enterprise Visitor',
      visitorEmail,
      status: 'AI_ACTIVE',
      priority: 'NORMAL',
      pageUrl: pageUrl || '/',
    });

    // Add initial welcome message from Axion AI
    const welcomeMsg = db.addMessage({
      conversationId: conversation.id,
      senderRole: 'ai',
      senderName: 'Axion AI',
      content: 'Welcome to Axion Technologies. How can we help your business engineer intelligent operations today?',
    });

    // Broadcast new conversation to admins
    broadcastToAdmins({
      event: 'conversation_created',
      data: { conversation, message: welcomeMsg },
    });
  }

  const messages = db.getMessages(conversation.id);
  return res.json({
    visitorId: vid,
    conversation,
    messages,
  });
});

apiRouter.get('/chat/:conversationId/messages', (req, res) => {
  const { conversationId } = req.params;
  const conversation = db.getConversationById(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const messages = db.getMessages(conversationId);
  // Reset unread count for visitor if visitor is polling
  db.updateConversation(conversationId, { unreadVisitorCount: 0 });

  return res.json({ conversation, messages });
});

apiRouter.post('/chat/message', async (req, res) => {
  const { conversationId, content, senderRole, senderName, visitorMetadata } = req.body;

  if (!conversationId || !content) {
    return res.status(400).json({ error: 'conversationId and content required' });
  }

  let conversation = db.getConversationById(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  // Update visitor info if provided
  if (visitorMetadata) {
    db.updateConversation(conversationId, {
      visitorName: visitorMetadata.name || conversation.visitorName,
      visitorEmail: visitorMetadata.email || conversation.visitorEmail,
      visitorPhone: visitorMetadata.phone || conversation.visitorPhone,
      visitorCompany: visitorMetadata.company || conversation.visitorCompany,
      visitorCountry: visitorMetadata.country || conversation.visitorCountry,
    });
  }

  // 1. Save visitor message
  const userMsg = db.addMessage({
    conversationId,
    senderRole: senderRole || 'visitor',
    senderName: senderName || conversation.visitorName || 'Visitor',
    content,
  });

  // Realtime notify admins
  broadcastToAdmins({
    event: 'new_message',
    data: { conversationId, message: userMsg, conversation: db.getConversationById(conversationId) },
  });

  // If conversation is already under human control, do NOT generate AI reply
  if (conversation.status === 'HUMAN_ACTIVE' || conversation.status === 'HUMAN_REQUESTED') {
    return res.json({
      userMessage: userMsg,
      conversationStatus: conversation.status,
      aiMessage: null,
    });
  }

  // Check for human handoff triggers
  const existingMessages = db.getMessages(conversationId);
  const handoffCheck = detectHandoffIntent(content, existingMessages.length);

  if (handoffCheck.isHandoff) {
    const updatedConv = db.updateConversation(conversationId, {
      status: 'HUMAN_REQUESTED',
      priority: 'HIGH',
      handoffReason: handoffCheck.reason,
    });

    const systemMsg = db.addMessage({
      conversationId,
      senderRole: 'system',
      senderName: 'System',
      content: 'An Axion team member has been notified and is joining the conversation.',
    });

    // Create admin notification
    const notif = db.createNotification({
      type: 'human_handoff',
      title: 'Human Specialist Requested',
      message: `${conversation.visitorName} requested live assistance: "${content.slice(0, 80)}..."`,
      link: `/admin/live-chat?conv=${conversationId}`,
      metadata: { conversationId, reason: handoffCheck.reason },
    });

    // Broadcast to admins
    broadcastToAdmins({
      event: 'human_handoff_requested',
      data: { conversation: updatedConv, message: systemMsg, notification: notif },
    });

    // Broadcast to visitor
    broadcastToVisitor(conversationId, {
      event: 'status_changed',
      data: { conversation: updatedConv, message: systemMsg },
    });

    return res.json({
      userMessage: userMsg,
      conversationStatus: 'HUMAN_REQUESTED',
      aiMessage: null,
      systemMessage: systemMsg,
    });
  }

  // 2. Generate AI response
  const historyForAI = existingMessages.map((m) => ({
    role: m.senderRole,
    content: m.content,
  }));

  try {
    const aiText = await generateAIResponse(conversationId, content, historyForAI);

    const aiMsg = db.addMessage({
      conversationId,
      senderRole: 'ai',
      senderName: 'Axion AI',
      content: aiText,
    });

    // Broadcast to visitor
    broadcastToVisitor(conversationId, {
      event: 'new_message',
      data: { conversationId, message: aiMsg },
    });

    // Broadcast to admins
    broadcastToAdmins({
      event: 'new_message',
      data: { conversationId, message: aiMsg, conversation: db.getConversationById(conversationId) },
    });

    return res.json({
      userMessage: userMsg,
      conversationStatus: conversation.status,
      aiMessage: aiMsg,
    });
  } catch (err) {
    console.error('Error generating AI answer:', err);
    return res.status(500).json({ error: 'AI processing failure' });
  }
});

// Explicit human handoff request via button
apiRouter.post('/chat/handoff', (req, res) => {
  const { conversationId, reason, visitorMetadata } = req.body;
  if (!conversationId) {
    return res.status(400).json({ error: 'conversationId is required' });
  }

  let conversation = db.getConversationById(conversationId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  if (visitorMetadata) {
    db.updateConversation(conversationId, {
      visitorName: visitorMetadata.name || conversation.visitorName,
      visitorEmail: visitorMetadata.email || conversation.visitorEmail,
      visitorPhone: visitorMetadata.phone || conversation.visitorPhone,
      visitorCompany: visitorMetadata.company || conversation.visitorCompany,
    });
  }

  const updatedConv = db.updateConversation(conversationId, {
    status: 'HUMAN_REQUESTED',
    priority: 'HIGH',
    handoffReason: reason || 'Visitor explicitly clicked "Talk to a Human".',
  });

  const systemMsg = db.addMessage({
    conversationId,
    senderRole: 'system',
    senderName: 'System',
    content: 'An Axion team member has been alerted and will join the conversation shortly.',
  });

  const notif = db.createNotification({
    type: 'human_handoff',
    title: 'Human Specialist Requested',
    message: `${updatedConv?.visitorName || 'A visitor'} clicked "Talk to a Human".`,
    link: `/admin/live-chat?conv=${conversationId}`,
    metadata: { conversationId },
  });

  broadcastToAdmins({
    event: 'human_handoff_requested',
    data: { conversation: updatedConv, message: systemMsg, notification: notif },
  });

  broadcastToVisitor(conversationId, {
    event: 'status_changed',
    data: { conversation: updatedConv, message: systemMsg },
  });

  return res.json({ conversation: updatedConv, systemMessage: systemMsg });
});

// Offline lead submission when team is away
apiRouter.post('/chat/offline-lead', (req, res) => {
  const { conversationId, name, email, phone, company, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const lead = db.createLead({
    name,
    company: company || 'Not specified',
    email,
    phone,
    source: 'ai_chatbot',
    interest: 'Offline Live Chat Callback',
    status: 'NEW',
    priority: 'HIGH',
    notes: message || 'Visitor requested callback when live chat team was offline.',
    conversationId,
  });

  if (conversationId) {
    db.updateConversation(conversationId, {
      visitorName: name,
      visitorEmail: email,
      visitorPhone: phone,
      visitorCompany: company,
      status: 'WAITING',
    });

    db.addMessage({
      conversationId,
      senderRole: 'system',
      senderName: 'System',
      content: `Contact details received for ${name} (${email}). An Axion consultant will follow up shortly.`,
    });
  }

  const notif = db.createNotification({
    type: 'new_lead',
    title: 'New Lead Captured (Offline Chat)',
    message: `${name} from ${company || 'organization'} requested a callback.`,
    link: '/admin/leads',
    metadata: { leadId: lead.id },
  });

  broadcastToAdmins({
    event: 'new_lead',
    data: { lead, notification: notif },
  });

  return res.json({ status: 'ok', lead });
});

// ----------------------------------------------------
// ADMIN LIVE CHAT & CONVERSATION MANAGEMENT
// ----------------------------------------------------
apiRouter.get('/conversations', (req, res) => {
  const conversations = db.getConversations();
  return res.json({ conversations });
});

apiRouter.get('/conversations/:id', (req, res) => {
  const conv = db.getConversationById(req.params.id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  const messages = db.getMessages(req.params.id);
  // Reset unread count for admin
  db.updateConversation(req.params.id, { unreadAdminCount: 0 });
  return res.json({ conversation: conv, messages });
});

// Admin Take Over
apiRouter.post('/conversations/:id/takeover', (req, res) => {
  const { id } = req.params;
  const { adminName, adminId } = req.body;

  const conv = db.getConversationById(id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const updatedConv = db.updateConversation(id, {
    status: 'HUMAN_ACTIVE',
    assignedAdminId: adminId || 'admin-1',
    assignedAdminName: adminName || 'Abdullahi Abubakar',
    unreadAdminCount: 0,
  });

  const systemMsg = db.addMessage({
    conversationId: id,
    senderRole: 'system',
    senderName: 'System',
    content: `${adminName || 'Abdullahi Abubakar'} from Axion Technologies joined the conversation.`,
  });

  broadcastToVisitor(id, {
    event: 'agent_joined',
    data: {
      conversation: updatedConv,
      message: systemMsg,
      adminName: adminName || 'Abdullahi Abubakar',
    },
  });

  broadcastToAdmins({
    event: 'conversation_updated',
    data: { conversation: updatedConv, message: systemMsg },
  });

  return res.json({ conversation: updatedConv, systemMessage: systemMsg });
});

// Admin Return to AI
apiRouter.post('/conversations/:id/return-to-ai', (req, res) => {
  const { id } = req.params;
  const updatedConv = db.updateConversation(id, {
    status: 'AI_ACTIVE',
    assignedAdminId: undefined,
    assignedAdminName: undefined,
  });

  const systemMsg = db.addMessage({
    conversationId: id,
    senderRole: 'system',
    senderName: 'System',
    content: 'Conversation returned to Axion AI automated assistant.',
  });

  broadcastToVisitor(id, {
    event: 'status_changed',
    data: { conversation: updatedConv, message: systemMsg },
  });

  broadcastToAdmins({
    event: 'conversation_updated',
    data: { conversation: updatedConv, message: systemMsg },
  });

  return res.json({ conversation: updatedConv, systemMessage: systemMsg });
});

// Admin Send Reply in Live Chat
apiRouter.post('/conversations/:id/reply', (req, res) => {
  const { id } = req.params;
  const { content, adminName } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const conv = db.getConversationById(id);
  if (!conv) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const adminMsg = db.addMessage({
    conversationId: id,
    senderRole: 'admin',
    senderName: adminName || conv.assignedAdminName || 'Abdullahi Abubakar',
    content,
  });

  // Make sure conversation is HUMAN_ACTIVE
  if (conv.status !== 'HUMAN_ACTIVE') {
    db.updateConversation(id, {
      status: 'HUMAN_ACTIVE',
      assignedAdminName: adminName || 'Abdullahi Abubakar',
    });
  }

  broadcastToVisitor(id, {
    event: 'new_message',
    data: { conversationId: id, message: adminMsg },
  });

  broadcastToAdmins({
    event: 'new_message',
    data: { conversationId: id, message: adminMsg, conversation: db.getConversationById(id) },
  });

  return res.json({ message: adminMsg });
});

// Admin Close Conversation
apiRouter.post('/conversations/:id/close', (req, res) => {
  const { id } = req.params;
  const updatedConv = db.updateConversation(id, {
    status: 'CLOSED',
  });

  const systemMsg = db.addMessage({
    conversationId: id,
    senderRole: 'system',
    senderName: 'System',
    content: 'This conversation has been concluded. Thank you for connecting with Axion Technologies.',
  });

  broadcastToVisitor(id, {
    event: 'conversation_closed',
    data: { conversation: updatedConv, message: systemMsg },
  });

  broadcastToAdmins({
    event: 'conversation_updated',
    data: { conversation: updatedConv, message: systemMsg },
  });

  return res.json({ conversation: updatedConv });
});

// Admin Update Notes/Priority
apiRouter.patch('/conversations/:id', (req, res) => {
  const { id } = req.params;
  const { priority, internalNotes } = req.body;
  const updated = db.updateConversation(id, { priority, internalNotes });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  return res.json({ conversation: updated });
});

// ----------------------------------------------------
// LEADS CRM
// ----------------------------------------------------
apiRouter.get('/leads', (req, res) => {
  return res.json({ leads: db.getLeads() });
});

apiRouter.post('/leads', (req, res) => {
  const { name, company, email, phone, country, industry, source, interest, priority, notes, estimatedValue } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const lead = db.createLead({
    name,
    company: company || 'Enterprise',
    email,
    phone,
    country: country || 'Nigeria',
    industry: industry || 'Technology',
    source: source || 'manual',
    interest: interest || 'General Enterprise Inquiry',
    status: 'NEW',
    priority: priority || 'NORMAL',
    notes,
    estimatedValue,
  });

  const notif = db.createNotification({
    type: 'new_lead',
    title: 'New Lead Created',
    message: `${name} from ${lead.company} registered as a new lead.`,
    link: '/admin/leads',
  });

  broadcastToAdmins({ event: 'new_lead', data: { lead, notification: notif } });
  return res.json({ lead });
});

apiRouter.patch('/leads/:id', (req, res) => {
  const updated = db.updateLead(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Lead not found' });
  broadcastToAdmins({ event: 'lead_updated', data: { lead: updated } });
  return res.json({ lead: updated });
});

apiRouter.delete('/leads/:id', (req, res) => {
  const ok = db.deleteLead(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Lead not found' });
  broadcastToAdmins({ event: 'lead_deleted', data: { id: req.params.id } });
  return res.json({ success: true });
});

// ----------------------------------------------------
// CONTACT MESSAGES
// ----------------------------------------------------
apiRouter.get('/contact', (req, res) => {
  return res.json({ messages: db.getContactMessages() });
});

apiRouter.post('/contact', (req, res) => {
  const { name, company, email, phone, country, industry, serviceInterest, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const contactMsg = db.createContactMessage({
    name,
    company: company || 'Enterprise Client',
    email,
    phone,
    country: country || 'Nigeria',
    industry: industry || 'Enterprise',
    serviceInterest: serviceInterest || 'AI & Automation',
    message,
    status: 'NEW',
  });

  // Automatically create a matching lead
  const lead = db.createLead({
    name,
    company: company || 'Enterprise Client',
    email,
    phone,
    country: country || 'Nigeria',
    industry: industry || 'Enterprise',
    source: 'contact_form',
    interest: serviceInterest || 'AI & Automation',
    status: 'NEW',
    priority: 'HIGH',
    notes: `Initial Contact Form Submission: "${message}"`,
    contactMessageId: contactMsg.id,
  });

  // Update contact message with lead ID
  db.updateContactMessage(contactMsg.id, { leadId: lead.id });

  const notif = db.createNotification({
    type: 'new_contact',
    title: 'New Contact Form Submission',
    message: `${name} (${company || 'Enterprise'}) sent an inquiry regarding ${serviceInterest || 'Solutions'}.`,
    link: '/admin/messages',
    metadata: { contactId: contactMsg.id, leadId: lead.id },
  });

  broadcastToAdmins({
    event: 'new_contact',
    data: { contactMessage: contactMsg, lead, notification: notif },
  });

  return res.json({ status: 'ok', contactMessage: contactMsg, leadId: lead.id });
});

apiRouter.patch('/contact/:id', (req, res) => {
  const updated = db.updateContactMessage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Contact message not found' });
  return res.json({ contactMessage: updated });
});

apiRouter.post('/contact/:id/convert-lead', (req, res) => {
  const msg = db.getContactMessages().find((m) => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });

  const lead = db.createLead({
    name: msg.name,
    company: msg.company,
    email: msg.email,
    phone: msg.phone,
    country: msg.country,
    industry: msg.industry,
    source: 'contact_form',
    interest: msg.serviceInterest,
    status: 'QUALIFIED',
    priority: 'HIGH',
    notes: `Converted from contact message: "${msg.message}"`,
    contactMessageId: msg.id,
  });

  const updatedMsg = db.updateContactMessage(msg.id, {
    status: 'CONVERTED',
    leadId: lead.id,
  });

  broadcastToAdmins({ event: 'new_lead', data: { lead } });
  return res.json({ lead, contactMessage: updatedMsg });
});

apiRouter.delete('/contact/:id', (req, res) => {
  const ok = db.deleteContactMessage(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Contact message not found' });
  return res.json({ success: true });
});

// ----------------------------------------------------
// AI KNOWLEDGE BASE
// ----------------------------------------------------
apiRouter.get('/knowledge', (req, res) => {
  const publishedOnly = req.query.published === 'true';
  return res.json({ knowledge: db.getKnowledgeBase(publishedOnly) });
});

apiRouter.post('/knowledge', (req, res) => {
  const { title, category, content, keywords, isPublished, priority } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const entry = db.createKnowledgeEntry({
    title,
    category: category || 'Company',
    content,
    keywords: Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? keywords.split(',').map((k) => k.trim()) : [],
    isPublished: isPublished !== false,
    priority: Number(priority) || 50,
  });

  return res.json({ entry });
});

apiRouter.put('/knowledge/:id', (req, res) => {
  const { title, category, content, keywords, isPublished, priority } = req.body;
  const updated = db.updateKnowledgeEntry(req.params.id, {
    title,
    category,
    content,
    keywords: Array.isArray(keywords) ? keywords : typeof keywords === 'string' ? keywords.split(',').map((k) => k.trim()) : undefined,
    isPublished,
    priority: priority !== undefined ? Number(priority) : undefined,
  });

  if (!updated) return res.status(404).json({ error: 'Knowledge entry not found' });
  return res.json({ entry: updated });
});

apiRouter.patch('/knowledge/:id/publish', (req, res) => {
  const { isPublished } = req.body;
  const updated = db.updateKnowledgeEntry(req.params.id, { isPublished });
  if (!updated) return res.status(404).json({ error: 'Knowledge entry not found' });
  return res.json({ entry: updated });
});

apiRouter.delete('/knowledge/:id', (req, res) => {
  const ok = db.deleteKnowledgeEntry(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Knowledge entry not found' });
  return res.json({ success: true });
});

// ----------------------------------------------------
// PRODUCTS, SERVICES, INDUSTRIES
// ----------------------------------------------------
apiRouter.get('/products', (req, res) => {
  return res.json({ products: db.getProducts() });
});

apiRouter.patch('/products/:id', (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  return res.json({ product: updated });
});

apiRouter.get('/services', (req, res) => {
  return res.json({ services: db.getServices() });
});

apiRouter.get('/industries', (req, res) => {
  return res.json({ industries: db.getIndustries() });
});

// ----------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------
apiRouter.get('/notifications', (req, res) => {
  return res.json({ notifications: db.getNotifications() });
});

apiRouter.patch('/notifications/:id/read', (req, res) => {
  db.markNotificationRead(req.params.id);
  return res.json({ success: true });
});

apiRouter.post('/notifications/read-all', (req, res) => {
  db.markAllNotificationsRead();
  return res.json({ success: true });
});

apiRouter.post('/notifications/clear', (req, res) => {
  db.clearNotifications();
  return res.json({ success: true });
});

// ----------------------------------------------------
// ANALYTICS
// ----------------------------------------------------
apiRouter.get('/analytics', (req, res) => {
  return res.json({ analytics: db.getAnalyticsSummary() });
});

apiRouter.post('/analytics/track', (req, res) => {
  const { eventType, page, visitorId, metadata } = req.body;
  if (eventType && visitorId) {
    db.logAnalyticsEvent(eventType, page || '/', visitorId, metadata);
  }
  return res.json({ status: 'ok' });
});

// ----------------------------------------------------
// SETTINGS
// ----------------------------------------------------
apiRouter.get('/settings', (req, res) => {
  return res.json({ settings: db.getSettings() });
});

apiRouter.put('/settings', (req, res) => {
  const updated = db.updateSettings(req.body);
  broadcastToAll({ event: 'settings_updated', data: { settings: updated } });
  return res.json({ settings: updated });
});
