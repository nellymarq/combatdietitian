#!/usr/bin/env node
/**
 * check-funnel.mjs — guards the Scythene reader-funnel + brand-claims policy.
 *
 * The end-of-post product card + FTC disclosure render automatically from each
 * post's `products:` frontmatter (see src/pages/blog/[slug].astro). This script
 * makes sure new/edited posts keep funneling readers correctly AND that nobody
 * re-introduces a prohibited claim about Scythene.
 *
 * ERRORS (exit 1 — objective defects, block the build):
 *   - a `products:` frontmatter slug that is not in the Scythene catalog
 *   - an inline scythene.com product link that is bare (missing utm params)
 *   - an inline scythene.com product link whose slug is not in the catalog
 *   - an inline link using the legacy /products/ path (canonical is /supplements/)
 *   - a leftover hand-written promo block ("Shop Scythene" / "MPS20" / gated code)
 *   - CLAIMS: a blog paragraph that names Scythene AND makes a testing /
 *     certification / anti-doping claim (third-party tested, NSF, Informed Sport,
 *     WADA, banned-substance-free, lab reports, COA…)
 *   - CLAIMS: ANY such term in site chrome (src/pages, src/components,
 *     src/layouts, the catalog, affiliate lib) — chrome is always about our own
 *     brands, so there is no educational exemption there
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
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const CATALOG = join(ROOT, 'src/data/scythene-catalog.ts');
// Site chrome: every file here speaks in the brand's own voice → zero tolerance.
// (src/content/modules + src/data/quizzes + src/data/course.ts are Academy course material that
// legitimately TEACHES about NSF / Informed Sport / WADA — intentionally excluded.)
const CHROME_DIRS = ['src/pages', 'src/components', 'src/layouts', 'src/lib'];
const CHROME_FILES = ['src/data/scythene-catalog.ts'];

const argv = process.argv.slice(2);
const ERRORS_ONLY = argv.includes('--errors-only');
const STRICT = argv.includes('--strict');

// Supplement keywords that SHOULD funnel to a Scythene product (detection heuristic).
// Mirrors TOPIC_TO_SLUG in src/lib/affiliate.ts. Drift-tolerant — used only for warnings.
const MAPPED_KEYWORDS = [
  'creatine', 'caffeine', 'pre-workout', 'citrulline', 'beetroot', 'nitrate', 'whey',
  'protein powder', 'bcaa', 'electrolyte', 'omega-3', 'fish oil', 'magnesium',
  'vitamin d', 'multivitamin', 'collagen', 'glutamine',
];

// Prohibited brand claims. Scythene is NOT third-party tested (operator decision
// 2026-10-13). Approved language: transparent labels / evidence-based /
// GMP-certified US manufacturing.
const CLAIM_RE = /third[- ]?party|3rd[- ]?party|lab[- ]tested|batch[- ]tested|tested for (purity|potency|banned)|\bNSF\b|informed[- ](sport|choice)|\bWADA\b|\bUSADA\b|banned[- ]substance|certificate of analysis|\bCOAs?\b|lab reports?|safe for (drug[- ])?tested athletes|anti[- ]doping/i;

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

  // 2) inline scythene.com product links: canonical path + valid slug + UTM required
  const linkRe = /scythene\.com\/(products|supplements)\/([a-z0-9-]+)(\?[^)\s"]*)?/g;
  for (const m of body.matchAll(linkRe)) {
    const [, pathSeg, linkSlug, query] = m;
    if (pathSeg === 'products') errors.push(`${file}: inline link to "${linkSlug}" uses legacy /products/ path — use /supplements/`);
    if (!catalogSlugs.has(linkSlug)) errors.push(`${file}: inline link slug "${linkSlug}" not in catalog`);
    if (!query || !query.includes('utm_source=combatdietitian')) {
      errors.push(`${file}: inline link to "${linkSlug}" is missing utm tracking (bare link)`);
    }
  }

  // 3) leftover hand-written promo blocks / gated code exposure
  if (/Shop Scythene/i.test(body)) errors.push(`${file}: leftover "Shop Scythene" promo block — the ProductCTA card is the CTA`);
  if (/\bMPS20\b/.test(body)) errors.push(`${file}: gated code "MPS20" exposed in post body`);

  // 4) CLAIMS: Scythene + prohibited claim in the same paragraph
  for (const para of body.split(/\n\s*\n/)) {
    if (/scythene/i.test(para) && CLAIM_RE.test(para)) {
      const hit = para.match(CLAIM_RE)?.[0];
      errors.push(`${file}: paragraph names Scythene alongside a prohibited claim ("${hit}") — Scythene is not third-party tested; use transparent-labels / evidence-based / GMP language`);
    }
  }

  // 5) WARNING: mentions a mapped supplement but has no funnel
  if (products.length === 0) {
    const bodyLc = body.toLowerCase();
    const hit = MAPPED_KEYWORDS.find((k) => bodyLc.includes(k));
    if (hit) warnings.push(`${file}: mentions "${hit}" but has no products: funnel (review — add products or confirm intentional skip)`);
  }
}

// --- Scan site chrome for prohibited claims --------------------------------
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|ts|tsx|mjs)$/.test(entry)) out.push(p);
  }
  return out;
}
let chromeFiles = [];
try {
  for (const d of CHROME_DIRS) chromeFiles.push(...walk(join(ROOT, d)));
  for (const f of CHROME_FILES) chromeFiles.push(join(ROOT, f));
} catch (e) {
  fail(`cannot walk chrome dirs: ${e.message}`);
}
for (const p of chromeFiles) {
  const src = readFileSync(p, 'utf8');
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    // Allow the policy comment itself (and this checker) to name the banned terms.
    if (/CLAIMS? POLICY|claims policy|Never describe them as|no testing claims|No testing claims|testing \/ certification/i.test(line)) return;
    if (CLAIM_RE.test(line)) {
      errors.push(`${relative(ROOT, p)}:${i + 1}: prohibited claim term "${line.match(CLAIM_RE)[0]}" in site chrome — Scythene is not third-party tested`);
    }
  });
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
  console.log(`✓ check-funnel: ${files.length} posts + ${chromeFiles.length} chrome files, funnel intact, no prohibited claims.`);
}

const failed = errors.length > 0 || (STRICT && warnings.length > 0);
process.exit(failed ? 1 : 0);
