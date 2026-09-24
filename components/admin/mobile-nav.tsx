"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  ["/admin", "Dashboard"],
  ["/admin/services", "Services"],
  ["/admin/products", "Products"],
  ["/admin/projects", "Projects"],
  ["/admin/clients", "Clients"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/team", "Team"],
  ["/admin/careers", "Careers"],
  ["/admin/faqs", "FAQs"],
  ["/admin/courses", "Courses"],
  ["/admin/blog", "Insights"],
  ["/admin/pages", "Pages"],
  ["/admin/navigation", "Navigation"],
  ["/admin/media", "Media"],
  ["/admin/enquiries", "Enquiries"],
  ["/admin/enrollments", "Enrollments"],
  ["/admin/settings", "Settings"],
  ["/admin/users", "Users"],
] as const;

export function MobileAdminNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="CMS sections"
      className="flex snap-x snap-mandatory gap-1 overflow-x-auto border-b bg-background/80 px-3 py-2 shadow-sm backdrop-blur-xl lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {LINKS.map(([href, label]) => {
        const active = href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 snap-start whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-primary/10 font-semibold text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
