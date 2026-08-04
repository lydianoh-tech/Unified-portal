// Explanation: the next line is part of program logic.
import prisma from '../models/prisma.js';

// Explanation: the next line is part of program logic.
export function listTickets(userId) {
// Explanation: the next line is part of program logic.
  return prisma.ticket.findMany({
// Explanation: the next line is part of program logic.
    where: { OR: [{ creatorId: userId }, { assigneeId: userId }] },
// Explanation: the next line is part of program logic.
    include: {
// Explanation: the next line is part of program logic.
      creator: { select: { id: true, name: true, email: true } },
// Explanation: the next line is part of program logic.
      assignee: { select: { id: true, name: true, email: true } },
// Explanation: the next line is part of program logic.
    },
// Explanation: the next line is part of program logic.
    orderBy: { createdAt: 'desc' },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function createTicket(creatorId, data) {
// Explanation: the next line is part of program logic.
  return prisma.ticket.create({
// Explanation: the next line is part of program logic.
    data: { creatorId, ...data },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}
