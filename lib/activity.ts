import "server-only";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface LogActivityInput {
  action: string;
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}

/** Records CMS activity. Never throws — logging must not break a mutation. */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    const session = await getSession();
    await prisma.activityLog.create({
      data: {
        userId: session?.id ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        meta: (input.meta ?? {}) as object,
      },
    });
  } catch {
    // ignore
  }
}