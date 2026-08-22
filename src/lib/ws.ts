type EventCallback = (data: any) => void;

class RealtimeClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private reconnectTimer: any = null;
  private isConnecting: boolean = false;
  private pingInterval: any = null;
  private role: 'admin' | 'visitor' = 'visitor';
  private conversationId?: string;
  private visitorId?: string;
  private adminId?: string;
  // Flag to suppress auto-reconnect when disconnect() is called deliberately
  private intentionalDisconnect: boolean = false;

  connect(role: 'admin' | 'visitor' = 'visitor', options?: { conversationId?: string; visitorId?: string; adminId?: string }) {
    this.role = role;
    if (options?.conversationId) this.conversationId = options.conversationId;
    if (options?.visitorId) this.visitorId = options.visitorId;
    if (options?.adminId) this.adminId = options.adminId;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (this.role === 'admin') {
        this.send('auth_admin', { adminId: this.adminId });
      } else if (this.conversationId) {
        this.send('join_conversation', { conversationId: this.conversationId, visitorId: this.visitorId });
      }
      return;
    }

    this.isConnecting = true;
    this.intentionalDisconnect = false; // Reset flag on new connect
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnecting = false;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

        if (this.role === 'admin') {
          this.send('auth_admin', { adminId: this.adminId });
        } else if (this.conversationId) {
          this.send('join_conversation', { conversationId: this.conversationId, visitorId: this.visitorId });
        }

        // Setup ping keepalive
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          this.send('ping', {});
        }, 25000);

        this.emit('connected', { status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { event: eventName, data } = payload;
          if (eventName) {
            this.emit(eventName, data);
            this.emit('*', { event: eventName, data });
          }
        } catch (e) {
          console.error('Error parsing WebSocket event:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.emit('disconnected', {});
        // Only auto-reconnect if this was NOT an intentional disconnect (e.g. logout)
        if (!this.intentionalDisconnect) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.warn('WebSocket connection error:', error);
        this.ws?.close();
      };
    } catch (e) {
      console.error('WebSocket initial connect exception:', e);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect(this.role, {
        conversationId: this.conversationId,
        visitorId: this.visitorId,
        adminId: this.adminId,
      });
    }, 3000);
  }

  send(event: string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }));
    }
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => {
      this.off(event, callback);
    };
  }

  off(event: string, callback: EventCallback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  private emit(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => cb(data));
    }
  }

  disconnect() {
    // Mark this as intentional so onclose does NOT trigger scheduleReconnect
    this.intentionalDisconnect = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const realtime = new RealtimeClient();
