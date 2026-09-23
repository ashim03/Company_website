import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { text } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { TeamFields } from "@/components/admin/forms/team-fields";
import { updateTeamMember } from "@/app/admin/actions/content";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader
        title={`Edit · ${member.name}`}
        back={{ href: "/admin/team", label: "Team" }}
      />
      <EntityForm
        action={updateTeamMember.bind(null, member.id)}
        submitLabel="Save changes"
        cancelHref="/admin/team"
      >
        <TeamFields
          media={media}
          defaults={{
            name: member.name,
            role: text(member.role),
            bio: text(member.bio),
            photo: text(member.photo),
            email: text(member.email),
            socials: member.socials ?? undefined,
            sortOrder: member.sortOrder,
            isVisible: member.isVisible,
          }}
        />
      </EntityForm>
    </div>
  );
}