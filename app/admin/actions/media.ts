"use server";

import { requireSession } from "@/lib/auth";
import { uploadMedia, deleteMedia, MediaError } from "@/lib/media";
import { revalidateAll } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type UploadResult =
  | { ok: true; id: string; url: string }
  | { ok: false; error: string };

export async function uploadMediaAction(
  file: File,
  folder = "general"
): Promise<UploadResult> {
  try {
    await requireSession();
    const result = await uploadMedia(file, folder);
    await revalidateAll();
    return { ok: true, ...result };
  } catch (error) {
    if (error instanceof MediaError) return { ok: false, error: error.message };
    return { ok: false, error: "Upload failed. Please try again." };
  }
}

export async function deleteMediaAction(id: string): Promise<void> {
  await requireSession();
  await deleteMedia(id);
  await revalidateAll();
}

export async function updateMediaAlt(id: string, alt: string): Promise<void> {
  await requireSession();
  await prisma.media.update({ where: { id }, data: { alt: alt.trim() || null } });
}