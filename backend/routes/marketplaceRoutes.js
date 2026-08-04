// Explanation: the next line is part of program logic.
import { Router } from "express";
// Explanation: the next line is part of program logic.
import { asyncHandler } from "../utils/asyncHandler.js";
// Explanation: the next line is part of program logic.
import { requireAuth } from "../middleware/auth.js";
// Explanation: the next line is part of program logic.
import * as marketplaceController from "../controllers/marketplaceController.js";

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.get("/", asyncHandler(marketplaceController.getListings));
// Explanation: the next line is part of program logic.
router.get(
  "/:id/reviews",
  asyncHandler(marketplaceController.getListingReviews),
);
// Explanation: the next line is part of program logic.
router.post(
  "/",
  requireAuth,
  asyncHandler(marketplaceController.createListing),
);
// Explanation: the next line is part of program logic.
router.post(
  "/:id/reviews",
  requireAuth,
  asyncHandler(marketplaceController.createListingReview),
);
// Explanation: the next line is part of program logic.
router.post(
  "/:id/purchase",
  requireAuth,
  asyncHandler(marketplaceController.purchaseListing),
);
// Explanation: the next line is part of program logic.
router.get(
  "/orders/mine",
  requireAuth,
  asyncHandler(marketplaceController.getMyOrders),
);

// Explanation: the next line is part of program logic.
export default router;
