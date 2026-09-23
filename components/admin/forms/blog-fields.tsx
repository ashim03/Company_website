import type { Media, BlogCategory } from "@prisma/client";
import { TextField, TextAreaField, SelectField, SwitchField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export type BlogDefaults = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  authorName?: string;
  categoryId?: string;
  tagNames?: string[];
  publishedAt?: string;
  status?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export function BlogFields({
  defaults = {},
  categories = [],
  media = [],
}: {
  defaults?: BlogDefaults;
  categories?: BlogCategory[];
  media?: Media[];
}) {
  const publishedAt =
    defaults.publishedAt && !isNaN(Date.parse(defaults.publishedAt))
      ? new Date(defaults.publishedAt).toISOString().slice(0, 10)
      : "";
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Title" name="title" defaultValue={defaults.title} required />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={defaults.slug}
          hint="Leave empty to auto-generate from the title."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Category"
          name="categoryId"
          defaultValue={defaults.categoryId ?? ""}
          options={[
            { value: "", label: "Uncategorised" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <TextField label="Author name" name="authorName" defaultValue={defaults.authorName} />
      </div>
      <TextAreaField label="Excerpt" name="excerpt" defaultValue={defaults.excerpt} rows={3} />
      <TextAreaField
        label="Content"
        name="content"
        defaultValue={defaults.content}
        rows={16}
        required
        hint="Markdown supported — headings, lists, images, and blockquotes."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <MediaPicker label="Cover image" name="coverImage" defaultUrl={defaults.coverImage} media={media} folder="blog" />
        <TextField label="Tags" name="tagNames" defaultValue={(defaults.tagNames ?? []).join("\n")} hint="One tag per line." />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="Publish date" name="publishedAt" type="date" defaultValue={publishedAt} />
        <SelectField
          label="Status"
          name="status"
          defaultValue={defaults.status ?? "DRAFT"}
          options={STATUS_OPTIONS}
          required
        />
        <SwitchField label="Featured" name="featured" defaultChecked={defaults.featured} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="SEO title" name="seoTitle" defaultValue={defaults.seoTitle} />
        <TextField label="SEO description" name="seoDescription" defaultValue={defaults.seoDescription} />
      </div>
    </>
  );
}