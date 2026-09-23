import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ProjectFields } from "@/components/admin/forms/project-fields";
import { createProject } from "@/app/admin/actions/content";

export default async function NewProjectPage() {
  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader title="New project" back={{ href: "/admin/projects", label: "Projects" }} />
      <EntityForm action={createProject} submitLabel="Create project" cancelHref="/admin/projects">
        <ProjectFields media={media} />
      </EntityForm>
    </div>
  );
}