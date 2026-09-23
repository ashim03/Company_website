import "server-only";

import { cache } from "react";
import type { Prisma } from "@prisma/client";
import type {
  Service,
  Product,
  Project,
  Course,
  Client,
  Testimonial,
  TeamMember,
  BlogCategory,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  defaultServices,
  defaultProducts,
  defaultCourses,
  defaultPages,
  defaultFaqs,
  defaultTeamMembers,
  defaultTestimonials,
  defaultProjects,
  defaultBlogPosts,
  defaultBlogCategories,
  defaultHomeSections,
  defaultCompanySections,
  defaultProcessSections,
  type DefaultPageContent,
} from "@/lib/default-content";
import {
  stringArray,
  asRecord,
  type SafeService,
  type SafeProduct,
  type SafeProject,
  type SafeCourse,
  type NavNode,
} from "@/lib/types";

// ------------------------------------------------------------------
// Safe query helpers. Every public query falls back to bundled default
// content so the site renders before a database is connected or seeded,
// and so `next build` never breaks on an empty environment.
// ------------------------------------------------------------------

async function safely<T>(fallback: T, fn: () => Promise<T | null>): Promise<T> {
  if (!process.env.DATABASE_URL) return fallback;
  try {
    return (await fn()) ?? fallback;
  } catch {
    return fallback;
  }
}

function toSafeService(service: Service): SafeService {
  const { relatedProjectIds, gallery, benefits, features, technologies, ...rest } = service;
  return {
    ...rest,
    relatedProjectIds: stringArray(relatedProjectIds),
    gallery: stringArray(gallery),
    benefits: stringArray(benefits),
    features: stringArray(features),
    technologies: stringArray(technologies),
  };
}

function toSafeProduct(product: Product): SafeProduct {
  const { screenshots, features, ...rest } = product;
  return { ...rest, screenshots: stringArray(screenshots), features: stringArray(features) };
}

function toSafeCourse(course: Course): SafeCourse {
  const { syllabus, prerequisites, ...rest } = course;
  return { ...rest, syllabus: stringArray(syllabus), prerequisites: stringArray(prerequisites) };
}

function toSafeProject(project: Project): SafeProject {
  const { gallery, technology, testimonials, ...rest } = project;
  return {
    ...rest,
    gallery: stringArray(gallery),
    technology: stringArray(technology),
    testimonials,
  };
}

/** Convert a seed-input (Prisma create input) into its safe public shape. */
function seedToSafeService(input: (typeof defaultServices)[number]): SafeService {
  return toSafeService(input as unknown as Service);
}
function seedToSafeProduct(input: (typeof defaultProducts)[number]): SafeProduct {
  return toSafeProduct(input as unknown as Product);
}
function seedToSafeCourse(input: (typeof defaultCourses)[number]): SafeCourse {
  return toSafeCourse(input as unknown as Course);
}

// ------------------------------------------------------------------
// Navigation
// ------------------------------------------------------------------

export const getNavTree = cache(async (): Promise<NavNode[]> => {
  // Navigation is a page map. Falling back to service records here made a
  // database hiccup turn the primary nav into a list of service detail links.
  const fallback: NavNode[] = [
    { id: "fallback-home", label: "Home", url: "/", isExternal: false, children: [] },
    { id: "fallback-services", label: "Services", url: "/services", isExternal: false, children: [] },
    { id: "fallback-products", label: "Products", url: "/products", isExternal: false, children: [] },
    { id: "fallback-classes", label: "Classes", url: "/classes", isExternal: false, children: [] },
    { id: "fallback-company", label: "About Us", url: "/company", isExternal: false, children: [] },
    { id: "fallback-work", label: "Work", url: "/work", isExternal: false, children: [] },
    { id: "fallback-contact", label: "Contact", url: "/contact", isExternal: false, children: [] },
  ];

  const items = await safely<NavNode[]>(fallback, async () => {
    const rows = await prisma.navigationItem.findMany({
      orderBy: { sortOrder: "asc" },
      include: { children: { orderBy: { sortOrder: "asc" } } },
    });
    if (rows.length === 0) return null;
    return rows
      .filter((r) => r.isVisible && !r.parentId)
      .map(
        (r): NavNode => ({
          id: r.id,
          label: r.label,
          url: r.url,
          isExternal: r.isExternal,
          children: r.children
            .filter((c) => c.isVisible)
            .map(
              (c): NavNode => ({
                id: c.id,
                label: c.label,
                url: c.url,
                isExternal: c.isExternal,
                children: [],
              })
            ),
        })
      );
  });
  return items;
});

// ------------------------------------------------------------------
// Pages + sections
// ------------------------------------------------------------------

export interface PublicSection {
  id: string;
  sectionType: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  sortOrder: number;
}

export interface PublicPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  status: string;
  sections: PublicSection[];
}

function mapSection(s: {
  id: string;
  sectionType: string;
  title: string | null;
  subtitle: string | null;
  content: Prisma.JsonValue | null;
  settings: Prisma.JsonValue | null;
  sortOrder: number;
}): PublicSection {
  return {
    id: s.id,
    sectionType: s.sectionType,
    title: s.title,
    subtitle: s.subtitle,
    content: asRecord(s.content),
    settings: asRecord(s.settings),
    sortOrder: s.sortOrder,
  };
}

