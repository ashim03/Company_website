"use server";

import { headers } from "next/headers";
import { prisma, isDbAvailable } from "@/lib/prisma";
import { enrollmentSchema } from "@/lib/validations";

export type EnrollmentState = {
  ok: boolean;
  error?: string;
  details?: Record<string, string[]>;
};

const MAX_PER_HOUR = Number(process.env.ENROLLMENT_MAX_PER_HOUR) || 5;

export async function submitEnrollment(
  prev: EnrollmentState,
  formData: FormData
): Promise<EnrollmentState> {
  const raw = {
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    course: formData.get("course") ?? "",
    courseSlug: formData.get("courseSlug") ?? "",
    experience: formData.get("experience") ?? "",
    schedule: formData.get("schedule") ?? "",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "", // honeypot
  };

  const parsed = enrollmentSchema.safeParse(raw);
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
    return { ok: true };
  }

  try {
    if (ip) {
      const recent = await prisma.classEnrollment.count({
        where: {
          ip,
          createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
        },
      });
      if (recent >= MAX_PER_HOUR) {
        return {
          ok: false,
          error: "Too many requests from this network. Please try again later.",
        };
      }
    }

    await prisma.classEnrollment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        course: data.course,
        courseSlug: data.courseSlug || null,
        experience: data.experience || null,
        schedule: data.schedule || null,
        message: data.message || null,
        ip: ip || null,
      },
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Something went wrong submitting your request. Please try again.",
    };
  }
}