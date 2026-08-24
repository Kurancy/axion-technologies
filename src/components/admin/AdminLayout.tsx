import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Users,
  Inbox,
  BookOpen,
  Package,
  BarChart2,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  LogOut,
  Globe,
  Shield,
  Menu,
  X,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import type {
  AdminUser,
  AdminNotification,
  Conversation,
} from "../../types/index.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
  getAdminConversations,
} from "../../lib/api.js";
import { realtime } from "../../lib/ws.js";
import { AxionLogo } from "../public/AxionLogo.js";

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  adminUser: AdminUser;
  onLogout: () => void;
  onBackToSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  adminUser,
  onLogout,
  onBackToSite,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(true);
  const [pendingHandoffCount, setPendingHandoffCount] = useState(0);

  // Keep soundEnabledRef in sync with state (no effect re-run needed)
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Load initial notifications & conversations for badge
  // NOTE: soundEnabled is intentionally NOT in deps — we use a ref so the
  // notification handler always reads the latest value without reconnecting WS.
  useEffect(() => {
    // Connect WebSocket as admin
    realtime.connect("admin", { adminId: adminUser.id });

    const loadData = async () => {
      try {
        const notifRes = await getNotifications();
        setNotifications(notifRes.notifications || []);

        const convRes = await getAdminConversations();
        const pending = (convRes.conversations || []).filter(
          (c) => c.status === "human_requested",
        ).length;
        setPendingHandoffCount(pending);
      } catch (e) {
        console.error("Error loading admin notifications:", e);
      }
    };

    loadData();

    // Listen for incoming notifications and live chat events
    const unsubNotif = realtime.on(
      "new_notification",
      (data: { notification: AdminNotification }) => {
        if (data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
          // Use ref so we read latest soundEnabled value without re-subscribing
          if (soundEnabledRef.current) {
            try {
              const ctx = new (
                window.AudioContext || (window as any).webkitAudioContext
              )();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(
                0.01,
                ctx.currentTime + 0.3,
              );
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            } catch {}
          }
        }
      },
    );

    const unsubHandoff = realtime.on("human_handoff_requested", () => {
      setPendingHandoffCount((prev) => prev + 1);
    });

    const unsubStatus = realtime.on(
      "status_change",
      (data: { status: string }) => {
        if (data.status === "human_active" || data.status === "closed") {
          setPendingHandoffCount((prev) => Math.max(0, prev - 1));
        }
      },
    );

    return () => {
      unsubNotif();
      unsubHandoff();
      unsubStatus();
      // Disconnect WS when admin unmounts (logs out)
      realtime.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminUser.id]); // Only reconnect if admin identity changes, NOT on every state change

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "live-chat",
      label: "Live Chat Queue",
      icon: MessageSquare,
      badge: pendingHandoffCount > 0 ? pendingHandoffCount : undefined,
      badgeColor: "bg-red-500",
    },
    { id: "conversations", label: "Conversations & Logs", icon: History },
    { id: "leads", label: "Leads CRM", icon: Users },
    { id: "contact", label: "Contact Messages", icon: Inbox },
    { id: "knowledge", label: "AI Knowledge Base", icon: BookOpen },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart2 },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  function onNavigate(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-[#07101F] text-slate-200 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0F1D32] border-b border-slate-800 p-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-slate-300"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <span className="font-extrabold text-sm text-white tracking-wider"></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-slate-300"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
          <button onClick={onBackToSite} className="text-xs text-[#46DCDC]">
            Public Site
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0F1D32] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Top: Brand */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div
              id="axion-brand-logo"
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => onNavigate("home")}
              role="button"
              aria-label="Axion Technologies Ltd. Home"
            >
              {/* Desktop Logo Height: 44px */}
              <div className="hidden sm:block">
                <AxionLogo
                  logoSize={44}
                  isDarkMode={true}
                  glow={true}
                  interactive={true}
                />
              </div>
              {/* Mobile Logo Height: 36px */}
              <div className="block sm:hidden">
                <AxionLogo
                  logoSize={36}
                  isDarkMode={true}
                  glow={true}
                  interactive={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-[#2D96FF] text-white shadow-[0_0_12px_rgba(45,150,255,0.35)]"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${
                      item.badgeColor || "bg-[#2D96FF]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom: Admin Profile & Controls */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#07101F]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {adminUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {adminUser.name}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tight">
                  {adminUser.role}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute alert chime" : "Enable alert chime"}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#46DCDC]" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onBackToSite}
              className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#07101F] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900 text-red-300 text-[11px] font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-[#0F1D32]/50 border-b border-slate-800/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-white tracking-wide capitalize">
              {currentTab.replace("-", " ")}
            </h1>
            <span className="text-xs font-mono text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              Enterprise Administration Platform
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="admin-notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-[#07101F] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0F1D32] border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-3 bg-[#07101F] border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      Live Activity Feed
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[#2D96FF] hover:underline text-[11px]"
                      >
                        Mark read
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="text-slate-400 hover:underline text-[11px]"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800 text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-xs">
                        No active notifications
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 space-y-1 hover:bg-slate-800/50 transition-colors ${
                            !n.isRead ? "bg-[#2D96FF]/10" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white">
                              {n.title}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-snug">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Public Site preview button */}
            <button
              onClick={onBackToSite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07101F] border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#46DCDC]" />
              <span>View Public Site</span>
            </button>
          </div>
        </header>

        {/* Dynamic Screen Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
