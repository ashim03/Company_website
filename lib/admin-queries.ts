import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type DashboardCounts = {
  services: number;
  products: number;
  projects: number;
  clients: number;
  testimonials: number;
  team: number;
  faqs: number;
  posts: number;
  media: number;
  newEnquiries: number;
  courses: number;
  newEnrollments: number;
  pages: number;
};

export const getDashboardData = cache(async (): Promise<{
  counts: DashboardCounts;
  recentEnquiries: Awaited<ReturnType<typeof getEnquiries>>;
  recentEnrollments: Awaited<ReturnType<typeof getEnrollments>>;
}> => {
  const [counts, recentEnquiries, recentEnrollments] = await Promise.all([
    prisma.$transaction([
      prisma.service.count(),
      prisma.product.count(),
      prisma.project.count(),
      prisma.client.count(),
      prisma.testimonial.count(),
      prisma.teamMember.count(),
      prisma.faq.count(),
      prisma.blogPost.count(),
      prisma.media.count(),
      prisma.contactEnquiry.count({ where: { status: "NEW" } }),
      prisma.course.count(),
      prisma.classEnrollment.count({ where: { status: "NEW" } }),
      prisma.page.count(),
    ]) as unknown as Promise<
      [number, number, number, number, number, number, number, number, number, number, number, number, number]
    >,
    prisma.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.classEnrollment.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const [
    services,
    products,
    projects,
    clients,
    testimonials,
    team,
    faqs,
    posts,
    media,
    newEnquiries,
    courses,
    newEnrollments,
    pages,
  ] = counts;
  return {
    counts: {
      services,
      products,
      projects,
      clients,
      testimonials,
      team,
      faqs,
      posts,
      media,
      newEnquiries,
      courses,
      newEnrollments,
      pages,
    },
    recentEnquiries,
    recentEnrollments,
  };
});

export const getServices = cache(async () =>
  prisma.service.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
);

export const getProducts = cache(async () =>
  prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
);

export const getProjects = cache(async () =>
  prisma.project.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] })
);

export const getClients = cache(async () =>
  prisma.client.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
);

export const getTestimonials = cache(async () =>
  prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] })
);

export const getTeamMembers = cache(async () =>
  prisma.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
);

export const getFaqs = cache(async () =>
  prisma.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { question: "asc" }] })
);

export const getBlogPosts = cache(async () =>
  prisma.blogPost.findMany({
    include: { category: true, tags: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  })
);

export const getBlogCategories = cache(async () =>
  prisma.blogCategory.findMany({ orderBy: { name: "asc" } })
);

export const getPages = cache(async () =>
  prisma.page.findMany({
    include: { _count: { select: { sections: true } } },
    orderBy: { updatedAt: "desc" },
  })
);

export const getNavigation = cache(async () =>
  prisma.navigationItem.findMany({ orderBy: { sortOrder: "asc" } })
);

export const getMedia = cache(async () =>
  prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
);

export const getEnquiries = cache(async () =>
  prisma.contactEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
);

export const getCourses = cache(async () =>
  prisma.course.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
);

export const getEnrollments = cache(async () =>
  prisma.classEnrollment.findMany({ orderBy: { createdAt: "desc" }, take: 200 })
);

export const getUsers = cache(async () =>
  prisma.user.findMany({ orderBy: { createdAt: "asc" } })
);

export const getRecentActivity = cache(async () =>
  prisma.activityLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  })
);