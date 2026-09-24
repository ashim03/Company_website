import { z } from "zod";

export const vacancySchema = z.object({
  title: z.string().trim().min(2).max(160),
  department: z.string().trim().max(100),
  location: z.string().trim().min(2).max(160),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
  description: z.string().trim().min(20).max(12000),
  requirements: z.string().trim().max(12000),
  deadline: z.string().refine(v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v, "Enter a valid deadline."),
  applicationUrl: z.string().trim().max(2000).refine(v => !v || /^https?:\/\//i.test(v) && URL.canParse(v), "Application link must start with https:// or http://."),
});
export type Vacancy = z.infer<typeof vacancySchema> & { id: string };
export function isOpenVacancy(vacancy: Vacancy, now = Date.now()) {
  return vacancy.status === "PUBLISHED" && (!vacancy.deadline || now <= Date.parse(`${vacancy.deadline}T23:59:59.999+05:45`));
}
