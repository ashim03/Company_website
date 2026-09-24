export const LOGIN_FAILURE_LIMIT = 5;
export const LOGIN_COOLDOWN_MS = 60_000;

/** Failures are newest first. After five, every new failure starts a minute. */
export function loginRetryAt(failures: { createdAt: Date }[], now: number): number | undefined {
  if (failures.length < LOGIN_FAILURE_LIMIT) return undefined;
  const until = failures[0].createdAt.getTime() + LOGIN_COOLDOWN_MS;
  return until > now ? until : undefined;
}
