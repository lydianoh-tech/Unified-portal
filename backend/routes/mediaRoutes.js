// Explanation: the next line is part of program logic.
import { Router } from 'express';
// Explanation: the next line is part of program logic.
import { asyncHandler } from '../utils/asyncHandler.js';
// Explanation: the next line is part of program logic.
import { requireAuth } from '../middleware/auth.js';
// Explanation: the next line is part of program logic.
import { upload } from '../middleware/upload.js';
// Explanation: the next line is part of program logic.
import * as mediaController from '../controllers/mediaController.js';

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.get('/', requireAuth, asyncHandler(mediaController.getMedia));
// Explanation: the next line is part of program logic.
router.post('/upload', requireAuth, upload.single('file'), asyncHandler(mediaController.uploadMedia));

// Explanation: the next line is part of program logic.
export default router;
