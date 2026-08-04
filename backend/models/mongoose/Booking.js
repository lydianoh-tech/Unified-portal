// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { BookingStatus, defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const bookingSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    serviceId: { type: String, ref: 'Service', required: true, index: true },
// Explanation: the next line is part of program logic.
    customerId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    providerId: { type: String, ref: 'User' },
// Explanation: the next line is part of program logic.
    scheduledAt: { type: Date, required: true },
// Explanation: the next line is part of program logic.
    status: { type: String, enum: BookingStatus, default: 'PENDING' },
// Explanation: the next line is part of program logic.
    notes: String,
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default mongoose.model('Booking', bookingSchema);
