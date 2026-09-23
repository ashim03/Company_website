"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { revalidateAll } from "@/lib/admin";

export type TeamSectionState = { visible: boolean; error?: string };

/**
 * Publish or unpublish the "Meet the team" section site-wide.
 * Flips every team-type page section at once so the admin's intent is
 * unambiguous, regardless of which page hosts the section.
 */
export async function setTeamSectionVisibility(visible: boolean): Promise<TeamSectionState> {
  await requireSession();

  try {
    await prisma.pageSection.updateMany({
      where: { sectionType: "team" },
      data: { isVisible: visible },
    });
    await revalidateAll();
    return { visible };
  } catch {
    return { visible: !visible, error: "Could not update the team section. Please try again." };
  }
}