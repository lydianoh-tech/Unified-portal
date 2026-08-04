// Explanation: the next line is part of program logic.
import prisma from "../models/prisma.js";

const TRACKING_ORDER = {
  ACCEPTED: 1,
  ON_THE_WAY: 2,
  ARRIVED: 3,
  STARTED: 4,
  MIDWAY: 5,
  FINISHED: 6,
};

const bookingInclude = {
  service: true,
  customer: { select: { id: true, name: true } },
  provider: { select: { id: true, name: true } },
};

const trackingInclude = {
  ...bookingInclude,
  progressUpdates: {
    include: { actor: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  },
};

function withRatingSummary(entity, ratings) {
  const reviewCount = ratings.length;
  const ratingAverage = reviewCount
    ? Number(
        (
          ratings.reduce((sum, item) => sum + item.rating, 0) / reviewCount
        ).toFixed(2),
      )
    : null;

  return { ...entity, reviewCount, ratingAverage };
}

function assertBookingParticipant(booking, userId) {
  if (booking.customerId !== userId && booking.providerId !== userId) {
    const err = new Error("You cannot access this booking");
    err.status = 403;
    throw err;
  }
}

function assertProviderAssigned(booking, providerId) {
  if (!booking.providerId || booking.providerId !== providerId) {
    const err = new Error("Only the assigned provider can update this booking");
    err.status = 403;
    throw err;
  }
}

function parseCoordinate(value) {
  return typeof value === "number" ? value : null;
}

export async function listServices() {
  const services = await prisma.service.findMany({
    where: { active: true },
    include: {
      reviews: { select: { rating: true } },
      provider: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  return services.map(({ reviews, ...service }) =>
    withRatingSummary(service, reviews),
  );
}

export function listBookings(customerId) {
  return prisma.booking.findMany({
    where: { customerId },
    include: bookingInclude,
    orderBy: { scheduledAt: "desc" },
  });
}

export function listOpenBookings(userId) {
  return prisma.booking.findMany({
    where: {
      status: "PENDING",
      providerId: null,
      customerId: { not: userId },
    },
    include: bookingInclude,
    orderBy: { scheduledAt: "asc" },
  });
}

export function listProviderBookings(providerId) {
  return prisma.booking.findMany({
    where: { providerId },
    include: bookingInclude,
    orderBy: { scheduledAt: "asc" },
  });
}

function startOfDay(date = new Date()) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function startOfWeek(date = new Date()) {
  const value = startOfDay(date);
  const day = value.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diffToMonday);
  return value;
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function roundCurrency(amount) {
  return Number(amount.toFixed(2));
}

function normalizeDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    const err = new Error("Invalid date provided");
    err.status = 400;
    throw err;
  }
  return date;
}

function sumEarningsSince(trips, threshold) {
  const total = trips
    .filter((trip) => new Date(trip.completedAt) >= threshold)
    .reduce((sum, trip) => sum + trip.fare, 0);

  return roundCurrency(total);
}

export async function getProviderEarningsSummary(providerId) {
  const [completedBookings, activeTrips, openRequests, cancelledTrips] =
    await Promise.all([
      prisma.booking.findMany({
        where: { providerId, status: "COMPLETED" },
        include: { service: { select: { price: true, name: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.booking.count({
        where: { providerId, status: "CONFIRMED" },
      }),
      prisma.booking.count({
        where: {
          status: "PENDING",
          providerId: null,
          customerId: { not: providerId },
        },
      }),
      prisma.booking.count({
        where: { providerId, status: "CANCELLED" },
      }),
    ]);

  const completedTrips = completedBookings.map((booking) => ({
    id: booking.id,
    serviceName: booking.service.name,
    fare: Number(booking.service.price),
    completedAt: booking.updatedAt,
  }));

  const now = new Date();
  const today = startOfDay(now);
  const week = startOfWeek(now);
  const month = startOfMonth(now);

  const allTime = roundCurrency(
    completedTrips.reduce((sum, trip) => sum + trip.fare, 0),
  );

  return {
    earnings: {
      today: sumEarningsSince(completedTrips, today),
      week: sumEarningsSince(completedTrips, week),
      month: sumEarningsSince(completedTrips, month),
      allTime,
    },
    trips: {
      completed: completedTrips.length,
      active: activeTrips,
      openRequests,
      cancelled: cancelledTrips,
    },
    recentTrips: completedTrips.slice(0, 8),
  };
}

export async function getProviderPayoutReport(
  providerId,
  { from, to, commissionRate = 20 },
) {
  const fromDate = normalizeDate(from);
  const toDate = normalizeDate(to);

  if (fromDate > toDate) {
    const err = new Error("From date cannot be after to date");
    err.status = 400;
    throw err;
  }

  const completedBookings = await prisma.booking.findMany({
    where: {
      providerId,
      status: "COMPLETED",
      updatedAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      service: { select: { name: true, price: true } },
      customer: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const rate = Number(commissionRate) / 100;

  const trips = completedBookings.map((booking) => {
    const gross = Number(booking.service.price);
    const commission = roundCurrency(gross * rate);
    const net = roundCurrency(gross - commission);

    return {
      id: booking.id,
      completedAt: booking.updatedAt,
      serviceName: booking.service.name,
      customerName: booking.customer.name,
      gross,
      commission,
      net,
    };
  });

  const grossTotal = roundCurrency(
    trips.reduce((sum, trip) => sum + trip.gross, 0),
  );
  const commissionTotal = roundCurrency(
    trips.reduce((sum, trip) => sum + trip.commission, 0),
  );
  const netTotal = roundCurrency(
    trips.reduce((sum, trip) => sum + trip.net, 0),
  );

  return {
    range: {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    },
    commissionRate: Number(commissionRate),
    totals: {
      trips: trips.length,
      gross: grossTotal,
      commission: commissionTotal,
      net: netTotal,
    },
    trips,
  };
}

function buildStatementCsv(report) {
  const header = [
    "Booking ID",
    "Completed At",
    "Service",
    "Customer",
    "Gross",
    "Commission",
    "Net",
  ];

  const rows = report.trips.map((trip) => [
    trip.id,
    new Date(trip.completedAt).toISOString(),
    trip.serviceName,
    trip.customerName,
    trip.gross.toFixed(2),
    trip.commission.toFixed(2),
    trip.net.toFixed(2),
  ]);

  rows.push([]);
  rows.push([
    "TOTAL",
    "",
    "",
    "",
    report.totals.gross.toFixed(2),
    report.totals.commission.toFixed(2),
    report.totals.net.toFixed(2),
  ]);

  return [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}

export async function getProviderWeeklyStatementCsv(
  providerId,
  { weekStart, commissionRate = 20 },
) {
  const start = startOfDay(normalizeDate(weekStart));
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  const report = await getProviderPayoutReport(providerId, {
    from: start,
    to: end,
    commissionRate,
  });

  const csv = buildStatementCsv(report);

  return {
    csv,
    filename: `weekly-statement-${start.toISOString().slice(0, 10)}.csv`,
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

export async function getProviderCustomStatementCsv(
  providerId,
  { from, to, commissionRate = 20 },
) {
  const report = await getProviderPayoutReport(providerId, {
    from,
    to,
    commissionRate,
  });

  const fromDate = normalizeDate(report.range.from);
  const toDate = normalizeDate(report.range.to);
  const csv = buildStatementCsv(report);

  return {
    csv,
    filename: `payout-statement-${fromDate.toISOString().slice(0, 10)}-to-${toDate.toISOString().slice(0, 10)}.csv`,
    from: report.range.from,
    to: report.range.to,
  };
}

export async function listServiceReviews(serviceId) {
  return prisma.serviceReview.findMany({
    where: { serviceId },
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listProviderServices(providerId) {
  const services = await prisma.service.findMany({
    where: { providerId },
    include: {
      reviews: { select: { rating: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return services.map(({ reviews, _count, ...service }) => ({
    ...withRatingSummary(service, reviews),
    bookingCount: _count.bookings,
  }));
}

export async function createProviderService(providerId, data) {
  return prisma.service.create({
    data: {
      providerId,
      department: data.department,
      name: data.name,
      description: data.description,
      category: data.category,
      tags: data.tags ?? [],
      imageUrl: data.imageUrl,
      price: data.price,
      durationMin: data.durationMin,
      active: true,
    },
  });
}

export async function updateProviderService(providerId, serviceId, data) {
  const existing = await prisma.service.findUnique({
    where: { id: serviceId },
  });
  if (!existing) {
    const err = new Error("Service not found");
    err.status = 404;
    throw err;
  }
  if (existing.providerId !== providerId) {
    const err = new Error("You can only edit your own services");
    err.status = 403;
    throw err;
  }

  return prisma.service.update({
    where: { id: serviceId },
    data: {
      ...data,
      tags: data.tags ?? undefined,
    },
  });
}

export async function archiveProviderService(providerId, serviceId) {
  const existing = await prisma.service.findUnique({
    where: { id: serviceId },
  });
  if (!existing) {
    const err = new Error("Service not found");
    err.status = 404;
    throw err;
  }
  if (existing.providerId !== providerId) {
    const err = new Error("You can only archive your own services");
    err.status = 403;
    throw err;
  }

  return prisma.service.update({
    where: { id: serviceId },
    data: { active: false },
  });
}

export async function createBooking(
  customerId,
  { serviceId, scheduledAt, notes },
) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    const err = new Error("Service not found");
    err.status = 404;
    throw err;
  }

  return prisma.booking.create({
    data: {
      serviceId,
      customerId,
      scheduledAt: new Date(scheduledAt),
      notes,
    },
    include: bookingInclude,
  });
}

export async function acceptBooking(providerId, bookingId) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    const err = new Error("Booking not found");
    err.status = 404;
    throw err;
  }
  if (booking.customerId === providerId) {
    const err = new Error("You cannot accept your own booking request");
    err.status = 400;
    throw err;
  }
  if (booking.providerId && booking.providerId !== providerId) {
    const err = new Error("Booking already accepted by another provider");
    err.status = 409;
    throw err;
  }
  if (booking.status !== "PENDING") {
    const err = new Error("Booking is no longer pending");
    err.status = 400;
    throw err;
  }

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: {
        providerId,
        status: "CONFIRMED",
        currentStage: "ACCEPTED",
        acceptedAt: new Date(),
      },
    }),
    prisma.bookingProgressUpdate.create({
      data: {
        bookingId,
        actorId: providerId,
        stage: "ACCEPTED",
        evidenceUrls: [],
      },
    }),
  ]);

  return getBookingTracking(providerId, bookingId);
}

export async function rejectBooking(providerId, bookingId, { reason }) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    const err = new Error("Booking not found");
    err.status = 404;
    throw err;
  }
  if (booking.customerId === providerId) {
    const err = new Error("You cannot reject your own booking request");
    err.status = 400;
    throw err;
  }
  if (booking.status !== "PENDING") {
    const err = new Error("Booking is no longer pending");
    err.status = 400;
    throw err;
  }

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: {
        providerId,
        status: "CANCELLED",
        currentStage: "REJECTED",
        rejectedAt: new Date(),
      },
    }),
    prisma.bookingProgressUpdate.create({
      data: {
        bookingId,
        actorId: providerId,
        stage: "REJECTED",
        note: reason,
        evidenceUrls: [],
      },
    }),
  ]);

  return getBookingTracking(providerId, bookingId);
}

export async function getBookingTracking(userId, bookingId) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: trackingInclude,
  });
  if (!booking) {
    const err = new Error("Booking not found");
    err.status = 404;
    throw err;
  }

  assertBookingParticipant(booking, userId);
  return booking;
}

export async function addBookingTrackingUpdate(
  providerId,
  bookingId,
  { stage, note, latitude, longitude, evidenceUrls },
) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    const err = new Error("Booking not found");
    err.status = 404;
    throw err;
  }
  assertProviderAssigned(booking, providerId);
  if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    const err = new Error("Booking is already closed");
    err.status = 400;
    throw err;
  }

  if (!TRACKING_ORDER[stage]) {
    const err = new Error("Invalid tracking stage");
    err.status = 400;
    throw err;
  }

  const currentOrder = booking.currentStage
    ? (TRACKING_ORDER[booking.currentStage] ?? 0)
    : 0;
  if (TRACKING_ORDER[stage] < currentOrder) {
    const err = new Error("Tracking stage cannot move backwards");
    err.status = 400;
    throw err;
  }

  const lat = parseCoordinate(latitude);
  const lng = parseCoordinate(longitude);
  const nextStatus = stage === "FINISHED" ? "COMPLETED" : "CONFIRMED";

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: nextStatus,
        currentStage: stage,
        currentLat: lat,
        currentLng: lng,
        locationUpdatedAt:
          lat !== null && lng !== null ? new Date() : booking.locationUpdatedAt,
      },
    }),
    prisma.bookingProgressUpdate.create({
      data: {
        bookingId,
        actorId: providerId,
        stage,
        note,
        latitude: lat,
        longitude: lng,
        evidenceUrls: evidenceUrls ?? [],
      },
    }),
  ]);

  return getBookingTracking(providerId, bookingId);
}

export async function createServiceReview(
  authorId,
  serviceId,
  { rating, comment },
) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    const err = new Error("Service not found");
    err.status = 404;
    throw err;
  }

  const hasBooking = await prisma.booking.findFirst({
    where: { serviceId, customerId: authorId },
    select: { id: true },
  });
  if (!hasBooking) {
    const err = new Error("You can only review services you booked");
    err.status = 403;
    throw err;
  }

  return prisma.serviceReview.upsert({
    where: {
      serviceId_authorId: { serviceId, authorId },
    },
    create: { serviceId, authorId, rating, comment },
    update: { rating, comment },
    include: {
      author: { select: { id: true, name: true } },
    },
  });
}
