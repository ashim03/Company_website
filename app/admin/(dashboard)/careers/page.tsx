import Link from "next/link";
import { getVacancies } from "@/lib/careers";
import { saveVacancy, deleteVacancy } from "@/app/admin/actions/careers";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { EntityForm } from "@/components/admin/entity-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminCareers({ searchParams }: { searchParams: Promise<{ edit?: string; ok?: string }> }) {
  const params = await searchParams;
  const vacancies = await getVacancies();
  const vacancy = vacancies.find(v => v.id === params.edit);
  return <div className="mx-auto max-w-5xl space-y-8">
    <AdminPageHeader title="Careers" description="Create vacancies, publish openings, and close roles when hiring ends. Expired roles are hidden automatically." actions={<Link href="/careers" className="text-sm text-primary">View careers page ↗</Link>} />
    {params.ok && <p role="status" className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm">Vacancy saved.</p>}
    <AdminTable rows={vacancies} columns={[
      { key: "title", label: "Role" }, { key: "status", label: "Status" }, { key: "location", label: "Location" }, { key: "deadline", label: "Deadline" },
    ]} emptyLabel="No vacancies yet. Create your first role below." actions={{ edit: v => `/admin/careers?edit=${v.id}#vacancy-form`, delete: v => v.title, onDelete: deleteVacancy }} />
    <section id="vacancy-form" className="scroll-mt-24 rounded-xl border bg-card p-5 sm:p-7">
      <h2 className="mb-5 text-xl font-semibold">{vacancy ? `Edit ${vacancy.title}` : "New vacancy"}</h2>
      <EntityForm key={vacancy?.id || "new"} action={saveVacancy} submitLabel="Save vacancy" cancelHref="/admin/careers">
        <input type="hidden" name="id" value={vacancy?.id || ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          {([{ name: "title", label: "Role title", required: true }, { name: "department", label: "Department" }, { name: "location", label: "Location / work arrangement", required: true }, { name: "deadline", label: "Application deadline (Nepal time)", type: "date" }] as const).map(field => <div key={field.name} className="space-y-2"><Label htmlFor={field.name}>{field.label}</Label><Input id={field.name} name={field.name} type={"type" in field ? field.type : "text"} required={"required" in field && field.required} defaultValue={vacancy?.[field.name] || (field.name === "location" ? "Chhetrapati–17, Kathmandu" : "")} /></div>)}
          <div className="space-y-2"><Label htmlFor="type">Employment type</Label><select id="type" name="type" defaultValue={vacancy?.type || "Full-time"} className="h-10 w-full rounded-md border bg-background px-3 text-sm">{["Full-time", "Part-time", "Contract", "Internship"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="status">Publication status</Label><select id="status" name="status" defaultValue={vacancy?.status || "DRAFT"} className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="DRAFT">Draft — only visible here</option><option value="PUBLISHED">Published — open for applications</option><option value="CLOSED">Closed — hidden from website</option></select></div>
        </div>
        <div className="space-y-2"><Label htmlFor="description">Role description and responsibilities</Label><Textarea id="description" name="description" required minLength={20} rows={6} defaultValue={vacancy?.description} /></div>
        <div className="space-y-2"><Label htmlFor="requirements">Requirements (one per line)</Label><Textarea id="requirements" name="requirements" rows={5} defaultValue={vacancy?.requirements} /></div>
        <div className="space-y-2"><Label htmlFor="applicationUrl">Application form URL (optional)</Label><Input id="applicationUrl" name="applicationUrl" type="url" placeholder="https://…" defaultValue={vacancy?.applicationUrl} /><p className="text-xs text-muted-foreground">Leave blank to receive applications at the primary company email in Site settings. No deadline means the role stays open until you close it.</p></div>
      </EntityForm>
    </section>
  </div>;
}
