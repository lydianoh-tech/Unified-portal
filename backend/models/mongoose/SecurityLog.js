// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { LogSeverity, defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const securityLogSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    userId: { type: String, ref: 'User', index: true },
// Explanation: the next line is part of program logic.
    event: { type: String, required: true },
// Explanation: the next line is part of program logic.
    source: { type: String, required: true },
// Explanation: the next line is part of program logic.
    severity: { type: String, enum: LogSeverity, default: 'INFO', index: true },
// Explanation: the next line is part of program logic.
    ipAddress: String,
// Explanation: the next line is part of program logic.
    metadata: mongoose.Schema.Types.Mixed,
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
securityLogSchema.index({ createdAt: -1 });

// Explanation: the next line is part of program logic.
export default mongoose.model('SecurityLog', securityLogSchema);
