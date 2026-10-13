# Combat Dietitian — Project Instructions

Site: https://combatdietitian.com — MPS LLC's tactical/combat dietitian site (Astro + Tailwind, Vercel-hosted). Primary content surface is the blog (55 posts as of 2026-10-13).

## Stack
- **Framework:** Astro 6 + Tailwind CSS 4 (`@tailwindcss/vite`), React islands for Academy forms, `@astrojs/vercel` adapter (`output: 'server'`, marketing pages `prerender = true`)
- **Content:** Markdown posts in `src/content/blog/*.md` with Astro Content Collections
- **Hosting:** Vercel (auto-deploy on push to master)
- **Domain:** combatdietitian.com
- **Dev server:** `npm run dev` (default port)

## Project Structure
```
src/
  content/
    blog/                       # *.md blog posts — source of truth
    modules/                    # Academy course HTML
  content.config.ts             # Content Collection schema (blog: title/description/date/author/tags/products)
  data/scythene-catalog.ts      # Scythene catalog — single source of truth (synced to scythene.com)
  lib/affiliate.ts              # UTM link builders + TOPIC_TO_SLUG map
  pages/
    blog/                       # Blog index + slug routing
    locations/                  # Location-targeted SEO pages
    index.astro                 # Homepage
  components/
  layouts/
public/
  brand/                        # Brand assets (see Brand Assets below)
  og/                           # Generated OG cards (npm run generate:og)
seo/                            # GBP copy, citation audit (markdown only)
scripts/
  check-funnel.mjs              # Build gate: Scythene funnel + claims policy (runs in prebuild)
  generate-og-images.mjs        # OG card generator (sharp)
```

## Brand Assets (`public/brand/`, regenerated 2026-10-13 from OneDrive masters)
- Masters: `OneDrive/Documents/Marques Performance Systems/Combat Dietitian/{Logo,Icon}/` (Aug-2026 lockups), `.../Scythene/{Logo,Icon}/`, `OneDrive/Documents/Calsanova/{Logo,Icon}/`.
- `cd-lockup.png` (icon + wordmark, transparent) · `cd-lockup-tagline.png` (+ "Science-Driven. Battle-Tested.") · `cd-icon.png` (octagon mark, 1024) · `scythene-logo-white.png` · `scythene-icon-white.png` · `calsanova-logo.png` · `calsanova-icon.png`.
- Favicons (`favicon-16/32/192`, `apple-touch-icon`, `favicon.ico`) + `og-image.png` derive from the CD icon/lockup. Nav uses icon + typeset wordmark (the lockup is illegible at 64px nav height); Footer/OG/Ecosystem use the lockups.
- Lockup masters are on opaque black — the transparent versions were produced with a luma-key (black → alpha) that keeps the octagon's black fill. Re-run that pipeline (not a plain magic-wand) if the masters change.

## Commands
```bash
npm run dev          # Dev server
npm run build        # Production build — must pass before any deploy
npm run generate:og  # Regenerate all OG cards (blog + location pages + default og-image.png)
npm run check:funnel # Scythene funnel + claims-policy gate (also runs automatically in prebuild)
```

## Blog Publishing
Workflow rules live in `~/.claude/projects/-home-nelly/memory/feedback_blog_publish_workflow.md` (auto-loaded every session). **This section documents Combat Dietitian-specific paths, frontmatter format, and topic-cluster data only — do NOT add workflow rules here.** Anything conceptual goes in the global memory file.

**Combat Dietitian-specific:**
- **Posts file:** `src/content/blog/<slug>.md` — extension is `.md`, NOT `.mdx` (Astro Content Collections, not Next.js MDX).
- **Frontmatter shape (YAML):**
  ```yaml
  ---
  title: "Post Title"
  description: "..."
  date: YYYY-MM-DD
  author: "Nelson Marques, MS, RD, LD"
  tags: ["Tag1","Tag2"]
  products: ["scythene-slug", ...]   # OPTIONAL — see Reader Funnel below; drives the auto product card
  ---
  ```

### Scythene CLAIMS POLICY (operator decision 2026-10-13 — applies to every surface, including social)

**Scythene is NOT third-party tested.** Never describe Scythene or any Scythene product as third-party / lab / batch tested, NSF Certified for Sport, Informed Sport/Choice, WADA/USADA-compliant, "safe for tested athletes", banned-substance-free, or as having lab reports / COAs. Do not make brand-level "clinically dosed" or "no proprietary blends" claims either (several SKUs carry a blend and sub-clinical doses). **Approved trust language mirrors scythene.com exactly:** "transparent labels", "evidence-based", "GMP-certified US manufacturing", "curated by a registered dietitian". Educational content about certification programs (Academy modules, the supplement-red-flags post) is fine as long as the same paragraph does not name Scythene. **Mechanical gate:** `npm run check:funnel` (prebuild) fails the build on any prohibited term in site chrome, or in a blog paragraph that also names Scythene.

### Reader Funnel — Scythene affiliate links (MANDATORY on any supplement-relevant post)

Every post that discusses a supplement Scythene sells must funnel readers to the Scythene store (our own brand = full margin, on-brand — never an external display-ad network). The FTC disclosure and the end-of-post product card **render automatically** from the `products:` frontmatter via `src/pages/blog/[slug].astro` — you only add the frontmatter + inline links.

