// ------------------------------------------------------------------
// CodAstra Labs — database seed
//
// Populates the CMS with the site's default content (settings, nav,
// pages + sections, services, products, FAQs, blog categories) and an
// initial admin user.
//
// Run:  npm run db:seed
//
// The script is idempotent for unique records (upserts). For seeded
// pages, existing sections are replaced so the seed stays the source
// of truth for the default page structure.
// ------------------------------------------------------------------

// tsx does not load .env on its own — import dotenv so the admin
// credentials and other SEED_* variables honour the environment file.
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import {
  defaultSiteSettings,
  defaultServices,
  defaultProducts,
  defaultCourses,
  defaultFaqs,
  defaultTeamMembers,
  defaultTestimonials,
  defaultProjects,
  defaultBlogCategories,
  defaultBlogPosts,
  defaultNav,
  defaultClients,
  defaultPages,
  defaultHomeSections,
  defaultCompanySections,
  defaultProcessSections,
} from "../lib/default-content";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CodAstra Labs database...");

  // --- Admin user ----------------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL || "admin@codastralabs.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "change-me-please";
  const name = process.env.SEED_ADMIN_NAME || "Site Admin";
  const passwordHash = await hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, status: "ACTIVE" },
    create: { email, passwordHash, name, role: "ADMIN", status: "ACTIVE" },
  });
  console.log(`  Admin user: ${email}`);

  // --- Site settings -------------------------------------------------
  await prisma.siteSetting.upsert({
    where: { key: "site" },
    update: { value: defaultSiteSettings as object },
    create: { key: "site", value: defaultSiteSettings as object },
  });

  // --- Navigation ----------------------------------------------------
  await prisma.navigationItem.deleteMany({});
  for (const item of defaultNav) {
    const { children, ...parent } = item;
    await prisma.navigationItem.create({
      data: { ...parent, isVisible: true, children: { create: children.map(child => ({ ...child, isVisible: true })) } },
    });
  }

  // --- Services ------------------------------------------------------
  for (const service of defaultServices) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
  console.log(`  Services: ${defaultServices.length}`);

  // --- Products ------------------------------------------------------
  for (const product of defaultProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`  Products: ${defaultProducts.length}`);

  // --- Courses (classes) ---------------------------------------------
  for (const course of defaultCourses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });
  }
  console.log(`  Courses: ${defaultCourses.length}`);

  // --- Clients -------------------------------------------------------
  await prisma.client.deleteMany({});
  for (const client of defaultClients) {
    await prisma.client.create({ data: client });
  }
  console.log(`  Clients: ${defaultClients.length}`);

  // --- Content the live site does publish ---------------------------
  // Projects (case studies), testimonials, FAQs, team, and blog posts
  // populate the public pages: /work, /company, /contact, /insights,
  // and the homepage sections. The admin can edit these through the CMS.
  await prisma.blogPost.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.faq.deleteMany({});
  await prisma.teamMember.deleteMany({});

  // --- Projects ------------------------------------------------------
  for (const project of defaultProjects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }
  console.log(`  Projects: ${defaultProjects.length}`);

  // --- Team ----------------------------------------------------------
  for (const member of defaultTeamMembers) {
    const existing = await prisma.teamMember.findFirst({ where: { name: member.name } });
    if (!existing) {
      await prisma.teamMember.create({ data: member });
    }
  }
  console.log(`  Team: ${defaultTeamMembers.length}`);

  // --- Testimonials --------------------------------------------------
  for (const testimonial of defaultTestimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { quote: testimonial.quote } });
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial });
    }
  }
  console.log(`  Testimonials: ${defaultTestimonials.length}`);

  // --- FAQs ----------------------------------------------------------
  for (const faq of defaultFaqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: faq });
    }
  }
  console.log(`  FAQs: ${defaultFaqs.length}`);

  // --- Blog categories + posts ---------------------------------------
  await prisma.blogTag.deleteMany({});
  for (const category of defaultBlogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { name: category.name, slug: category.slug },
    });
  }

  for (const post of defaultBlogPosts) {
    const category = await prisma.blogCategory.findUnique({
      where: { slug: post.categorySlug },
    });
    const postRow = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage ?? null,
        authorName: post.authorName ?? null,
        publishedAt: post.publishedAt,
        status: "PUBLISHED",
        featured: post.featured ?? false,
        seoTitle: post.seoTitle ?? null,
        seoDescription: post.seoDescription ?? null,
        categoryId: category?.id ?? null,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage ?? null,
        authorName: post.authorName ?? null,
        publishedAt: post.publishedAt,
        status: "PUBLISHED",
        featured: post.featured ?? false,
        seoTitle: post.seoTitle ?? null,
        seoDescription: post.seoDescription ?? null,
        categoryId: category?.id ?? null,
      },
    });
    const tagIds: string[] = [];
    for (const name of post.tagNames) {
      const tag = await prisma.blogTag.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: { name },
        create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      });
      tagIds.push(tag.id);
    }
    await prisma.blogPost.update({
      where: { id: postRow.id },
      data: { tags: { set: tagIds.map((id) => ({ id })) } },
    });
  }
  console.log(`  Blog posts: ${defaultBlogPosts.length}`);

  // --- Pages + sections ----------------------------------------------
  const pageDefs = [
    { title: "Home", slug: "home", description: defaultSiteSettings.description, sections: defaultHomeSections() },
    { title: "Company", slug: "company", description: defaultSiteSettings.description, sections: defaultCompanySections },
    { title: "Process", slug: "process", description: defaultSiteSettings.description, sections: defaultProcessSections },
    ...defaultPages.map((p) => ({ title: p.title, slug: p.slug, description: p.description, sections: p.sections })),
  ];

  for (const def of pageDefs) {
    const page = await prisma.page.upsert({
      where: { slug: def.slug },
      update: { title: def.title, description: def.description, metaTitle: null, metaDescription: null },
      create: {
        title: def.title,
        slug: def.slug,
        description: def.description,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    // Replace sections so the seed reflects current default page structure.
    // The team section stays unpublished by default — it only appears after
    // an admin publishes it from the Team page (TeamSectionControl).
    await prisma.pageSection.deleteMany({ where: { pageId: page.id } });
    for (let i = 0; i < def.sections.length; i += 1) {
      const s = def.sections[i];
      await prisma.pageSection.create({
        data: {
          pageId: page.id,
          sectionType: s.sectionType,
          title: (s as { title?: string }).title ?? null,
          subtitle: (s as { subtitle?: string }).subtitle ?? null,
          content: (s.content ?? {}) as Prisma.InputJsonValue,
          settings: {},
          sortOrder: i + 1,
          isVisible: true,
        },
      });
    }
  }
  console.log(`  Pages: ${pageDefs.length}`);

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
