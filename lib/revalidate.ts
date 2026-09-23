import "server-only";

import { revalidatePath } from "next/cache";
import { PUBLIC_PATHS, PUBLIC_DYNAMIC_PATHS } from "@/lib/constants";

/**
 * Central revalidation for public website content.
 * Call after every CMS mutation that affects public pages.
 */
export async function revalidatePublic(
  extraPaths: string[] = []
): Promise<void> {
  for (const path of PUBLIC_PATHS) {
    revalidatePath(path, "page");
  }
  for (const pattern of PUBLIC_DYNAMIC_PATHS) {
    revalidatePath(pattern, "page");
  }
  for (const path of extraPaths) {
    if (path.startsWith("/")) revalidatePath(path, "page");
  }
}

/** Revalidates only specific paths (used by per-entity updates). */
export async function revalidatePaths(paths: string[]): Promise<void> {
  for (const path of paths) {
    if (path.startsWith("/")) revalidatePath(path, "page");
  }
}