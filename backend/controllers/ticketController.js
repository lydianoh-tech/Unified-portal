// Explanation: the next line is part of program logic.
import { z } from 'zod';
// Explanation: the next line is part of program logic.
import * as ticketService from '../services/ticketService.js';

// Explanation: the next line is part of program logic.
const ticketSchema = z.object({
// Explanation: the next line is part of program logic.
  subject: z.string().min(3),
// Explanation: the next line is part of program logic.
  description: z.string().min(10),
// Explanation: the next line is part of program logic.
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
// Explanation: the next line is part of program logic.
});

// Explanation: the next line is part of program logic.
export async function getTickets(req, res) {
// Explanation: the next line is part of program logic.
  const tickets = await ticketService.listTickets(req.user.id);
// Explanation: the next line is part of program logic.
  return res.json({ tickets });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function createTicket(req, res) {
// Explanation: the next line is part of program logic.
  const parsed = ticketSchema.safeParse(req.body);
// Explanation: the next line is part of program logic.
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

// Explanation: the next line is part of program logic.
  const ticket = await ticketService.createTicket(req.user.id, parsed.data);
// Explanation: the next line is part of program logic.
  return res.status(201).json({ ticket });
// Explanation: the next line is part of program logic.
}
