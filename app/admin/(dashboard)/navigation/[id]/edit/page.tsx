import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getNavigation } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { TextField, SelectField, SwitchField } from "@/components/admin/fields";
import { updateNavItem } from "@/app/admin/actions/navigation";

export default async function EditNavItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, items] = await Promise.all([
    prisma.navigationItem.findUnique({ where: { id } }),
    getNavigation(),
  ]);
  if (!item) notFound();

  const parentOptions = [
    { value: "", label: "Top level" },
    ...items.filter((i) => i.id !== item.id).map((i) => ({ value: i.id, label: i.label })),
  ];

  return (
    <div>
      <AdminPageHeader title={`Edit · ${item.label}`} back={{ href: "/admin/navigation", label: "Navigation" }} />
      <EntityForm
        action={updateNavItem.bind(null, item.id)}
        submitLabel="Save changes"
        cancelHref="/admin/navigation"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Label" name="label" defaultValue={item.label} required />
          <TextField label="URL" name="url" defaultValue={item.url} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Parent" name="parentId" options={parentOptions} defaultValue={item.parentId ?? ""} />
          <TextField label="Sort order" name="sortOrder" type="number" defaultValue={String(item.sortOrder)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SwitchField
            label="Open in new tab"
            name="isExternal"
            defaultChecked={item.isExternal}
          />
          <SwitchField label="Visible on site" name="isVisible" defaultChecked={item.isVisible} />
        </div>
      </EntityForm>
    </div>
  );
}