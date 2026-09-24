import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";
import { defaultSiteSettings } from "../lib/default-content";
const prisma = new PrismaClient();
async function main() {
  const row = await prisma.siteSetting.findUnique({ where: { key: "site" } });
  const stored = row?.value as Record<string, Prisma.JsonValue> | undefined;
  const social = (stored?.social ?? defaultSiteSettings.social) as Record<string, Prisma.JsonValue>;
  const demos = ["Facebook", "Instagram", "LinkedIn", "YouTube", "TikTok", "Reddit"].map(label => ({ label, url: `https://www.${label.toLowerCase()}.com/`, demo: true }));
  const value = { ...(stored ?? defaultSiteSettings), address: defaultSiteSettings.address, social: { ...social, extra: Array.isArray(social.extra) && social.extra.length ? social.extra : demos } };
  await prisma.siteSetting.upsert({ where: { key: "site" }, create: { key: "site", value }, update: { value } });
  console.log("Address updated; existing settings preserved.");
  console.log("Configured social profiles:", JSON.stringify(social ?? {}));
}
main().catch(() => { console.error("Address update failed."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
