import type { Media } from "@prisma/client";
import { TextField, TextAreaField, ListField, SelectField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export type ProductDefaults = {
  name?: string;
  slug?: string;
  logo?: string;
  tagline?: string;
  shortDescription?: string;
  detailedDescription?: string;
  screenshots?: string[];
  features?: string[];
  technology?: string;
  websiteUrl?: string;
  ctaLabel?: string;
  status?: string;
  sortOrder?: number;
};

export function ProductFields({
  defaults = {},
  media = [],
}: {
  defaults?: ProductDefaults;
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
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Tagline" name="tagline" defaultValue={defaults.tagline} />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaults.sortOrder != null ? String(defaults.sortOrder) : "0"}
        />
      </div>
      <MediaPicker label="Logo" name="logo" defaultUrl={defaults.logo} media={media} folder="products" />
      <TextAreaField
        label="Short description"
        name="shortDescription"
        defaultValue={defaults.shortDescription}
        rows={3}
        required
      />
      <TextAreaField
        label="Detailed description"
        name="detailedDescription"
        defaultValue={defaults.detailedDescription}
        rows={8}
        hint="Used on the product page. Markdown supported."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ListField label="Features" name="features" defaultValue={defaults.features} />
        <ListField label="Screenshots (URLs)" name="screenshots" defaultValue={defaults.screenshots} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Technology" name="technology" defaultValue={defaults.technology} hint="Comma-separated." />
        <TextField label="CTA label" name="ctaLabel" defaultValue={defaults.ctaLabel} hint="e.g. Visit BridgeLabs" />
      </div>
      <TextField label="Website URL" name="websiteUrl" type="url" defaultValue={defaults.websiteUrl} />
      <SelectField
        label="Status"
        name="status"
        defaultValue={defaults.status ?? "DRAFT"}
        options={STATUS_OPTIONS}
        required
      />
    </>
  );
}