import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { asRecord, stringArray, text } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ProjectFields } from "@/components/admin/forms/project-fields";
import { updateProject } from "@/app/admin/actions/content";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const [media] = await Promise.all([getMedia()]);
  const record = asRecord(project);

  return (
    <div>
      <AdminPageHeader
        title={`Edit · ${project.name}`}
        back={{ href: "/admin/projects", label: "Projects" }}
      />
      <EntityForm
        action={updateProject.bind(null, project.id)}
        submitLabel="Save changes"
        cancelHref="/admin/projects"
      >
        <ProjectFields
          media={media}
          defaults={{
            name: project.name,
            slug: project.slug,
            client: text(record.client),
            industry: text(record.industry),
            projectType: text(record.projectType),
            shortDescription: project.shortDescription,
            problem: text(record.problem),
            solution: text(record.solution),
            outcome: text(record.outcome),
            coverImage: text(record.coverImage),
            gallery: stringArray(project.gallery),
            technology: stringArray(project.technology),
            serviceProvided: text(record.serviceProvided),
            projectUrl: text(record.projectUrl),
            completionDate: project.completionDate
              ? new Date(project.completionDate).toISOString().slice(0, 10)
              : "",
            featured: project.featured,
            articleUrl: text(record.articleUrl),
            seoTitle: text(project.seoTitle),
            seoDescription: text(project.seoDescription),
            status: project.status,
          }}
        />
      </EntityForm>
    </div>
  );
}