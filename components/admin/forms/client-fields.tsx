import type { Media } from "@prisma/client";
import { TextField, SwitchField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";

export type ClientDefaults = {
  name?: string;
  logo?: string;
  website?: string;
  industry?: string;
  sortOrder?: number;
  featured?: boolean;
  isVisible?: boolean;
};

export function ClientFields({
  defaults = {},
  media = [],
}: {
  defaults?: ClientDefaults;
  media?: Media[];
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" defaultValue={defaults.name} required />
        <TextField label="Industry" name="industry" defaultValue={defaults.industry} />
      </div>
      <MediaPicker label="Logo" name="logo" defaultUrl={defaults.logo} media={media} folder="clients" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Website" name="website" type="url" defaultValue={defaults.website} />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaults.sortOrder != null ? String(defaults.sortOrder) : "0"}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SwitchField label="Featured" name="featured" defaultChecked={defaults.featured} />
        <SwitchField
          label="Visible on site"
          name="isVisible"
          defaultChecked={defaults.isVisible ?? true}
          hint="Uncheck to hide this client."
        />
      </div>
    </>
  );
}