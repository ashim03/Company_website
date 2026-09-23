import type { Media } from "@prisma/client";
import {
  TextField,
  TextAreaField,
  ListField,
  SelectField,
} from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { SERVICE_ICONS } from "@/lib/constants";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export type ServiceDefaults = {
  name?: string;
  slug?: string;
  shortDescription?: string;
  fullDescription?: string;
  icon?: string;
  coverImage?: string;
  gallery?: string[];
  benefits?: string[];
  features?: string[];
  technologies?: string[];
  relatedProjectIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
  sortOrder?: number;
};

export function ServiceFields({
  defaults = {},
  media = [],
}: {
  defaults?: ServiceDefaults;
  media?: Media[];
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" defaultValue={defaults.name} required />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={defaults.slug}
          hint="Leave empty to auto-generate from the name."
        />
      </div>
      <TextAreaField
        label="Short description"
        name="shortDescription"
        defaultValue={defaults.shortDescription}
        rows={3}
        required
        hint="One or two sentences shown on cards and list pages."
      />
      <TextAreaField
        label="Full description"
        name="fullDescription"
        defaultValue={defaults.fullDescription}
        rows={12}
        required
        hint="Long-form page copy. Markdown supported."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Icon"
          name="icon"
          defaultValue={defaults.icon}
          options={SERVICE_ICONS.map((k) => ({ value: k, label: k }))}
        />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaults.sortOrder != null ? String(defaults.sortOrder) : "0"}
        />
      </div>
      <MediaPicker
        label="Cover image"
        name="coverImage"
        defaultUrl={defaults.coverImage}
        media={media}
        folder="services"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ListField label="Benefits" name="benefits" defaultValue={defaults.benefits} />
        <ListField label="Features" name="features" defaultValue={defaults.features} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ListField label="Technologies" name="technologies" defaultValue={defaults.technologies} />
        <ListField
          label="Gallery (image URLs)"
          name="gallery"
          defaultValue={defaults.gallery}
          hint="One image URL per line."
        />
      </div>
      <ListField
        label="Related projects (IDs)"
        name="relatedProjectIds"
        defaultValue={defaults.relatedProjectIds}
        hint="Optional — one project ID per line."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Status"
          name="status"
          defaultValue={defaults.status ?? "DRAFT"}
          options={STATUS_OPTIONS}
          required
        />
        <TextField
          label="SEO title"
          name="seoTitle"
          defaultValue={defaults.seoTitle}
        />
      </div>
      <TextField label="SEO description" name="seoDescription" defaultValue={defaults.seoDescription} />
    </>
  );
}