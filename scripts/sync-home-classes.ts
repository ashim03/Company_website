import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { defaultHomeSections } from "../lib/default-content";

// Targeted copy update: preserve all unrelated CMS content and section order.
const prisma = new PrismaClient();
async function main() {
  const section = await prisma.pageSection.findFirst({
    where: { page: { slug: "home" }, sectionType: "classes" },
  });
  if (!section) throw new Error("Home Classes section is missing.");
  const defaults = defaultHomeSections().find((item) => item.sectionType === "classes")!.content;
  const content = (section.content ?? {}) as Record<string, Prisma.JsonValue>;
  for (const key of ["sectionEyebrow", "sectionTitle", "sectionDescription", "title", "description"]) {
    content[key] = defaults[key] as string;
  }
  await prisma.pageSection.update({ where: { id: section.id }, data: { content: content as Prisma.InputJsonValue } });
  console.log("Updated the homepage Classes heading and card copy.");
}
main().catch(() => { console.error("Classes sync failed."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
