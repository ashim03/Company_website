import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { asRecord, stringArray } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ServiceFields } from "@/components/admin/forms/service-fields";
import { updateService } from "@/app/admin/actions/content";
import { text } from "@/lib/types";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  const [media] = await Promise.all([getMedia()]);
  const gallery = stringArray(service.gallery);
  const benefits = stringArray(service.benefits);
  const features = stringArray(service.features);
  const technologies = stringArray(service.technologies);
  const relatedProjectIds = stringArray(service.relatedProjectIds);
  const record = asRecord(service);

  return (
    <div>
      <AdminPageHeader
        title={`Edit · ${service.name}`}
        back={{ href: "/admin/services", label: "Services" }}
      />
      <EntityForm
        action={updateService.bind(null, service.id)}
        submitLabel="Save changes"
        cancelHref="/admin/services"
      >
        <ServiceFields
          media={media}
          defaults={{
            name: service.name,
            slug: service.slug,
            shortDescription: service.shortDescription,
            fullDescription: service.fullDescription,
            icon: text(record.icon),
            coverImage: text(record.coverImage),
            gallery,
            benefits,
            features,
            technologies,
            relatedProjectIds,
            seoTitle: text(service.seoTitle),
            seoDescription: text(service.seoDescription),
            status: service.status,
            sortOrder: service.sortOrder,
          }}
        />
      </EntityForm>
    </div>
  );
}