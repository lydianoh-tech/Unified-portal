// Explanation: the next line is part of program logic.
import { z } from 'zod';
// Explanation: the next line is part of program logic.
import * as taskService from '../services/taskService.js';
// Explanation: the next line is part of program logic.
import { paramId } from '../utils/params.js';

// Explanation: the next line is part of program logic.
const taskSchema = z.object({
// Explanation: the next line is part of program logic.
  title: z.string().min(1),
// Explanation: the next line is part of program logic.
  description: z.string().optional(),
// Explanation: the next line is part of program logic.
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
// Explanation: the next line is part of program logic.
  dueDate: z.string().datetime().optional(),
// Explanation: the next line is part of program logic.
});

// Explanation: the next line is part of program logic.
export async function getTasks(req, res) {
// Explanation: the next line is part of program logic.
  const tasks = await taskService.listTasks(req.user.id);
// Explanation: the next line is part of program logic.
  return res.json({ tasks });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function createTask(req, res) {
// Explanation: the next line is part of program logic.
  const parsed = taskSchema.safeParse(req.body);
// Explanation: the next line is part of program logic.
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

// Explanation: the next line is part of program logic.
  const task = await taskService.createTask(req.user.id, parsed.data);
// Explanation: the next line is part of program logic.
  return res.status(201).json({ task });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function updateTask(req, res) {
// Explanation: the next line is part of program logic.
  const updateSchema = taskSchema.partial().extend({
// Explanation: the next line is part of program logic.
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
  const parsed = updateSchema.safeParse(req.body);
// Explanation: the next line is part of program logic.
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

// Explanation: the next line is part of program logic.
  try {
// Explanation: the next line is part of program logic.
    const task = await taskService.updateTask(req.user.id, paramId(req.params.id), parsed.data);
// Explanation: the next line is part of program logic.
    return res.json({ task });
// Explanation: the next line is part of program logic.
  } catch (err) {
// Explanation: the next line is part of program logic.
    return res.status(err.status ?? 500).json({ error: err.message });
// Explanation: the next line is part of program logic.
  }
// Explanation: the next line is part of program logic.
}
