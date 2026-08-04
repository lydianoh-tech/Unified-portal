// Explanation: the next line is part of program logic.
import { Router } from 'express';
// Explanation: the next line is part of program logic.
import { asyncHandler } from '../utils/asyncHandler.js';
// Explanation: the next line is part of program logic.
import { requireAuth } from '../middleware/auth.js';
// Explanation: the next line is part of program logic.
import * as chatController from '../controllers/chatController.js';

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.get('/', requireAuth, asyncHandler(chatController.getConversations));
// Explanation: the next line is part of program logic.
router.post('/', requireAuth, asyncHandler(chatController.createConversation));
// Explanation: the next line is part of program logic.
router.get('/:id/messages', requireAuth, asyncHandler(chatController.getMessages));

// Explanation: the next line is part of program logic.
export default router;
