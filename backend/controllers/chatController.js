// Explanation: the next line is part of program logic.
import { z } from 'zod';
// Explanation: the next line is part of program logic.
import * as chatService from '../services/chatService.js';
// Explanation: the next line is part of program logic.
import { paramId } from '../utils/params.js';

// Explanation: the next line is part of program logic.
const createSchema = z.object({
// Explanation: the next line is part of program logic.
  participantIds: z.array(z.string()).min(1),
// Explanation: the next line is part of program logic.
});

// Explanation: the next line is part of program logic.
export async function getConversations(req, res) {
// Explanation: the next line is part of program logic.
  const conversations = await chatService.listConversations(req.user.id);
// Explanation: the next line is part of program logic.
  return res.json({ conversations });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function createConversation(req, res) {
// Explanation: the next line is part of program logic.
  const parsed = createSchema.safeParse(req.body);
// Explanation: the next line is part of program logic.
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

// Explanation: the next line is part of program logic.
  const conversation = await chatService.createConversation(
// Explanation: the next line is part of program logic.
    req.user.id,
// Explanation: the next line is part of program logic.
    parsed.data.participantIds
// Explanation: the next line is part of program logic.
  );
// Explanation: the next line is part of program logic.
  return res.status(201).json({ conversation });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function getMessages(req, res) {
// Explanation: the next line is part of program logic.
  try {
// Explanation: the next line is part of program logic.
    const messages = await chatService.listMessages(req.user.id, paramId(req.params.id));
// Explanation: the next line is part of program logic.
    return res.json({ messages });
// Explanation: the next line is part of program logic.
  } catch (err) {
// Explanation: the next line is part of program logic.
    return res.status(err.status ?? 500).json({ error: err.message });
// Explanation: the next line is part of program logic.
  }
// Explanation: the next line is part of program logic.
}
