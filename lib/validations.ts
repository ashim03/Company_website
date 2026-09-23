import { z } from "zod";

// ------------------------------------------------------------------
// Shared validation schemas. Server-side only; never expose to the browser.
// ------------------------------------------------------------------

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

const optionalText = z.string().trim().max(5000).optional().or(z.literal(""));

const strArray = z
  .union([z.array(z.string().trim().min(1).max(500)).max(60), z.string().trim()])
  .transform((v) => (Array.isArray(v) ? v : v ? v.split("\n").map((s) => s.trim()).filter(Boolean) : []))
  .optional()
  .default([]);

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(200),
  password: z.string().min(1, "Password is required.").max(200),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(150),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  service: z.string().trim().max(200).optional().or(z.literal("")),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please describe your project in at least 10 characters.").max(8000),
  website: z.string().trim().max(100).optional(), // honeypot
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: slug,
  shortDescription: z.string().trim().min(2).max(500),
  fullDescription: z.string().trim().min(2).max(20000),
  icon: z.string().trim().max(100).optional().or(z.literal("")),
  coverImage: optionalUrl,
  gallery: strArray,
  benefits: strArray,
  features: strArray,
  technologies: strArray,
  relatedProjectIds: z.array(z.string()).max(60).optional().default([]),
  seoTitle: optionalText,
  seoDescription: optionalText,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  sortOrder: z.coerce.number().int().min(0).max(10000),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug,
  logo: optionalUrl,
  tagline: optionalText,
  shortDescription: z.string().trim().min(2).max(500),
  detailedDescription: optionalText,
  screenshots: strArray,
  features: strArray,
  technology: optionalText,
  websiteUrl: optionalUrl,
  ctaLabel: optionalText,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  sortOrder: z.coerce.number().int().min(0).max(10000),
});

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug,
  client: optionalText,
  industry: optionalText,
  projectType: optionalText,
  shortDescription: z.string().trim().min(2).max(500),
  problem: optionalText,
  solution: optionalText,
  outcome: optionalText,
  coverImage: optionalUrl,
  gallery: strArray,
  technology: strArray,
  serviceProvided: optionalText,
  projectUrl: optionalUrl,
  completionDate: z.string().trim().optional().or(z.literal("")),
  featured: z.coerce.boolean(),
  articleUrl: optionalUrl,
  seoTitle: optionalText,
  seoDescription: optionalText,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2).max(200),
  logo: optionalUrl,
  website: optionalUrl,
  industry: optionalText,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  featured: z.coerce.boolean(),
  isVisible: z.coerce.boolean(),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(2).max(5000),
  author: optionalText,
  role: optionalText,
  company: optionalText,
  avatar: optionalUrl,
  source: optionalText,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  isVisible: z.coerce.boolean(),
});

export const teamSchema = z.object({
  name: z.string().trim().min(2).max(200),
  role: optionalText,
  bio: optionalText,
  photo: optionalUrl,
  email: optionalUrl,
  socials: z
    .object({
      linkedin: z.string().max(500).optional().or(z.literal("")),
      twitter: z.string().max(500).optional().or(z.literal("")),
      github: z.string().max(500).optional().or(z.literal("")),
    })
    .optional(),
  sortOrder: z.coerce.number().int().min(0).max(10000),
  isVisible: z.coerce.boolean(),
});

