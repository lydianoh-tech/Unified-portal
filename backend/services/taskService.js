// Explanation: the next line is part of program logic.
import prisma from '../models/prisma.js';

// Explanation: the next line is part of program logic.
export function listTasks(userId) {
// Explanation: the next line is part of program logic.
  return prisma.task.findMany({
// Explanation: the next line is part of program logic.
    where: { userId },
// Explanation: the next line is part of program logic.
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function createTask(userId, data) {
// Explanation: the next line is part of program logic.
  return prisma.task.create({
// Explanation: the next line is part of program logic.
    data: {
// Explanation: the next line is part of program logic.
      userId,
// Explanation: the next line is part of program logic.
      title: data.title,
// Explanation: the next line is part of program logic.
      description: data.description,
// Explanation: the next line is part of program logic.
      priority: data.priority,
// Explanation: the next line is part of program logic.
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
// Explanation: the next line is part of program logic.
    },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function updateTask(userId, taskId, data) {
// Explanation: the next line is part of program logic.
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
// Explanation: the next line is part of program logic.
  if (!task) {
// Explanation: the next line is part of program logic.
    const err = new Error('Task not found');
// Explanation: the next line is part of program logic.
    err.status = 404;
// Explanation: the next line is part of program logic.
    throw err;
// Explanation: the next line is part of program logic.
  }

// Explanation: the next line is part of program logic.
  return prisma.task.update({
// Explanation: the next line is part of program logic.
    where: { id: task.id },
// Explanation: the next line is part of program logic.
    data: {
// Explanation: the next line is part of program logic.
      ...data,
// Explanation: the next line is part of program logic.
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
// Explanation: the next line is part of program logic.
    },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}
