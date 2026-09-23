"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export type LoginState = { error?: string };

const MAX_ATTEMPTS = 8; // per window below
const LOCK_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

async function getClientIp(): Promise<string | undefined> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    undefined
  );
}

async function isLocked(ip?: string, email?: string): Promise<boolean> {
  if (!ip && !email) return false;
  const since = new Date(Date.now() - LOCK_WINDOW_MS);
  const attempts = await prisma.loginAttempt.count({
    where: {
      createdAt: { gte: since },
      OR: [
        ...(ip ? [{ ip }] : []),
        ...(email ? [{ email }] : []),
      ],
    },
  });
  return attempts >= MAX_ATTEMPTS;
}

async function recordFailure(email: string, ip?: string): Promise<void> {
  try {
    await prisma.loginAttempt.create({ data: { email, ip } });
  } catch {
    // Do not let a logging failure block the login response.
  }
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email address and password." };
  }

  const ip = await getClientIp();
  const email = parsed.data.email.toLowerCase();

  if (!(await isLocked(ip, email))) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.status === "ACTIVE") {
      const valid = await verifyPassword(parsed.data.password, user.passwordHash);
      if (valid) {
        const h = await headers();
        await createSession(user, {
          userAgent: h.get("user-agent") ?? undefined,
          ip: h.get("x-forwarded-for")?.split(",")[0] ?? undefined,
        });
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        redirect("/admin");
      }
    }
  }

  await recordFailure(email, ip);
  return { error: "Invalid email or password." };
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}