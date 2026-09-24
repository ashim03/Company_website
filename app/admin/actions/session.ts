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
import { loginRetryAt, LOGIN_FAILURE_LIMIT } from "@/lib/login-cooldown";
import type { Prisma } from "@prisma/client";

export type LoginState = { error?: string; retryAt?: number };

async function getClientIp(): Promise<string | undefined> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    undefined
  );
}

async function retryAt(tx: Prisma.TransactionClient, email: string, ip?: string) {
  const groups = await Promise.all([{ email }, ...(ip ? [{ ip }] : [])].map(where => tx.loginAttempt.findMany({
    where, select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: LOGIN_FAILURE_LIMIT,
  })));
  return Math.max(0, ...groups.map(failures => loginRetryAt(failures, Date.now()) ?? 0)) || undefined;
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

  try {
    const result = await prisma.$transaction(async tx => {
      // Serialize attempts across server instances so parallel requests cannot
      // slip through the fifth-failure boundary. Stable ordering avoids deadlocks.
      for (const key of [`login:email:${email}`, ...(ip ? [`login:ip:${ip}`] : [])].sort()) {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${key}, 0))::text`;
      }
      const blockedUntil = await retryAt(tx, email, ip);
      if (blockedUntil) return { retryAt: blockedUntil };
      const user = await tx.user.findUnique({ where: { email } });
      if (user?.status === "ACTIVE" && await verifyPassword(parsed.data.password, user.passwordHash)) {
        await tx.loginAttempt.deleteMany({ where: { OR: [{ email }, ...(ip ? [{ ip }] : [])] } });
        await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        return { user };
      }
      await tx.loginAttempt.create({ data: { email, ip } });
      return { retryAt: await retryAt(tx, email, ip) };
    }, { maxWait: 10_000, timeout: 15_000 });
    if (!result.user) return result.retryAt
      ? { error: "Too many failed attempts. Please wait one minute before trying again.", retryAt: result.retryAt }
      : { error: "Invalid email or password." };
    const h = await headers();
    await createSession(result.user, { userAgent: h.get("user-agent") ?? undefined, ip });
  } catch {
    return { error: "Sign in is temporarily unavailable. Please try again shortly." };
  }
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
