"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll } from "@/lib/admin";
import { slugify, toJson, publishedAtFor, formField, formBool, linesToList, firstIssue } from "@/lib/admin";
import {
  serviceSchema,
  productSchema,
  projectSchema,
  clientSchema,
  testimonialSchema,
  teamSchema,
  faqSchema,
  courseSchema,
} from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

type SessionGuard = { user: { id: string } };

async function guard(): Promise<SessionGuard["user"]> {
  const session = await requireSession();
  return { id: session.id };
}

function ensureSlug(name: string, rawSlug: string): string {
  return rawSlug.trim() || slugify(name);
}

// ------------------------------------------------------------------
// Services
// ------------------------------------------------------------------

export async function createService(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = serviceSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    shortDescription: formField(fd, "shortDescription"),
    fullDescription: formField(fd, "fullDescription"),
    icon: formField(fd, "icon"),
    coverImage: formField(fd, "coverImage"),
    gallery: linesToList(formField(fd, "gallery")),
    benefits: linesToList(formField(fd, "benefits")),
    features: linesToList(formField(fd, "features")),
    technologies: linesToList(formField(fd, "technologies")),
    relatedProjectIds: linesToList(formField(fd, "relatedProjectIds")),
    seoTitle: formField(fd, "seoTitle"),
    seoDescription: formField(fd, "seoDescription"),
    status: formField(fd, "status") || "DRAFT",
    sortOrder: formField(fd, "sortOrder") || "0",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A service with this slug already exists." };

  const created = await prisma.service.create({
    data: {
      ...parsed.data,
      publishedAt: publishedAtFor(parsed.data.status),
      gallery: toJson(parsed.data.gallery),
      benefits: toJson(parsed.data.benefits),
      features: toJson(parsed.data.features),
      technologies: toJson(parsed.data.technologies),
      relatedProjectIds: toJson(parsed.data.relatedProjectIds),
    },
  });
  await logActivity(user.id, "service.create", "service", created.id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/services/${created.id}/edit`);
}

export async function updateService(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { error: "Service not found." };

  const parsed = serviceSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    shortDescription: formField(fd, "shortDescription"),
    fullDescription: formField(fd, "fullDescription"),
    icon: formField(fd, "icon"),
    coverImage: formField(fd, "coverImage"),
    gallery: linesToList(formField(fd, "gallery")),
    benefits: linesToList(formField(fd, "benefits")),
    features: linesToList(formField(fd, "features")),
    technologies: linesToList(formField(fd, "technologies")),
    relatedProjectIds: linesToList(formField(fd, "relatedProjectIds")),
    seoTitle: formField(fd, "seoTitle"),
    seoDescription: formField(fd, "seoDescription"),
    status: formField(fd, "status") || "DRAFT",
    sortOrder: formField(fd, "sortOrder") || "0",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const duplicate = await prisma.service.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (duplicate) return { error: "A service with this slug already exists." };

  await prisma.service.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt: publishedAtFor(parsed.data.status, existing.publishedAt),
      gallery: toJson(parsed.data.gallery),
      benefits: toJson(parsed.data.benefits),
      features: toJson(parsed.data.features),
      technologies: toJson(parsed.data.technologies),
      relatedProjectIds: toJson(parsed.data.relatedProjectIds),
    },
  });
  await logActivity(user.id, "service.update", "service", id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/services/${id}/edit?ok=1`);
}

export async function deleteService(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.service.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "service.delete", "service", id, item.name);
    await prisma.service.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// Courses (classes)
// ------------------------------------------------------------------

