/**
 * Canonical Scythene product catalog — single source of truth on this site.
 *
 * Consumed by:
 *   - src/pages/scythene.astro          (store page grid)
 *   - src/lib/affiliate.ts              (topic → product mapping for blog links)
 *   - src/components/ProductCTA.astro   (end-of-post product callout)
 *   - scripts/check-funnel.mjs          (build gate — parses `slug:` lines)
 *
 * Mirrors scythene.com (`src/lib/products.ts` in the Scythene repo) at the GROUP
 * level: flavor/form variants (vanilla + chocolate whey, five Scynergy flavors…)
 * collapse into one entry whose `slug` is the group's canonical URL on
 * scythene.com/supplements/<slug>. Resynced 2026-10-13 — prices, servings, and
 * slugs were ~6 months stale before that (several links 301'd to generic pages).
 *
 * CLAIMS POLICY (operator decision, 2026-10-13): Scythene products are NOT
 * independently tested or certified by any outside program. The full list of
 * prohibited terms lives in CLAUDE.md → "Scythene CLAIMS POLICY"; approved trust
 * language mirrors scythene.com exactly: "transparent labels", "evidence-based",
 * "GMP-certified US manufacturing". `npm run check:funnel` fails the build on
 * violations — including in this file's blurbs.
 */

export interface ScytheneProduct {
  /** Canonical group slug on scythene.com — the product URL is /supplements/<slug>. */
  slug: string;
  name: string;
  /** Display price. Use "from $X" when variants differ. */
  price: string;
  servings: string;
  type: 'Powder' | 'Capsule' | 'Softgel' | 'Strip';
  category: 'Performance' | 'Recovery' | 'Hydration' | 'Foundation' | 'Energy' | 'Focus';
  /** false = listed on scythene.com but not yet purchasable (renders as Coming Soon). */
  available: boolean;
  /** Flavor / form variants folded into this entry, if any. */
  variants?: string[];
  /** One-line, label-accurate blurb for the end-of-post CTA card. No testing claims. */
  blurb: string;
}

