// Explanation: the next line is part of program logic.
import bcrypt from "bcryptjs";
// Explanation: the next line is part of program logic.
import crypto from "crypto";
// Explanation: the next line is part of program logic.
import prisma from "../models/prisma.js";
// Explanation: the next line is part of program logic.
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
// Explanation: the next line is part of program logic.
import { logSecurityEvent } from "../middleware/securityLogger.js";
// Explanation: the next line is part of program logic.
import config from "../config/index.js";

function mapRegisterPrismaError(error) {
  const prismaCode = error?.code;

  if (prismaCode === "P2002") {
    const err = new Error("Email already registered");
    err.status = 409;
    return err;
  }

  if (prismaCode === "P2021") {
    const err = new Error(
      "Database schema is not ready. Run migrations and try again.",
    );
    err.status = 503;
    return err;
  }

  if (prismaCode === "P1001") {
    const err = new Error(
      "Database is unavailable. Ensure PostgreSQL is running and try again.",
    );
    err.status = 503;
    return err;
  }

  return error;
}

// Explanation: the next line is part of program logic.
const userSelect = {
  // Explanation: the next line is part of program logic.
  id: true,
  // Explanation: the next line is part of program logic.
  email: true,
  // Explanation: the next line is part of program logic.
  name: true,
  // Explanation: the next line is part of program logic.
  role: true,
  // Explanation: the next line is part of program logic.
  avatarUrl: true,
  // Explanation: the next line is part of program logic.
  createdAt: true,
  // Explanation: the next line is part of program logic.
};

// Explanation: the next line is part of program logic.
export async function register(
  { email, password, name, role = "USER" },
  ipAddress,
) {
  try {
    // Explanation: the next line is part of program logic.
    const existing = await prisma.user.findUnique({ where: { email } });
    // Explanation: the next line is part of program logic.
    if (existing) {
      // Explanation: the next line is part of program logic.
      const err = new Error("Email already registered");
      // Explanation: the next line is part of program logic.
      err.status = 409;
      // Explanation: the next line is part of program logic.
      throw err;
      // Explanation: the next line is part of program logic.
    }

    // Explanation: the next line is part of program logic.
    const passwordHash = await bcrypt.hash(password, 12);
    // Explanation: the next line is part of program logic.
    const safeRole = role === "CUSTOMER" ? "CUSTOMER" : "USER";
    // Explanation: the next line is part of program logic.
    const user = await prisma.user.create({
      // Explanation: the next line is part of program logic.
      data: { email, passwordHash, name, role: safeRole },
      // Explanation: the next line is part of program logic.
      select: userSelect,
      // Explanation: the next line is part of program logic.
    });

    // Explanation: the next line is part of program logic.
    await logSecurityEvent("User registered", "auth", "INFO", {
      userId: user.id,
      ipAddress,
    });
    // Explanation: the next line is part of program logic.
    return user;
  } catch (error) {
    throw mapRegisterPrismaError(error);
  }
}

// Explanation: the next line is part of program logic.
export async function login({ email, password }, ipAddress) {
  // Explanation: the next line is part of program logic.
  const user = await prisma.user.findUnique({ where: { email } });
  // Explanation: the next line is part of program logic.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    // Explanation: the next line is part of program logic.
    await logSecurityEvent("Failed login attempt", "auth", "WARNING", {
      // Explanation: the next line is part of program logic.
      ipAddress,
      // Explanation: the next line is part of program logic.
      metadata: { email },
      // Explanation: the next line is part of program logic.
    });
    // Explanation: the next line is part of program logic.
    const err = new Error("Invalid credentials");
    // Explanation: the next line is part of program logic.
    err.status = 401;
    // Explanation: the next line is part of program logic.
    throw err;
    // Explanation: the next line is part of program logic.
  }

  // Explanation: the next line is part of program logic.
  const payload = { sub: user.id, email: user.email, role: user.role };
  // Explanation: the next line is part of program logic.
  const accessToken = signAccessToken(payload);
  // Explanation: the next line is part of program logic.
  const refreshToken = signRefreshToken(payload);
  // Explanation: the next line is part of program logic.
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Explanation: the next line is part of program logic.
  await prisma.refreshToken.create({
    // Explanation: the next line is part of program logic.
    data: { token: refreshToken, userId: user.id, expiresAt },
    // Explanation: the next line is part of program logic.
  });

  // Explanation: the next line is part of program logic.
  await logSecurityEvent("User logged in", "auth", "INFO", {
    userId: user.id,
    ipAddress,
  });

  // Explanation: the next line is part of program logic.
  return {
    // Explanation: the next line is part of program logic.
    accessToken,
    // Explanation: the next line is part of program logic.
    refreshToken,
    // Explanation: the next line is part of program logic.
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    // Explanation: the next line is part of program logic.
  };
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function refreshAccessToken(token) {
  // Explanation: the next line is part of program logic.
  const payload = verifyRefreshToken(token);
  // Explanation: the next line is part of program logic.
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  // Explanation: the next line is part of program logic.
  if (!stored || stored.expiresAt < new Date()) {
    // Explanation: the next line is part of program logic.
    const err = new Error("Invalid refresh token");
    // Explanation: the next line is part of program logic.
    err.status = 401;
    // Explanation: the next line is part of program logic.
    throw err;
    // Explanation: the next line is part of program logic.
  }

  // Explanation: the next line is part of program logic.
  return signAccessToken({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function logout(refreshToken) {
  // Explanation: the next line is part of program logic.
  if (refreshToken) {
    // Explanation: the next line is part of program logic.
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    // Explanation: the next line is part of program logic.
  }
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function getProfile(userId) {
  // Explanation: the next line is part of program logic.
  return prisma.user.findUnique({ where: { id: userId }, select: userSelect });
  // Explanation: the next line is part of program logic.
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email, ipAddress) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await logSecurityEvent(
      "Password reset requested for unknown email",
      "auth",
      "WARNING",
      {
        ipAddress,
        metadata: { email },
      },
    );
    return { ok: true };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: { tokenHash, userId: user.id, expiresAt },
  });

  await logSecurityEvent("Password reset requested", "auth", "INFO", {
    userId: user.id,
    ipAddress,
  });

  const resetLink = `${config.clientUrl}/reset-password?token=${token}`;

  return {
    ok: true,
    ...(config.nodeEnv !== "production"
      ? { resetToken: token, resetLink }
      : {}),
  };
}

export async function resetPassword(token, newPassword, ipAddress) {
  const tokenHash = hashToken(token);
  const stored = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!stored || stored.expiresAt < new Date()) {
    const err = new Error("Invalid or expired reset token");
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: stored.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: stored.userId } }),
    prisma.refreshToken.deleteMany({ where: { userId: stored.userId } }),
  ]);

  await logSecurityEvent("Password reset completed", "auth", "INFO", {
    userId: stored.userId,
    ipAddress,
  });

  return { ok: true };
}
