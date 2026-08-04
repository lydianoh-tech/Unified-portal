// Explanation: the next line is part of program logic.
export const Role = ['USER', 'CUSTOMER', 'ADMIN'];
// Explanation: the next line is part of program logic.
export const BookingStatus = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
// Explanation: the next line is part of program logic.
export const OrderStatus = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
// Explanation: the next line is part of program logic.
export const TicketStatus = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
// Explanation: the next line is part of program logic.
export const TaskStatus = ['TODO', 'IN_PROGRESS', 'DONE'];
// Explanation: the next line is part of program logic.
export const TaskPriority = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
// Explanation: the next line is part of program logic.
export const LogSeverity = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];

// Explanation: the next line is part of program logic.
export function jsonTransform(_doc, ret) {
// Explanation: the next line is part of program logic.
  ret.id = ret._id.toString();
// Explanation: the next line is part of program logic.
  delete ret._id;
// Explanation: the next line is part of program logic.
  delete ret.__v;
// Explanation: the next line is part of program logic.
  return ret;
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export const defaultSchemaOptions = {
// Explanation: the next line is part of program logic.
  timestamps: true,
// Explanation: the next line is part of program logic.
  toJSON: { transform: jsonTransform },
// Explanation: the next line is part of program logic.
  toObject: { transform: jsonTransform },
// Explanation: the next line is part of program logic.
};
