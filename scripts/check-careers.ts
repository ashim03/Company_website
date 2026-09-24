import assert from "node:assert/strict";
import { vacancySchema, isOpenVacancy } from "../lib/careers-schema";

const role = { id: "test", title: "Developer", department: "Engineering", location: "Kathmandu", type: "Full-time" as const, status: "PUBLISHED" as const, description: "Build accessible software with our team.", requirements: "TypeScript", applicationUrl: "https://example.com/apply", deadline: "2026-10-01" };
assert(vacancySchema.safeParse(role).success);
assert(isOpenVacancy(role, Date.parse("2026-10-01T18:14:59Z")));
assert(!isOpenVacancy(role, Date.parse("2026-10-01T18:15:00Z")));
assert(!isOpenVacancy({ ...role, status: "DRAFT", deadline: "" }));
assert(!isOpenVacancy({ ...role, status: "CLOSED", deadline: "" }));
assert(isOpenVacancy({ ...role, deadline: "" }));
assert(!vacancySchema.safeParse({ ...role, applicationUrl: "javascript:alert(1)" }).success);
assert(!vacancySchema.safeParse({ ...role, deadline: "2026-02-30" }).success);
assert(!vacancySchema.safeParse({ ...role, title: "" }).success);
console.log("Careers validation, publication states, and Nepal deadline boundary passed.");
