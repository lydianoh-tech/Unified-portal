// Explanation: the next line is part of program logic.
// Import Mongoose to manage MongoDB connections.
// Explanation: the next line is part of program logic.
import mongoose from "mongoose";
// Explanation: the next line is part of program logic.
// Import the Prisma client instance for PostgreSQL access.
// Explanation: the next line is part of program logic.
import prisma from "../models/prisma.js";
// Explanation: the next line is part of program logic.
// Import normalized environment configuration values.
// Explanation: the next line is part of program logic.
import config from "./index.js";
// Explanation: the next line is part of program logic.
// Import the shared logger utility for connection logs.
// Explanation: the next line is part of program logic.
import { logger } from "../utils/logger.js";

// Explanation: the next line is part of program logic.
// Export an async function that connects to MongoDB.
// Explanation: the next line is part of program logic.
export async function connectMongo() {
  // Explanation: the next line is part of program logic.
  // Guard against missing Mongo connection string.
  // Explanation: the next line is part of program logic.
  if (!config.mongoUri) {
    // Explanation: the next line is part of program logic.
    // Throw a clear startup/configuration error if URI is missing.
    // Explanation: the next line is part of program logic.
    throw new Error("MONGODB_URI is not configured");
    // Explanation: the next line is part of program logic.
    // Close the guard block.
    // Explanation: the next line is part of program logic.
  }

  // Explanation: the next line is part of program logic.
  // Enable strict query parsing behavior in Mongoose.
  // Explanation: the next line is part of program logic.
  mongoose.set("strictQuery", true);
  // Explanation: the next line is part of program logic.
  // Open the MongoDB connection using the configured URI.
  // Explanation: the next line is part of program logic.
  await mongoose.connect(config.mongoUri);
  // Explanation: the next line is part of program logic.
  // Write a success message after MongoDB connects.
  // Explanation: the next line is part of program logic.
  logger.info("MongoDB connected via Mongoose");
  // Explanation: the next line is part of program logic.
  // Close the Mongo connection function.
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
// Export an async function that connects all application databases.
// Explanation: the next line is part of program logic.
export async function connectDatabases() {
  // Explanation: the next line is part of program logic.
  // Connect to MongoDB first.
  // Explanation: the next line is part of program logic.
  await connectMongo();
  // Explanation: the next line is part of program logic.
  // Connect to PostgreSQL through Prisma.
  // Explanation: the next line is part of program logic.
  await prisma.$connect();
  // Explanation: the next line is part of program logic.
  // Write a success message after PostgreSQL connects.
  // Explanation: the next line is part of program logic.
  logger.info("PostgreSQL connected via Prisma");
  // Explanation: the next line is part of program logic.
  // Close the multi-database connect function.
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
// Export an async function that disconnects all application databases.
// Explanation: the next line is part of program logic.
export async function disconnectDatabases() {
  // Explanation: the next line is part of program logic.
  // Disconnect the MongoDB/Mongoose connection.
  // Explanation: the next line is part of program logic.
  await mongoose.disconnect();
  // Explanation: the next line is part of program logic.
  // Disconnect the Prisma/PostgreSQL connection.
  // Explanation: the next line is part of program logic.
  await prisma.$disconnect();
  // Explanation: the next line is part of program logic.
  // Close the multi-database disconnect function.
  // Explanation: the next line is part of program logic.
}
