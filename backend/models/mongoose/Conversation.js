// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const conversationSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    participantIds: [{ type: String, ref: 'User', required: true }],
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
conversationSchema.index({ participantIds: 1 });

// Explanation: the next line is part of program logic.
export default mongoose.model('Conversation', conversationSchema);
