// Explanation: the next line is part of program logic.
import { Router } from 'express';
// Explanation: the next line is part of program logic.
import { asyncHandler } from '../utils/asyncHandler.js';
// Explanation: the next line is part of program logic.
import { requireAuth } from '../middleware/auth.js';
// Explanation: the next line is part of program logic.
import * as taskController from '../controllers/taskController.js';

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.get('/', requireAuth, asyncHandler(taskController.getTasks));
// Explanation: the next line is part of program logic.
router.post('/', requireAuth, asyncHandler(taskController.createTask));
// Explanation: the next line is part of program logic.
router.patch('/:id', requireAuth, asyncHandler(taskController.updateTask));

// Explanation: the next line is part of program logic.
export default router;
