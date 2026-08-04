// Explanation: the next line is part of program logic.
import { Server } from 'socket.io';
// Explanation: the next line is part of program logic.
import { verifyAccessToken } from '../utils/jwt.js';
// Explanation: the next line is part of program logic.
import * as chatService from './chatService.js';

// Explanation: the next line is part of program logic.
export function setupSocket(httpServer, clientUrl) {
// Explanation: the next line is part of program logic.
  const io = new Server(httpServer, {
// Explanation: the next line is part of program logic.
    cors: { origin: clientUrl, credentials: true },
// Explanation: the next line is part of program logic.
  });

// Explanation: the next line is part of program logic.
  io.use((socket, next) => {
// Explanation: the next line is part of program logic.
    const token = socket.handshake.auth.token;
// Explanation: the next line is part of program logic.
    if (!token) return next(new Error('Authentication required'));
// Explanation: the next line is part of program logic.
    try {
// Explanation: the next line is part of program logic.
      const payload = verifyAccessToken(token);
// Explanation: the next line is part of program logic.
      socket.data.user = { id: payload.sub, email: payload.email, role: payload.role };
// Explanation: the next line is part of program logic.
      next();
// Explanation: the next line is part of program logic.
    } catch {
// Explanation: the next line is part of program logic.
      next(new Error('Invalid token'));
// Explanation: the next line is part of program logic.
    }
// Explanation: the next line is part of program logic.
  });

// Explanation: the next line is part of program logic.
  io.on('connection', (socket) => {
// Explanation: the next line is part of program logic.
    const userId = socket.data.user.id;
// Explanation: the next line is part of program logic.
    socket.join(`user:${userId}`);

// Explanation: the next line is part of program logic.
    socket.on('join_conversation', (conversationId) => {
// Explanation: the next line is part of program logic.
      socket.join(`conversation:${conversationId}`);
// Explanation: the next line is part of program logic.
    });

// Explanation: the next line is part of program logic.
    socket.on('send_message', async (payload) => {
// Explanation: the next line is part of program logic.
      try {
// Explanation: the next line is part of program logic.
        const message = await chatService.sendMessage(
// Explanation: the next line is part of program logic.
          userId,
// Explanation: the next line is part of program logic.
          payload.conversationId,
// Explanation: the next line is part of program logic.
          payload.content
// Explanation: the next line is part of program logic.
        );
// Explanation: the next line is part of program logic.
        io.to(`conversation:${payload.conversationId}`).emit('new_message', message);
// Explanation: the next line is part of program logic.
      } catch (err) {
// Explanation: the next line is part of program logic.
        socket.emit('error', { message: err.message });
// Explanation: the next line is part of program logic.
      }
// Explanation: the next line is part of program logic.
    });
// Explanation: the next line is part of program logic.
  });

// Explanation: the next line is part of program logic.
  return io;
// Explanation: the next line is part of program logic.
}
