// Explanation: the next line is part of program logic.
import { Router } from "express";
// Explanation: the next line is part of program logic.
import { asyncHandler } from "../utils/asyncHandler.js";
// Explanation: the next line is part of program logic.
import { requireAuth, requireRole } from "../middleware/auth.js";
// Explanation: the next line is part of program logic.
import * as bookingController from "../controllers/bookingController.js";

// Explanation: the next line is part of program logic.
const router = Router();

// Explanation: the next line is part of program logic.
router.get("/services", asyncHandler(bookingController.getServices));
router.get(
  "/provider/services",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.getProviderServices),
);
router.post(
  "/provider/services",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.createProviderService),
);
router.patch(
  "/provider/services/:id",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.updateProviderService),
);
router.delete(
  "/provider/services/:id",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.archiveProviderService),
);
// Explanation: the next line is part of program logic.
router.get(
  "/services/:id/reviews",
  asyncHandler(bookingController.getServiceReviews),
);
// Explanation: the next line is part of program logic.
router.get(
  "/bookings",
  requireAuth,
  asyncHandler(bookingController.getBookings),
);
router.get(
  "/bookings/open",
  requireAuth,
  asyncHandler(bookingController.getOpenBookings),
);
router.get(
  "/bookings/provider",
  requireAuth,
  asyncHandler(bookingController.getProviderBookings),
);
router.get(
  "/bookings/provider/earnings",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.getProviderEarnings),
);
router.get(
  "/bookings/provider/payout-report",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.getProviderPayoutReport),
);
router.get(
  "/bookings/provider/statement/weekly.csv",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.downloadProviderWeeklyStatement),
);
router.get(
  "/bookings/provider/statement/custom.csv",
  requireAuth,
  requireRole("USER", "ADMIN"),
  asyncHandler(bookingController.downloadProviderCustomStatement),
);
// Explanation: the next line is part of program logic.
router.post(
  "/bookings",
  requireAuth,
  asyncHandler(bookingController.createBooking),
);
router.post(
  "/bookings/:id/accept",
  requireAuth,
  asyncHandler(bookingController.acceptBooking),
);
router.post(
  "/bookings/:id/reject",
  requireAuth,
  asyncHandler(bookingController.rejectBooking),
);
router.get(
  "/bookings/:id/tracking",
  requireAuth,
  asyncHandler(bookingController.getBookingTracking),
);
router.post(
  "/bookings/:id/tracking",
  requireAuth,
  asyncHandler(bookingController.addBookingTrackingUpdate),
);
// Explanation: the next line is part of program logic.
router.post(
  "/services/:id/reviews",
  requireAuth,
  asyncHandler(bookingController.createServiceReview),
);

// Explanation: the next line is part of program logic.
export default router;
