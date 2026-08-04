// Explanation: the next line is part of program logic.
import { logger } from '../utils/logger.js';

// Explanation: the next line is part of program logic.
export function notFoundHandler(_req, res) {
// Explanation: the next line is part of program logic.
  res.status(404).json({ error: 'Not found' });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function errorHandler(err, _req, res, _next) {
// Explanation: the next line is part of program logic.
  logger.error(err.message, { stack: err.stack });
// Explanation: the next line is part of program logic.
  const status = err.status ?? 500;
// Explanation: the next line is part of program logic.
  res.status(status).json({
// Explanation: the next line is part of program logic.
    error: status === 500 ? 'Internal server error' : err.message,
// Explanation: the next line is part of program logic.
  });
// Explanation: the next line is part of program logic.
}
