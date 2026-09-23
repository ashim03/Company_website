"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll } from "@/lib/admin";
import { formField, firstIssue } from "@/lib/admin";
import { enquiryStatusSchema } from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

async function guard() {
  return requireSession();
}

export async function updateEnquiryStatus(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const parsed = enquiryStatusSchema.safeParse({
    status: formField(fd, "status"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };
  const id = formField(fd, "id");
  const existing = await prisma.contactEnquiry.findUnique({ where: { id } });
  if (!existing) return { error: "Enquiry not found." };
  await prisma.contactEnquiry.update({ where: { id }, data: { status: parsed.data.status } });
  await revalidateAll();
  redirect("/admin/enquiries");
}

export async function deleteEnquiry(id: string): Promise<void> {
  await guard();
  await prisma.contactEnquiry.delete({ where: { id } });
}