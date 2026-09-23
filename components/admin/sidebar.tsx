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
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-card/40 lg:flex">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          C
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">CodAstra CMS</p>
          <p className="text-[11px] text-muted-foreground">Content management</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              isActive(item.href, item.href === "/admin")
                ? "bg-accent font-medium text-foreground"
                : ""
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-0.5 border-t p-2">
        {SETTINGS_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              isActive(item.href) ? "bg-accent font-medium text-foreground" : ""
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