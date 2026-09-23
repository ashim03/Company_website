import type { MetadataRoute } from "next";
import { getPublishedPages, getServices, getProjects, getProducts, getPublishedPosts } from "@/lib/queries";
import { getSettings } from "@/lib/site-settings";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [, pages, services, projects, products, posts] = await Promise.all([
    getSettings(),
    getPublishedPages(),
    getServices(),
    getProjects(),
    getProducts(),
    getPublishedPosts(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now },
    { url: absoluteUrl("/services"), lastModified: now },
    { url: absoluteUrl("/products"), lastModified: now },
    { url: absoluteUrl("/work"), lastModified: now },
    { url: absoluteUrl("/insights"), lastModified: now },
    { url: absoluteUrl("/classes"), lastModified: now },
    { url: absoluteUrl("/contact"), lastModified: now },
    { url: absoluteUrl("/company"), lastModified: now },
    { url: absoluteUrl("/process"), lastModified: now },
  ];

  const staticSlugs = new Set([
    "",
    "services",
    "products",
    "work",
    "insights",
    "classes",
    "contact",
    "company",
    "process",
  ]);

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((p) => p.slug !== "home" && !staticSlugs.has(p.slug))
    .map((p) => ({
      url: absoluteUrl(`/${p.slug}`),
      lastModified: now,
    }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    lastModified: now,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: absoluteUrl(`/work/${p.slug}`),
    lastModified: p.updatedAt ?? now,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/products/${p.slug}`),
    lastModified: now,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/insights/${post.slug}`),
    lastModified: post.updatedAt ?? now,
  }));

  return [
    ...staticRoutes,
    ...pageRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...productRoutes,
    ...postRoutes,
  ];
}