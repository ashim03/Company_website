import type { ContentStatus, Prisma } from "@prisma/client";
import { revalidatePublic } from "@/lib/revalidate";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Converts unknown JSON (form payloads, section bodies) to a Prisma Json value. */
export function toJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

/** Builds the publishedAt value when an entity is saved as PUBLISHED. */
export function publishedAtFor(
  status: ContentStatus,
  existing?: Date | null
): Date | null {
  if (status === "PUBLISHED") return existing ?? new Date();
  return null;
}

/** Revalidates every public path after a CMS mutation. */
export async function revalidateAll(): Promise<void> {
  await revalidatePublic();
}

/** Parses a textarea list (one item per line) into a trimmed string array. */
export function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Reads a text field from a FormData payload. */
export function formField(fd: FormData, name: string): string {
  const value = fd.get(name);
  return typeof value === "string" ? value : "";
}

/** Reads a checkbox (Switch submits "on" when checked). */
export function formBool(fd: FormData, name: string): boolean {
  return formField(fd, name) === "on";
}

/** First human-readable message from a zod validation failure. */
export function firstIssue(result: { error?: { issues?: { message?: string }[] } }): string {
  return result?.error?.issues?.[0]?.message ?? "Please check the form and try again.";
}