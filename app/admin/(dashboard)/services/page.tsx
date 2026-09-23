import Link from "next/link";
import { Plus } from "lucide-react";
import { getServices } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  deleteService,
} from "@/app/admin/actions/content";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Services"
        description="Your service packages — shown on /services and the homepage."
        actions={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New service
          </Link>
        }
      />
      <AdminTable
        columns={[
          { key: "name", label: "Name", cell: (s) => <span className="font-medium">{s.name}</span> },
          { key: "slug", label: "Slug", cell: (s) => <code className="text-xs">{s.slug}</code> },
          { key: "icon", label: "Icon" },
          { key: "status", label: "Status", cell: (s) => <StatusBadge status={s.status} /> },
          { key: "sortOrder", label: "Order" },
        ]}
        rows={services}
        emptyLabel="No services yet. Create your first service."
        actions={{
          edit: (s) => `/admin/services/${s.id}/edit`,
          view: (s) => `/services/${s.slug}`,
          delete: (s) => s.name,
          onDelete: deleteService,
        }}
      />
    </div>
  );
}