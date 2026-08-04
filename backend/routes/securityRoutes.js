// Explanation: the next line is part of program logic.
import { Router } from 'express';
// Explanation: the next line is part of program logic.
import { asyncHandler } from '../utils/asyncHandler.js';
// Explanation: the next line is part of program logic.
import { requireAuth, requireRole } from '../middleware/auth.js';
// Explanation: the next line is part of program logic.
import * as securityController from '../controllers/securityController.js';

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.get('/logs', requireAuth, requireRole('ADMIN'), asyncHandler(securityController.getLogs));
// Explanation: the next line is part of program logic.
router.get(
// Explanation: the next line is part of program logic.
  '/dashboard',
// Explanation: the next line is part of program logic.
  requireAuth,
// Explanation: the next line is part of program logic.
  requireRole('ADMIN'),
// Explanation: the next line is part of program logic.
  asyncHandler(securityController.getDashboard)
// Explanation: the next line is part of program logic.
);
// Explanation: the next line is part of program logic.
router.get(
// Explanation: the next line is part of program logic.
  '/monitoring',
// Explanation: the next line is part of program logic.
  requireAuth,
// Explanation: the next line is part of program logic.
  requireRole('ADMIN'),
// Explanation: the next line is part of program logic.
  asyncHandler(securityController.getMonitoring)
// Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
export default router;
