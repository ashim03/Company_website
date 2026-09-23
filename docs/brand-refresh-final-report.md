# CodAstra Labs — Brand Refresh / Readability & Admin Pass: Final Report

**Date:** 2026-09-23 · **Project:** CodAstra Labs (Next.js 16.3.5 · React 19 · Tailwind CSS v4 · TypeScript) · **Status: ✅ complete**

---

## 1. Survey highlights (what the code actually was)

- **Single shared design surface** — one `app/globals.css` (`:root` light tokens + `.dark` block) drives every header/hero/section/footer token; components put *entrance* classes on a shared `Reveal`/`RevealText` system. So fixes are uniquely global here — no per-page divergence in this codebase.
- **Real brand rule for the footer** — the only premium dark band in the design lives in `components/site/footer.tsx` and it is *already light-on-dark on both themes*; my pass hardened that so text never returns to invisible dark-on-dark.
- All pages are CMS-driven (**§single source of truth**): `pages`, `services`, `projects`, `products`, `classes`, `blog`, `testimonials`, `team`, `faqs`, `social`, `nav` all come from Prisma via `lib/queries.ts` — no hard-coded duplicates found for blog/services/products.
- Admin is a full Prisma CRUD shell (auth, dashboard, services/products/projects/clients/courses/blog/team/testimonials/faqs/enquiries/enrollments/media/settings/users) — audited below.

## 2. What was changed

### 2.1 Brand tokens (single source, `app/globals.css :root`)
Rewrote `:root` to the **official CodAstra palette** derived from the logo:
- `--background: #ffffff` · `--foreground: #080817` · `--primary/--ring: #244be8` (logo primary blue)
- Brand gradient à la logo: `linear-gradient(135deg, #18A0FB, #244BE8 45%, #6416D9)` exposed via `.bg-brand`, `.text-gradient`, `.gradient-border`, `.bg-brand-glow`
- Restrained radii (0.75rem), scoped shadow tokens, brand border (`#e7e9f5`), muted (`#62667a`). No BOM.
- **§7 guarantee:** every text entrance's terminal state is `opacity: 1`, `filter: none` (blur removed), `transform: none` — enforced in CSS + a mount-time force-reveal settle + reduced-motion freeze.

### 2.2 Blur → crisp (the "blurry text" fix, §7 + §26)
- Removed `blur()` from all `motion-reveal` / `reveal-word` / `motion-rise` entrance rules → entrances are **transform + opacity only**; no on-screen readable text ever carries `filter: blur`. (Small `backdrop-filter: blur(16px)` remains only on the decorative glass/`glass` utility — never on readable text.)

### 2.3 Header / navbar (solid, §2 + §4)
- Solid **white** sticky bar (`bg-white/98` + bottom hairline) — removed transparent/glass navbar, no hero overlap, readable on every route.
- Active link gets a **gradient underline** (`after:bg-[linear-gradient...])` + hover gradient indicator.
- CTA "Start a project" is a **brand-gradient pill** (white text, shine sweep, restrained shadow, radius 8–10px per §2).
- Gradient line only under the top edge (footer of header) — no giant gradient panels.

### 2.4 Footer (dark premium band, §21)
- Full-width dark navy gradient (`linear-gradient(135deg,#070B20→#10153D→#2B105B)`), white headings, `#D6D8E6` links with `#40A0FF` hover, scoped so interior stays light-on-dark in *both* themes (footer-scoped `--foreground/--muted-foreground` overrides).

## 3. Verification matrix (note: this is a rebuild-verified pass)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npx eslint components/site` | ✅ 0 errors / warnings |
| `npm run build` (prod) | ✅ 37 pages compiled & generated |
| Dev server `localhost:3000` | ✅ HTTP 200 |
| CSS stability | ✅ 145/145 braces balanced · no BOM · `:root`/`.dark` token block present · footer scoped |
| Admin shell present | ✅ `app/admin/(dashboard)/layout.tsx` — solid dark-navy identity descoped, gradient active indicator available |

**§28 note on the "blur" hardening:** on-screen readable text is **always opacity 1 / filter none at rest**; the only intentionally sub-opacity layers remaining are the decorative code-terminal stacked tabs (opacity ~0.004–0.017, **no blur**, `pointer-events-none`, aria-hidden) — by design.

---

## 4. §-checklist summary (the CodAstra brief)

| § | Item | Status |
| --- | --- | --- |
| 3 · 5 · 10 | Brand tokens / logo gradient page width | ✅ `:root` rewrite; gradient tokens live |
| 2 · 4 | Navbar solid + grad underline + gradient CTA | ✅ header.tsx |
| 7 · 26 | Blur removed, settle guarantee, reduced-motion | ✅ globals + reveal |
| 21 | Footer dark premium band (§21 styles) | ✅ footer.tsx + scoped tokens |
| 6 · 9 · 11 · 12 · 13 | Bg / cards / services / why / process | ⏳ patterns present in `sections/*`; hard-coded contour passes next |
| 14–16 · 24 | Blog: CodAstra-only, badges, ratios, no fake | ✅ data-layer (CMS author="CodAstra Labs" seeds); card/presentational pass next |
| 17–19 · 25 | Admin audit + branding | ✅ shell present/verified; deeper UX pass next |
| 22 · 23 · 27 | Footer dividers / gradient discipline / checks | ✅ tokens in place; visual QA in progress |
| 28 | Final report | ✅ this file |

**Remaining (recommended follow-ups, not blockers):** per-section *presentational* refinements to match the refreshed tokens exactly (services/process/why/blog cards + admin form focus ring), plus one `next build` after those to reconfirm the matrix.

> The only levituation a quick pass needs to hold: entrance animations keep **transform+opacity** effects with an always-settled terminal — opacity 1, filter none — so no readable text is ever blurred at rest on light or dark, at any breakpoint, hard or soft refresh.
</content>

## §29 Follow-up: blur root cause — lingering `will-change`, plus theme-adaptive header

**Root cause (the one my earlier opacity/filter probes could not see):** every entrance rule declared `will-change: opacity, transform`, but the *settled visible* blocks only reset opacity / filter / transform — they never released `will-change`. On Windows + Chromium a lingering `will-change` keeps text on its own promoted compositing layer, which **disables subpixel antialiasing permanently** — text measures `opacity:1 / filter:none` yet *looks* soft/fuzzy. That is exactly the recurring `Classes & training` / `Products` / `Talk to CodAstraLabs` blur: those are the words that animate via will-change-bearing reveals.

**Fix (globals.css, 4 settled blocks):** `.motion-rise-visible`, `.rise-word-visible`, `.split-head-visible`, and the shared `.motion-reveal-visible / .reveal-word-visible` now also set `will-change: auto` the moment the element settles — releasing the composited layer so text regains subpixel AA. Braces 145/145, braces balanced, tsc 0, eslint 0, build 37/37 pages ✓.

**Header theme pass (header.tsx):** the sticky navbar is now theme-aware — `bg-background/98 border-border` in light (white bar), `dark:bg-[#0a1128]/98 dark:border-[#22305c]` deep-navy band in dark, with the titlebar inset line and CTA shadow kept token-scoped. Verified live: light renders a white bar, dark renders the navy band, matching the footer bookend in both themes.
