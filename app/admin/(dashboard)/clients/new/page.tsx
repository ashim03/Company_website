import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ClientFields } from "@/components/admin/forms/client-fields";
import { createClient } from "@/app/admin/actions/content";

export default async function NewClientPage() {
  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader title="New client" back={{ href: "/admin/clients", label: "Clients" }} />
      <EntityForm action={createClient} submitLabel="Create client" cancelHref="/admin/clients">
        <ClientFields media={media} />
      </EntityForm>
    </div>
  );
}