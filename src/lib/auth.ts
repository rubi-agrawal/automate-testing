import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { connectDB } from "./db";
import { getTokenFromHeader, verifyToken, type JwtPayload } from "./jwt";
import User from "@/models/User";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getAuthFromRequest(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization");
  const cookieToken = request.cookies.get("token")?.value;
  const token = getTokenFromHeader(authHeader) || cookieToken || null;
  if (!token) return null;
  return verifyToken(token);
}

export async function getAuthUser(request: NextRequest) {
  const payload = getAuthFromRequest(request);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId).select("-password");
  return user;
}

export function requireAuth(payload: JwtPayload | null): JwtPayload {
  if (!payload) {
    throw new Error("Unauthorized");
  }
  return payload;
}

export function requireAdmin(payload: JwtPayload | null): JwtPayload {
  const auth = requireAuth(payload);
  if (auth.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }
  return auth;
}
