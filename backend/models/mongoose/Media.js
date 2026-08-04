// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const mediaSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    userId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    filename: { type: String, required: true },
// Explanation: the next line is part of program logic.
    originalName: { type: String, required: true },
// Explanation: the next line is part of program logic.
    mimeType: { type: String, required: true },
// Explanation: the next line is part of program logic.
    sizeBytes: { type: Number, required: true },
// Explanation: the next line is part of program logic.
    url: { type: String, required: true },
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default mongoose.model('Media', mediaSchema);
