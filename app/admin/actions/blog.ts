"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll } from "@/lib/admin";
import { slugify, toJson, formField, formBool, linesToList, publishedAtFor, firstIssue } from "@/lib/admin";
import { blogSchema } from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

async function guard() {
  return requireSession();
}

function ensureSlug(title: string, rawSlug: string): string {
  return rawSlug.trim() || slugify(title);
}

async function findOrCreateTags(names: string[]): Promise<string[]> {
  if (names.length === 0) return [];
  const ids: string[] = [];
  for (const name of names) {
    const slug = slugify(name);
    const tag = await prisma.blogTag.upsert({
      where: { slug },
      create: { name, slug },
      update: {},
    });
    ids.push(tag.id);
  }
  return ids;
}

export async function createPost(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = blogSchema.safeParse({
    title: formField(fd, "title"),
    slug: ensureSlug(formField(fd, "title"), formField(fd, "slug")),
    excerpt: formField(fd, "excerpt"),
    content: formField(fd, "content"),
    coverImage: formField(fd, "coverImage"),
    authorName: formField(fd, "authorName"),
    categoryId: formField(fd, "categoryId"),
    tagNames: linesToList(formField(fd, "tagNames")),
    publishedAt: formField(fd, "publishedAt"),
    status: formField(fd, "status") || "DRAFT",
    featured: formBool(fd, "featured"),
    seoTitle: formField(fd, "seoTitle"),
    seoDescription: formField(fd, "seoDescription"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const existing = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A post with this slug already exists." };

  const categoryId = parsed.data.categoryId || null;
  const post = await prisma.blogPost.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || null,
      authorName: parsed.data.authorName || null,
      categoryId,
      publishedAt: parsed.data.publishedAt
        ? new Date(parsed.data.publishedAt)
        : publishedAtFor(parsed.data.status),
      status: parsed.data.status,
      featured: parsed.data.featured,
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      tags: { connect: (await findOrCreateTags(parsed.data.tagNames)).map((id) => ({ id })) },
    },
  });
  await logActivity(user.id, "post.create", "post", post.id, parsed.data.title);
  await revalidateAll();
  redirect(`/admin/blog/${post.id}/edit`);
}

export async function updatePost(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return { error: "Post not found." };

  const parsed = blogSchema.safeParse({
    title: formField(fd, "title"),
    slug: ensureSlug(formField(fd, "title"), formField(fd, "slug")),
    excerpt: formField(fd, "excerpt"),
    content: formField(fd, "content"),
    coverImage: formField(fd, "coverImage"),
    authorName: formField(fd, "authorName"),
    categoryId: formField(fd, "categoryId"),
    tagNames: linesToList(formField(fd, "tagNames")),
    publishedAt: formField(fd, "publishedAt"),
    status: formField(fd, "status") || "DRAFT",
    featured: formBool(fd, "featured"),
    seoTitle: formField(fd, "seoTitle"),
    seoDescription: formField(fd, "seoDescription"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const duplicate = await prisma.blogPost.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (duplicate) return { error: "A post with this slug already exists." };

  const categoryId = parsed.data.categoryId || null;
  await prisma.blogPost.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || null,
      authorName: parsed.data.authorName || null,
      categoryId,
      publishedAt: parsed.data.publishedAt
        ? new Date(parsed.data.publishedAt)
        : publishedAtFor(parsed.data.status, existing.publishedAt),
      status: parsed.data.status,
      featured: parsed.data.featured,
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      tags: { set: (await findOrCreateTags(parsed.data.tagNames)).map((tagId) => ({ id: tagId })) },
    },
  });
  await logActivity(user.id, "post.update", "post", id, parsed.data.title);
  await revalidateAll();
  redirect(`/admin/blog/${id}/edit?ok=1`);
}

export async function deletePost(id: string): Promise<void> {
  const user = await guard();
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (post) {
    await logActivity(user.id, "post.delete", "post", id, post.title);
    await prisma.blogPost.delete({ where: { id } });
    await revalidateAll();
  }
}

export async function createCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await guard();
  const name = formField(fd, "name").trim();
  if (!name) return { error: "Category name is required." };
  const slug = slugify(name);
  const existing = await prisma.blogCategory.findUnique({ where: { slug } });
  if (existing) return { error: "A category with this name already exists." };
  await prisma.blogCategory.create({ data: { name, slug } });
  redirect("/admin/blog");
}

export async function deleteCategory(id: string): Promise<void> {
  await guard();
  await prisma.blogCategory.delete({ where: { id } });
  await revalidateAll();
}

async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  name?: string
): Promise<void> {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      meta: toJson(name ? { name } : {}),
    },
  });
}