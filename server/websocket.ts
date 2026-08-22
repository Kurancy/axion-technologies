import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import { db } from './db.js';

interface ClientConnection {
  ws: WebSocket;
  type: 'admin' | 'visitor';
  visitorId?: string;
  conversationId?: string;
  adminId?: string;
}

let clients: ClientConnection[] = [];

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    let clientInfo: ClientConnection = {
      ws,
      type: 'visitor',
    };
    clients.push(clientInfo);

    ws.on('message', (messageRaw: string) => {
      try {
        const payload = JSON.parse(messageRaw.toString());
        const { event, data } = payload;

        switch (event) {
          case 'auth_admin': {
            clientInfo.type = 'admin';
            clientInfo.adminId = data?.adminId || 'admin-1';
            ws.send(
              JSON.stringify({
                event: 'admin_authenticated',
                data: { status: 'ok', activeConversations: db.getConversations() },
              })
            );
            break;
          }

          case 'join_conversation': {
            clientInfo.conversationId = data.conversationId;
            clientInfo.visitorId = data.visitorId;
            ws.send(
              JSON.stringify({
                event: 'joined_conversation',
                data: { conversationId: data.conversationId },
              })
            );
            break;
          }

          case 'typing': {
            // Forward typing indicator
            if (clientInfo.type === 'admin') {
              broadcastToVisitor(data.conversationId, {
                event: 'typing',
                data: { sender: 'admin', isTyping: data.isTyping },
              });
            } else {
              broadcastToAdmins({
                event: 'typing',
                data: {
                  conversationId: data.conversationId,
                  sender: 'visitor',
                  isTyping: data.isTyping,
                },
              });
            }
            break;
          }

          case 'ping': {
            ws.send(JSON.stringify({ event: 'pong' }));
            break;
          }
        }
      } catch (e) {
        console.error('WebSocket message parsing error:', e);
      }
    });

    ws.on('close', () => {
      clients = clients.filter((c) => c.ws !== ws);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
      clients = clients.filter((c) => c.ws !== ws);
    });
  });

  return wss;
}

export function broadcastToAdmins(payload: { event: string; data: any }) {
  const message = JSON.stringify(payload);
  clients.forEach((client) => {
    if (client.type === 'admin' && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

export function broadcastToVisitor(conversationId: string, payload: { event: string; data: any }) {
  const message = JSON.stringify(payload);
  clients.forEach((client) => {
    if (
      client.type === 'visitor' &&
      client.conversationId === conversationId &&
      client.ws.readyState === WebSocket.OPEN
    ) {
      client.ws.send(message);
    }
  });
}

export function broadcastToAll(payload: { event: string; data: any }) {
  const message = JSON.stringify(payload);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}