export async function createCourse(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = courseSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    category: formField(fd, "category"),
    level: formField(fd, "level"),
    duration: formField(fd, "duration"),
    mode: formField(fd, "mode"),
    shortDescription: formField(fd, "shortDescription"),
    description: formField(fd, "description"),
    syllabus: linesToList(formField(fd, "syllabus")),
    prerequisites: linesToList(formField(fd, "prerequisites")),
    price: formField(fd, "price"),
    coverImage: formField(fd, "coverImage"),
    status: formField(fd, "status") || "DRAFT",
    sortOrder: formField(fd, "sortOrder") || "0",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const existing = await prisma.course.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A course with this slug already exists." };

  const created = await prisma.course.create({
    data: {
      ...parsed.data,
      publishedAt: publishedAtFor(parsed.data.status),
      syllabus: toJson(parsed.data.syllabus),
      prerequisites: toJson(parsed.data.prerequisites),
    },
  });
  await logActivity(user.id, "course.create", "course", created.id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/courses/${created.id}/edit`);
}

export async function updateCourse(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.course.findUnique({ where: { id } });
  if (!existing) return { error: "Course not found." };

  const parsed = courseSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    category: formField(fd, "category"),
    level: formField(fd, "level"),
    duration: formField(fd, "duration"),
    mode: formField(fd, "mode"),
    shortDescription: formField(fd, "shortDescription"),
    description: formField(fd, "description"),
    syllabus: linesToList(formField(fd, "syllabus")),
    prerequisites: linesToList(formField(fd, "prerequisites")),
    price: formField(fd, "price"),
    coverImage: formField(fd, "coverImage"),
    status: formField(fd, "status") || "DRAFT",
    sortOrder: formField(fd, "sortOrder") || "0",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const duplicate = await prisma.course.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (duplicate) return { error: "A course with this slug already exists." };

  await prisma.course.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt: publishedAtFor(parsed.data.status, existing.publishedAt),
      syllabus: toJson(parsed.data.syllabus),
      prerequisites: toJson(parsed.data.prerequisites),
    },
  });
  await logActivity(user.id, "course.update", "course", id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/courses/${id}/edit?ok=1`);
}

export async function deleteCourse(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.course.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "course.delete", "course", id, item.name);
    await prisma.course.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// Products
// ------------------------------------------------------------------

export async function createProduct(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = productSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    logo: formField(fd, "logo"),
    tagline: formField(fd, "tagline"),
    shortDescription: formField(fd, "shortDescription"),
    detailedDescription: formField(fd, "detailedDescription"),
    screenshots: linesToList(formField(fd, "screenshots")),
    features: linesToList(formField(fd, "features")),
    technology: formField(fd, "technology"),
    websiteUrl: formField(fd, "websiteUrl"),
    ctaLabel: formField(fd, "ctaLabel"),
    status: formField(fd, "status") || "DRAFT",
    sortOrder: formField(fd, "sortOrder") || "0",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A product with this slug already exists." };

  const created = await prisma.product.create({
    data: {
      ...parsed.data,
      publishedAt: publishedAtFor(parsed.data.status),
      screenshots: toJson(parsed.data.screenshots),
      features: toJson(parsed.data.features),
    },
  });
  await logActivity(user.id, "product.create", "product", created.id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/products/${created.id}/edit`);
}

export async function updateProduct(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: "Product not found." };

  const parsed = productSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    logo: formField(fd, "logo"),
    tagline: formField(fd, "tagline"),
    shortDescription: formField(fd, "shortDescription"),
    detailedDescription: formField(fd, "detailedDescription"),
    screenshots: linesToList(formField(fd, "screenshots")),
    features: linesToList(formField(fd, "features")),
    technology: formField(fd, "technology"),
    websiteUrl: formField(fd, "websiteUrl"),
    ctaLabel: formField(fd, "ctaLabel"),
    status: formField(fd, "status") || "DRAFT",
    sortOrder: formField(fd, "sortOrder") || "0",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const duplicate = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (duplicate) return { error: "A product with this slug already exists." };

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt: publishedAtFor(parsed.data.status, existing.publishedAt),
      screenshots: toJson(parsed.data.screenshots),
      features: toJson(parsed.data.features),
    },
  });
  await logActivity(user.id, "product.update", "product", id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/products/${id}/edit?ok=1`);
}

export async function deleteProduct(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.product.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "product.delete", "product", id, item.name);
    await prisma.product.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// Projects
// ------------------------------------------------------------------

