import "server-only";

import crypto from "node:crypto";
import { put, del, head } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_MEDIA_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  MAX_FILE_BYTES,
} from "@/lib/constants";

export class MediaError extends Error {
  code: "TYPE" | "SIZE" | "STORAGE" | "USED" | "NOT_FOUND" | "UNAVAILABLE";
  constructor(message: string, code: MediaError["code"]) {
    super(message);
    this.name = "MediaError";
    this.code = code;
  }
}

export function validateMediaFile(file: File): void {
  const type = file.type || "application/octet-stream";
  if (!ALLOWED_MEDIA_TYPES.includes(type)) {
    throw new MediaError(
      `Unsupported file type "${type}". Allowed: JPG, PNG, WEBP, AVIF, SVG, PDF, MP4.`,
      "TYPE"
    );
  }
  const max =
    type === "video/mp4"
      ? MAX_VIDEO_BYTES
      : ALLOWED_IMAGE_TYPES.includes(type)
        ? MAX_IMAGE_BYTES
        : MAX_FILE_BYTES;
  if (file.size > max) {
    throw new MediaError(
      `File is too large (${Math.round(file.size / 1024 / 1024)} MB). Maximum allowed is ${Math.round(max / 1024 / 1024)} MB.`,
      "SIZE"
    );
  }
}

const extensionFromType = (type: string): string => {
  if (type === "image/webp") return "webp";
  if (type === "image/avif") return "avif";
  if (type === "image/svg+xml") return "svg";
  if (type === "image/png") return "png";
  if (type === "application/pdf") return "pdf";
  if (type === "video/mp4") return "mp4";
  return "jpg";
};

/**
 * Uploads a file to Vercel Blob with a unique pathname and records its
 * metadata in the database. Original blobs are never overwritten.
 */
export async function uploadMedia(file: File, folder = "general"): Promise<{ id: string; url: string }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new MediaError(
      "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN.",
      "UNAVAILABLE"
    );
  }
  validateMediaFile(file);
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "general";
  const id = crypto.randomBytes(6).toString("hex");
  const ext = extensionFromType(file.type || "application/octet-stream");
  const pathname = `${safeFolder}/${Date.now()}-${id}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });

  const record = await prisma.media.create({
    data: {
      name: file.name,
      filename: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      url: blob.url,
      pathname: blob.pathname,
    },
  });

  return { id: record.id, url: record.url };
}

/**
 * Deletes a media record + its blob, but only when the file is not
 * referenced anywhere in the CMS.
 */
export async function deleteMedia(id: string): Promise<void> {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new MediaError("Media not found", "NOT_FOUND");

  const usage = await findMediaUsage(media.url);
  if (usage.length > 0) {
    throw new MediaError(
      `This file is used by: ${usage.join(", ")}. Remove those references first.`,
      "USED"
    );
  }

  await del(media.url).catch(() => undefined);
  await prisma.media.delete({ where: { id } });
}

export async function mediaExists(url: string): Promise<boolean> {
  try {
    await head(url);
    return true;
  } catch {
    return false;
  }
}

/** Rough scan of every JSON/string column that can hold media URLs. */
export async function findMediaUsage(url: string): Promise<string[]> {
  const hit = (value: unknown): boolean =>
    typeof value === "string"
      ? value.includes(url)
      : Array.isArray(value)
        ? value.some((v) => hit(v))
        : typeof value === "object" && value !== null
          ? Object.values(value).some((v) => hit(v))
          : false;

  const results: string[] = [];

  const [
    services, products, projects, clients, testimonials, teamMembers, blogPosts, pages, faqs,
  ] = await Promise.all([
    prisma.service.findMany(),
    prisma.product.findMany(),
    prisma.project.findMany(),
    prisma.client.findMany(),
    prisma.testimonial.findMany(),
    prisma.teamMember.findMany(),
    prisma.blogPost.findMany(),
    prisma.page.findMany({ include: { sections: true } }),
    prisma.faq.findMany(),
  ]);

  const check = (label: string, value: unknown) => {
    if (hit(value)) results.push(label);
  };

  for (const s of services) check(`Service: ${s.name}`, [s.icon, s.coverImage, s.gallery]);
  for (const p of products) check(`Product: ${p.name}`, [p.logo, p.screenshots]);
  for (const p of projects) check(`Project: ${p.name}`, [p.coverImage, p.gallery]);
  for (const c of clients) check(`Client: ${c.name}`, [c.logo]);
  for (const t of testimonials) check(`Testimonial: ${t.author ?? "—"}`, [t.avatar]);
  for (const t of teamMembers) check(`Team: ${t.name}`, [t.photo]);
  for (const b of blogPosts) check(`Blog: ${b.title}`, [b.coverImage, b.content]);
  for (const p of pages) check(`Page: ${p.title}`, [p.ogImage, ...p.sections.map((s) => [s.title, s.subtitle, s.content, s.settings])]);
  for (const f of faqs) check(`FAQ: ${f.question}`, [f.answer]);
  for (const s of services) check(`Service settings: ${s.name}`, [s.relatedProjectIds, s.benefits, s.features, s.technologies]);
  for (const p of products) check(`Product settings: ${p.name}`, [p.features]);

  return [...new Set(results)];
}