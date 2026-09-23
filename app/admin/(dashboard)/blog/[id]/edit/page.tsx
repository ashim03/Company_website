import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBlogCategories, getMedia } from "@/lib/admin-queries";
import { text } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { BlogFields } from "@/components/admin/forms/blog-fields";
import { updatePost } from "@/app/admin/actions/blog";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: { category: true, tags: true },
  });
  if (!post) notFound();

  const [categories, media] = await Promise.all([getBlogCategories(), getMedia()]);

  return (
    <div>
      <AdminPageHeader
        title={`Edit · ${post.title}`}
        back={{ href: "/admin/blog", label: "Insights" }}
      />
      <EntityForm
        action={updatePost.bind(null, post.id)}
        submitLabel="Save changes"
        cancelHref="/admin/blog"
      >
        <BlogFields
          categories={categories}
          media={media}
          defaults={{
            title: post.title,
            slug: post.slug,
            excerpt: text(post.excerpt),
            content: post.content,
            coverImage: text(post.coverImage),
            authorName: text(post.authorName),
            categoryId: post.categoryId ?? "",
            tagNames: post.tags.map((t) => t.name),
            publishedAt: post.publishedAt ? post.publishedAt.toISOString() : "",
            status: post.status,
            featured: post.featured,
            seoTitle: text(post.seoTitle),
            seoDescription: text(post.seoDescription),
          }}
        />
      </EntityForm>
    </div>
  );
}