function defaultPageFrom(content: DefaultPageContent): PublicPage {
  return {
    id: `default-${content.slug}`,
    title: content.title,
    slug: content.slug,
    description: content.description,
    metaTitle: null,
    metaDescription: null,
    ogImage: null,
    status: "PUBLISHED",
    sections: content.sections.map((s, i) => ({
      id: `default-${content.slug}-section-${i}`,
      sectionType: s.sectionType,
      title: s.title ?? null,
      subtitle: null,
      content: s.content,
      settings: {},
      sortOrder: i + 1,
    })),
  };
}

const HOME = "home";
const COMPANY = "company";
const PROCESS = "process";

export const getPage = cache(async (slug: string): Promise<PublicPage | null> => {
  let fallback: PublicPage | null | undefined;

  if (slug === HOME) {
    fallback = defaultPageFrom({
      title: "Home",
      slug: HOME,
      description: defaultSiteDescription(),
      sections: defaultHomeSections().map((s) => ({
        sectionType: s.sectionType,
        title: s.title,
        content: s.content,
      })),
    });
  } else if (slug === COMPANY) {
    fallback = defaultPageFrom({
      title: "Company",
      slug: COMPANY,
      description: defaultSiteDescription(),
      sections: defaultCompanySections.map((s) => ({
        sectionType: s.sectionType,
        title: (s as { title?: string }).title,
        content: s.content,
      })),
    });
  } else if (slug === PROCESS) {
    fallback = defaultPageFrom({
      title: "Process",
      slug: PROCESS,
      description: defaultSiteDescription(),
      sections: defaultProcessSections.map((s) => ({
        sectionType: s.sectionType,
        title: (s as { title?: string }).title,
        content: s.content,
      })),
    });
  } else {
    const legal = defaultPages.find((p) => p.slug === slug);
    fallback = legal ? defaultPageFrom(legal) : null;
  }

  // If a DB page exists, prefer it; otherwise fall back to defaults.
  const page = await safely<PublicPage | null>(fallback, async () => {
    const row = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      ogImage: row.ogImage,
      status: row.status,
      sections: row.sections.map(mapSection),
    };
  });

  // Draft/archived pages are never served publicly.
  if (page && page.status !== "PUBLISHED") return null;
  return page;
});

export const getHomePage = cache(async (): Promise<PublicPage | null> => getPage(HOME));
export const getCompanyPage = cache(async (): Promise<PublicPage | null> => getPage(COMPANY));

export const getPublishedPages = cache(async (): Promise<PublicPage[]> => {
  const pages = await safely<PublicPage[] | null>(null, async () => {
    const all = await prisma.page.findMany({
      where: { status: "PUBLISHED" },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { title: "asc" },
    });
    if (all.length === 0) return null;
    return all.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      ogImage: row.ogImage,
      status: row.status,
      sections: row.sections.map(mapSection),
    }));
  });
  return pages ?? [];
});

// ------------------------------------------------------------------
// Services
// ------------------------------------------------------------------

export const getServices = cache(async (): Promise<SafeService[]> => {
  const fallback: SafeService[] = defaultServices.map(seedToSafeService);
  return safely<SafeService[]>(fallback, async () => {
    const all = await prisma.service.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    return all.length ? all.map(toSafeService) : null;
  });
});

export const getService = cache(async (slug: string): Promise<SafeService | null> => {
  const fallback = defaultServices.find((s) => s.slug === slug);
  const fallbackSafe: SafeService | null = fallback ? seedToSafeService(fallback) : null;
  return safely<SafeService | null>(fallbackSafe, async () => {
    const row = await prisma.service.findFirst({
      where: { slug, status: "PUBLISHED" },
    });
    return row ? toSafeService(row) : null;
  });
});

// ------------------------------------------------------------------
// Products
// ------------------------------------------------------------------

export const getProducts = cache(async (): Promise<SafeProduct[]> => {
  const fallback: SafeProduct[] = defaultProducts.map(seedToSafeProduct);
  return safely<SafeProduct[]>(fallback, async () => {
    const all = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    return all.length ? all.map(toSafeProduct) : null;
  });
});

export const getProduct = cache(async (slug: string): Promise<SafeProduct | null> => {
  const fallback = defaultProducts.find((p) => p.slug === slug);
  const fallbackSafe: SafeProduct | null = fallback ? seedToSafeProduct(fallback) : null;
  return safely<SafeProduct | null>(fallbackSafe, async () => {
    const row = await prisma.product.findFirst({
      where: { slug, status: "PUBLISHED" },
    });
    return row ? toSafeProduct(row) : null;
  });
});

// ------------------------------------------------------------------
// Courses / classes
// ------------------------------------------------------------------

export const getCourses = cache(async (): Promise<SafeCourse[]> => {
  const fallback: SafeCourse[] = defaultCourses.map(seedToSafeCourse);
  return safely<SafeCourse[]>(fallback, async () => {
    const all = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    });
    return all.length ? all.map(toSafeCourse) : null;
  });
});