export const SCYTHENE_PRODUCTS: ScytheneProduct[] = [
  // --- Performance ---
  {
    slug: 'creatine-monohydrate',
    name: 'Creatine Monohydrate',
    price: '$27.99',
    servings: '50 servings',
    type: 'Powder',
    category: 'Performance',
    available: true,
    blurb: 'Single-ingredient creatine monohydrate at the studied 5 g dose — unflavored, 50 servings. The most-researched performance supplement in sport.',
  },
  {
    slug: 'pre-workout',
    name: 'Pre-Workout',
    price: '$39.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Performance',
    available: true,
    variants: ['Fruit Punch'],
    blurb: 'Moderate-stim pre-workout: 175 mg caffeine with creatine, L-arginine AKG, beta-alanine, and a B-complex — every dose on the label.',
  },
  {
    slug: 'beetroot',
    name: 'Beetroot',
    price: '$29.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Performance',
    available: true,
    blurb: 'Concentrated beetroot extract for dietary nitrate — nitric-oxide support for blood flow and endurance efficiency.',
  },
  {
    slug: 'nitric-oxide',
    name: 'Nitric Oxide',
    price: '$24.99',
    servings: '30 servings (60 capsules)',
    type: 'Capsule',
    category: 'Performance',
    available: true,
    blurb: 'Capsule-form L-citrulline + L-arginine nitric-oxide support — two amino acids feeding the NO pathway from different angles.',
  },

  // --- Recovery ---
  {
    slug: 'whey-protein',
    name: 'Whey Protein Isolate',
    price: '$54.99',
    servings: '28 servings',
    type: 'Powder',
    category: 'Recovery',
    available: true,
    variants: ['Vanilla', 'Chocolate'],
    blurb: 'Whey protein isolate with 19 g complete protein per serving and ~5 g naturally occurring BCAAs — the fast-absorbing option when food alone won\'t hit the target.',
  },
  {
    slug: 'collagen-peptides',
    name: 'Collagen Peptides',
    price: 'from $34.99',
    servings: '14 servings',
    type: 'Powder',
    category: 'Recovery',
    available: true,
    variants: ['Unflavored', 'Chocolate'],
    blurb: 'Grass-fed hydrolyzed bovine collagen (Type I & III), 20 g per scoop — for tendon, ligament, and connective-tissue support around hard training.',
  },
  {
    slug: 'l-glutamine',
    name: 'L-Glutamine',
    price: '$21.99',
    servings: '~31 servings',
    type: 'Powder',
    category: 'Recovery',
    available: true,
    blurb: 'Unflavored L-glutamine, 3.15 g per scoop — supports gut integrity and recovery during high-volume training blocks.',
  },
  {
    slug: 'bcaa-recovery',
    name: 'BCAA Recovery',
    price: '$34.99',
    servings: '45 servings',
    type: 'Powder',
    category: 'Recovery',
    available: true,
    variants: ['Honeydew/Watermelon', 'Fruit Punch'],
    blurb: '4 g BCAAs at the research-standard 2:1:1 ratio plus 1 g L-glutamine per serving — intra- or post-session recovery support.',
  },
  {
    slug: 'sleep-formula',
    name: 'Sleep Protocol',
    price: '$29.90',
    servings: '30 servings (60 capsules)',
    type: 'Capsule',
    category: 'Recovery',
    available: true,
    blurb: 'Nightly sleep-support capsule — see the label on scythene.com for the full formula and doses.',
  },

  // --- Hydration ---
  {
    slug: 'electrolytes',
    name: 'Electrolytes',
    price: '$34.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Hydration',
    available: true,
    variants: ['Peach Mango', 'Passion Fruit'],
    blurb: 'Sodium, potassium, and magnesium dosed to real sweat losses — no added sugar. Built for rehydration, heat, and post-weigh-in recovery.',
  },
  {
    slug: 'creatine-electrolytes',
    name: 'Creatine+',
    price: '$32.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Hydration',
    available: true,
    variants: ['Lemon'],
    blurb: '5 g creatine monohydrate with 1,000 mg sodium, 200 mg potassium, and 60 mg magnesium in one scoop — creatine plus hydration for heat and volume.',
  },

  // --- Foundation ---
  {
    slug: 'omega-3',
    name: 'Omega-3 EPA/DHA',
    price: '$24.99',
    servings: '100 softgels',
    type: 'Softgel',
    category: 'Foundation',
    available: true,
    blurb: 'Molecularly distilled fish oil — 180 mg EPA + 120 mg DHA per softgel for recovery and brain-health support.',
  },
  {
    slug: 'multivitamin',
    name: 'Daily Multivitamin',
    price: '$27.99',
    servings: '30 servings (60 capsules)',
    type: 'Capsule',
    category: 'Foundation',
    available: true,
    blurb: 'Full B-complex plus vitamins A/C/D/E, minerals, and botanicals — foundational micronutrient coverage for athletes whose training outpaces intake.',
  },
  {
    slug: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    price: '$23.99',
    servings: '30 servings (90 capsules)',
    type: 'Capsule',
    category: 'Foundation',
    available: true,
    blurb: 'Chelated magnesium glycinate — 275 mg elemental magnesium per 3-capsule serving — for sleep, recovery, and neuromuscular function.',
  },
  {
    slug: 'vitamin-d3',
    name: 'Vitamin D3 — 2,000 IU',
    price: '$22.99',
    servings: '100 softgels',
    type: 'Softgel',
    category: 'Foundation',
    available: true,
    blurb: 'Vitamin D3 at 2,000 IU per softgel — a daily maintenance dose for bone, muscle, and immune support.',
  },
  {
    slug: 'bone-heart-support',
    name: 'Vitamin D3 + K2',
    price: '$29.90',
    servings: '30 servings (60 capsules)',
    type: 'Capsule',
    category: 'Foundation',
    available: true,
    blurb: '5,000 IU vitamin D3 paired with 100 mcg K2 (MK-7) — the pairing that routes calcium toward bone.',
  },
  {
    slug: 'greens',
    name: 'Greens',
    price: '$39.99',
    servings: '~30 servings',
    type: 'Powder',
    category: 'Foundation',
    available: true,
    blurb: 'Daily greens blend — concentrated vegetables, fruits, and adaptogens to help fill gaps when whole-food intake falls short.',
  },
  {
    slug: 'digestion-protocol',
    name: 'Digestion Protocol',
    price: '$29.99',
    servings: '30 servings (60 capsules)',
    type: 'Capsule',
    category: 'Foundation',
    available: true,
    blurb: 'Protease, amylase, lipase, and lactase enzyme blend for high-protein, high-volume eaters.',
  },

  // --- Energy / Focus ---
  {
    slug: 'scynergy',
    name: 'Scynergy — Daytime Energy',
    price: '$34.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Energy',
    available: true,
    variants: ['Citrus', 'Fruit Punch', 'Guava Berry', 'Strawberry Shortcake', 'Cotton Candy'],
    blurb: 'Daytime energy powder — moderate caffeine, a full B-complex, and an adaptogen blend for cognitive lift without a full pre-workout stack.',
  },
  {
    slug: 'neurolene',
    name: 'Neurolene — Focus',
    price: '$44.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Focus',
    available: true,
    variants: ['Sour Gummi Worm', 'Sour Grape', 'Sour Candy'],
    blurb: 'Cognitive-support powder built on L-tyrosine, L-theanine, and a B-complex — clean focus and processing speed.',
  },
  {
    slug: 'cognitive-relax-strips',
    name: 'Scyn — Cognitive Relaxation Strips',
    price: '$32.90',
    servings: '30 strips',
    type: 'Strip',
    category: 'Focus',
    available: true,
    blurb: 'Fast-dissolve oral strips with L-theanine, GABA, and vitamin B6 — situational calm and focus, no water needed.',
  },
];

/** Lookup by slug. Returns undefined if the slug is not in the catalog. */
export function getScytheneProduct(slug: string): ScytheneProduct | undefined {
  return SCYTHENE_PRODUCTS.find((p) => p.slug === slug);
}
