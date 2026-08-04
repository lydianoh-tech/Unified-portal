// Explanation: the next line is part of program logic.
import fs from 'fs';
// Explanation: the next line is part of program logic.
import path from 'path';
// Explanation: the next line is part of program logic.
import config from '../config/index.js';

// Explanation: the next line is part of program logic.
if (!fs.existsSync(config.logDir)) {
// Explanation: the next line is part of program logic.
  fs.mkdirSync(config.logDir, { recursive: true });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
function logFilePath() {
// Explanation: the next line is part of program logic.
  const date = new Date().toISOString().slice(0, 10);
// Explanation: the next line is part of program logic.
  return path.join(config.logDir, `${date}.log`);
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function writeLog(level, message, meta = {}) {
// Explanation: the next line is part of program logic.
  const entry = {
// Explanation: the next line is part of program logic.
    timestamp: new Date().toISOString(),
// Explanation: the next line is part of program logic.
    level,
// Explanation: the next line is part of program logic.
    message,
// Explanation: the next line is part of program logic.
    ...meta,
// Explanation: the next line is part of program logic.
  };
// Explanation: the next line is part of program logic.
  const line = JSON.stringify(entry) + '\n';
// Explanation: the next line is part of program logic.
  fs.appendFileSync(logFilePath(), line, 'utf8');
// Explanation: the next line is part of program logic.
  if (config.nodeEnv !== 'production') {
// Explanation: the next line is part of program logic.
    console.log(`[${level}] ${message}`, meta);
// Explanation: the next line is part of program logic.
  }
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export const logger = {
// Explanation: the next line is part of program logic.
  info: (message, meta) => writeLog('INFO', message, meta),
// Explanation: the next line is part of program logic.
  warn: (message, meta) => writeLog('WARN', message, meta),
// Explanation: the next line is part of program logic.
  error: (message, meta) => writeLog('ERROR', message, meta),
// Explanation: the next line is part of program logic.
};
