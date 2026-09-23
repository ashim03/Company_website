import type {
  Role,
  ContentStatus,
  Service,
  Product,
  Project,
  Client,
  Course,
  Testimonial,
  TeamMember,
  BlogPost,
  Faq,
  Media,
} from "@prisma/client";

export type UserRole = Role;
export type PublicStatus = ContentStatus;

/** Union of all JSON body types used in PageSection.content. */
export type Inner = Record<string, unknown>;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type SafeService = Omit<Service, "relatedProjectIds" | "gallery" | "benefits" | "features" | "technologies"> & {
  relatedProjectIds: string[];
  gallery: string[];
  benefits: string[];
  features: string[];
  technologies: string[];
};

export type SafeProduct = Omit<Product, "screenshots" | "features"> & {
  screenshots: string[];
  features: string[];
};

export type SafeProject = Omit<Project, "gallery" | "technology" | "testimonials"> & {
  gallery: string[];
  technology: string[];
  testimonials: unknown;
};

export type SafeCourse = Omit<Course, "syllabus" | "prerequisites"> & {
  syllabus: string[];
  prerequisites: string[];
};

export type SafeClient = Client;
export type SafeTestimonial = Testimonial;
export type SafeTeamMember = TeamMember;
export type SafeBlogPost = BlogPost;
export type SafeFAQ = Faq;
export type SafeMedia = Media;

export interface NavNode {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  children: NavNode[];
}

export interface SectionRendererProps {
  sectionType: string;
  title?: string | null;
  subtitle?: string | null;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
}

// Helper to read values that may be stored as strings in a couple of shapes.
export function text(value: unknown, fallback = ""): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

export function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
  return [];
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}