// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const messageSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    conversationId: {
// Explanation: the next line is part of program logic.
      type: mongoose.Schema.Types.ObjectId,
// Explanation: the next line is part of program logic.
      ref: 'Conversation',
// Explanation: the next line is part of program logic.
      required: true,
// Explanation: the next line is part of program logic.
      index: true,
// Explanation: the next line is part of program logic.
    },
// Explanation: the next line is part of program logic.
    senderId: { type: String, ref: 'User', required: true },
// Explanation: the next line is part of program logic.
    content: { type: String, required: true },
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
messageSchema.index({ conversationId: 1, createdAt: 1 });

// Explanation: the next line is part of program logic.
export default mongoose.model('Message', messageSchema);
