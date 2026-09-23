import type { Media, Prisma } from "@prisma/client";
import { TextField, TextAreaField, SwitchField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";

export type TeamDefaults = {
  name?: string;
  role?: string;
  bio?: string;
  photo?: string;
  email?: string;
  socials?: Prisma.JsonValue | { linkedin?: string; twitter?: string; github?: string };
  sortOrder?: number;
  isVisible?: boolean;
};

function social(value: unknown, key: string): string {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const v = (value as Record<string, unknown>)[key];
    return typeof v === "string" ? v : "";
  }
  return "";
}

export function TeamFields({
  defaults = {},
  media = [],
}: {
  defaults?: TeamDefaults;
  media?: Media[];
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" defaultValue={defaults.name} required />
        <TextField label="Role" name="role" defaultValue={defaults.role} />
      </div>
      <MediaPicker label="Photo" name="photo" defaultUrl={defaults.photo} media={media} folder="team" />
      <TextAreaField label="Bio" name="bio" defaultValue={defaults.bio} rows={4} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Email" name="email" type="email" defaultValue={defaults.email} />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaults.sortOrder != null ? String(defaults.sortOrder) : "0"}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="LinkedIn" name="socialLinkedin" type="url" defaultValue={social(defaults.socials, "linkedin")} />
        <TextField label="Twitter" name="socialTwitter" type="url" defaultValue={social(defaults.socials, "twitter")} />
        <TextField label="GitHub" name="socialGithub" type="url" defaultValue={social(defaults.socials, "github")} />
      </div>
      <SwitchField
        label="Visible on site"
        name="isVisible"
        defaultChecked={defaults.isVisible ?? true}
      />
    </>
  );
}