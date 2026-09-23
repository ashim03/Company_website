import Link from "next/link";
import {
  Layers,
  Package,
  FolderKanban,
  Users,
  Quote,
  UserCircle,
  HelpCircle,
  Newspaper,
  Image as ImageIcon,
  Inbox,
  FileText,
  ArrowRight,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import { getDashboardData } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

const STAT_CARDS = [
  { label: "Services", key: "services", href: "/admin/services", icon: Layers },
  { label: "Products", key: "products", href: "/admin/products", icon: Package },
  { label: "Projects", key: "projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Clients", key: "clients", href: "/admin/clients", icon: Users },
  { label: "Testimonials", key: "testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "Team", key: "team", href: "/admin/team", icon: UserCircle },
  { label: "FAQs", key: "faqs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Courses", key: "courses", href: "/admin/courses", icon: GraduationCap },
  { label: "Insights", key: "posts", href: "/admin/blog", icon: Newspaper },
  { label: "Pages", key: "pages", href: "/admin/pages", icon: FileText },
  { label: "Media", key: "media", href: "/admin/media", icon: ImageIcon },
] as const;

export default async function AdminDashboardPage() {
  const { counts, recentEnquiries, recentEnrollments } = await getDashboardData();

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Dashboard"
        description="Everything your visitors see is managed from here."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Inbox className="size-4" />
              {counts.newEnquiries > 0
                ? `${counts.newEnquiries} unread enquiry${counts.newEnquiries === 1 ? "" : "s"}`
                : "Enquiries"}
            </Link>
            <Link
              href="/admin/enrollments"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-card px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              <ClipboardList className="size-4" />
              {counts.newEnrollments > 0
                ? `${counts.newEnrollments} new enrollment${counts.newEnrollments === 1 ? "" : "s"}`
                : "Enrollments"}
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <card.icon className="size-5 text-muted-foreground" />
              <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums">
              {counts[card.key]}
            </p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent enquiries
          </h2>
          <div className="overflow-hidden rounded-lg border bg-card">
            {recentEnquiries.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                No enquiries yet. They will appear here when people submit the
                contact form.
              </p>
            ) : (
              <ul className="divide-y">
                {recentEnquiries.map((enquiry) => (
                  <li key={enquiry.id} className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {enquiry.name}
                        <span className="font-normal text-muted-foreground">
                          {" "}
                          · {enquiry.email}
                        </span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {enquiry.company || enquiry.service || "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={enquiry.status} tone="enquiry" />
                      <time className="text-xs tabular-nums text-muted-foreground">
                        {enquiry.createdAt.toLocaleDateString()}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link
            href="/admin/enquiries"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all enquiries
            <ArrowRight className="size-3.5" />
          </Link>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Getting started
          </h2>
          <div className="rounded-lg border bg-card p-5">
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  1
                </span>
                <p>
                  Review <Link href="/admin/settings" className="text-primary hover:underline">Site settings</Link>{" "}
                  — logo, contact details, social links.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  2
                </span>
                <p>
                  Publish your{" "}
                  <Link href="/admin/services" className="text-primary hover:underline">services</Link>,
                  {" "}
                  <Link href="/admin/projects" className="text-primary hover:underline">projects</Link>{" "}
                  and{" "}
                  <Link href="/admin/products" className="text-primary hover:underline">products</Link>.
                  Only PUBLISHED items appear on the website.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  3
                </span>
                <p>
                  Add real{" "}
                  <Link href="/admin/clients" className="text-primary hover:underline">clients</Link>,
                  {" "}
                  <Link href="/admin/testimonials" className="text-primary hover:underline">testimonials</Link>{" "}
                  and{" "}
                  <Link href="/admin/team" className="text-primary hover:underline">team members</Link>.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  4
                </span>
                <p>
                  Upload images to{" "}
                  <Link href="/admin/media" className="text-primary hover:underline">Media</Link>{" "}
                  and attach them to pages.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  5
                </span>
                <p>
                  Publish the{" "}
                  <Link href="/admin/team" className="text-primary hover:underline">team section</Link>{" "}
                  when members are ready, and adjust the{" "}
                  <Link href="/admin/navigation" className="text-primary hover:underline">menu</Link>{" "}
                  when you add new pages.
                </p>
              </li>
            </ol>
          </div>
        </section>
      </div>

      {counts.newEnrollments > 0 ? (
        <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList className="size-5" />
              </span>
              <div>
                <p className="font-medium">New enrollment requests waiting</p>
                <p className="text-sm text-muted-foreground">
                  Review, accept, or reject requests from your{" "}
                  <Link href="/admin/enrollments" className="text-primary hover:underline">
                    enrollment inbox
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent enrollment requests
        </h2>
        <div className="overflow-hidden rounded-lg border bg-card">
          {recentEnrollments.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No enrollment requests yet. They appear here when someone submits the form on the
              Classes page.
            </p>
          ) : (
            <ul className="divide-y">
              {recentEnrollments.map((enrollment) => (
                <li key={enrollment.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {enrollment.name}
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {enrollment.email}
                      </span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {enrollment.course}
                      {enrollment.schedule ? ` · ${enrollment.schedule}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={enrollment.status} tone="enrollment" />
                    <time className="text-xs tabular-nums text-muted-foreground">
                      {enrollment.createdAt.toLocaleDateString()}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link
          href="/admin/enrollments"
          className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all enrollments
          <ArrowRight className="size-3.5" />
        </Link>
      </section>
    </div>
  );
}
