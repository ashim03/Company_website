import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { text } from "@/lib/types";
import {
  SECTION_TYPES,
  SECTION_TYPE_LABELS,
} from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import {
  TextField,
  TextAreaField,
  SelectField,
  SwitchField,
} from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { SectionMover } from "@/components/admin/section-mover";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  updatePageMeta,
  updateSection,
  deleteSection,
  addSection,
} from "@/app/admin/actions/pages";

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const SECTION_TYPE_OPTIONS = SECTION_TYPES.map((t) => ({
  value: t,
  label: SECTION_TYPE_LABELS[t] ?? t,
}));

const SECTION_CONTENT_GUIDES: Record<string, string> = {
  hero: '{\n  "eyebrow": "…",\n  "headline": "…",\n  "subtitle": "…",\n  "primaryCta": { "label": "…", "href": "/contact" },\n  "secondaryCta": { "label": "…", "href": "/work" },\n  "image": "…url…",\n  "imageAlt": "…",\n  "stats": [{ "value": "…", "label": "…" }]\n}',
  cta: '{\n  "title": "…",\n  "subtitle": "…",\n  "primaryCta": { "label": "…", "href": "/contact" },\n  "secondaryCta": { "label": "…", "href": "/work" }\n}',
  stats: '{\n  "title": "…",\n  "subtitle": "…",\n  "items": [{ "label": "…", "value": "…" }]\n}',
  process: '{\n  "title": "…",\n  "subtitle": "…",\n  "steps": [{ "title": "…", "description": "…" }]\n}',
  why: '{\n  "title": "…",\n  "subtitle": "…",\n  "points": ["…", "…"]\n}',
  intro: '{\n  "title": "…",\n  "subtitle": "…",\n  "description": "…",\n  "items": ["…", "…"]\n}',
  content: '{\n  "body": "Markdown text.…",\n  "blocks": [{ "title": "…", "body": "…" }]\n}',
  clients:
    '{\n  "title": "…",\n  "subtitle": "…"\n}\n// Client logos come from the Clients section of the CMS.',
  services:
    '{\n  "eyebrow": "…",\n  "title": "…",\n  "description": "…",\n  "items": [{ "title": "…", "icon": "…", "points": ["…"] }]\n}\n// No "items": the curated 6 pillars are used. Pillars cover marketing, design, social media, web & software, IT, and classes.',
  promo:
    '{\n  "eyebrow": "…",\n  "title": "…",\n  "description": "…",\n  "icon": "trending-up",\n  "points": ["…", "…"],\n  "primaryCta": { "label": "…", "href": "/services" }\n}\n// Spotlight band: icon keys are the same as services icons.',
  classes:
    '{\n  "eyebrow": "…",\n  "title": "Learn. Build. Grow.",\n  "description": "…",\n  "points": ["IT and digital skills", "…"],\n  "primaryCta": { "label": "Explore Our Classes", "href": "/services" }\n}',
  products:
    '{\n  "title": "…",\n  "subtitle": "…",\n  "cta": { "label": "…", "href": "/products" }\n}\n// Cards come from the Products section of the CMS.',
  projects:
    '{\n  "title": "…",\n  "subtitle": "…",\n  "cta": { "label": "…", "href": "/work" }\n}\n// Cards come from the Projects section of the CMS.',
  testimonials:
    '{\n  "title": "…",\n  "subtitle": "…"\n}\n// Quotes come from the Testimonials section of the CMS.',
  team: '{\n  "title": "…",\n  "subtitle": "…"\n}\n// Members come from the Team section of the CMS.',
  faqs: '{\n  "title": "…",\n  "subtitle": "…"\n}\n// Questions come from the FAQs section of the CMS.',
  blog: '{\n  "title": "…",\n  "subtitle": "…"\n}\n// Posts come from the Insights section of the CMS.',
};

