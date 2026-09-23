import Link from "next/link";
import { Plus } from "lucide-react";
import { getTestimonials } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { deleteTestimonial } from "@/app/admin/actions/content";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Testimonials"
        description="Client quotes — shown on the homepage and project pages."
        actions={
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New testimonial
          </Link>
        }
      />
      <AdminTable
        columns={[
          {
            key: "quote",
            label: "Quote",
            cell: (t) => (
              <span className="line-clamp-2 max-w-md text-sm text-muted-foreground">“{t.quote}”</span>
            ),
          },
          { key: "author", label: "Author", cell: (t) => <span className="font-medium">{t.author || "—"}</span> },
          { key: "company", label: "Company", cell: (t) => t.company || "—" },
          {
            key: "isVisible",
            label: "Visible",
            cell: (t) => (t.isVisible ? <Badge variant="success">Visible</Badge> : <Badge variant="muted">Hidden</Badge>),
          },
        ]}
        rows={testimonials}
        emptyLabel="No testimonials yet. Ask happy clients for a short quote."
        actions={{
          edit: (t) => `/admin/testimonials/${t.id}/edit`,
          delete: (t) => `quote by ${t.author ?? "unknown author"}`,
          onDelete: deleteTestimonial,
        }}
      />
    </div>
  );
}