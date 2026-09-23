import { getUsers } from "@/lib/admin-queries";
import { getSession } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { EntityForm } from "@/components/admin/entity-form";
import { TextField, SelectField } from "@/components/admin/fields";
import { createUser, deleteUser } from "@/app/admin/actions/users";

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), getSession()]);
  const isAdmin = session?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <AdminPageHeader
        title="Users"
        description={isAdmin ? "People who can sign in to this CMS." : "Only administrators can manage users."}
      />
      <AdminTable
        columns={[
          { key: "name", label: "Name", cell: (u) => <span className="font-medium">{u.name}</span> },
          { key: "email", label: "Email", cell: (u) => <span className="text-sm">{u.email}</span> },
          { key: "role", label: "Role", cell: (u) => <StatusBadge status={u.role} tone="role" /> },
          { key: "status", label: "Status", cell: (u) => <StatusBadge status={u.status} tone="user" /> },
          {
            key: "lastLoginAt",
            label: "Last login",
            cell: (u) =>
              u.lastLoginAt ? (
                <span className="text-xs text-muted-foreground">{u.lastLoginAt.toLocaleDateString()}</span>
              ) : (
                <span className="text-xs text-muted-foreground">Never</span>
              ),
          },
        ]}
        rows={users}
        emptyLabel="No users yet."
        actions={
          isAdmin
            ? {
                edit: (u) => `/admin/users/${u.id}/edit`,
                delete: (u) => u.email,
                onDelete: deleteUser,
              }
            : undefined
        }
      />
      {isAdmin ? (
        <section className="max-w-xl">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Add user
          </h2>
          <EntityForm action={createUser} submitLabel="Create user" cancelHref="/admin/users">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" name="name" required />
              <TextField label="Email" name="email" type="email" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Password" name="password" type="password" required min={10} hint="At least 10 characters." />
              <SelectField
                label="Role"
                name="role"
                defaultValue="EDITOR"
                options={[
                  { value: "ADMIN", label: "Administrator" },
                  { value: "EDITOR", label: "Editor" },
                ]}
              />
            </div>
          </EntityForm>
        </section>
      ) : null}
    </div>
  );
}