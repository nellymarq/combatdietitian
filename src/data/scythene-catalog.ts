/**
 * Canonical Scythene product catalog — single source of truth.
 *
 * Consumed by:
 *   - src/pages/scythene.astro          (store page: Available Now + Coming Soon grids)
 *   - src/lib/affiliate.ts              (topic → product mapping for blog links)
 *   - src/components/ProductCTA.astro   (end-of-post product callout)
 *
 * Keep this in sync with scythene.com. Do NOT re-declare product arrays elsewhere —
 * import from here so price/availability never drift between surfaces.
 */

export interface ScytheneProduct {
  slug: string;
  name: string;
  price: string;
  servings: string;
  type: 'Powder' | 'Capsule' | 'Softgel';
  category: 'Performance' | 'Protein' | 'Hydration' | 'Foundation' | 'Recovery';
  available: boolean;
  /** One-line, evidence-forward blurb for the end-of-post CTA card. */
  blurb: string;
}

export const SCYTHENE_PRODUCTS: ScytheneProduct[] = [
  {
    slug: 'pre-workout',
    name: 'Pre-Workout',
    price: '$44.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Performance',
    available: true,
    blurb: 'Clinically-dosed pre-workout — caffeine, citrulline, and beta-alanine at label-transparent doses. No proprietary blends.',
  },
  {
    slug: 'whey-protein-vanilla',
    name: 'Whey Protein — Vanilla',
    price: '$54.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Protein',
    available: true,
    blurb: 'Third-party tested whey protein at a full per-serving dose — no fillers, no amino spiking.',
  },
  {
    slug: 'whey-protein-chocolate',
    name: 'Whey Protein — Chocolate',
    price: '$54.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Protein',
    available: true,
    blurb: 'Third-party tested whey protein at a full per-serving dose — no fillers, no amino spiking.',
  },
  {
    slug: 'creatine-monohydrate',
    name: 'Creatine Monohydrate',
    price: '$29.99',
    servings: '60 servings',
    type: 'Powder',
    category: 'Performance',
    available: true,
    blurb: 'Pure creatine monohydrate at the studied 3–5 g dose — the most-researched performance supplement in sport.',
  },
  {
    slug: 'electrolytes-berry',
    name: 'Electrolytes — Berry',
    price: '$29.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Hydration',
    available: true,
    blurb: 'Real-dose sodium and potassium for rehydration and post-weigh-in recovery — no sugar filler.',
  },
  {
    slug: 'omega-3',
    name: 'Omega-3',
    price: '$34.99',
    servings: '60 softgels',
    type: 'Softgel',
    category: 'Foundation',
    available: false,
    blurb: 'High-EPA/DHA fish oil for recovery and brain health — third-party tested for oxidation and purity.',
  },
  {
    slug: 'multivitamin',
    name: 'Multivitamin',
    price: '$34.99',
    servings: '60 capsules',
    type: 'Capsule',
    category: 'Foundation',
    available: false,
    blurb: 'A no-nonsense daily foundation multivitamin dosed for athletes — full label transparency.',
  },
  {
    slug: 'magnesium-bisglycinate',
    name: 'Magnesium Bisglycinate',
    price: '$24.99',
    servings: '60 capsules',
    type: 'Capsule',
    category: 'Recovery',
    available: false,
    blurb: 'Highly-absorbable magnesium bisglycinate for sleep, recovery, and neuromuscular function.',
  },
  {
    slug: 'beta-alanine',
    name: 'Beta-Alanine',
    price: '$24.99',
    servings: '60 servings',
    type: 'Powder',
    category: 'Performance',
    available: false,
    blurb: 'Beta-alanine at the daily dose shown to buffer fatigue in repeated high-intensity efforts.',
  },
  {
    slug: 'collagen-peptides-vitamin-c',
    name: 'Collagen Peptides + Vitamin C',
    price: '$39.99',
    servings: '30 servings',
    type: 'Powder',
    category: 'Recovery',
    available: false,
    blurb: 'Collagen peptides paired with vitamin C for connective-tissue and joint support around hard training.',
  },
  {
    slug: 'vitamin-d3-k2',
    name: 'Vitamin D3 + K2',
    price: '$19.99',
    servings: '60 softgels',
    type: 'Softgel',
    category: 'Foundation',
    available: false,
    blurb: 'Vitamin D3 with K2 for bone, immune, and performance support — a common gap in tested athletes.',
  },
  {
    slug: 'l-glutamine',
    name: 'L-Glutamine',
    price: '$24.99',
    servings: '60 servings',
    type: 'Powder',
    category: 'Recovery',
    available: false,
    blurb: 'L-glutamine to support gut integrity and recovery during high-volume training blocks.',
  },
  {
    slug: 'b-vitamins',
    name: 'B Vitamins',
    price: '$19.99',
    servings: '60 capsules',
    type: 'Capsule',
    category: 'Foundation',
    available: false,
    blurb: 'A complete B-complex to support energy metabolism during heavy training and weight-management phases.',
  },
];

/** Lookup by slug. Returns undefined if the slug is not in the catalog. */
export function getScytheneProduct(slug: string): ScytheneProduct | undefined {
  return SCYTHENE_PRODUCTS.find((p) => p.slug === slug);
}
