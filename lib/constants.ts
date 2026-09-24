// ------------------------------------------------------------------
// Shared constants for CodAstra Labs website + CMS
// ------------------------------------------------------------------

export const CODASTRA = {
  companyName: "CodAstra Labs",
  companyLegalName: "CodAstra Labs Pvt. Ltd.",
  defaultTagline: "Software, websites, and apps built for real operations.",
  defaultDescription:
    "CodAstraLabs builds websites, mobile apps, web apps, automation, cloud systems, and secure business software from Nepal.",
  defaultEmail: "support.codastralabs@gmail.com",
  defaultPhone: "9851405271",
};

export const SESSION_COOKIE = "codastra_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const BLOB_HOST = "public.blob.vercel-storage.com";

// Cache tags used with revalidatePath/revalidateTag
export const CACHE = {
  home: "page:home",
  pages: "pages",
  services: "services",
  products: "products",
  projects: "projects",
  clients: "clients",
  testimonials: "testimonials",
  team: "team",
  faqs: "faqs",
  blog: "blog",
  media: "media",
  site: "site",
  nav: "nav",
} as const;

// Public paths revalidated after CMS publishes content.
export const PUBLIC_PATHS = [
  "/",
  "/services",
  "/work",
  "/products",
  "/insights",
  "/company",
  "/process",
  "/classes",
  "/careers",
  "/contact",
] as const;

// Dynamic route patterns revalidated wholesale
export const PUBLIC_DYNAMIC_PATHS = [
  "/services/[slug]",
  "/work/[slug]",
  "/products/[slug]",
  "/insights/[slug]",
  "/[slug]",
] as const;

// PageSection.sectionType values supported by the public renderer
export const SECTION_TYPES = [
  "hero",
  "clients",
  "intro",
  "services",
  "products",
  "projects",
  "process",
  "testimonials",
  "team",
  "faqs",
  "cta",
  "stats",
  "blog",
  "why",
  "content",
  "promo",
  "classes",
  "journey",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  clients: "Clients / Trust",
  intro: "Introduction",
  services: "Services",
  products: "Products",
  projects: "Projects",
  process: "Process",
  testimonials: "Testimonials",
  team: "Team",
  faqs: "FAQs",
  cta: "Call to action",
  stats: "Statistics",
  blog: "Insights / Blog",
  why: "Why CodAstra",
  content: "Rich content",
  promo: "Feature spotlight",
  classes: "Classes / Training",
  journey: "Company journey",
};

export const STATUS_LABELS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
} as const;

export const ENQUIRY_STATUS_LABELS = {
  NEW: "New",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
} as const;

export const ENROLLMENT_STATUS_LABELS = {
  NEW: "New",
  REVIEWING: "Reviewing",
  ACCEPTED: "Accepted",
  WAITLISTED: "Waitlisted",
  REJECTED: "Rejected",
  ARCHIVED: "Archived",
} as const;

export const ROLE_LABELS = {
  ADMIN: "Administrator",
  EDITOR: "Editor",
} as const;

export const USER_STATUS_LABELS = {
  ACTIVE: "Active",
  DISABLED: "Disabled",
} as const;

// Allowed media types for the media library (server-validated)
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

export const ALLOWED_MEDIA_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf",
  "video/mp4",
];

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB

// Service icons are rendered from these keys mapped to lucide icons.
export const SERVICE_ICONS = [
  "globe",
  "layout",
  "smartphone",
  "workflow",
  "cloud",
  "shield",
  "trending-up",
  "database",
  "code",
  "bot",
  "paintbrush",
  "rocket",
] as const;

export type ServiceIconKey = (typeof SERVICE_ICONS)[number];
