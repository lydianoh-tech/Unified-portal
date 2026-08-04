// Explanation: the next line is part of program logic.
import { Router } from 'express';
// Explanation: the next line is part of program logic.
import { asyncHandler } from '../utils/asyncHandler.js';
// Explanation: the next line is part of program logic.
import { requireAuth } from '../middleware/auth.js';
// Explanation: the next line is part of program logic.
import * as ticketController from '../controllers/ticketController.js';

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.get('/', requireAuth, asyncHandler(ticketController.getTickets));
// Explanation: the next line is part of program logic.
router.post('/', requireAuth, asyncHandler(ticketController.createTicket));

// Explanation: the next line is part of program logic.
export default router;
