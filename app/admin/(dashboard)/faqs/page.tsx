import Link from "next/link";
import { Plus } from "lucide-react";
import { getFaqs } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { deleteFaq } from "@/app/admin/actions/content";

export default async function AdminFaqsPage() {
  const faqs = await getFaqs();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="FAQs"
        description="Frequently asked questions — shown in the FAQs section."
        actions={
          <Link
            href="/admin/faqs/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New FAQ
          </Link>
        }
      />
      <AdminTable
        columns={[
          { key: "question", label: "Question", cell: (f) => <span className="font-medium">{f.question}</span> },
          { key: "category", label: "Category", cell: (f) => f.category || "—" },
          {
            key: "isVisible",
            label: "Visible",
            cell: (f) => (f.isVisible ? <Badge variant="success">Visible</Badge> : <Badge variant="muted">Hidden</Badge>),
          },
          { key: "sortOrder", label: "Order" },
        ]}
        rows={faqs}
        emptyLabel="No FAQs yet."
        actions={{
          edit: (f) => `/admin/faqs/${f.id}/edit`,
          delete: (f) => f.question,
          onDelete: deleteFaq,
        }}
      />
    </div>
  );
}