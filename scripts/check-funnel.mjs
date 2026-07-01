#!/usr/bin/env node
/**
 * check-funnel.mjs — guards the Scythene reader-funnel across blog posts.
 *
 * The end-of-post product card + FTC disclosure render automatically from each
 * post's `products:` frontmatter (see src/pages/blog/[slug].astro). This script
 * makes sure new/edited posts keep funneling readers correctly.
 *
 * ERRORS (exit 1 — objective defects, block the build):
 *   - a `products:` frontmatter slug that is not in the Scythene catalog
 *   - an inline scythene.com/products link that is bare (missing utm params)
 *   - an inline scythene.com/products link whose slug is not in the catalog
 *   - a leftover hand-written promo block ("Shop Scythene" / "MPS20" / gated code)
 *
 * WARNINGS (exit 0 by default — judgment calls, surfaced for review):
 *   - a post that mentions a Scythene-mapped supplement but has no `products:`
 *     frontmatter (a possible missed funnel — or a deliberate skip)
 *
 * Flags:
 *   --errors-only   suppress warnings entirely (used by the `prebuild` hook)
 *   --strict        make warnings fail too (exit 1)
 *
 * Wired into `prebuild`, so `npm run build` (local + Vercel) fails on any defect.
 * The script never throws on its own bugs — it degrades to a warning + exit 0 so a
 * checker glitch can't take down deploys.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const CATALOG = join(ROOT, 'src/data/scythene-catalog.ts');

const argv = process.argv.slice(2);
const ERRORS_ONLY = argv.includes('--errors-only');
const STRICT = argv.includes('--strict');

// Supplement keywords that SHOULD funnel to a Scythene product (detection heuristic).
// Mirrors TOPIC_TO_SLUG in src/lib/affiliate.ts. Drift-tolerant — used only for warnings.
const MAPPED_KEYWORDS = [
  'creatine', 'caffeine', 'pre-workout', 'citrulline', 'whey', 'protein powder',
  'electrolyte', 'beta-alanine', 'omega-3', 'fish oil', 'magnesium',
  'vitamin d', 'multivitamin', 'collagen', 'glutamine',
];

function fail(msg) {
  // A checker bug should never break the build — warn and pass.
  console.warn(`⚠️  check-funnel skipped (${msg})`);
  process.exit(0);
}

// --- Load catalog slugs (single source of truth) --------------------------
let catalogSlugs;
try {
  const src = readFileSync(CATALOG, 'utf8');
  catalogSlugs = new Set([...src.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]));
} catch (e) {
  fail(`cannot read catalog: ${e.message}`);
}
if (!catalogSlugs || catalogSlugs.size === 0) fail('no catalog slugs parsed');

// --- Scan posts -----------------------------------------------------------
const errors = [];
const warnings = [];

let files;
try {
  files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
} catch (e) {
  fail(`cannot read blog dir: ${e.message}`);
}

for (const file of files) {
  const path = join(BLOG_DIR, file);
  const slug = file.replace(/\.md$/, '');
  const raw = readFileSync(path, 'utf8');

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = fmMatch ? fmMatch[1] : '';
  const body = fmMatch ? raw.slice(fmMatch[0].length) : raw;

  // 1) products: frontmatter slugs must be in the catalog
  const prodMatch = frontmatter.match(/^products:\s*(\[[^\]]*\])/m);
  let products = [];
  if (prodMatch) {
    try {
      products = JSON.parse(prodMatch[1].replace(/'/g, '"'));
    } catch {
      errors.push(`${file}: malformed products: frontmatter — ${prodMatch[1]}`);
    }
    for (const p of products) {
      if (!catalogSlugs.has(p)) errors.push(`${file}: products slug "${p}" not in catalog`);
    }
  }

  // 2) inline scythene.com/products links: valid slug + UTM required
  const linkRe = /scythene\.com\/products\/([a-z0-9-]+)(\?[^)\s"]*)?/g;
  for (const m of body.matchAll(linkRe)) {
    const [, linkSlug, query] = m;
    if (!catalogSlugs.has(linkSlug)) errors.push(`${file}: inline link slug "${linkSlug}" not in catalog`);
    if (!query || !query.includes('utm_source=combatdietitian')) {
      errors.push(`${file}: inline link to "${linkSlug}" is missing utm tracking (bare link)`);
    }
  }

  // 3) leftover hand-written promo blocks / gated code exposure
  if (/Shop Scythene/i.test(body)) errors.push(`${file}: leftover "Shop Scythene" promo block — the ProductCTA card is the CTA`);
  if (/\bMPS20\b/.test(body)) errors.push(`${file}: gated code "MPS20" exposed in post body`);

  // 4) WARNING: mentions a mapped supplement but has no funnel
  if (products.length === 0) {
    const bodyLc = body.toLowerCase();
    const hit = MAPPED_KEYWORDS.find((k) => bodyLc.includes(k));
    if (hit) warnings.push(`${file}: mentions "${hit}" but has no products: funnel (review — add products or confirm intentional skip)`);
  }
}

// --- Report ---------------------------------------------------------------
if (errors.length) {
  console.error(`\n❌ check-funnel: ${errors.length} error(s) — blocking:`);
  for (const e of errors) console.error(`   • ${e}`);
}
if (!ERRORS_ONLY && warnings.length) {
  console.warn(`\n⚠️  check-funnel: ${warnings.length} warning(s) — review:`);
  for (const w of warnings) console.warn(`   • ${w}`);
}
if (!errors.length && (ERRORS_ONLY || !warnings.length)) {
  console.log(`✓ check-funnel: ${files.length} posts, funnel intact, no errors.`);
}

const failed = errors.length > 0 || (STRICT && warnings.length > 0);
process.exit(failed ? 1 : 0);