export const faqSchema = z.object({
  question: z.string().trim().min(2).max(500),
  answer: z.string().trim().min(2).max(10000),
  category: optionalText,
  sortOrder: z.coerce.number().int().min(0).max(10000),
  isVisible: z.coerce.boolean(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(2).max(300),
  slug,
  excerpt: optionalText,
  content: z.string().trim().min(2).max(200000),
  coverImage: optionalUrl,
  authorName: optionalText,
  categoryId: z.string().trim().max(60).optional().or(z.literal("")),
  tagNames: z.array(z.string().trim().max(80)).max(20).optional().default([]),
  publishedAt: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.coerce.boolean(),
  seoTitle: optionalText,
  seoDescription: optionalText,
});

export const pageSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug,
  description: optionalText,
  metaTitle: optionalText,
  metaDescription: optionalText,
  ogImage: optionalUrl,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const sectionSchema = z.object({
  pageId: z.string().trim().min(1),
  sectionType: z.string().trim().min(1).max(60),
  title: z.string().trim().max(300).optional().or(z.literal("")),
  subtitle: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.record(z.string(), z.unknown()).optional().default({}),
  settings: z.record(z.string(), z.unknown()).optional().default({}),
  sortOrder: z.coerce.number().int().min(0).max(10000),
  isVisible: z.coerce.boolean(),
});

export const navItemSchema = z.object({
  label: z.string().trim().min(1).max(200),
  url: z.string().trim().min(1).max(500),
  isExternal: z.coerce.boolean(),
  parentId: z.string().trim().max(60).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(10000),
  isVisible: z.coerce.boolean(),
});

export const settingsSchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  legalName: z.string().trim().max(200),
  tagline: z.string().trim().max(300),
  description: z.string().trim().max(1000),
  logo: optionalUrl,
  darkLogo: optionalUrl,
  favicon: optionalUrl,
  email: z.object({
    primary: z.string().trim().email("Enter a valid email.").max(200),
    secondary: z.string().trim().max(200).optional().or(z.literal("")),
  }),
  phone: z.object({
    primary: z.string().trim().max(50),
    secondary: z.string().trim().max(50).optional().or(z.literal("")),
  }),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  mapUrl: optionalUrl,
  social: z.object({
    facebook: optionalUrl,
    linkedin: optionalUrl,
    instagram: optionalUrl,
    youtube: optionalUrl,
    whatsapp: optionalUrl,
  }),
  seo: z.object({
    title: z.string().trim().max(300),
    description: z.string().trim().max(1000),
    ogImage: optionalUrl,
  }),
  footer: z.object({
    about: z.string().trim().max(2000),
    copyright: z.string().trim().max(500),
  }),
  design: z.object({
    primary: z.string().trim().max(50),
    radius: z.string().trim().max(50),
  }),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  password: z.string().min(10, "Password must be at least 10 characters.").max(200),
  role: z.enum(["ADMIN", "EDITOR"]),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  role: z.enum(["ADMIN", "EDITOR"]),
  status: z.enum(["ACTIVE", "DISABLED"]),
  password: z.string().trim().max(200).optional().or(z.literal("")),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(10, "Password must be at least 10 characters.").max(200),
});

export const enquiryStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "REPLIED", "ARCHIVED"]),
});

export const enrollmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(150),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  course: z.string().trim().min(2, "Please choose a course or class.").max(300),
  courseSlug: z.string().trim().max(200).optional().or(z.literal("")),
  experience: z.string().trim().max(60).optional().or(z.literal("")),
  schedule: z.string().trim().max(300).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  website: z.string().trim().max(100).optional(), // honeypot
});

export const courseSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug,
  category: z.string().trim().max(120).optional().or(z.literal("")),
  level: z.string().trim().max(80).optional().or(z.literal("")),
  duration: z.string().trim().max(80).optional().or(z.literal("")),
  mode: z.string().trim().max(80).optional().or(z.literal("")),
  shortDescription: z.string().trim().min(2).max(500),
  description: z.string().trim().min(2).max(20000).optional().or(z.literal("")),
  syllabus: strArray,
  prerequisites: strArray,
  price: z.string().trim().max(120).optional().or(z.literal("")),
  coverImage: optionalUrl,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  sortOrder: z.coerce.number().int().min(0).max(10000),
});

export const enrollmentStatusSchema = z.object({
  status: z.enum(["NEW", "REVIEWING", "ACCEPTED", "WAITLISTED", "REJECTED", "ARCHIVED"]),
});