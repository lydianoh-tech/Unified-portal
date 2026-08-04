// Explanation: the next line is part of program logic.
import { z } from "zod";
// Explanation: the next line is part of program logic.
import * as authService from "../services/authService.js";
// Explanation: the next line is part of program logic.
import config from "../config/index.js";

// Explanation: the next line is part of program logic.
const registerSchema = z.object({
  // Explanation: the next line is part of program logic.
  email: z.string().email(),
  // Explanation: the next line is part of program logic.
  password: z.string().min(8),
  // Explanation: the next line is part of program logic.
  name: z.string().min(2),
  // Explanation: the next line is part of program logic.
  role: z.enum(["USER", "CUSTOMER"]).optional(),
  // Explanation: the next line is part of program logic.
});

// Explanation: the next line is part of program logic.
const loginSchema = z.object({
  // Explanation: the next line is part of program logic.
  email: z.string().email(),
  // Explanation: the next line is part of program logic.
  password: z.string().min(1),
  // Explanation: the next line is part of program logic.
});

const requestPasswordResetSchema = z.object({
  // Explanation: the next line is part of program logic.
  email: z.string().email(),
  // Explanation: the next line is part of program logic.
});

const resetPasswordSchema = z.object({
  // Explanation: the next line is part of program logic.
  token: z.string().min(1),
  // Explanation: the next line is part of program logic.
  password: z.string().min(8),
  // Explanation: the next line is part of program logic.
});

// Explanation: the next line is part of program logic.
export async function register(req, res) {
  // Explanation: the next line is part of program logic.
  const parsed = registerSchema.safeParse(req.body);
  // Explanation: the next line is part of program logic.
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  // Explanation: the next line is part of program logic.
  const user = await authService.register(parsed.data, req.ip);
  // Explanation: the next line is part of program logic.
  return res.status(201).json({ user });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function login(req, res) {
  // Explanation: the next line is part of program logic.
  const parsed = loginSchema.safeParse(req.body);
  // Explanation: the next line is part of program logic.
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  // Explanation: the next line is part of program logic.
  const result = await authService.login(parsed.data, req.ip);
  // Explanation: the next line is part of program logic.
  res.cookie("refreshToken", result.refreshToken, {
    // Explanation: the next line is part of program logic.
    httpOnly: true,
    // Explanation: the next line is part of program logic.
    secure: config.nodeEnv === "production",
    // Explanation: the next line is part of program logic.
    sameSite: "lax",
    // Explanation: the next line is part of program logic.
    maxAge: 7 * 24 * 60 * 60 * 1000,
    // Explanation: the next line is part of program logic.
  });

  // Explanation: the next line is part of program logic.
  return res.json({ accessToken: result.accessToken, user: result.user });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function requestPasswordReset(req, res) {
  // Explanation: the next line is part of program logic.
  const parsed = requestPasswordResetSchema.safeParse(req.body);
  // Explanation: the next line is part of program logic.
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  // Explanation: the next line is part of program logic.
  const result = await authService.requestPasswordReset(
    parsed.data.email,
    req.ip,
  );
  // Explanation: the next line is part of program logic.
  return res.json(result);
}

// Explanation: the next line is part of program logic.
export async function resetPassword(req, res) {
  // Explanation: the next line is part of program logic.
  const parsed = resetPasswordSchema.safeParse(req.body);
  // Explanation: the next line is part of program logic.
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });

  // Explanation: the next line is part of program logic.
  const result = await authService.resetPassword(
    parsed.data.token,
    parsed.data.password,
    req.ip,
  );
  // Explanation: the next line is part of program logic.
  return res.json(result);
}

// Explanation: the next line is part of program logic.
export async function refresh(req, res) {
  // Explanation: the next line is part of program logic.
  const token = req.cookies?.refreshToken ?? req.body.refreshToken;
  // Explanation: the next line is part of program logic.
  if (!token) return res.status(401).json({ error: "Refresh token required" });

  // Explanation: the next line is part of program logic.
  try {
    // Explanation: the next line is part of program logic.
    const accessToken = await authService.refreshAccessToken(token);
    // Explanation: the next line is part of program logic.
    return res.json({ accessToken });
    // Explanation: the next line is part of program logic.
  } catch (err) {
    // Explanation: the next line is part of program logic.
    return res.status(err.status ?? 401).json({ error: err.message });
    // Explanation: the next line is part of program logic.
  }
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function logout(req, res) {
  // Explanation: the next line is part of program logic.
  await authService.logout(req.cookies?.refreshToken);
  // Explanation: the next line is part of program logic.
  res.clearCookie("refreshToken");
  // Explanation: the next line is part of program logic.
  return res.json({ ok: true });
  // Explanation: the next line is part of program logic.
}

// Explanation: the next line is part of program logic.
export async function me(req, res) {
  // Explanation: the next line is part of program logic.
  const user = await authService.getProfile(req.user.id);
  // Explanation: the next line is part of program logic.
  return res.json({ user });
  // Explanation: the next line is part of program logic.
}
