// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const listingSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    sellerId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    title: { type: String, required: true },
// Explanation: the next line is part of program logic.
    description: { type: String, required: true },
// Explanation: the next line is part of program logic.
    price: { type: Number, required: true },
// Explanation: the next line is part of program logic.
    imageUrl: String,
// Explanation: the next line is part of program logic.
    active: { type: Boolean, default: true },
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default mongoose.model('Listing', listingSchema);
