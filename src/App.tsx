import React, { useState, useEffect } from 'react';
import { Header } from './components/public/Header.js';
import { Footer } from './components/public/Footer.js';
import { Hero } from './components/public/Hero.js';
import { WhatWeDo } from './components/public/WhatWeDo.js';
import { SolutionsView } from './components/public/SolutionsView.js';
import { ProductsView } from './components/public/ProductsView.js';
import { IndustriesView } from './components/public/IndustriesView.js';
import { AboutView } from './components/public/AboutView.js';
import { ContactView } from './components/public/ContactView.js';
import { AxionAIChatWidget } from './components/chat/AxionAIChatWidget.js';
import { AxionSplashScreen } from './components/public/AxionSplashScreen.js';
import { AxionFavicon } from './components/public/AxionFavicon.js';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { AdminLiveChat } from './components/admin/AdminLiveChat.js';
import { AdminConversations } from './components/admin/AdminConversations.js';
import { AdminLeads } from './components/admin/AdminLeads.js';
import { AdminContactMessages } from './components/admin/AdminContactMessages.js';
import { AdminKnowledge } from './components/admin/AdminKnowledge.js';
import { AdminAnalytics } from './components/admin/AdminAnalytics.js';
import { AdminSettings } from './components/admin/AdminSettings.js';

import type { AdminUser } from './types/index.js';
import { checkAuthMe, trackAnalyticsEvent } from './lib/api.js';

