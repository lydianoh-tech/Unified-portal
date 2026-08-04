// Explanation: the next line is part of program logic.
import { Conversation, Message } from '../models/mongoose/index.js';
// Explanation: the next line is part of program logic.
import prisma from '../models/prisma.js';

// Explanation: the next line is part of program logic.
async function loadParticipants(participantIds) {
// Explanation: the next line is part of program logic.
  const users = await prisma.user.findMany({
// Explanation: the next line is part of program logic.
    where: { id: { in: participantIds } },
// Explanation: the next line is part of program logic.
    select: { id: true, name: true, email: true },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
  return participantIds.map((id) => ({
// Explanation: the next line is part of program logic.
    user: users.find((user) => user.id === id) ?? { id, name: 'Unknown', email: '' },
// Explanation: the next line is part of program logic.
  }));
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
async function loadSender(senderId) {
// Explanation: the next line is part of program logic.
  return prisma.user.findUnique({
// Explanation: the next line is part of program logic.
    where: { id: senderId },
// Explanation: the next line is part of program logic.
    select: { id: true, name: true },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function listConversations(userId) {
// Explanation: the next line is part of program logic.
  const conversations = await Conversation.find({ participantIds: userId })
// Explanation: the next line is part of program logic.
    .sort({ updatedAt: -1 })
// Explanation: the next line is part of program logic.
    .lean();

// Explanation: the next line is part of program logic.
  return Promise.all(
// Explanation: the next line is part of program logic.
    conversations.map(async (conversation) => {
// Explanation: the next line is part of program logic.
      const participants = await loadParticipants(conversation.participantIds);
// Explanation: the next line is part of program logic.
      const lastMessage = await Message.findOne({ conversationId: conversation._id })
// Explanation: the next line is part of program logic.
        .sort({ createdAt: -1 })
// Explanation: the next line is part of program logic.
        .lean();

// Explanation: the next line is part of program logic.
      let messages = [];
// Explanation: the next line is part of program logic.
      if (lastMessage) {
// Explanation: the next line is part of program logic.
        const sender = await loadSender(lastMessage.senderId);
// Explanation: the next line is part of program logic.
        messages = [
// Explanation: the next line is part of program logic.
          {
// Explanation: the next line is part of program logic.
            id: lastMessage._id.toString(),
// Explanation: the next line is part of program logic.
            content: lastMessage.content,
// Explanation: the next line is part of program logic.
            createdAt: lastMessage.createdAt,
// Explanation: the next line is part of program logic.
            sender,
// Explanation: the next line is part of program logic.
          },
// Explanation: the next line is part of program logic.
        ];
// Explanation: the next line is part of program logic.
      }

// Explanation: the next line is part of program logic.
      return {
// Explanation: the next line is part of program logic.
        id: conversation._id.toString(),
// Explanation: the next line is part of program logic.
        createdAt: conversation.createdAt,
// Explanation: the next line is part of program logic.
        updatedAt: conversation.updatedAt,
// Explanation: the next line is part of program logic.
        participants,
// Explanation: the next line is part of program logic.
        messages,
// Explanation: the next line is part of program logic.
      };
// Explanation: the next line is part of program logic.
    })
// Explanation: the next line is part of program logic.
  );
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function createConversation(userId, participantIds) {
// Explanation: the next line is part of program logic.
  const allIds = [...new Set([userId, ...participantIds])];
// Explanation: the next line is part of program logic.
  const conversation = await Conversation.create({ participantIds: allIds });
// Explanation: the next line is part of program logic.
  const participants = await loadParticipants(allIds);

// Explanation: the next line is part of program logic.
  return {
// Explanation: the next line is part of program logic.
    id: conversation.id,
// Explanation: the next line is part of program logic.
    createdAt: conversation.createdAt,
// Explanation: the next line is part of program logic.
    updatedAt: conversation.updatedAt,
// Explanation: the next line is part of program logic.
    participants,
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function listMessages(userId, conversationId) {
// Explanation: the next line is part of program logic.
  const conversation = await Conversation.findById(conversationId).lean();
// Explanation: the next line is part of program logic.
  if (!conversation || !conversation.participantIds.includes(userId)) {
// Explanation: the next line is part of program logic.
    const err = new Error('Access denied');
// Explanation: the next line is part of program logic.
    err.status = 403;
// Explanation: the next line is part of program logic.
    throw err;
// Explanation: the next line is part of program logic.
  }

// Explanation: the next line is part of program logic.
  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();

// Explanation: the next line is part of program logic.
  return Promise.all(
// Explanation: the next line is part of program logic.
    messages.map(async (message) => ({
// Explanation: the next line is part of program logic.
      id: message._id.toString(),
// Explanation: the next line is part of program logic.
      conversationId: message.conversationId.toString(),
// Explanation: the next line is part of program logic.
      content: message.content,
// Explanation: the next line is part of program logic.
      createdAt: message.createdAt,
// Explanation: the next line is part of program logic.
      sender: await loadSender(message.senderId),
// Explanation: the next line is part of program logic.
    }))
// Explanation: the next line is part of program logic.
  );
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function sendMessage(userId, conversationId, content) {
// Explanation: the next line is part of program logic.
  const conversation = await Conversation.findById(conversationId);
// Explanation: the next line is part of program logic.
  if (!conversation || !conversation.participantIds.includes(userId)) {
// Explanation: the next line is part of program logic.
    const err = new Error('Not a participant in this conversation');
// Explanation: the next line is part of program logic.
    err.status = 403;
// Explanation: the next line is part of program logic.
    throw err;
// Explanation: the next line is part of program logic.
  }

// Explanation: the next line is part of program logic.
  const message = await Message.create({
// Explanation: the next line is part of program logic.
    conversationId: conversation._id,
// Explanation: the next line is part of program logic.
    senderId: userId,
// Explanation: the next line is part of program logic.
    content,
// Explanation: the next line is part of program logic.
  });

// Explanation: the next line is part of program logic.
  conversation.updatedAt = new Date();
// Explanation: the next line is part of program logic.
  await conversation.save();

// Explanation: the next line is part of program logic.
  const sender = await loadSender(userId);

// Explanation: the next line is part of program logic.
  return {
// Explanation: the next line is part of program logic.
    id: message.id,
// Explanation: the next line is part of program logic.
    conversationId: message.conversationId.toString(),
// Explanation: the next line is part of program logic.
    content: message.content,
// Explanation: the next line is part of program logic.
    createdAt: message.createdAt,
// Explanation: the next line is part of program logic.
    sender,
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
}