export const getCourse = cache(async (slug: string): Promise<SafeCourse | null> => {
  const fallback = defaultCourses.find((c) => c.slug === slug);
  const fallbackSafe: SafeCourse | null = fallback ? seedToSafeCourse(fallback) : null;
  return safely<SafeCourse | null>(fallbackSafe, async () => {
    const row = await prisma.course.findFirst({ where: { slug, status: "PUBLISHED" } });
    return row ? toSafeCourse(row) : null;
  });
});

// ------------------------------------------------------------------
// Projects / case studies
// ------------------------------------------------------------------

export const getProjects = cache(
  async (options?: { featuredOnly?: boolean }): Promise<SafeProject[]> => {
    const fallback: SafeProject[] = defaultProjects
      .filter((p) => (options?.featuredOnly ? p.featured === true : true))
      .map((p) => toSafeProject(p as unknown as Project));

    return safely<SafeProject[]>(fallback, async () => {
      const all = await prisma.project.findMany({
        where: {
          status: "PUBLISHED",
          ...(options?.featuredOnly ? { featured: true } : {}),
        },
        orderBy: [{ featured: "desc" }, { completionDate: "desc" }],
      });
      return all.length ? all.map(toSafeProject) : null;
    });
  }
);

export const getProject = cache(async (slug: string): Promise<SafeProject | null> => {
  const fallback = defaultProjects.find((p) => p.slug === slug);
  const fallbackSafe: SafeProject | null = fallback
    ? toSafeProject(fallback as unknown as Project)
    : null;
  return safely<SafeProject | null>(fallbackSafe, async () => {
    const row = await prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
    });
    return row ? toSafeProject(row) : null;
  });
});

// ------------------------------------------------------------------
// Clients / testimonials / team / FAQs
// ------------------------------------------------------------------

export const getClients = cache(async (): Promise<Client[]> => {
  return safely<Client[]>([] as Client[], async () => {
    const all = await prisma.client.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
    return all.length ? all : null;
  });
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const fallback: Testimonial[] = defaultTestimonials as unknown as Testimonial[];
  return safely<Testimonial[]>(fallback, async () => {
    const all = await prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
    return all.length ? all : null;
  });
});

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const fallback: TeamMember[] = defaultTeamMembers as unknown as TeamMember[];
  return safely<TeamMember[]>(fallback, async () => {
    const all = await prisma.teamMember.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
    return all.length ? all : null;
  });
});

export const getFaqs = cache(async () => {
  const fallback = defaultFaqs.map((f, i) => ({
    id: `default-faq-${i}`,
    question: f.question,
    answer: f.answer,
    category: f.category ?? null,
    sortOrder: i + 1,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  return safely(fallback, async () => {
    const all = await prisma.faq.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    });
    return all.length ? all : null;
  });
});

// ------------------------------------------------------------------
// Blog
// ------------------------------------------------------------------

type PublishedPost = Prisma.BlogPostGetPayload<{
  include: { category: true; tags: true };
}>;

export const getPublishedPosts = cache(async (): Promise<PublishedPost[]> => {
  const fallback: PublishedPost[] = defaultBlogPosts.map((post) => {
    const category = defaultBlogCategories.find((c) => c.slug === post.categorySlug);
    return {
      id: `default-post-${post.slug}`,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage ?? null,
      authorName: post.authorName ?? null,
      categoryId: category?.slug ?? null,
      publishedAt: post.publishedAt,
      status: "PUBLISHED",
      featured: post.featured ?? false,
      seoTitle: post.seoTitle ?? null,
      seoDescription: post.seoDescription ?? null,
      createdAt: post.publishedAt,
      updatedAt: post.publishedAt,
      category: category
        ? { id: `default-category-${category.slug}`, name: category.name, slug: category.slug }
        : null,
      tags: post.tagNames.map((name) => ({
        id: `default-tag-${name}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      })),
    };
  });

  return safely<PublishedPost[]>(fallback, async () => {
    const all = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      include: { category: true, tags: true },
    });
    return all.length ? all : null;
  });
});

export const getPublishedPost = cache(async (slug: string): Promise<PublishedPost | null> => {
  const fallbackPost = defaultBlogPosts.find((p) => p.slug === slug);
  const fallback = fallbackPost
    ? (await getPublishedPosts()).find((p) => p.slug === slug) ?? null
    : null;

  return safely<PublishedPost | null>(fallback, async () => {
    const row = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { category: true, tags: true },
    });
    return row ?? null;
  });
});

export const getBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  const fallback: BlogCategory[] = defaultBlogCategories.map((c) => ({
    id: `default-category-${c.slug}`,
    name: c.name,
    slug: c.slug,
  }));
  return safely<BlogCategory[]>(fallback, async () => {
    const all = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
    return all.length ? all : null;
  });
});

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function defaultSiteDescription(): string {
  return "CodAstraLabs builds websites, mobile apps, web apps, automation, cloud systems, and secure business software.";
}

export type { SafeService, SafeProduct, SafeProject, SafeCourse };
