import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { TextField, SelectField } from "@/components/admin/fields";
import { updateUser, changePassword } from "@/app/admin/actions/users";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/admin");

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div className="space-y-10">
      <AdminPageHeader title={`Edit · ${user.name}`} back={{ href: "/admin/users", label: "Users" }} />
      <EntityForm
        action={updateUser.bind(null, user.id)}
        submitLabel="Save changes"
        cancelHref="/admin/users"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" name="name" defaultValue={user.name} required />
          <TextField label="Email" name="email" type="email" defaultValue={user.email} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            label="Role"
            name="role"
            defaultValue={user.role}
            options={[
              { value: "ADMIN", label: "Administrator" },
              { value: "EDITOR", label: "Editor" },
            ]}
          />
          <SelectField
            label="Status"
            name="status"
            defaultValue={user.status}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "DISABLED", label: "Disabled" },
            ]}
          />
          <TextField
            label="New password"
            name="password"
            type="password"
            hint="Leave blank to keep the current password."
            min={10}
          />
        </div>
      </EntityForm>

      <section className="max-w-xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Change my password
        </h2>
        <EntityForm action={changePassword} submitLabel="Update password" cancelHref="/admin/users">
          <TextField label="Current password" name="currentPassword" type="password" required />
          <TextField label="New password" name="newPassword" type="password" required min={10} hint="At least 10 characters." />
        </EntityForm>
      </section>
    </div>
  );
}