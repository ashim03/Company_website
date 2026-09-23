import { getBlogCategories, getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { BlogFields } from "@/components/admin/forms/blog-fields";
import { createPost } from "@/app/admin/actions/blog";

export default async function NewBlogPostPage() {
  const [categories, media] = await Promise.all([getBlogCategories(), getMedia()]);
  return (
    <div>
      <AdminPageHeader title="New post" back={{ href: "/admin/blog", label: "Insights" }} />
      <EntityForm action={createPost} submitLabel="Create post" cancelHref="/admin/blog">
        <BlogFields categories={categories} media={media} />
      </EntityForm>
    </div>
  );
}