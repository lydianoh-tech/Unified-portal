// Explanation: the next line is part of program logic.
import prisma from "../models/prisma.js";

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

export async function listListings({ department } = {}) {
  const listings = await prisma.listing.findMany({
    where: {
      active: true,
      ...(department ? { department } : {}),
    },
    include: {
      seller: { select: { id: true, name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return listings.map(({ reviews, ...listing }) =>
    withRatingSummary(listing, reviews),
  );
}

// Explanation: the next line is part of program logic.
export function createListing(sellerId, data) {
  // Explanation: the next line is part of program logic.
  return prisma.listing.create({ data: { ...data, sellerId } });
  // Explanation: the next line is part of program logic.
}

export async function listListingReviews(listingId) {
  return prisma.listingReview.findMany({
    where: { listingId },
    include: {
      author: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createListingReview(
  authorId,
  listingId,
  { rating, comment },
) {
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || !listing.active) {
    const err = new Error("Listing not found");
    err.status = 404;
    throw err;
  }

  const hasPurchased = await prisma.order.findFirst({
    where: { listingId, buyerId: authorId },
    select: { id: true },
  });
  if (!hasPurchased) {
    const err = new Error("You can only review listings you purchased");
    err.status = 403;
    throw err;
  }

  return prisma.listingReview.upsert({
    where: {
      listingId_authorId: { listingId, authorId },
    },
    create: { listingId, authorId, rating, comment },
    update: { rating, comment },
    include: {
      author: { select: { id: true, name: true } },
    },
  });
}

// Explanation: the next line is part of program logic.
export async function purchaseListing(buyerId, listingId) {
  // Explanation: the next line is part of program logic.
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  // Explanation: the next line is part of program logic.
  if (!listing || !listing.active) {
    // Explanation: the next line is part of program logic.
    const err = new Error("Listing not found");
    // Explanation: the next line is part of program logic.
    err.status = 404;
    // Explanation: the next line is part of program logic.
    throw err;
    // Explanation: the next line is part of program logic.
  }
  // Explanation: the next line is part of program logic.
  if (listing.sellerId === buyerId) {
    // Explanation: the next line is part of program logic.
    const err = new Error("Cannot purchase your own listing");
    // Explanation: the next line is part of program logic.
    err.status = 400;
    // Explanation: the next line is part of program logic.
    throw err;
    // Explanation: the next line is part of program logic.
  }

  // Explanation: the next line is part of program logic.
  return prisma.order.create({
    // Explanation: the next line is part of program logic.
    data: {
      // Explanation: the next line is part of program logic.
      listingId: listing.id,
      // Explanation: the next line is part of program logic.
      buyerId,
      // Explanation: the next line is part of program logic.
      sellerId: listing.sellerId,
      // Explanation: the next line is part of program logic.
      total: listing.price,
      // Explanation: the next line is part of program logic.
    },
    // Explanation: the next line is part of program logic.
    include: { listing: true },
    // Explanation: the next line is part of program logic.
  });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export function listOrders(userId) {
  // Explanation: the next line is part of program logic.
  return prisma.order.findMany({
    // Explanation: the next line is part of program logic.
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    // Explanation: the next line is part of program logic.
    include: { listing: true },
    // Explanation: the next line is part of program logic.
    orderBy: { createdAt: "desc" },
    // Explanation: the next line is part of program logic.
  });
  // Explanation: the next line is part of program logic.
}
