// Explanation: the next line is part of program logic.
import { z } from "zod";
// Explanation: the next line is part of program logic.
import * as bookingService from "../services/bookingService.js";
import { paramId } from "../utils/params.js";

const departments = [
  "HAIRSTYLIST",
  "NAILS",
  "EYEBROWS",
  "DRESSING",
  "DESIGNER",
  "STYLIST",
];

// Explanation: the next line is part of program logic.
const bookingSchema = z.object({
  // Explanation: the next line is part of program logic.
  serviceId: z.string(),
  // Explanation: the next line is part of program logic.
  scheduledAt: z.string().datetime(),
  // Explanation: the next line is part of program logic.
  notes: z.string().optional(),
  // Explanation: the next line is part of program logic.
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

const rejectSchema = z.object({
  reason: z.string().max(1000).optional(),
});

const trackingUpdateSchema = z.object({
  stage: z.enum(["ON_THE_WAY", "ARRIVED", "STARTED", "MIDWAY", "FINISHED"]),
  note: z.string().max(1000).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  evidenceUrls: z.array(z.string().startsWith("/uploads/")).max(10).optional(),
});

const providerServiceCreateSchema = z.object({
  department: z.enum(departments).optional(),
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(80).optional(),
  tags: z.array(z.string().min(1).max(30)).max(12).optional(),
  imageUrl: z.string().max(2048).optional(),
  price: z.number().positive(),
  durationMin: z.number().int().min(15).max(480),
});

const providerServiceUpdateSchema = providerServiceCreateSchema
  .partial()
  .extend({
    active: z.boolean().optional(),
  });

const payoutQuerySchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
  commissionRate: z.coerce.number().min(0).max(100).default(20),
});

const weeklyStatementQuerySchema = z.object({
  weekStart: z.string().datetime(),
  commissionRate: z.coerce.number().min(0).max(100).default(20),
});

// Explanation: the next line is part of program logic.
export async function getServices(_req, res) {
  // Explanation: the next line is part of program logic.
  const services = await bookingService.listServices();
  // Explanation: the next line is part of program logic.
  return res.json({ services });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function getBookings(req, res) {
  // Explanation: the next line is part of program logic.
  const bookings = await bookingService.listBookings(req.user.id);
  // Explanation: the next line is part of program logic.
  return res.json({ bookings });
  // Explanation: the next line is part of program logic.
}

export async function getOpenBookings(req, res) {
  const bookings = await bookingService.listOpenBookings(req.user.id);
  return res.json({ bookings });
}

export async function getProviderBookings(req, res) {
  const bookings = await bookingService.listProviderBookings(req.user.id);
  return res.json({ bookings });
}

export async function getProviderEarnings(req, res) {
  const summary = await bookingService.getProviderEarningsSummary(req.user.id);
  return res.json(summary);
}

export async function getProviderPayoutReport(req, res) {
  const parsed = payoutQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const report = await bookingService.getProviderPayoutReport(
      req.user.id,
      parsed.data,
    );
    return res.json(report);
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function downloadProviderWeeklyStatement(req, res) {
  const parsed = weeklyStatementQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const statement = await bookingService.getProviderWeeklyStatementCsv(
      req.user.id,
      parsed.data,
    );

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${statement.filename}"`,
    );
    return res.status(200).send(statement.csv);
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function downloadProviderCustomStatement(req, res) {
  const parsed = payoutQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const statement = await bookingService.getProviderCustomStatementCsv(
      req.user.id,
      parsed.data,
    );

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${statement.filename}"`,
    );
    return res.status(200).send(statement.csv);
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function getServiceReviews(req, res) {
  const reviews = await bookingService.listServiceReviews(req.params.id);
  return res.json({ reviews });
}

export async function getProviderServices(req, res) {
  const services = await bookingService.listProviderServices(req.user.id);
  return res.json({ services });
}

export async function createProviderService(req, res) {
  const parsed = providerServiceCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const service = await bookingService.createProviderService(
    req.user.id,
    parsed.data,
  );
  return res.status(201).json({ service });
}

export async function updateProviderService(req, res) {
  const parsed = providerServiceUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const service = await bookingService.updateProviderService(
      req.user.id,
      paramId(req.params.id),
      parsed.data,
    );
    return res.json({ service });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function archiveProviderService(req, res) {
  try {
    const service = await bookingService.archiveProviderService(
      req.user.id,
      paramId(req.params.id),
    );
    return res.json({ service });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

// Explanation: the next line is part of program logic.
export async function createBooking(req, res) {
  // Explanation: the next line is part of program logic.
  const parsed = bookingSchema.safeParse(req.body);
  // Explanation: the next line is part of program logic.
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  // Explanation: the next line is part of program logic.
  const booking = await bookingService.createBooking(req.user.id, parsed.data);
  // Explanation: the next line is part of program logic.
  return res.status(201).json({ booking });
  // Explanation: the next line is part of program logic.
}

export async function acceptBooking(req, res) {
  try {
    const booking = await bookingService.acceptBooking(
      req.user.id,
      paramId(req.params.id),
    );
    return res.json({ booking });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function rejectBooking(req, res) {
  const parsed = rejectSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const booking = await bookingService.rejectBooking(
      req.user.id,
      paramId(req.params.id),
      parsed.data,
    );
    return res.json({ booking });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function getBookingTracking(req, res) {
  try {
    const booking = await bookingService.getBookingTracking(
      req.user.id,
      paramId(req.params.id),
    );
    return res.json({ booking });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function addBookingTrackingUpdate(req, res) {
  const parsed = trackingUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const booking = await bookingService.addBookingTrackingUpdate(
      req.user.id,
      paramId(req.params.id),
      parsed.data,
    );
    return res.json({ booking });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

export async function createServiceReview(req, res) {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const review = await bookingService.createServiceReview(
      req.user.id,
      req.params.id,
      parsed.data,
    );
    return res.status(201).json({ review });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}
