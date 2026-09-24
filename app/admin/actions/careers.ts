"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { vacancySchema } from "@/lib/careers-schema";
import { firstIssue, formField, toJson } from "@/lib/admin";
import type { ActionState } from "@/components/admin/entity-form";

export async function saveVacancy(_previous: ActionState, data: FormData): Promise<ActionState> {
  await requireSession();
  const parsed = vacancySchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { error: firstIssue(parsed) };
  const id = formField(data, "id");
  if (id) {
    const record = await prisma.siteSetting.findUnique({ where: { id } });
    if (!record?.key.startsWith("vacancy:")) return { error: "Vacancy no longer exists. Reload and try again." };
    await prisma.siteSetting.update({ where: { id }, data: { value: toJson(parsed.data) } });
  } else {
    await prisma.siteSetting.create({ data: { key: `vacancy:${randomUUID()}`, value: toJson(parsed.data) } });
  }
  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  redirect("/admin/careers?ok=1");
}

export async function deleteVacancy(id: string): Promise<void> {
  await requireSession();
  await prisma.siteSetting.deleteMany({ where: { id, key: { startsWith: "vacancy:" } } });
  revalidatePath("/careers");
  revalidatePath("/admin/careers");
}
