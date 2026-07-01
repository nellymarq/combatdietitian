# Combat Dietitian — Project Instructions

Site: https://combatdietitian.com — MPS LLC's tactical/combat dietitian site (Astro + Tailwind, Vercel-hosted). Primary content surface is the blog (34+ posts as of 2026-05-04).

## Stack
- **Framework:** Astro 4 + Tailwind CSS
- **Content:** Markdown posts in `src/content/blog/*.md` with Astro Content Collections
- **Hosting:** Vercel (auto-deploy on push to master)
- **Domain:** combatdietitian.com
- **Dev server:** `npm run dev` (default port)

## Project Structure
```
src/
  content/
    blog/                       # *.md blog posts — source of truth
    config.ts                   # Content Collection schema
  pages/
    blog/                       # Blog index + slug routing
    locations/                  # Location-targeted SEO pages
    index.astro                 # Homepage
  components/
  layouts/
public/                         # Static assets
seo/                            # SEO scripts (npm run og)
scripts/
```

## Commands
```bash
npm run dev          # Dev server
npm run build        # Production build — must pass before any deploy
npm run og           # Generate OG images for posts
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

### Reader Funnel — Scythene affiliate links (MANDATORY on any supplement-relevant post)

Every post that discusses a supplement Scythene sells must funnel readers to the Scythene store (our own brand = full margin, on-brand — never a third-party display-ad network). The FTC disclosure and the end-of-post product card **render automatically** from the `products:` frontmatter via `src/pages/blog/[slug].astro` — you only add the frontmatter + inline links.

- **Frontmatter:** `products: ["slug", ...]` — max 3, AVAILABLE products first, most-relevant first. Slugs MUST come from `src/data/scythene-catalog.ts` (single source of truth). This drives both the `ProductCTA` card and the `AffiliateDisclosure`.
- **Inline links:** wrap the FIRST natural mention of each mapped supplement in `[existing words](URL)`, max 3/post, using EXACTLY:
  `https://scythene.com/products/<slug>?utm_source=combatdietitian&utm_medium=blog&utm_campaign=supplement-links&utm_content=<post-slug>`
- **Topic → slug** (map lives in `src/lib/affiliate.ts` `TOPIC_TO_SLUG`): creatine→`creatine-monohydrate` · caffeine/pre-workout/citrulline→`pre-workout` · protein/whey→`whey-protein-vanilla` · electrolytes/hydration/rehydration→`electrolytes-berry` · beta-alanine→`beta-alanine` · omega-3/fish oil→`omega-3` · magnesium→`magnesium-bisglycinate` · vitamin d→`vitamin-d3-k2` · multivitamin→`multivitamin` · collagen→`collagen-peptides-vitamin-c` · glutamine→`l-glutamine`.
- **Never link** supplements Scythene doesn't sell (beetroot/dietary nitrate, sodium bicarbonate, tart cherry) — leave as plain text. (Amazon Associates fallback is scaffolded but inert in `affiliate.ts` until a tag is set.)
- **Judgment:** don't link a caution/warning/reduce-this mention (e.g. a caffeine-taper post must NOT push pre-workout — inline OR in `products`). Don't hand-write "Shop Scythene"/promo-block CTAs — the `ProductCTA` card IS the end-of-post CTA. Don't expose the gated `MPS20` code in post bodies.
- **Verify (mechanical gate):** `npm run check:funnel` — hard-fails on non-catalog slugs, bare (un-UTM'd) links, and leftover promo blocks; warns on supplement posts missing `products:`. Also runs automatically via `prebuild` on every `npm run build` (local + Vercel), so a broken funnel blocks the deploy.

**Topic clusters** (cross-link discovery — group new posts with their natural neighbors. Update this list when shipping a new post.):
- **Weight cuts:** `weight-cut-science`, `weight-cutting-in-combat-sports`, `why-fighters-lose-strength-during-weight-cuts`, `how-to-rehydrate-after-weigh-in`, `post-weigh-in-mistakes-24-hours-that-lose-fights`
- **Protein/macros:** `protein-timing-does-it-actually-matter`, `protein-timing-for-combat-athletes`, `nutrition-periodization-for-training-phases`, `periodized-nutrition-matching-fuel-to-training`
- **Brain/concussion:** `brain-health-nutrition-for-combat-athletes`, `concussion-recovery-nutrition`
- **Supplements:** `supplements-combat-athletes-actually-need`, `creatine-the-most-researched-supplement-in-sports`, `caffeine-for-members-a-complete-guide`, `caffeine-half-life-fight-day`, `supplement-red-flags-what-dietitians-should-watch-for`
- **Female athlete:** `nutrition-for-the-female-member`, `iron-deficiency-in-members-the-silent-performance-killer`
- **Labs/bloodwork:** `mid-camp-bloodwork-for-fighters`, `iron-deficiency-in-members-the-silent-performance-killer`

## Voice & Style
- **Author:** Nelson Marques, MS, RD, LD (tactical/performance dietitian, UFC experience)
- **Audience:** Combat athletes, fight teams, tactical operators (police, SWAT, military), combat-sports coaches and dietitians
- **Tone:** Direct, evidence-based, working-clinician voice. No hedging. Cite mechanism and dose ranges. Avoid hype, avoid academic prose.
- **Length:** Most posts 1500–2500 words. Use `## ` section headers and `**bold**` for key terms. Lists where they belong, prose elsewhere.

## Mandatory Workflow — EVERY Code Change
Per `~/.claude/CLAUDE.md` global rules: even on this content-focused site, code changes (Astro components, layouts, content schema) follow the target workflow. Pure blog content additions are content authoring — they follow the Blog Publishing chain above, not the full code-change audit cycle, but still verify build before commit.
