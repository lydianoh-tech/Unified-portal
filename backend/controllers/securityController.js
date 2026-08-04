// Explanation: the next line is part of program logic.
import * as securityService from '../services/securityService.js';

// Explanation: the next line is part of program logic.
export async function getLogs(req, res) {
// Explanation: the next line is part of program logic.
  const severity = typeof req.query.severity === 'string' ? req.query.severity : undefined;
// Explanation: the next line is part of program logic.
  const limit = Number(req.query.limit ?? 50);
// Explanation: the next line is part of program logic.
  const logs = await securityService.listLogs({ severity, limit });
// Explanation: the next line is part of program logic.
  return res.json({ logs });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function getDashboard(_req, res) {
// Explanation: the next line is part of program logic.
  const data = await securityService.getDashboard();
// Explanation: the next line is part of program logic.
  return res.json(data);
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function getMonitoring(_req, res) {
// Explanation: the next line is part of program logic.
  const data = await securityService.getMonitoring();
// Explanation: the next line is part of program logic.
  return res.json(data);
// Explanation: the next line is part of program logic.
}
