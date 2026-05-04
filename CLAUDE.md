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
Canonical workflow lives in `~/.claude/projects/-home-nelly/memory/feedback_blog_publish_workflow.md`. The 8-step chain (inventory → topic → write → cross-link → build → stage → commit/push → verify) applies in full. Cross-linking related posts is mandatory.

Combat Dietitian-specific paths/commands:
- **Source of truth:** `src/content/blog/<slug>.md` — extension is `.md`, NOT `.mdx`. Frontmatter:
  ```yaml
  ---
  title: "Post Title"
  description: "..."
  date: YYYY-MM-DD
  author: "Nelson Marques, MS, RD, LD"
  tags: ["Tag1","Tag2"]
  ---
  ```
- **Verify compile:** `npx astro build` — confirms the post renders to `dist/client/blog/<slug>/index.html`.
- **Internal links:** Standard markdown `[link text](/blog/<slug>)`. Existing posts use this style consistently — see `iron-deficiency-in-members-the-silent-performance-killer.md` for example.
- **Topic clusters to cross-link** (group related posts):
  - **Weight cuts:** `weight-cut-science`, `weight-cutting-in-combat-sports`, `why-fighters-lose-strength-during-weight-cuts`, `how-to-rehydrate-after-weigh-in`
  - **Protein/macros:** `protein-timing-does-it-actually-matter`, `protein-timing-for-combat-athletes`, `nutrition-periodization-for-training-phases`, `periodized-nutrition-matching-fuel-to-training`
  - **Brain/concussion:** `brain-health-nutrition-for-combat-athletes`, `concussion-recovery-nutrition`
  - **Supplements:** `supplements-combat-athletes-actually-need`, `creatine-the-most-researched-supplement-in-sports`, `caffeine-for-members-a-complete-guide`, `supplement-red-flags-what-dietitians-should-watch-for`
  - **Female athlete:** `nutrition-for-the-female-member`, `iron-deficiency-in-members-the-silent-performance-killer`
- **Stage explicitly:** `git add src/content/blog/<slug>.md` — never `git add .`.
- **Deploy timing:** Vercel auto-deploys on push to master, ~1 min push-to-prod. Verify via `curl -sI https://combatdietitian.com/blog/<slug>` returns 200, AND `curl -s ... | grep <reciprocal-slug>` to confirm cross-links landed.

## Voice & Style
- **Author:** Nelson Marques, MS, RD, LD (tactical/performance dietitian, UFC experience)
- **Audience:** Combat athletes, fight teams, tactical operators (police, SWAT, military), combat-sports coaches and dietitians
- **Tone:** Direct, evidence-based, working-clinician voice. No hedging. Cite mechanism and dose ranges. Avoid hype, avoid academic prose.
- **Length:** Most posts 1500–2500 words. Use `## ` section headers and `**bold**` for key terms. Lists where they belong, prose elsewhere.

## Mandatory Workflow — EVERY Code Change
Per `~/.claude/CLAUDE.md` global rules: even on this content-focused site, code changes (Astro components, layouts, content schema) follow the target workflow. Pure blog content additions are content authoring — they follow the Blog Publishing chain above, not the full code-change audit cycle, but still verify build before commit.
