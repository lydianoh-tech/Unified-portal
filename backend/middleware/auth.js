// Explanation: the next line is part of program logic.
import { verifyAccessToken } from '../utils/jwt.js';
// Explanation: the next line is part of program logic.
import prisma from '../models/prisma.js';

// Explanation: the next line is part of program logic.
export async function requireAuth(req, res, next) {
// Explanation: the next line is part of program logic.
  const header = req.headers.authorization;
// Explanation: the next line is part of program logic.
  const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;

// Explanation: the next line is part of program logic.
  if (!token) {
// Explanation: the next line is part of program logic.
    return res.status(401).json({ error: 'Authentication required' });
// Explanation: the next line is part of program logic.
  }

// Explanation: the next line is part of program logic.
  try {
// Explanation: the next line is part of program logic.
    const payload = verifyAccessToken(token);
// Explanation: the next line is part of program logic.
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
// Explanation: the next line is part of program logic.
    if (!user) {
// Explanation: the next line is part of program logic.
      return res.status(401).json({ error: 'User not found' });
// Explanation: the next line is part of program logic.
    }
// Explanation: the next line is part of program logic.
    req.user = { id: user.id, email: user.email, role: user.role };
// Explanation: the next line is part of program logic.
    next();
// Explanation: the next line is part of program logic.
  } catch {
// Explanation: the next line is part of program logic.
    return res.status(401).json({ error: 'Invalid or expired token' });
// Explanation: the next line is part of program logic.
  }
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function requireRole(...roles) {
// Explanation: the next line is part of program logic.
  return (req, res, next) => {
// Explanation: the next line is part of program logic.
    if (!req.user || !roles.includes(req.user.role)) {
// Explanation: the next line is part of program logic.
      return res.status(403).json({ error: 'Insufficient permissions' });
// Explanation: the next line is part of program logic.
    }
// Explanation: the next line is part of program logic.
    next();
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
}
