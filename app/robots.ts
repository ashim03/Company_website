import type { MetadataRoute } from "next";
import { SESSION_COOKIE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", `/?${SESSION_COOKIE}=*`],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://codastralabs.com"}/sitemap.xml`,
  };
}