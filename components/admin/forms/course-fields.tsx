import type { Media } from "@prisma/client";
import {
  TextField,
  TextAreaField,
  ListField,
  SelectField,
} from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "—" },
  { value: "IT & Digital Skills", label: "IT & Digital Skills" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "Data & AI", label: "Data & AI" },
];

export type CourseDefaults = {
  name?: string;
  slug?: string;
  category?: string;
  level?: string;
  duration?: string;
  mode?: string;
  shortDescription?: string;
  description?: string;
  syllabus?: string[];
  prerequisites?: string[];
  price?: string;
  coverImage?: string;
  status?: string;
  sortOrder?: number;
};

export function CourseFields({
  defaults = {},
  media = [],
}: {
  defaults?: CourseDefaults;
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
        <SelectField
          label="Category"
          name="category"
          defaultValue={defaults.category ?? ""}
          options={CATEGORY_OPTIONS}
        />
        <TextField label="Level" name="level" defaultValue={defaults.level} placeholder="Beginner, Intermediate, Advanced" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Duration" name="duration" defaultValue={defaults.duration} placeholder="e.g. 8 weeks · 2 sessions/week" />
        <TextField label="Mode" name="mode" defaultValue={defaults.mode} placeholder="Online, On-campus, Hybrid" />
      </div>
      <TextAreaField
        label="Short description"
        name="shortDescription"
        defaultValue={defaults.shortDescription}
        rows={3}
        required
        hint="One or two sentences shown on the Classes page card."
      />
      <TextAreaField
        label="Full details"
        name="description"
        defaultValue={defaults.description}
        rows={10}
        hint="Longer course details shown when a visitor expands a course."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Fee" name="price" defaultValue={defaults.price} placeholder="e.g. NPR 35,000" />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaults.sortOrder != null ? String(defaults.sortOrder) : "0"}
        />
      </div>
      <MediaPicker
        label="Cover image (optional)"
        name="coverImage"
        defaultUrl={defaults.coverImage}
        media={media}
        folder="courses"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <ListField
          label="Syllabus / topics"
          name="syllabus"
          defaultValue={defaults.syllabus}
          hint="One topic per line — shown as tags on the card."
        />
        <ListField
          label="Prerequisites / who it's for"
          name="prerequisites"
          defaultValue={defaults.prerequisites}
        />
      </div>
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