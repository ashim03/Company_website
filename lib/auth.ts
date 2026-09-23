import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";
import type { SessionUser, UserRole } from "@/lib/types";

const PLACEHOLDER_SECRET = "change-me-to-a-long-random-secret-string";
const DEV_FALLBACK = "dev-only-insecure-secret";

/**
 * Resolves the signing secret lazily so builds are not blocked, but any
 * real authentication in production fails closed when the secret is
 * missing or still the placeholder.
 */
function resolveSecret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value === PLACEHOLDER_SECRET || value === DEV_FALLBACK) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET is not configured. Set a long random value in production."
      );
    }
    return new TextEncoder().encode(DEV_FALLBACK);
  }
  return new TextEncoder().encode(value);
}
const TOKEN_ISSUER = "codastra-admin";

export const hashPassword = (password: string) => hash(password, 12);
export const verifyPassword = (password: string, passwordHash: string) =>
  compare(password, passwordHash);

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Creates a signed JWT session, records it in the DB for revocation/audit,
 * and sets the httpOnly session cookie.
 */
export async function createSession(
  user: { id: string; name: string; email: string; role: UserRole },
  meta?: { userAgent?: string; ip?: string }
): Promise<void> {
  const jti = randomBytes(16).toString("hex");
  const token = await new SignJWT({
    role: user.role,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(TOKEN_ISSUER)
    .setSubject(user.id)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(resolveSecret());

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: sha256(token),
      userAgent: meta?.userAgent?.slice(0, 300),
      ip: meta?.ip?.slice(0, 64),
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Resolves the current user from the signed JWT + DB session record.
 * Returns null when unauthenticated, revoked, or expired.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, resolveSecret(), {
      issuer: TOKEN_ISSUER,
    });
    if (!payload.sub) return null;

    const session = await prisma.session.findUnique({
      where: { tokenHash: sha256(token) },
      include: { user: true },
    });
    if (!session || session.expiresAt.getTime() < Date.now()) return null;
    if (session.user.status !== "ACTIVE") return null;

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };
  } catch {
    return null;
  }
}

/** Throws if the visitor is not signed in / not authorized. */
export async function requireSession(roles?: UserRole[]): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new AuthError("Authentication required", "UNAUTHORIZED");
  if (roles && roles.length > 0 && !roles.includes(session.role)) {
    throw new AuthError("You do not have permission to perform this action", "FORBIDDEN");
  }
  return session;
}

/** Admin-only guard used by privileged mutations (users, settings, deletes). */
export const requireAdmin = () => requireSession(["ADMIN"]);

export class AuthError extends Error {
  code: "UNAUTHORIZED" | "FORBIDDEN";
  constructor(message: string, code: "UNAUTHORIZED" | "FORBIDDEN") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session
      .deleteMany({ where: { tokenHash: sha256(token) } })
      .catch(() => undefined);
  }
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function canManageSensitive(role: UserRole): boolean {
  return role === "ADMIN";
}