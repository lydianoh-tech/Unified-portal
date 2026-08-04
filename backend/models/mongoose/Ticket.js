// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { TicketStatus, TaskPriority, defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const ticketSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    creatorId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    assigneeId: { type: String, ref: 'User' },
// Explanation: the next line is part of program logic.
    subject: { type: String, required: true },
// Explanation: the next line is part of program logic.
    description: { type: String, required: true },
// Explanation: the next line is part of program logic.
    status: { type: String, enum: TicketStatus, default: 'OPEN' },
// Explanation: the next line is part of program logic.
    priority: { type: String, enum: TaskPriority, default: 'MEDIUM' },
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default mongoose.model('Ticket', ticketSchema);
