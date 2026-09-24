"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderKanban,
  Users,
  Quote,
  UserCircle,
  HelpCircle,
  Newspaper,
  FileText,
  Image,
  Inbox,
  Settings,
  MenuSquare,
  Shield,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/team", label: "Team", icon: UserCircle },
  { href: "/admin/careers", label: "Careers", icon: ClipboardList },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/courses", label: "Courses", icon: GraduationCap },
  { href: "/admin/blog", label: "Insights", icon: Newspaper },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/navigation", label: "Navigation", icon: MenuSquare },
  { href: "/admin/media", label: "Media", icon: Image },
] as const;

const SETTINGS_NAV = [
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: Shield },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-card/70 shadow-[8px_0_30px_-26px_rgba(15,23,42,0.5)] lg:flex">
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-[0_8px_20px_-10px_rgba(37,99,235,0.8)]">
          CA
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">CodAstra CMS</p>
          <p className="text-[11px] text-muted-foreground">Content workspace</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">Content</p>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
              isActive(item.href, item.href === "/admin")
                ? "bg-primary/10 font-semibold text-primary shadow-sm"
                : ""
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-0.5 border-t px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">Workspace</p>
        {SETTINGS_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
              isActive(item.href) ? "bg-primary/10 font-semibold text-primary shadow-sm" : ""
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
