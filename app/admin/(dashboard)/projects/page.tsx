import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { getProjects } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteProject } from "@/app/admin/actions/content";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Projects"
        description="Portfolio work and case studies — shown on /work."
        actions={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New project
          </Link>
        }
      />
      <AdminTable
        columns={[
          {
            key: "name",
            label: "Name",
            cell: (p) => (
              <span className="flex items-center gap-1.5 font-medium">
                {p.name}
                {p.featured ? <Star className="size-3.5 fill-amber-400 text-amber-400" /> : null}
              </span>
            ),
          },
          { key: "client", label: "Client", cell: (p) => p.client || "—" },
          { key: "status", label: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          {
            key: "updatedAt",
            label: "Updated",
            cell: (p) => <span className="text-xs text-muted-foreground">{p.updatedAt.toLocaleDateString()}</span>,
          },
        ]}
        rows={projects}
        emptyLabel="No projects yet. Create your first project."
        actions={{
          edit: (p) => `/admin/projects/${p.id}/edit`,
          view: (p) => `/work/${p.slug}`,
          delete: (p) => p.name,
          onDelete: deleteProject,
        }}
      />
    </div>
  );
}