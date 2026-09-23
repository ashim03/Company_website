import Link from "next/link";
import { Plus } from "lucide-react";
import { getClients } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { deleteClient } from "@/app/admin/actions/content";

export default async function AdminClientsPage() {
  const clients = await getClients();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Clients"
        description="Company logos shown in the clients strip on the homepage."
        actions={
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New client
          </Link>
        }
      />
      <AdminTable
        columns={[
          { key: "name", label: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
          { key: "industry", label: "Industry", cell: (c) => c.industry || "—" },
          {
            key: "isVisible",
            label: "Visible",
            cell: (c) => (c.isVisible ? <Badge variant="success">Visible</Badge> : <Badge variant="muted">Hidden</Badge>),
          },
          {
            key: "featured",
            label: "Featured",
            cell: (c) => (c.featured ? <Badge>Featured</Badge> : "—"),
          },
          { key: "sortOrder", label: "Order" },
        ]}
        rows={clients}
        emptyLabel="No clients yet. Add the companies you work with."
        actions={{
          edit: (c) => `/admin/clients/${c.id}/edit`,
          delete: (c) => c.name,
          onDelete: deleteClient,
        }}
      />
    </div>
  );
}