export async function createProject(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = projectSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    client: formField(fd, "client"),
    industry: formField(fd, "industry"),
    projectType: formField(fd, "projectType"),
    shortDescription: formField(fd, "shortDescription"),
    problem: formField(fd, "problem"),
    solution: formField(fd, "solution"),
    outcome: formField(fd, "outcome"),
    coverImage: formField(fd, "coverImage"),
    gallery: linesToList(formField(fd, "gallery")),
    technology: linesToList(formField(fd, "technology")),
    serviceProvided: formField(fd, "serviceProvided"),
    projectUrl: formField(fd, "projectUrl"),
    completionDate: formField(fd, "completionDate"),
    featured: formBool(fd, "featured"),
    articleUrl: formField(fd, "articleUrl"),
    seoTitle: formField(fd, "seoTitle"),
    seoDescription: formField(fd, "seoDescription"),
    status: formField(fd, "status") || "DRAFT",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const existing = await prisma.project.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A project with this slug already exists." };

  const created = await prisma.project.create({
    data: {
      ...parsed.data,
      completionDate: parsed.data.completionDate ? new Date(parsed.data.completionDate) : null,
      publishedAt: publishedAtFor(parsed.data.status),
      gallery: toJson(parsed.data.gallery),
      technology: toJson(parsed.data.technology),
    },
  });
  await logActivity(user.id, "project.create", "project", created.id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/projects/${created.id}/edit`);
}

export async function updateProject(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { error: "Project not found." };

  const parsed = projectSchema.safeParse({
    name: formField(fd, "name"),
    slug: ensureSlug(formField(fd, "name"), formField(fd, "slug")),
    client: formField(fd, "client"),
    industry: formField(fd, "industry"),
    projectType: formField(fd, "projectType"),
    shortDescription: formField(fd, "shortDescription"),
    problem: formField(fd, "problem"),
    solution: formField(fd, "solution"),
    outcome: formField(fd, "outcome"),
    coverImage: formField(fd, "coverImage"),
    gallery: linesToList(formField(fd, "gallery")),
    technology: linesToList(formField(fd, "technology")),
    serviceProvided: formField(fd, "serviceProvided"),
    projectUrl: formField(fd, "projectUrl"),
    completionDate: formField(fd, "completionDate"),
    featured: formBool(fd, "featured"),
    articleUrl: formField(fd, "articleUrl"),
    seoTitle: formField(fd, "seoTitle"),
    seoDescription: formField(fd, "seoDescription"),
    status: formField(fd, "status") || "DRAFT",
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const duplicate = await prisma.project.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (duplicate) return { error: "A project with this slug already exists." };

  await prisma.project.update({
    where: { id },
    data: {
      ...parsed.data,
      completionDate: parsed.data.completionDate ? new Date(parsed.data.completionDate) : null,
      publishedAt: publishedAtFor(parsed.data.status, existing.publishedAt),
      gallery: toJson(parsed.data.gallery),
      technology: toJson(parsed.data.technology),
    },
  });
  await logActivity(user.id, "project.update", "project", id, parsed.data.name);
  await revalidateAll();
  redirect(`/admin/projects/${id}/edit?ok=1`);
}

export async function deleteProject(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.project.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "project.delete", "project", id, item.name);
    await prisma.project.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// Clients
// ------------------------------------------------------------------

export async function createClient(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = clientSchema.safeParse({
    name: formField(fd, "name"),
    logo: formField(fd, "logo"),
    website: formField(fd, "website"),
    industry: formField(fd, "industry"),
    sortOrder: formField(fd, "sortOrder") || "0",
    featured: formBool(fd, "featured"),
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const created = await prisma.client.create({ data: parsed.data });
  await logActivity(user.id, "client.create", "client", created.id, parsed.data.name);
  await revalidateAll();
  redirect("/admin/clients");
}

export async function updateClient(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return { error: "Client not found." };

  const parsed = clientSchema.safeParse({
    name: formField(fd, "name"),
    logo: formField(fd, "logo"),
    website: formField(fd, "website"),
    industry: formField(fd, "industry"),
    sortOrder: formField(fd, "sortOrder") || "0",
    featured: formBool(fd, "featured"),
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  await prisma.client.update({ where: { id }, data: parsed.data });
  await logActivity(user.id, "client.update", "client", id, parsed.data.name);
  await revalidateAll();
  redirect("/admin/clients");
}

export async function deleteClient(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.client.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "client.delete", "client", id, item.name);
    await prisma.client.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// Testimonials
// ------------------------------------------------------------------

export async function createTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = testimonialSchema.safeParse({
    quote: formField(fd, "quote"),
    author: formField(fd, "author"),
    role: formField(fd, "role"),
    company: formField(fd, "company"),
    avatar: formField(fd, "avatar"),
    source: formField(fd, "source"),
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const created = await prisma.testimonial.create({ data: parsed.data });
  await logActivity(user.id, "testimonial.create", "testimonial", created.id, parsed.data.author);
  await revalidateAll();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return { error: "Testimonial not found." };

  const parsed = testimonialSchema.safeParse({
    quote: formField(fd, "quote"),
    author: formField(fd, "author"),
    role: formField(fd, "role"),
    company: formField(fd, "company"),
    avatar: formField(fd, "avatar"),
    source: formField(fd, "source"),
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  await logActivity(user.id, "testimonial.update", "testimonial", id, parsed.data.author);
  await revalidateAll();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "testimonial.delete", "testimonial", id, item.author ?? undefined);
    await prisma.testimonial.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// Team members
// ------------------------------------------------------------------

export async function createTeamMember(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = teamSchema.safeParse({
    name: formField(fd, "name"),
    role: formField(fd, "role"),
    bio: formField(fd, "bio"),
    photo: formField(fd, "photo"),
    email: formField(fd, "email"),
    socials: {
      linkedin: formField(fd, "socialLinkedin"),
      twitter: formField(fd, "socialTwitter"),
      github: formField(fd, "socialGithub"),
    },
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const created = await prisma.teamMember.create({
    data: { ...parsed.data, socials: toJson(parsed.data.socials ?? {}) },
  });
  await logActivity(user.id, "team.create", "team", created.id, parsed.data.name);
  await revalidateAll();
  redirect("/admin/team");
}

export async function updateTeamMember(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) return { error: "Team member not found." };

  const parsed = teamSchema.safeParse({
    name: formField(fd, "name"),
    role: formField(fd, "role"),
    bio: formField(fd, "bio"),
    photo: formField(fd, "photo"),
    email: formField(fd, "email"),
    socials: {
      linkedin: formField(fd, "socialLinkedin"),
      twitter: formField(fd, "socialTwitter"),
      github: formField(fd, "socialGithub"),
    },
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  await prisma.teamMember.update({
    where: { id },
    data: { ...parsed.data, socials: toJson(parsed.data.socials ?? {}) },
  });
  await logActivity(user.id, "team.update", "team", id, parsed.data.name);
  await revalidateAll();
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.teamMember.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "team.delete", "team", id, item.name);
    await prisma.teamMember.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// FAQs
// ------------------------------------------------------------------

export async function createFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const parsed = faqSchema.safeParse({
    question: formField(fd, "question"),
    answer: formField(fd, "answer"),
    category: formField(fd, "category"),
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  const created = await prisma.faq.create({ data: parsed.data });
  await logActivity(user.id, "faq.create", "faq", created.id, parsed.data.question);
  await revalidateAll();
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard();
  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) return { error: "FAQ not found." };

  const parsed = faqSchema.safeParse({
    question: formField(fd, "question"),
    answer: formField(fd, "answer"),
    category: formField(fd, "category"),
    sortOrder: formField(fd, "sortOrder") || "0",
    isVisible: formBool(fd, "isVisible"),
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  await prisma.faq.update({ where: { id }, data: parsed.data });
  await logActivity(user.id, "faq.update", "faq", id, parsed.data.question);
  await revalidateAll();
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string): Promise<void> {
  const user = await guard();
  const item = await prisma.faq.findUnique({ where: { id } });
  if (item) {
    await logActivity(user.id, "faq.delete", "faq", id, item.question);
    await prisma.faq.delete({ where: { id } });
    await revalidateAll();
  }
}

// ------------------------------------------------------------------
// Activity log helper
// ------------------------------------------------------------------

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