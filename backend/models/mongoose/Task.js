// Explanation: the next line is part of program logic.
import mongoose from 'mongoose';
// Explanation: the next line is part of program logic.
import { TaskStatus, TaskPriority, defaultSchemaOptions } from './enums.js';

// Explanation: the next line is part of program logic.
const taskSchema = new mongoose.Schema(
// Explanation: the next line is part of program logic.
  {
// Explanation: the next line is part of program logic.
    userId: { type: String, ref: 'User', required: true, index: true },
// Explanation: the next line is part of program logic.
    title: { type: String, required: true },
// Explanation: the next line is part of program logic.
    description: String,
// Explanation: the next line is part of program logic.
    status: { type: String, enum: TaskStatus, default: 'TODO' },
// Explanation: the next line is part of program logic.
    priority: { type: String, enum: TaskPriority, default: 'MEDIUM' },
// Explanation: the next line is part of program logic.
    dueDate: Date,
// Explanation: the next line is part of program logic.
  },
// Explanation: the next line is part of program logic.
  defaultSchemaOptions
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default mongoose.model('Task', taskSchema);
