// Explanation: the next line is part of program logic.
import { z } from "zod";
// Explanation: the next line is part of program logic.
import * as marketplaceService from "../services/marketplaceService.js";
// Explanation: the next line is part of program logic.
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
const listingSchema = z.object({
  // Explanation: the next line is part of program logic.
  department: z.enum(departments).optional(),
  // Explanation: the next line is part of program logic.
  category: z.string().min(2).max(80).optional(),
  // Explanation: the next line is part of program logic.
  tags: z.array(z.string().min(1).max(30)).max(12).optional(),
  // Explanation: the next line is part of program logic.
  title: z.string().min(3),
  // Explanation: the next line is part of program logic.
  description: z.string().min(10),
  // Explanation: the next line is part of program logic.
  price: z.number().positive(),
  // Explanation: the next line is part of program logic.
  imageUrl: z.string().max(2048).optional(),
  // Explanation: the next line is part of program logic.
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// Explanation: the next line is part of program logic.
export async function getListings(req, res) {
  // Explanation: the next line is part of program logic.
  const department = departments.includes(req.query?.department)
    ? req.query.department
    : undefined;
  const listings = await marketplaceService.listListings({ department });
  // Explanation: the next line is part of program logic.
  return res.json({ listings });
  // Explanation: the next line is part of program logic.
}

export async function getListingReviews(req, res) {
  const reviews = await marketplaceService.listListingReviews(
    paramId(req.params.id),
  );
  return res.json({ reviews });
}

// Explanation: the next line is part of program logic.
export async function createListing(req, res) {
  // Explanation: the next line is part of program logic.
  const parsed = listingSchema.safeParse(req.body);
  // Explanation: the next line is part of program logic.
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  // Explanation: the next line is part of program logic.
  const listing = await marketplaceService.createListing(
    req.user.id,
    parsed.data,
  );
  // Explanation: the next line is part of program logic.
  return res.status(201).json({ listing });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function purchaseListing(req, res) {
  // Explanation: the next line is part of program logic.
  try {
    // Explanation: the next line is part of program logic.
    const order = await marketplaceService.purchaseListing(
      req.user.id,
      paramId(req.params.id),
    );
    // Explanation: the next line is part of program logic.
    return res.status(201).json({ order });
    // Explanation: the next line is part of program logic.
  } catch (err) {
    // Explanation: the next line is part of program logic.
    return res.status(err.status ?? 500).json({ error: err.message });
    // Explanation: the next line is part of program logic.
  }
  // Explanation: the next line is part of program logic.
}

export async function createListingReview(req, res) {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const review = await marketplaceService.createListingReview(
      req.user.id,
      paramId(req.params.id),
      parsed.data,
    );
    return res.status(201).json({ review });
  } catch (err) {
    return res.status(err.status ?? 500).json({ error: err.message });
  }
}

// Explanation: the next line is part of program logic.
export async function getMyOrders(req, res) {
  // Explanation: the next line is part of program logic.
  const orders = await marketplaceService.listOrders(req.user.id);
  // Explanation: the next line is part of program logic.
  return res.json({ orders });
  // Explanation: the next line is part of program logic.
}
