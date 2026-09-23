import { getNavigation } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { EntityForm } from "@/components/admin/entity-form";
import { TextField, SelectField, SwitchField } from "@/components/admin/fields";
import { Badge } from "@/components/ui/badge";
import { createNavItem, deleteNavItem } from "@/app/admin/actions/navigation";

export default async function AdminNavigationPage() {
  const items = await getNavigation();
  const parentOptions = [
    { value: "", label: "Top level" },
    ...items.map((i) => ({ value: i.id, label: i.label })),
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminPageHeader
        title="Navigation"
        description="The main menu. Order with the sort number — smaller first."
      />
      <AdminTable
        columns={[
          {
            key: "label",
            label: "Label",
            cell: (n) => (
              <span className="font-medium">
                {n.parentId ? <span className="text-muted-foreground">↳ </span> : null}
                {n.label}
              </span>
            ),
          },
          { key: "url", label: "URL", cell: (n) => <code className="text-xs">{n.url}</code> },
          {
            key: "isExternal",
            label: "External",
            cell: (n) => (n.isExternal ? <Badge>External</Badge> : <span className="text-muted-foreground">—</span>),
          },
          {
            key: "isVisible",
            label: "Visible",
            cell: (n) => (n.isVisible ? <Badge variant="success">Visible</Badge> : <Badge variant="muted">Hidden</Badge>),
          },
          { key: "sortOrder", label: "Order" },
        ]}
        rows={items}
        emptyLabel="No menu items yet."
        actions={{
          edit: (n) => `/admin/navigation/${n.id}/edit`,
          delete: (n) => n.label,
          onDelete: deleteNavItem,
        }}
      />
      <section className="max-w-xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Add menu item
        </h2>
        <EntityForm action={createNavItem} submitLabel="Add item" cancelHref="/admin/navigation">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Label" name="label" placeholder="e.g. Services" required />
            <TextField label="URL" name="url" placeholder="/services" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Parent" name="parentId" options={parentOptions} />
            <TextField label="Sort order" name="sortOrder" type="number" defaultValue="0" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SwitchField label="Open in new tab" name="isExternal" />
            <SwitchField label="Visible on site" name="isVisible" defaultChecked />
          </div>
        </EntityForm>
      </section>
    </div>
  );
}