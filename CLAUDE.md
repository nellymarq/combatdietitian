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
  ---
  ```

**Topic clusters** (cross-link discovery — group new posts with their natural neighbors. Update this list when shipping a new post.):
- **Weight cuts:** `weight-cut-science`, `weight-cutting-in-combat-sports`, `why-fighters-lose-strength-during-weight-cuts`, `how-to-rehydrate-after-weigh-in`, `post-weigh-in-mistakes-24-hours-that-lose-fights`
- **Protein/macros:** `protein-timing-does-it-actually-matter`, `protein-timing-for-combat-athletes`, `nutrition-periodization-for-training-phases`, `periodized-nutrition-matching-fuel-to-training`
- **Brain/concussion:** `brain-health-nutrition-for-combat-athletes`, `concussion-recovery-nutrition`
- **Supplements:** `supplements-combat-athletes-actually-need`, `creatine-the-most-researched-supplement-in-sports`, `caffeine-for-members-a-complete-guide`, `supplement-red-flags-what-dietitians-should-watch-for`
- **Female athlete:** `nutrition-for-the-female-member`, `iron-deficiency-in-members-the-silent-performance-killer`
- **Labs/bloodwork:** `mid-camp-bloodwork-for-fighters`, `iron-deficiency-in-members-the-silent-performance-killer`

## Voice & Style
- **Author:** Nelson Marques, MS, RD, LD (tactical/performance dietitian, UFC experience)
- **Audience:** Combat athletes, fight teams, tactical operators (police, SWAT, military), combat-sports coaches and dietitians
- **Tone:** Direct, evidence-based, working-clinician voice. No hedging. Cite mechanism and dose ranges. Avoid hype, avoid academic prose.
- **Length:** Most posts 1500–2500 words. Use `## ` section headers and `**bold**` for key terms. Lists where they belong, prose elsewhere.

## Mandatory Workflow — EVERY Code Change
Per `~/.claude/CLAUDE.md` global rules: even on this content-focused site, code changes (Astro components, layouts, content schema) follow the target workflow. Pure blog content additions are content authoring — they follow the Blog Publishing chain above, not the full code-change audit cycle, but still verify build before commit.
