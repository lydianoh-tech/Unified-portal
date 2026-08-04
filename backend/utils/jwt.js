// Explanation: the next line is part of program logic.
import jwt from 'jsonwebtoken';
// Explanation: the next line is part of program logic.
import config from '../config/index.js';

// Explanation: the next line is part of program logic.
export function signAccessToken(payload) {
// Explanation: the next line is part of program logic.
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpires });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function signRefreshToken(payload) {
// Explanation: the next line is part of program logic.
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpires });
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function verifyAccessToken(token) {
// Explanation: the next line is part of program logic.
  return jwt.verify(token, config.jwt.accessSecret);
// Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function verifyRefreshToken(token) {
// Explanation: the next line is part of program logic.
  return jwt.verify(token, config.jwt.refreshSecret);
// Explanation: the next line is part of program logic.
}
