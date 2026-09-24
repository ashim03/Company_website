"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll } from "@/lib/admin";
import { formField, formBool, firstIssue } from "@/lib/admin";
import { navItemSchema } from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

async function guard() {
  return requireSession();
}

export async function createNavItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const parsed = navItemSchema.safeParse({
    label: formField(fd, "label"),
    url: formField(fd, "url"),
    isExternal: formBool(fd, "isExternal"),
    parentId: formField(fd, "parentId"),
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };
  await prisma.navigationItem.create({
    data: { ...parsed.data, parentId: parsed.data.parentId || null },
  });
  await revalidateAll();
  revalidatePath("/", "layout");
  redirect("/admin/navigation");
}

export async function updateNavItem(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const existing = await prisma.navigationItem.findUnique({ where: { id } });
  if (!existing) return { error: "Navigation item not found." };

  const parsed = navItemSchema.safeParse({
    label: formField(fd, "label"),
    url: formField(fd, "url"),
    isExternal: formBool(fd, "isExternal"),
    parentId: formField(fd, "parentId"),
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };
  await prisma.navigationItem.update({
    where: { id },
    data: { ...parsed.data, parentId: parsed.data.parentId || null },
  });
  await revalidateAll();
  revalidatePath("/", "layout");
  redirect("/admin/navigation");
}

export async function deleteNavItem(id: string): Promise<void> {
  await guard();
  await prisma.navigationItem.delete({ where: { id } });
  await revalidateAll();
  revalidatePath("/", "layout");
}
