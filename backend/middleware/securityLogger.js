// Explanation: the next line is part of program logic.
import { SecurityLog } from '../models/mongoose/index.js';
// Explanation: the next line is part of program logic.
import { logger } from '../utils/logger.js';

// Explanation: the next line is part of program logic.
export async function logSecurityEvent(event, source, severity, options = {}) {
// Explanation: the next line is part of program logic.
  await SecurityLog.create({
// Explanation: the next line is part of program logic.
    event,
// Explanation: the next line is part of program logic.
    source,
// Explanation: the next line is part of program logic.
    severity,
// Explanation: the next line is part of program logic.
    userId: options.userId,
// Explanation: the next line is part of program logic.
    ipAddress: options.ipAddress,
// Explanation: the next line is part of program logic.
    metadata: options.metadata,
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
  logger.info(event, { source, severity, ...options });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function securityLogger(source) {
// Explanation: the next line is part of program logic.
  return (req, res, next) => {
// Explanation: the next line is part of program logic.
    const originalJson = res.json.bind(res);
// Explanation: the next line is part of program logic.
    res.json = (body) => {
// Explanation: the next line is part of program logic.
      if (res.statusCode >= 400) {
// Explanation: the next line is part of program logic.
        void logSecurityEvent('HTTP error response', source, 'WARNING', {
// Explanation: the next line is part of program logic.
          ipAddress: req.ip,
// Explanation: the next line is part of program logic.
          metadata: { method: req.method, path: req.path, status: res.statusCode },
// Explanation: the next line is part of program logic.
        });
// Explanation: the next line is part of program logic.
      }
// Explanation: the next line is part of program logic.
      return originalJson(body);
// Explanation: the next line is part of program logic.
    };
// Explanation: the next line is part of program logic.
    next();
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
}
