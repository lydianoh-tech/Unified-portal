// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const refreshTokenSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    token: { type: String, required: true, unique: true },
// Explanation: the next line is part of program logic.
    userId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    expiresAt: { type: Date, required: true },
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  { ...defaultSchemaOptions, timestamps: { createdAt: true, updatedAt: false } }
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Explanation: the next line is part of program logic.
export default mongoose.model('RefreshToken', refreshTokenSchema);
