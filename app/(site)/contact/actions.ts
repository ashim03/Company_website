"use server";

import { headers } from "next/headers";
import { prisma, isDbAvailable } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export type ContactState = {
  ok: boolean;
  error?: string;
  details?: Record<string, string[]>;
};

const MAX_PER_HOUR = Number(process.env.CONTACT_MAX_PER_HOUR) || 5;

export async function submitContact(
  prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: formData.get("name") ?? "",
    company: formData.get("company") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    service: formData.get("service") ?? "",
    budget: formData.get("budget") ?? "",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "", // honeypot
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  // Honeypot: if a bot filled the hidden field, pretend success but discard.
  if (data.website && data.website.trim().length > 0) {
    return { ok: true };
  }

  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  const realIp = headerList.get("x-real-ip");
  const ip = (forwarded ? forwarded.split(",")[0].trim() : realIp ?? "").slice(0, 64);

  if (!isDbAvailable()) {
    // No database configured yet — accept the message but do not persist.
    return { ok: true };
  }

  try {
    if (ip) {
      const recent = await prisma.contactEnquiry.count({
        where: {
          ip,
          createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
        },
      });
      if (recent >= MAX_PER_HOUR) {
        return {
          ok: false,
          error: "Too many messages from this network. Please try again later.",
        };
      }
    }

    await prisma.contactEnquiry.create({
      data: {
        name: data.name,
        company: data.company || null,
        email: data.email,
        phone: data.phone || null,
        service: data.service || null,
        budget: data.budget || null,
        message: data.message,
        source: "contact",
        ip: ip || null,
      },
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Something went wrong sending your message. Please try again.",
    };
  }
}