import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "goamaze-fallback-secret-32-chars!!"
);

const TOKEN_NAME = "goamaze_admin_token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Sign a JWT for the given admin payload */
export async function signToken(payload: {
  id: string;
  email: string;
  role: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

/** Verify and decode a JWT. Returns null if invalid. */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

/** Read the admin token from the HTTP-only cookie */
export async function getTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value ?? null;
}

/** Set the JWT as an HTTP-only cookie */
export function buildCookieHeader(token: string) {
  return `${TOKEN_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`;
}

/** Clear the JWT cookie */
export function buildClearCookieHeader() {
  return `${TOKEN_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
