import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { TeamFields } from "@/components/admin/forms/team-fields";
import { createTeamMember } from "@/app/admin/actions/content";

export default async function NewTeamMemberPage() {
  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader title="New team member" back={{ href: "/admin/team", label: "Team" }} />
      <EntityForm action={createTeamMember} submitLabel="Create member" cancelHref="/admin/team">
        <TeamFields media={media} />
      </EntityForm>
    </div>
  );
}