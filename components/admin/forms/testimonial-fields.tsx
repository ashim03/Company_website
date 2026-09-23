import type { Media } from "@prisma/client";
import { TextField, TextAreaField, SwitchField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";

export type TestimonialDefaults = {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: string;
  source?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export function TestimonialFields({
  defaults = {},
  media = [],
}: {
  defaults?: TestimonialDefaults;
  media?: Media[];
}) {
  return (
    <>
      <TextAreaField label="Quote" name="quote" defaultValue={defaults.quote} rows={5} required />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="Author" name="author" defaultValue={defaults.author} />
        <TextField label="Role" name="role" defaultValue={defaults.role} />
        <TextField label="Company" name="company" defaultValue={defaults.company} />
      </div>
      <MediaPicker label="Avatar" name="avatar" defaultUrl={defaults.avatar} media={media} folder="testimonials" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Source"
          name="source"
          defaultValue={defaults.source}
          hint="Optional — project or client this quote relates to."
        />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaults.sortOrder != null ? String(defaults.sortOrder) : "0"}
        />
      </div>
      <SwitchField
        label="Visible on site"
        name="isVisible"
        defaultChecked={defaults.isVisible ?? true}
      />
    </>
  );
}