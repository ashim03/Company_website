"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll, toJson, formField, formBool, firstIssue } from "@/lib/admin";
import { pageSchema, sectionSchema } from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

async function guard() {
  return requireSession();
}

function parseJsonField(fd: FormData, name: string): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const raw = formField(fd, name);
  if (!raw.trim()) return { ok: true, value: {} };
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, error: "Content must be a JSON object (e.g. { \"headline\": \"…\" })." };
    }
    return { ok: true, value: value as Record<string, unknown> };
  } catch {
    return { ok: false, error: "Content is not valid JSON." };
  }
}

export async function updatePageMeta(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) return { error: "Page not found." };

  const parsed = pageSchema.safeParse({
    title: formField(fd, "title"),
    slug: formField(fd, "slug"),
    description: formField(fd, "description"),
    metaTitle: formField(fd, "metaTitle"),
    metaDescription: formField(fd, "metaDescription"),
    ogImage: formField(fd, "ogImage"),
    status: formField(fd, "status") || "DRAFT",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const duplicate = await prisma.page.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (duplicate) return { error: "A page with this slug already exists." };

  await prisma.page.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      metaTitle: parsed.data.metaTitle || null,
      metaDescription: parsed.data.metaDescription || null,
      ogImage: parsed.data.ogImage || null,
      status: parsed.data.status,
    },
  });
  await revalidateAll();
  redirect(`/admin/pages/${id}/edit?ok=1#sections`);
}

export async function addSection(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const pageId = formField(fd, "pageId");
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) return { error: "Page not found." };

  const sectionType = formField(fd, "sectionType") || "content";
  const content = parseJsonField(fd, "contentJson");
  if (!content.ok) return { error: content.error };

  const last = await prisma.pageSection.findFirst({
    where: { pageId },
    orderBy: { sortOrder: "desc" },
  });

  const parsed = sectionSchema.safeParse({
    pageId,
    sectionType,
    title: formField(fd, "title"),
    subtitle: formField(fd, "subtitle"),
    content: content.value,
    settings: {},
    sortOrder: (last?.sortOrder ?? 0) + 1,
    isVisible: true,
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  await prisma.pageSection.create({
    data: {
      pageId: parsed.data.pageId,
      sectionType: parsed.data.sectionType,
      title: parsed.data.title || null,
      subtitle: parsed.data.subtitle || null,
      content: toJson(parsed.data.content ?? {}),
      settings: toJson(parsed.data.settings ?? {}),
      sortOrder: parsed.data.sortOrder,
      isVisible: parsed.data.isVisible,
    },
  });
  await revalidateAll();
  redirect(`/admin/pages/${pageId}/edit?ok=1#sections`);
}

export async function updateSection(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const existing = await prisma.pageSection.findUnique({ where: { id } });
  if (!existing) return { error: "Section not found." };

  const content = parseJsonField(fd, "contentJson");
  if (!content.ok) return { error: content.error };

  const parsed = sectionSchema.safeParse({
    pageId: existing.pageId,
    sectionType: formField(fd, "sectionType") || existing.sectionType,
    title: formField(fd, "title"),
    subtitle: formField(fd, "subtitle"),
    content: content.value,
    settings: {},
    sortOrder: formField(fd, "sortOrder") || String(existing.sortOrder),
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  await prisma.pageSection.update({
    where: { id },
    data: {
      sectionType: parsed.data.sectionType,
      title: parsed.data.title || null,
      subtitle: parsed.data.subtitle || null,
      content: toJson(parsed.data.content ?? {}),
      settings: toJson({}),
      sortOrder: parsed.data.sortOrder,
      isVisible: parsed.data.isVisible,
    },
  });
  await revalidateAll();
  redirect(`/admin/pages/${existing.pageId}/edit?ok=1#sections`);
}

export async function deleteSection(id: string): Promise<void> {
  await guard();
  const section = await prisma.pageSection.findUnique({ where: { id } });
  if (section) {
    await prisma.pageSection.delete({ where: { id } });
    await revalidateAll();
  }
}

export async function moveSection(id: string, direction: "up" | "down"): Promise<void> {
  await guard();
  const section = await prisma.pageSection.findUnique({ where: { id } });
  if (!section) return;
  const siblings = await prisma.pageSection.findMany({
    where: { pageId: section.pageId },
    orderBy: { sortOrder: "asc" },
  });
  const index = siblings.findIndex((s) => s.id === id);
  const swapWith = direction === "up" ? siblings[index - 1] : siblings[index + 1];
  if (!swapWith) return;
  await prisma.$transaction([
    prisma.pageSection.update({ where: { id }, data: { sortOrder: swapWith.sortOrder } }),
    prisma.pageSection.update({ where: { id: swapWith.id }, data: { sortOrder: section.sortOrder } }),
  ]);
  await revalidateAll();
}