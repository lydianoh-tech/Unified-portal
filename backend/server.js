// Explanation: the next line is part of program logic.
import express from "express";
// Explanation: the next line is part of program logic.
import cors from "cors";
// Explanation: the next line is part of program logic.
import helmet from "helmet";
// Explanation: the next line is part of program logic.
import cookieParser from "cookie-parser";
// Explanation: the next line is part of program logic.
import rateLimit from "express-rate-limit";
// Explanation: the next line is part of program logic.
import { createServer } from "http";
// Explanation: the next line is part of program logic.
import config from "./config/index.js";
// Explanation: the next line is part of program logic.
import { connectDatabases } from "./config/database.js";
// Explanation: the next line is part of program logic.
import { logger } from "./utils/logger.js";
// Explanation: the next line is part of program logic.
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
// Explanation: the next line is part of program logic.
import { setupSocket } from "./services/socketService.js";
// Explanation: the next line is part of program logic.
import authRoutes from "./routes/authRoutes.js";
// Explanation: the next line is part of program logic.
import bookingRoutes from "./routes/bookingRoutes.js";
// Explanation: the next line is part of program logic.
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
// Explanation: the next line is part of program logic.
import mediaRoutes from "./routes/mediaRoutes.js";
// Explanation: the next line is part of program logic.
import ticketRoutes from "./routes/ticketRoutes.js";
// Explanation: the next line is part of program logic.
import taskRoutes from "./routes/taskRoutes.js";
// Explanation: the next line is part of program logic.
import securityRoutes from "./routes/securityRoutes.js";
// Explanation: the next line is part of program logic.
import chatRoutes from "./routes/chatRoutes.js";

// Explanation: the next line is part of program logic.
const app = express();
// Explanation: the next line is part of program logic.
const httpServer = createServer(app);

// Explanation: the next line is part of program logic.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// Explanation: the next line is part of program logic.
app.use(cors({ origin: config.clientUrl, credentials: true }));
// Explanation: the next line is part of program logic.
app.use(express.json());
// Explanation: the next line is part of program logic.
app.use(cookieParser());
// Explanation: the next line is part of program logic.
app.use(
  // Explanation: the next line is part of program logic.
  rateLimit({
    // Explanation: the next line is part of program logic.
    windowMs: 15 * 60 * 1000,
    // Explanation: the next line is part of program logic.
    max: 300,
    // Explanation: the next line is part of program logic.
    standardHeaders: true,
    // Explanation: the next line is part of program logic.
    legacyHeaders: false,
    // Explanation: the next line is part of program logic.
  }),
  // Explanation: the next line is part of program logic.
);

// Explanation: the next line is part of program logic.
app.use("/uploads", express.static(config.uploadDir));

// Explanation: the next line is part of program logic.
app.get("/api/health", async (_req, res) => {
  // Explanation: the next line is part of program logic.
  res.json({
    // Explanation: the next line is part of program logic.
    status: "ok",
    // Explanation: the next line is part of program logic.
    postgres: "connected",
    // Explanation: the next line is part of program logic.
    mongodb: "connected",
    // Explanation: the next line is part of program logic.
    timestamp: new Date().toISOString(),
    // Explanation: the next line is part of program logic.
  });
  // Explanation: the next line is part of program logic.
});

// Explanation: the next line is part of program logic.
app.use("/api/auth", authRoutes);
// Explanation: the next line is part of program logic.
app.use("/api/bookings", bookingRoutes);
// Explanation: the next line is part of program logic.
app.use("/api/marketplace", marketplaceRoutes);
// Explanation: the next line is part of program logic.
app.use("/api/media", mediaRoutes);
// Explanation: the next line is part of program logic.
app.use("/api/tickets", ticketRoutes);
// Explanation: the next line is part of program logic.
app.use("/api/tasks", taskRoutes);
// Explanation: the next line is part of program logic.
app.use("/api/security", securityRoutes);
// Explanation: the next line is part of program logic.
app.use("/api/chat", chatRoutes);

// Explanation: the next line is part of program logic.
setupSocket(httpServer, config.clientUrl);

// Explanation: the next line is part of program logic.
app.use(notFoundHandler);
// Explanation: the next line is part of program logic.
app.use(errorHandler);

// Explanation: the next line is part of program logic.
async function start() {
  // Explanation: the next line is part of program logic.
  try {
    // Explanation: the next line is part of program logic.
    await connectDatabases();

    httpServer.listen(config.port, () => {
      // Explanation: the next line is part of program logic.
      logger.info(`API server running on http://localhost:${config.port}`);
      // Explanation: the next line is part of program logic.
    });
    // Explanation: the next line is part of program logic.
  } catch (err) {
    // Explanation: the next line is part of program logic.
    logger.error("Failed to start server", { message: err.message });
    // Explanation: the next line is part of program logic.
    process.exit(1);
    // Explanation: the next line is part of program logic.
  }
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
start();