- **Frontmatter:** `products: ["slug", ...]` — max 3, AVAILABLE products first, most-relevant first. Slugs MUST come from `src/data/scythene-catalog.ts` (single source of truth). This drives both the `ProductCTA` card and the `AffiliateDisclosure`.
- **Inline links:** wrap the FIRST natural mention of each mapped supplement in `[existing words](URL)`, max 3/post, using EXACTLY (canonical `/supplements/` path — the legacy `/products/` path is a 301 and fails the gate):
  `https://scythene.com/supplements/<slug>?utm_source=combatdietitian&utm_medium=blog&utm_campaign=supplement-links&utm_content=<post-slug>`
- **Topic → slug** (map lives in `src/lib/affiliate.ts` `TOPIC_TO_SLUG`; slugs are scythene.com GROUP slugs — flavors fold into the group): creatine→`creatine-monohydrate` · caffeine/pre-workout→`pre-workout` · citrulline/nitric oxide→`nitric-oxide` · beetroot/nitrate→`beetroot` · protein/whey→`whey-protein` · bcaa→`bcaa-recovery` · electrolytes/hydration/rehydration→`electrolytes` · creatine+electrolytes→`creatine-electrolytes` · omega-3/fish oil→`omega-3` · magnesium→`magnesium-glycinate` · vitamin d→`vitamin-d3` (D3+K2 = `bone-heart-support`) · multivitamin→`multivitamin` · collagen→`collagen-peptides` · glutamine→`l-glutamine` · greens→`greens`.
- **Never link** supplements Scythene doesn't sell (standalone beta-alanine, standalone B-vitamins, sodium bicarbonate, tart cherry, iron, zinc, vitamin C) — leave as plain text. (Amazon Associates fallback is scaffolded but inert in `affiliate.ts` until a tag is set.)
- **Catalog sync:** `src/data/scythene-catalog.ts` must track `scythene/src/lib/products.ts` (slug, price, servings, availability). Resynced 2026-10-13 after ~6 months of drift (4 slugs were 301'ing to generic pages). When Scythene adds/renames a SKU, update the catalog + `TOPIC_TO_SLUG` + this map in the same commit.
- **Judgment:** don't link a caution/warning/reduce-this mention (e.g. a caffeine-taper post must NOT push pre-workout — inline OR in `products`). Don't hand-write "Shop Scythene"/promo-block CTAs — the `ProductCTA` card IS the end-of-post CTA. Don't expose the gated `MPS20` code in post bodies.
- **Verify (mechanical gate):** `npm run check:funnel` — hard-fails on non-catalog slugs, legacy `/products/` paths, bare (un-UTM'd) links, leftover promo blocks, and prohibited Scythene claims (see Claims Policy); warns on supplement posts missing `products:`. Also runs automatically via `prebuild` on every `npm run build` (local + Vercel), so a broken funnel blocks the deploy.

**Topic clusters** (cross-link discovery — group new posts with their natural neighbors. Update this list when shipping a new post.):
- **Weight cuts:** `weight-cut-science`, `weight-cutting-in-combat-sports`, `why-fighters-lose-strength-during-weight-cuts`, `how-to-rehydrate-after-weigh-in`, `post-weigh-in-mistakes-24-hours-that-lose-fights`
- **Protein/macros:** `protein-timing-does-it-actually-matter`, `protein-timing-for-combat-athletes`, `nutrition-periodization-for-training-phases`, `periodized-nutrition-matching-fuel-to-training`
- **Brain/concussion:** `brain-health-nutrition-for-combat-athletes`, `concussion-recovery-nutrition`
- **Supplements:** `supplements-combat-athletes-actually-need`, `creatine-the-most-researched-supplement-in-sports`, `caffeine-for-members-a-complete-guide`, `caffeine-half-life-fight-day`, `supplement-red-flags-what-dietitians-should-watch-for`
- **Female athlete:** `nutrition-for-the-female-member`, `iron-deficiency-in-members-the-silent-performance-killer`
- **Labs/bloodwork:** `mid-camp-bloodwork-for-fighters`, `iron-deficiency-in-members-the-silent-performance-killer`

## Calsanova positioning (operator, 2026-10-13)
Calsanova is a **performance optimization platform**, not a nutrition-tracking app. Site copy must describe it as connecting nutrition to training load, recovery, sleep, wearables, and lab data (all live modules in `calsanova/apps/web/src/app/(app)/`). "AI nutrition platform" / "nutrition tracking platform" phrasing is retired. Feature claims on `/calsanova` were verified against the Calsanova route inventory — don't add features that aren't shipped there.

## Voice & Style
- **Author:** Nelson Marques, MS, RD, LD (tactical/performance dietitian, UFC experience)
- **Audience:** Combat athletes, fight teams, tactical operators (police, SWAT, military), combat-sports coaches and dietitians
- **Tone:** Direct, evidence-based, working-clinician voice. No hedging. Cite mechanism and dose ranges. Avoid hype, avoid academic prose.
- **Length:** Most posts 1500–2500 words. Use `## ` section headers and `**bold**` for key terms. Lists where they belong, prose elsewhere.

## Mandatory Workflow — EVERY Code Change
Per `~/.claude/CLAUDE.md` global rules: even on this content-focused site, code changes (Astro components, layouts, content schema) follow the target workflow. Pure blog content additions are content authoring — they follow the Blog Publishing chain above, not the full code-change audit cycle, but still verify build before commit.
