import type { Media } from "@prisma/client";
import { TextField, TextAreaField, ListField, SelectField, SwitchField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export type ProjectDefaults = {
  name?: string;
  slug?: string;
  client?: string;
  industry?: string;
  projectType?: string;
  shortDescription?: string;
  problem?: string;
  solution?: string;
  outcome?: string;
  coverImage?: string;
  gallery?: string[];
  technology?: string[];
  serviceProvided?: string;
  projectUrl?: string;
  completionDate?: string;
  featured?: boolean;
  articleUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
};

export function ProjectFields({
  defaults = {},
  media = [],
}: {
  defaults?: ProjectDefaults;
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
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="Client" name="client" defaultValue={defaults.client} />
        <TextField label="Industry" name="industry" defaultValue={defaults.industry} />
        <TextField label="Project type" name="projectType" defaultValue={defaults.projectType} hint="e.g. Web app" />
      </div>
      <TextAreaField
        label="Short description"
        name="shortDescription"
        defaultValue={defaults.shortDescription}
        rows={3}
        required
      />
      <MediaPicker label="Cover image" name="coverImage" defaultUrl={defaults.coverImage} media={media} folder="projects" />
      <ListField label="Gallery (URLs)" name="gallery" defaultValue={defaults.gallery} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextAreaField label="The problem" name="problem" defaultValue={defaults.problem} rows={5} />
        <TextAreaField label="The solution" name="solution" defaultValue={defaults.solution} rows={5} />
      </div>
      <TextAreaField label="The outcome" name="outcome" defaultValue={defaults.outcome} rows={5} />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Services provided"
          name="serviceProvided"
          defaultValue={defaults.serviceProvided}
          hint="Comma-separated."
        />
        <TextField label="Project URL" name="projectUrl" type="url" defaultValue={defaults.projectUrl} />
        <TextField
          label="Completion date"
          name="completionDate"
          type="date"
          defaultValue={defaults.completionDate}
        />
      </div>
      <ListField label="Technology" name="technology" defaultValue={defaults.technology} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Case study article URL" name="articleUrl" type="url" defaultValue={defaults.articleUrl} />
        <TextField label="SEO title" name="seoTitle" defaultValue={defaults.seoTitle} />
      </div>
      <TextField label="SEO description" name="seoDescription" defaultValue={defaults.seoDescription} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Status"
          name="status"
          defaultValue={defaults.status ?? "DRAFT"}
          options={STATUS_OPTIONS}
          required
        />
        <SwitchField label="Featured" name="featured" defaultChecked={defaults.featured} hint="Shown first on /work." />
      </div>
    </>
  );
}