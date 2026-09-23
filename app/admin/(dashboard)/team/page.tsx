import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTeamMembers } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { TeamSectionControl } from "@/components/admin/team-section-control";
import { deleteTeamMember } from "@/app/admin/actions/content";

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  const teamSection = await prisma.pageSection.findFirst({
    where: { sectionType: "team" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Team"
        description="Publish the “Meet the team” section and manage the people shown in it."
        actions={
          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New member
          </Link>
        }
      />
      <div className="mb-6">
        <TeamSectionControl initialVisible={teamSection?.isVisible ?? false} />
      </div>
      <AdminTable
        columns={[
          { key: "name", label: "Name", cell: (m) => <span className="font-medium">{m.name}</span> },
          { key: "role", label: "Role", cell: (m) => m.role || "—" },
          {
            key: "isVisible",
            label: "Visible",
            cell: (m) => (m.isVisible ? <Badge variant="success">Visible</Badge> : <Badge variant="muted">Hidden</Badge>),
          },
          { key: "sortOrder", label: "Order" },
        ]}
        rows={members}
        emptyLabel="No team members yet."
        actions={{
          edit: (m) => `/admin/team/${m.id}/edit`,
          delete: (m) => m.name,
          onDelete: deleteTeamMember,
        }}
      />
    </div>
  );
}