import "server-only";
import { prisma } from "@/lib/prisma";
import { vacancySchema, type Vacancy } from "@/lib/careers-schema";

export async function getVacancies(): Promise<Vacancy[]> {
  const records = await prisma.siteSetting.findMany({ where: { key: { startsWith: "vacancy:" } }, orderBy: { updatedAt: "desc" } });
  return records.flatMap(record => {
    const parsed = vacancySchema.safeParse(record.value);
    return parsed.success ? [{ ...parsed.data, id: record.id }] : [];
  });
}
