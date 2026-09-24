import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  await prisma.$transaction(async tx => {
    if (await tx.navigationItem.findFirst({ where: { url: "/careers" } })) return;
    const contact = await tx.navigationItem.findFirst({ where: { url: "/contact", parentId: null } });
    const position = contact?.sortOrder ?? 7;
    await tx.navigationItem.updateMany({ where: { parentId: null, sortOrder: { gte: position } }, data: { sortOrder: { increment: 1 } } });
    await tx.navigationItem.create({ data: { label: "Careers", url: "/careers", sortOrder: position, isVisible: true } });
  });
  console.log("Careers navigation configured; existing content preserved.");
}
main().catch(() => { console.error("Navigation update failed."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
