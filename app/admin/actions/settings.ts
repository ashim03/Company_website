"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll, toJson, formField, formBool, firstIssue } from "@/lib/admin";
import { settingsSchema } from "@/lib/validations";
import type { ActionState } from "@/components/admin/entity-form";

const SITE_SETTING_KEY = "site";

export async function updateSettings(
  _prev: ActionState,
  fd: FormData
): Promise<ActionState> {
  await requireSession();
  let extra: unknown;
  try { extra = JSON.parse(formField(fd, "social_extra") || "[]"); }
  catch { return { error: "Please check the additional social links." }; }
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
    mapPublished: formBool(fd, "mapPublished"),
    social: {
      published: formBool(fd, "social_published"),
      hidden: ["facebook", "linkedin", "instagram", "youtube", "whatsapp"].filter(platform => !formBool(fd, `publish_${platform}`)),
      facebook: formField(fd, "social_facebook"),
      linkedin: formField(fd, "social_linkedin"),
      instagram: formField(fd, "social_instagram"),
      youtube: formField(fd, "social_youtube"),
      whatsapp: formField(fd, "social_whatsapp"),
      extra,
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
  revalidatePath("/", "layout");
  redirect("/admin/settings?ok=1");
}
