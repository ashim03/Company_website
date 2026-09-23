"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll } from "@/lib/admin";
import { formField, firstIssue } from "@/lib/admin";
import { enrollmentStatusSchema } from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

async function guard() {
  return requireSession();
}

export async function updateEnrollmentStatus(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  await guard();
  const parsed = enrollmentStatusSchema.safeParse({
    status: formField(fd, "status"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const id = formField(fd, "id");
  const existing = await prisma.classEnrollment.findUnique({ where: { id } });
  if (!existing) return { error: "Enrollment request not found." };

  await prisma.classEnrollment.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  await revalidateAll();
  redirect("/admin/enrollments");
}

export async function deleteEnrollment(id: string): Promise<void> {
  await guard();
  await prisma.classEnrollment.delete({ where: { id } });
}