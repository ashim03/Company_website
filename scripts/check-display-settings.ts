import assert from "node:assert/strict";
import { settingsSchema } from "../lib/validations";
import { defaultSiteSettings } from "../lib/default-content";
import { companyMap } from "../lib/company-map";

const settings = settingsSchema.parse({ ...defaultSiteSettings, mapPublished: false, social: { ...defaultSiteSettings.social, published: false, hidden: ["facebook"], extra: [{ label: "TikTok", url: "https://www.tiktok.com/", published: false, demo: true }] } });
assert.equal(settings.mapPublished, false);
assert.equal(settings.social.published, false);
assert.deepEqual(settings.social.hidden, ["facebook"]);
assert.equal(settings.social.extra[0].published, false);
assert.equal(settings.social.extra[0].url, "https://www.tiktok.com/");
assert(companyMap("Kathmandu", "javascript:alert(1)").directions.startsWith("https://www.google.com/maps/search"));
assert(!companyMap("Kathmandu", "https://example.com/maps/embed").embed.includes("example.com"));
assert.equal(companyMap("Kathmandu", "https://www.google.com/maps/embed?pb=test").embed, "https://www.google.com/maps/embed?pb=test");
console.log("Social/map visibility values preserve URLs; map iframe origins validated.");
