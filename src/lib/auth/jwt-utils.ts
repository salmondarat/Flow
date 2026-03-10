import type { ProfileRow } from "@/types";

const SECRET_KEY = process.env.JWT_SECRET || "flow-secret-key-change-in-production";

/**
 * Cached user role data stored in JWT
 */
export interface CachedUserData {
  userId: string;
  role: "admin" | "client";
  exp: number;
}

/**
 * Simple base64 encoding for role token (simpler than full JWT)
 * Valid for 1 hour
 */
export function createRoleToken(userId: string, role: "admin" | "client"): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // 1 hour from now

  const payload: CachedUserData = {
    userId,
    role,
    exp,
  };

  // Encode as base64 JSON (simple encoding, decodeURIComponent handles special chars)
  const token = Buffer.from(JSON.stringify(payload))
    .toString("base64");

  return token;
}

/**
 * Verify and extract user role from cached token
 */
export function verifyRoleToken(token: string | null | undefined): CachedUserData | null {
  if (!token) return null;

  try {
    // Decode base64 JSON
    const payload = JSON.parse(
      Buffer.from(token, "base64").toString()
    ) as CachedUserData;

    // Check if token is still valid
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract role token from cookies
 */
export function getRoleTokenFromRequest(request: Request): string | undefined {
  const cookies = request.headers.get("cookie") || "";
  const roleTokenMatch = cookies.match(/role_token=([^;]+)/);
  return roleTokenMatch?.[1];
}
