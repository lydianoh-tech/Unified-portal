// Explanation: the next line is part of program logic.
import { Router } from "express";
// Explanation: the next line is part of program logic.
import { asyncHandler } from "../utils/asyncHandler.js";
// Explanation: the next line is part of program logic.
import { requireAuth } from "../middleware/auth.js";
// Explanation: the next line is part of program logic.
import * as authController from "../controllers/authController.js";

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.post("/register", asyncHandler(authController.register));
// Explanation: the next line is part of program logic.
router.post("/login", asyncHandler(authController.login));
// Explanation: the next line is part of program logic.
router.post(
  "/password-reset/request",
  asyncHandler(authController.requestPasswordReset),
);
// Explanation: the next line is part of program logic.
router.post(
  "/password-reset/confirm",
  asyncHandler(authController.resetPassword),
);
// Explanation: the next line is part of program logic.
router.post("/refresh", asyncHandler(authController.refresh));
// Explanation: the next line is part of program logic.
router.post("/logout", requireAuth, asyncHandler(authController.logout));
// Explanation: the next line is part of program logic.
router.get("/me", requireAuth, asyncHandler(authController.me));

// Explanation: the next line is part of program logic.
export default router;
