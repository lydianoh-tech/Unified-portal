// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { OrderStatus, defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const orderSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    listingId: { type: String, ref: 'Listing', required: true, index: true },
// Explanation: the next line is part of program logic.
    buyerId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    sellerId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    status: { type: String, enum: OrderStatus, default: 'PENDING' },
// Explanation: the next line is part of program logic.
    total: { type: Number, required: true },
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default mongoose.model('Order', orderSchema);
