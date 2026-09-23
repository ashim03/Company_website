import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ServiceFields } from "@/components/admin/forms/service-fields";
import { createService } from "@/app/admin/actions/content";

export default async function NewServicePage() {
  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader title="New service" back={{ href: "/admin/services", label: "Services" }} />
      <EntityForm action={createService} submitLabel="Create service" cancelHref="/admin/services">
        <ServiceFields media={media} />
      </EntityForm>
    </div>
  );
}