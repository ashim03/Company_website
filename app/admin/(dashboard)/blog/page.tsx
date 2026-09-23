import Link from "next/link";
import { Plus } from "lucide-react";
import { getBlogPosts, getBlogCategories } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { EntityForm } from "@/components/admin/entity-form";
import { TextField } from "@/components/admin/fields";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { createCategory, deleteCategory, deletePost } from "@/app/admin/actions/blog";

export default async function AdminBlogPage() {
  const [posts, categories] = await Promise.all([getBlogPosts(), getBlogCategories()]);
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Insights"
        description="Blog posts — shown on /insights."
        actions={
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New post
          </Link>
        }
      />

      <AdminTable
        columns={[
          { key: "title", label: "Title", cell: (p) => <span className="font-medium">{p.title}</span> },
          {
            key: "category",
            label: "Category",
            cell: (p) =>
              p.category ? <Badge variant="secondary">{p.category.name}</Badge> : <span className="text-muted-foreground">—</span>,
          },
          { key: "status", label: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          {
            key: "publishedAt",
            label: "Published",
            cell: (p) =>
              p.publishedAt ? (
                <span className="text-xs text-muted-foreground">{p.publishedAt.toLocaleDateString()}</span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              ),
          },
        ]}
        rows={posts}
        emptyLabel="No posts yet. Write your first insight."
        actions={{
          edit: (p) => `/admin/blog/${p.id}/edit`,
          view: (p) => `/insights/${p.slug}`,
          delete: (p) => p.title,
          onDelete: deletePost,
        }}
      />

      <section className="mt-10 max-w-xl">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Categories
        </h2>
        {categories.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
                {c.name}
                <DeleteButton
                  id={c.id}
                  action={deleteCategory}
                  label="Remove category"
                  confirmText={`Delete category "${c.name}"? Posts will become uncategorised.`}
                />
              </span>
            ))}
          </div>
        ) : null}
        <EntityForm action={createCategory} submitLabel="Add category" cancelHref="/admin/blog">
          <TextField label="Category name" name="name" placeholder="e.g. Engineering" required />
        </EntityForm>
      </section>
    </div>
  );
}