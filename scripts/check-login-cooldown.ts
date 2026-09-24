import assert from "node:assert/strict";
import { loginRetryAt, LOGIN_COOLDOWN_MS } from "../lib/login-cooldown";

const now = Date.now();
const failures = Array.from({ length: 5 }, (_, index) => ({ createdAt: new Date(now - index * 1000) }));
assert.equal(loginRetryAt(failures.slice(0, 4), now), undefined);
assert.equal(loginRetryAt(failures, now), now + LOGIN_COOLDOWN_MS);
assert.equal(loginRetryAt(failures, now + 59_999), now + LOGIN_COOLDOWN_MS);
assert.equal(loginRetryAt(failures, now + 60_000), undefined);
const nextFailure = [{ createdAt: new Date(now + 60_001) }, ...failures].slice(0, 5);
assert.equal(loginRetryAt(nextFailure, now + 60_001), now + 120_001);
assert.equal(loginRetryAt([], now), undefined);
console.log("Five-attempt threshold, exact one-minute expiry, subsequent failure cooldown, and reset passed.");
