import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { text } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ClientFields } from "@/components/admin/forms/client-fields";
import { updateClient } from "@/app/admin/actions/content";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader
        title={`Edit · ${client.name}`}
        back={{ href: "/admin/clients", label: "Clients" }}
      />
      <EntityForm
        action={updateClient.bind(null, client.id)}
        submitLabel="Save changes"
        cancelHref="/admin/clients"
      >
        <ClientFields
          media={media}
          defaults={{
            name: client.name,
            logo: text(client.logo),
            website: text(client.website),
            industry: text(client.industry),
            sortOrder: client.sortOrder,
            featured: client.featured,
            isVisible: client.isVisible,
          }}
        />
      </EntityForm>
    </div>
  );
}