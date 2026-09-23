"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword, verifyPassword } from "@/lib/auth";
import { formField, firstIssue, toJson } from "@/lib/admin";
import {
  userCreateSchema,
  userUpdateSchema,
  changePasswordSchema,
} from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

export async function createUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = userCreateSchema.safeParse({
    name: formField(fd, "name"),
    email: formField(fd, "email"),
    password: formField(fd, "password"),
    role: formField(fd, "role") || "EDITOR",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with this email already exists." };

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role,
    },
  });
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: "user.create",
      entityType: "user",
      meta: toJson({ name: parsed.data.name, email }),
    },
  });
  redirect("/admin/users");
}

export async function updateUser(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = userUpdateSchema.safeParse({
    name: formField(fd, "name"),
    email: formField(fd, "email"),
    role: formField(fd, "role") || "EDITOR",
    status: formField(fd, "status") || "ACTIVE",
    password: formField(fd, "password"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return { error: "User not found." };

  const email = parsed.data.email.toLowerCase();
  const duplicate = await prisma.user.findFirst({
    where: { email, id: { not: id } },
  });
  if (duplicate) return { error: "A user with this email already exists." };
  if (id === admin.id && parsed.data.status === "DISABLED") {
    return { error: "You cannot disable your own account." };
  }

  await prisma.user.update({
    where: { id },
    data: {
      name: parsed.data.name,
      email,
      role: parsed.data.role,
      status: parsed.data.status,
      ...(parsed.data.password ? { passwordHash: await hashPassword(parsed.data.password) } : {}),
    },
  });
  redirect("/admin/users");
}

export async function deleteUser(id: string): Promise<void> {
  const admin = await requireAdmin();
  if (id === admin.id) throw new Error("You cannot delete your own account.");
  await prisma.user.delete({ where: { id } });
}

export async function changePassword(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formField(fd, "currentPassword"),
    newPassword: formField(fd, "newPassword"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return { error: "User not found." };
  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
}