export function App() {
  // Public vs Admin routing
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.pathname.startsWith('/admin');
  });

  // Public views: 'home' | 'solutions' | 'products' | 'industries' | 'about' | 'contact'
  const [showEntrance, setShowEntrance] = useState(true);
  const [isDarkMode] = useState(true);
  const [currentPublicView, setCurrentPublicView] = useState<string>('home');
  const [selectedSolutionSlug, setSelectedSolutionSlug] = useState<string>('ai-automation');
  const [selectedContactContext, setSelectedContactContext] = useState<{ service?: string; industry?: string }>({});

  // Chat widget state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialTopic, setChatInitialTopic] = useState<string | undefined>(undefined);

  // Admin state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedChatConvId, setSelectedChatConvId] = useState<string | undefined>(undefined);

  // Check auth session on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('axion_admin_token');
      if (token) {
        try {
          const res = await checkAuthMe();
          setAdminUser(res.admin);
        } catch {
          localStorage.removeItem('axion_admin_token');
          localStorage.removeItem('axion_admin_user');
          setAdminUser(null);
        }
      }
    };

    checkAuth();
  }, []);

  // Track page view analytics — fires only when the actual viewed page changes.
  // Uses a flag to abort if the component unmounts before the request completes.
  useEffect(() => {
    let cancelled = false;
    const page = isAdminMode ? `/admin/${adminTab}` : `/${currentPublicView}`;
    let visitorId = localStorage.getItem('axion_visitor_id');
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('axion_visitor_id', visitorId);
    }
    const vid = visitorId;
    // Fire-and-forget analytics — errors are silently swallowed so they
    // never put the app in an infinite loading state.
    trackAnalyticsEvent('page_view', page, vid).catch(() => {});
    if (!cancelled) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return () => { cancelled = true; };
  }, [currentPublicView, isAdminMode, adminTab]);

  const handleNavigatePublic = (view: string) => {
    setCurrentPublicView(view);
    setIsAdminMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChatWithTopic = (topic?: string) => {
    setChatInitialTopic(topic);
    setIsChatOpen(true);
  };

  const handleContactWithContext = (serviceOrProduct?: string, industry?: string) => {
    setSelectedContactContext({
      service: serviceOrProduct || 'AI & Automation',
      industry: industry || 'Manufacturing',
    });
    setCurrentPublicView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSolution = (slug?: string) => {
    if (slug) setSelectedSolutionSlug(slug);
    setCurrentPublicView('solutions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setAdminUser(admin);
    setIsAdminMode(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('axion_admin_token');
    localStorage.removeItem('axion_admin_user');
    setAdminUser(null);
    setIsAdminMode(false);
    setCurrentPublicView('home');
  };

  // ---------------- Render Admin Interface ----------------
  if (isAdminMode) {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={() => setIsAdminMode(false)}
        />
      );
    }

    return (


      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        onBackToSite={() => setIsAdminMode(false)}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={setAdminTab}
            onSelectConversation={(convId) => {
              setSelectedChatConvId(convId);
              setAdminTab('live-chat');
            }}
          />
        )}
        {adminTab === 'live-chat' && (
          <AdminLiveChat
            adminUser={adminUser}
            selectedConversationId={selectedChatConvId}
          />
        )}
        {adminTab === 'conversations' && (
          <AdminConversations
            onOpenInLiveChat={(convId) => {
              setSelectedChatConvId(convId);
              setAdminTab('live-chat');
            }}
          />
        )}
        {adminTab === 'leads' && <AdminLeads />}
        {adminTab === 'contact' && <AdminContactMessages />}
        {adminTab === 'knowledge' && <AdminKnowledge />}
        {adminTab === 'analytics' && <AdminAnalytics />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // ---------------- Render Public Website ----------------
  return (
    <div className="min-h-screen bg-[#07101F] text-slate-200 flex flex-col font-sans selection:bg-[#2D96FF]/30 selection:text-white">
      <AxionFavicon />
      {showEntrance && (
        <AxionSplashScreen
          isDarkMode={isDarkMode}
          onComplete={() => setShowEntrance(false)}
        />
      )}
      {/* Sticky Header */}
      <Header
        currentView={currentPublicView}
        onNavigate={handleNavigatePublic}
        onOpenChat={() => setIsChatOpen(true)}
        onGoAdmin={() => setIsAdminMode(true)}
      />

      {/* Main Public Content Switch */}
      <main className="flex-1">
        {currentPublicView === 'home' && (
          <>
            <Hero
              onExploreSolutions={() => handleNavigatePublic('solutions')}
              onOpenChat={() => setIsChatOpen(true)}
            />
            <WhatWeDo onSelectSolution={handleSelectSolution} />
            <SolutionsView
              initialSlug="ai-automation"
              onOpenChat={() => setIsChatOpen(true)}
              onContactUs={() => handleContactWithContext('AI & Automation')}
            />
            <ProductsView
              onOpenChat={handleOpenChatWithTopic}
              onContactUs={handleContactWithContext}
            />
            <IndustriesView
              onContactIndustry={(ind) => handleContactWithContext('Enterprise Systems', ind)}
              onOpenChat={() => setIsChatOpen(true)}
            />
            <AboutView
              onContactUs={() => handleNavigatePublic('contact')}
              onOpenChat={() => setIsChatOpen(true)}
            />
            <ContactView
              initialService="AI & Automation"
              initialIndustry="Manufacturing"
              onOpenChat={() => setIsChatOpen(true)}
            />
          </>
        )}

        {currentPublicView === 'solutions' && (
          <SolutionsView
            initialSlug={selectedSolutionSlug}
            onOpenChat={() => setIsChatOpen(true)}
            onContactUs={() => handleContactWithContext(selectedSolutionSlug)}
          />
        )}

        {currentPublicView === 'products' && (
          <ProductsView
            onOpenChat={handleOpenChatWithTopic}
            onContactUs={handleContactWithContext}
          />
        )}

        {currentPublicView === 'industries' && (
          <IndustriesView
            onContactIndustry={(ind) => handleContactWithContext('Enterprise Systems', ind)}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {currentPublicView === 'about' && (
          <AboutView
            onContactUs={() => handleNavigatePublic('contact')}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {currentPublicView === 'contact' && (
          <ContactView
            initialService={selectedContactContext.service || 'AI & Automation'}
            initialIndustry={selectedContactContext.industry || 'Manufacturing'}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}
      </main>
      

      {/* Footer */}
      <Footer
        onNavigate={handleNavigatePublic}
        onGoAdmin={() => setIsAdminMode(true)}
      />

      {/* Interactive AI Chatbot Widget */}
      <AxionAIChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
        initialTopic={chatInitialTopic}
      />
      
    </div>
    
  );
}

export default App;

