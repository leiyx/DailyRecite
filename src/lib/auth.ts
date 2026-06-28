import { cookies } from "next/headers";
import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required");
}

const COOKIE_NAME = "auth_token";
const TOKEN_DAYS = 30;

// ─── Password hashing (scrypt) ───

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(check));
}

// ─── Token (HMAC-SHA256) ───

function sign(payload: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET!).update(payload).digest("hex");
}

export function createToken(userId: number): string {
  const payload = `${userId}:${Date.now()}`;
  return `${payload}:${sign(payload)}`;
}

export function verifyToken(token: string): number | null {
  const parts = token.split(":");
  if (parts.length !== 3) return null;

  const [userIdStr, timestamp, signature] = parts;
  const payload = `${userIdStr}:${timestamp}`;

  // Constant-time signature check
  const expected = sign(payload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  // Check expiry (30 days)
  const age = Date.now() - Number(timestamp);
  if (age > TOKEN_DAYS * 24 * 60 * 60 * 1000) {
    return null;
  }

  return Number(userIdStr);
}

// ─── Cookie helpers ───

export async function setAuthCookie(userId: number): Promise<void> {
  const token = createToken(userId);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_DAYS * 24 * 60 * 60,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getAuthUserId(): Promise<number | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(): Promise<number> {
  const userId = await getAuthUserId();
  if (userId === null) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}
