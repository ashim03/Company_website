import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Globe } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";
import { logout } from "@/app/admin/actions/session";

export const dynamic = "force-dynamic";

const MOBILE_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/blog", label: "Insights" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/enrollments", label: "Enrollments" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession().catch(() => null);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur">
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden rounded-md bg-muted px-2 py-0.5 text-xs uppercase tracking-wide text-muted-foreground sm:inline">
              {session.role}
            </span>
            <span className="font-medium">{session.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Globe className="size-4" />
              View site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b px-3 py-2 lg:hidden">
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}