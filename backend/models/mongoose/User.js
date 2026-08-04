// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { Role, defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const userSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// Explanation: the next line is part of program logic.
    passwordHash: { type: String, required: true },
// Explanation: the next line is part of program logic.
    name: { type: String, required: true },
// Explanation: the next line is part of program logic.
    role: { type: String, enum: Role, default: 'USER' },
// Explanation: the next line is part of program logic.
    avatarUrl: String,
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default mongoose.model('User', userSchema);