function prettyJson(value: unknown): string {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });
  if (!page) notFound();

  const media = await getMedia();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title={`Edit · ${page.title}`}
        back={{ href: "/admin/pages", label: "Pages" }}
        actions={
          <Link
            href={page.slug === "home" ? "/" : `/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View page →
          </Link>
        }
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Page details
        </h2>
        <EntityForm
          action={updatePageMeta.bind(null, page.id)}
          submitLabel="Save page details"
          cancelHref="/admin/pages"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Title" name="title" defaultValue={page.title} required />
            <TextField label="Slug" name="slug" defaultValue={page.slug} required />
          </div>
          <TextAreaField label="Description" name="description" defaultValue={text(page.description)} rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Meta title" name="metaTitle" defaultValue={text(page.metaTitle)} />
            <TextField label="Meta description" name="metaDescription" defaultValue={text(page.metaDescription)} />
          </div>
          <MediaPicker
            label="Social share image"
            name="ogImage"
            defaultUrl={text(page.ogImage)}
            media={media}
            folder="pages"
          />
          <SelectField
            label="Status"
            name="status"
            defaultValue={page.status}
            options={STATUS_OPTIONS}
            required
          />
        </EntityForm>
      </section>

      <section id="sections">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Sections ({page.sections.length})
          </h2>
        </div>

        {page.sections.length === 0 ? (
          <p className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            This page has no sections yet.
          </p>
        ) : (
          <div className="space-y-4">
            {page.sections.map((section) => (
              <div key={section.id} className="rounded-lg border bg-card">
                <EntityForm
                  action={updateSection.bind(null, section.id)}
                  submitLabel="Save section"
                  cancelHref={`/admin/pages/${page.id}/edit#sections`}
                >
                  <div className="mb-4 flex items-center justify-between gap-2 border-b px-4 pt-4">
                    <div className="min-w-0">
                      <SelectField
                        label=""
                        name="sectionType"
                        defaultValue={section.sectionType}
                        options={SECTION_TYPE_OPTIONS}
                        className="mb-0"
                      />
                    </div>
                    <div className="flex shrink-0 items-center">
                      <SectionMover id={section.id} direction="up" />
                      <SectionMover id={section.id} direction="down" />
                      <DeleteButton
                        id={section.id}
                        action={deleteSection}
                        label="Remove section"
                        confirmText="Remove this section from the page?"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 px-4 pb-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField label="Title" name="title" defaultValue={text(section.title)} />
                      <TextField label="Subtitle" name="subtitle" defaultValue={text(section.subtitle)} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField
                        label="Sort order"
                        name="sortOrder"
                        type="number"
                        defaultValue={String(section.sortOrder)}
                      />
                      <SwitchField
                        label="Visible on site"
                        name="isVisible"
                        defaultChecked={section.isVisible}
                      />
                    </div>
                    <TextAreaField
                      label="Content (JSON)"
                      name="contentJson"
                      defaultValue={prettyJson(section.content)}
                      rows={8}
                      hint="Edit the JSON below. Examples…"
                      className="font-mono"
                    />
                    <details className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
                      <summary className="cursor-pointer font-medium text-foreground">
                        Content keys for “{SECTION_TYPE_LABELS[section.sectionType] ?? section.sectionType}”
                      </summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[11px]">
                        {SECTION_CONTENT_GUIDES[section.sectionType] ?? "{ \"title\": \"…\", \"subtitle\": \"…\" }"}
                      </pre>
                    </details>
                  </div>
                </EntityForm>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Add a section
        </h2>
        <EntityForm
          action={addSection}
          submitLabel="Add section"
          cancelHref={`/admin/pages/${page.id}/edit#sections`}
        >
          <input type="hidden" name="pageId" value={page.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Section type"
              name="sectionType"
              options={SECTION_TYPE_OPTIONS}
              required
            />
            <TextField label="Title" name="title" />
          </div>
          <TextField label="Subtitle" name="subtitle" />
          <TextAreaField
            label="Content (JSON, optional)"
            name="contentJson"
            rows={6}
            className="font-mono"
            hint="Leave empty to start with an empty section."
          />
        </EntityForm>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Notes
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Sections render in the order shown here. Collections (services, projects, posts, FAQs,
          clients, team, testimonials) are pulled from their own sections of the CMS and only need a
          “sectionType” — their cards are loaded automatically. For a section that pulls a
          collection, add only <code className="rounded bg-muted px-1">title</code> and{" "}
          <code className="rounded bg-muted px-1">subtitle</code>.
        </p>
      </section>
    </div>
  );
}