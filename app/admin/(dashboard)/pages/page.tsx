import { getPages } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminPagesPage() {
  const pages = await getPages();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Pages"
        description="Top-level pages (including legal pages). Their sections are edited per page."
      />
      <AdminTable
        columns={[
          { key: "title", label: "Title", cell: (p) => <span className="font-medium">{p.title}</span> },
          {
            key: "path",
            label: "URL",
            cell: (p) => (
              <code className="text-xs">
                /{p.slug === "home" ? "" : p.slug}
              </code>
            ),
          },
          { key: "status", label: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          { key: "sections", label: "Sections", cell: (p) => `${p._count.sections}` },
          {
            key: "updatedAt",
            label: "Updated",
            cell: (p) => <span className="text-xs text-muted-foreground">{p.updatedAt.toLocaleDateString()}</span>,
          },
        ]}
        rows={pages}
        emptyLabel="No pages yet."
        actions={{
          edit: (p) => `/admin/pages/${p.id}/edit`,
          view: (p) => (
            p.slug === "home"
              ? "/"
              : `/${p.slug}`
          ),
        }}
      />
    </div>
  );
}