import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  defaultSiteSettings,
  type SiteSettingsData,
} from "@/lib/default-content";

const SITE_SETTING_KEY = "site";

function mergeSettings(defaults: SiteSettingsData, stored: unknown): SiteSettingsData {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return defaults;
  const s = stored as Record<string, unknown>;
  return {
    ...defaults,
    ...(typeof s.companyName === "string" ? { companyName: s.companyName } : {}),
    ...(typeof s.legalName === "string" ? { legalName: s.legalName } : {}),
    ...(typeof s.tagline === "string" ? { tagline: s.tagline } : {}),
    ...(typeof s.description === "string" ? { description: s.description } : {}),
    ...(typeof s.logo === "string" ? { logo: s.logo } : {}),
    ...(typeof s.darkLogo === "string" ? { darkLogo: s.darkLogo } : {}),
    ...(typeof s.favicon === "string" ? { favicon: s.favicon } : {}),
    email: { ...defaults.email, ...(isRecord(s.email) ? s.email : {}) },
    phone: { ...defaults.phone, ...(isRecord(s.phone) ? s.phone : {}) },
    ...(typeof s.address === "string" ? { address: s.address } : {}),
    ...(typeof s.mapUrl === "string" ? { mapUrl: s.mapUrl } : {}),
    social: { ...defaults.social, ...(isRecord(s.social) ? s.social : {}) },
    seo: { ...defaults.seo, ...(isRecord(s.seo) ? s.seo : {}) },
    footer: { ...defaults.footer, ...(isRecord(s.footer) ? s.footer : {}) },
    design: { ...defaults.design, ...(isRecord(s.design) ? s.design : {}) },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

/**
 * Site-wide settings, merged over defaults so a missing row never breaks
 * the public site.
 */
export const getSettings = cache(async (): Promise<SiteSettingsData> => {
  if (!process.env.DATABASE_URL) return defaultSiteSettings;
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: SITE_SETTING_KEY },
    });
    return mergeSettings(defaultSiteSettings, row?.value);
  } catch {
    return defaultSiteSettings;
  }
});