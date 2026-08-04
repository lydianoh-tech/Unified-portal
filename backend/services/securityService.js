// Explanation: the next line is part of program logic.
import { SecurityLog } from '../models/mongoose/index.js';
// Explanation: the next line is part of program logic.
import prisma from '../models/prisma.js';

// Explanation: the next line is part of program logic.
async function attachUsers(logs) {
// Explanation: the next line is part of program logic.
  const userIds = [...new Set(logs.map((log) => log.userId).filter(Boolean))];
// Explanation: the next line is part of program logic.
  if (userIds.length === 0) {
// Explanation: the next line is part of program logic.
    return logs.map((log) => ({ ...log, user: null }));
// Explanation: the next line is part of program logic.
  }

// Explanation: the next line is part of program logic.
  const users = await prisma.user.findMany({
// Explanation: the next line is part of program logic.
    where: { id: { in: userIds } },
// Explanation: the next line is part of program logic.
    select: { id: true, email: true, name: true },
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
  const userMap = Object.fromEntries(users.map((user) => [user.id, user]));

// Explanation: the next line is part of program logic.
  return logs.map((log) => ({
// Explanation: the next line is part of program logic.
    ...log,
// Explanation: the next line is part of program logic.
    user: log.userId ? userMap[log.userId] ?? null : null,
// Explanation: the next line is part of program logic.
  }));
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function listLogs({ severity, limit = 50 }) {
// Explanation: the next line is part of program logic.
  const query = severity ? { severity } : {};
// Explanation: the next line is part of program logic.
  const logs = await SecurityLog.find(query)
// Explanation: the next line is part of program logic.
    .sort({ createdAt: -1 })
// Explanation: the next line is part of program logic.
    .limit(Math.min(limit, 200))
// Explanation: the next line is part of program logic.
    .lean();

// Explanation: the next line is part of program logic.
  return attachUsers(
// Explanation: the next line is part of program logic.
    logs.map((log) => ({
// Explanation: the next line is part of program logic.
      id: log._id.toString(),
// Explanation: the next line is part of program logic.
      userId: log.userId,
// Explanation: the next line is part of program logic.
      event: log.event,
// Explanation: the next line is part of program logic.
      source: log.source,
// Explanation: the next line is part of program logic.
      severity: log.severity,
// Explanation: the next line is part of program logic.
      ipAddress: log.ipAddress,
// Explanation: the next line is part of program logic.
      metadata: log.metadata,
// Explanation: the next line is part of program logic.
      createdAt: log.createdAt,
// Explanation: the next line is part of program logic.
    }))
// Explanation: the next line is part of program logic.
  );
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function getDashboard() {
// Explanation: the next line is part of program logic.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

// Explanation: the next line is part of program logic.
  const [users, bookings, orders, openTickets, criticalLogs, warningLogs, recentLogs] =
// Explanation: the next line is part of program logic.
    await Promise.all([
// Explanation: the next line is part of program logic.
      prisma.user.count(),
// Explanation: the next line is part of program logic.
      prisma.booking.count(),
// Explanation: the next line is part of program logic.
      prisma.order.count(),
// Explanation: the next line is part of program logic.
      prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
// Explanation: the next line is part of program logic.
      SecurityLog.countDocuments({ severity: 'CRITICAL' }),
// Explanation: the next line is part of program logic.
      SecurityLog.countDocuments({ severity: 'WARNING' }),
// Explanation: the next line is part of program logic.
      SecurityLog.find().sort({ createdAt: -1 }).limit(10).lean(),
// Explanation: the next line is part of program logic.
    ]);

// Explanation: the next line is part of program logic.
  const formattedLogs = recentLogs.map((log) => ({
// Explanation: the next line is part of program logic.
    id: log._id.toString(),
// Explanation: the next line is part of program logic.
    event: log.event,
// Explanation: the next line is part of program logic.
    severity: log.severity,
// Explanation: the next line is part of program logic.
    createdAt: log.createdAt,
// Explanation: the next line is part of program logic.
    userId: log.userId,
// Explanation: the next line is part of program logic.
  }));

// Explanation: the next line is part of program logic.
  const logsWithUsers = await attachUsers(formattedLogs);
// Explanation: the next line is part of program logic.
  const recentWithEmail = logsWithUsers.map((log) => ({
// Explanation: the next line is part of program logic.
    ...log,
// Explanation: the next line is part of program logic.
    user: log.user ? { email: log.user.email } : null,
// Explanation: the next line is part of program logic.
  }));

// Explanation: the next line is part of program logic.
  return {
// Explanation: the next line is part of program logic.
    stats: { users, bookings, orders, openTickets, criticalLogs, warningLogs },
// Explanation: the next line is part of program logic.
    recentLogs: recentWithEmail,
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function getMonitoring() {
// Explanation: the next line is part of program logic.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
// Explanation: the next line is part of program logic.
  const eventsLastHour = await SecurityLog.countDocuments({
// Explanation: the next line is part of program logic.
    createdAt: { $gte: oneHourAgo },
// Explanation: the next line is part of program logic.
  });

// Explanation: the next line is part of program logic.
  return {
// Explanation: the next line is part of program logic.
    status: 'healthy',
// Explanation: the next line is part of program logic.
    uptime: process.uptime(),
// Explanation: the next line is part of program logic.
    memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
// Explanation: the next line is part of program logic.
    eventsLastHour,
// Explanation: the next line is part of program logic.
    timestamp: new Date().toISOString(),
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
}
