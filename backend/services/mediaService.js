// Explanation: the next line is part of program logic.
import prisma from '../models/prisma.js';

// Explanation: the next line is part of program logic.
export function listMedia(userId) {
// Explanation: the next line is part of program logic.
  return prisma.media.findMany({
// Explanation: the next line is part of program logic.
    where: { userId },
// Explanation: the next line is part of program logic.
    orderBy: { createdAt: 'desc' },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function saveMedia(userId, file) {
// Explanation: the next line is part of program logic.
  const url = `/uploads/${file.filename}`;
// Explanation: the next line is part of program logic.
  return prisma.media.create({
// Explanation: the next line is part of program logic.
    data: {
// Explanation: the next line is part of program logic.
      userId,
// Explanation: the next line is part of program logic.
      filename: file.filename,
// Explanation: the next line is part of program logic.
      originalName: file.originalname,
// Explanation: the next line is part of program logic.
      mimeType: file.mimetype,
// Explanation: the next line is part of program logic.
      sizeBytes: file.size,
// Explanation: the next line is part of program logic.
      url,
// Explanation: the next line is part of program logic.
    },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}
