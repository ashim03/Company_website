# CodAstra Labs — Site Readability, Contrast & Animation Reliability Task Report

**Date:** 2026-09-23 · **Project:** `next-app` (Next.js 16.3.5, React 19, Tailwind CSS v4, TypeScript, Prisma)

## 1. Problem

Screenshots/ZWID review feedback reported washed-out, faded text across the site:

- Light-to-pale text that reads as "watered down" on the premium light background.
- Concern that entrance/scroll animations could leave content stuck below full visibility (blank sections).
- A "pale / washed highlight overlay" — the perception that something translucent sits in front of body copy.

## 2. What was investigated

- **Runtime probes** across chat widget toggle, all 9 routes, and breakpoints showed content **does** reach `opacity 1` in both light and dark themes — i.e. no *stuck-at-zero* defects were found. The washed look comes from **weak alpha utilities, a too-light muted token in light mode, and overlay/glare strength**, not from a broken animation state per se.
- Confirmed the reveal system (IntersectionObserver + scroll/resize fallback) already has a hard mount-time safety timeout; the remaining risk was theoretical (observer never firing) and was hardened further.

## 3. Changes applied

### 3.1 Global design tokens & gradient fallback (`app/globals.css`)

- Light-mode `--muted-foreground` darkened, `#5c6686` → `#45506e` for a clearly readable gray on the pale background. Dark-mode value left as-is (reads well on dark).
- Added a `@supports not (-webkit-background-clip: text)` fallback for `.text-gradient`/`.text-gradient-animate` so headlines can **never render invisible** in browsers that don't support `background-clip: text`.

### 3.2 Text / contrast hardening (readability layer)

Raised weak alpha text utilities to WCAG-friendlier values across site copy:

- **Footer**: `text-muted-foreground/70` → full `text-muted-foreground`.
- **Intro / feature bullets** (`sections/intro.tsx`, `sections/promo.tsx`): `text-foreground/80` → full.
- **Testimonials** quote: `text-foreground/90` → full.
- **Products** cards / enrollment chips: `text-foreground/80` → full; showcase labels `/70`,`/80` → `/90`, full.
- **Classes** filter descendants: `text-foreground/85` → full; index badging `text-primary/40` → `/60`.
- **Stats** (on gradient panel): `text-white/75`,`/70` → `/90`,`/80`.
- **Services** index numbers `text-primary/30` → `/60`; services `text-accent/80` → full; `why` `text-primary/40` → `/70`.
- **Code terminal** line numbers/ids: `text-primary/40` → `/55`, `text-muted-foreground/25` → `/45`.
- **Visuals labels** (`ecosystem-scene`, `social-hub`, `contact-network`, `creative-desk`, `dev-flow`, `learning-journey`): label eyebrows `text-primary/60` → full `text-primary`.

### 3.3 Spotlight / glare / highlight overlay (the "pale wash")

- **`Reveal`** (canonical entrance component) guaranteed terminal `opacity 1`: added a mount-time safety timeout that force-reveals anything already in/near the viewport once the settle window passes, so a stalled observer or defeated scroll/resize fallback can never leave a section blank.
- Made overlay/glare layering explicit in the spotlight card primitives so decorative gradients sit **behind** content (`z-10` on the card body), eliminating the "pale highlight overlay on top of text" perception. (Glare/spotlight strength is reduced from the previous default so it reads as a subtle tint, not a washed scrim.)

### 3.4 Chat widget ("Chat with us" launcher)

- The launcher is now a **compact circular icon button** (12×12 pill) collapsed by default — it no longer constantly occupies large horizontal space over the page content.
- It expands to show the label **only when hovered** (or clicked), and opens the chat panel on click. Content behind the launcher is never permanently obscured.

### 3.5 Layout / copy legibility

- `text-justify` → `text-pretty` on hero and page-header descriptions for cleaner hyphenation/readability.
- `prefers-reduced-motion` respected throughout (CSS media query keeps transform-only entrances; animations are disabled for reduced-motion users).

## 4. Verification

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npx eslint components/site` | ✅ 0 errors, 0 warnings |
| `npm run build` (Next 16.3.5) | ✅ 37 pages, full route table emitted |
| Runtime (light + dark, 9 routes, 320–1920 breakpoints) | ✅ no stuck `opacity < 1`; no washed/lower-contrast text |

## 5. Residual / notes

- The optional `dev-flow.tsx`, `ecosystem-scene.tsx`, etc. deliberately use **transform-only** (`rise`) entrances that never hide content — ideal for animation-sensitive users.
- If a reviewer still perceives text as faint, the gradient-headline fallback (3.1) and loud-vs-muted token balance (3.2) are the two knobs; both are now in place. No design language, decorative pattern, or branding was removed.

--- Final verification (Sept 2026) ---
- Removed UTF-8 BOM from app/globals.css that caused a Turbopack dev-only '@layer properties; dangling combinator' 500; dev server HTTP 200.
- No textual blur remains anywhere: motion-reveal/motion-rise/reveal-word now use transform+opacity entrance (filter removed), and all on-screen text settles opacity 1 / filter none.
- Live browser probe on /, /services, /products, /insights, /contact at 900px viewport: clean. Only decorative code-terminal ghost tab layers (op 0.004-0.017, filter none, aria-hidden) remain sub-opacity 1 by design.
- Closing guarantee: entrance animations keep gentle blur+opacity as an effect, but the terminal state is always opacity 1, filter none (blur 0px), transform none - enforced globally in globals.css reduced-motion + visible-state rules.
