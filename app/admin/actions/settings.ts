"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll, toJson, formField, firstIssue } from "@/lib/admin";
import { settingsSchema } from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

const SITE_SETTING_KEY = "site";

export async function updateSettings(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  await requireSession();
  const parsed = settingsSchema.safeParse({
    companyName: formField(fd, "companyName"),
    legalName: formField(fd, "legalName"),
    tagline: formField(fd, "tagline"),
    description: formField(fd, "description"),
    logo: formField(fd, "logo"),
    darkLogo: formField(fd, "darkLogo"),
    favicon: formField(fd, "favicon"),
    email: {
      primary: formField(fd, "email_primary"),
      secondary: formField(fd, "email_secondary"),
    },
    phone: {
      primary: formField(fd, "phone_primary"),
      secondary: formField(fd, "phone_secondary"),
    },
    address: formField(fd, "address"),
    mapUrl: formField(fd, "mapUrl"),
    social: {
      facebook: formField(fd, "social_facebook"),
      linkedin: formField(fd, "social_linkedin"),
      instagram: formField(fd, "social_instagram"),
      youtube: formField(fd, "social_youtube"),
      whatsapp: formField(fd, "social_whatsapp"),
    },
    seo: {
      title: formField(fd, "seo_title"),
      description: formField(fd, "seo_description"),
      ogImage: formField(fd, "seo_ogImage"),
    },
    footer: {
      about: formField(fd, "footer_about"),
      copyright: formField(fd, "footer_copyright"),
    },
    design: {
      primary: formField(fd, "design_primary"),
      radius: formField(fd, "design_radius"),
    },
  });
  if (!parsed.success) return { error: firstIssue(parsed) };

  await prisma.siteSetting.upsert({
    where: { key: SITE_SETTING_KEY },
    create: { key: SITE_SETTING_KEY, value: toJson(parsed.data) },
    update: { value: toJson(parsed.data) },
  });
  await revalidateAll();
  redirect("/admin/settings?ok=1");
}