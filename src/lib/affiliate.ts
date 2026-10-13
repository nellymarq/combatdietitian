/**
 * Affiliate / cross-sell link helpers.
 *
 * Scythene is a sibling MPS LLC brand, so blog links route purchase-intent to our
 * own store (full margin) rather than an external ad network. UTM params let
 * Scythene's analytics attribute traffic + conversions back to combatdietitian.com
 * per source post.
 *
 * Product URLs are the canonical scythene.com/supplements/<group-slug> form (the
 * legacy /products/<slug> paths 301 there — avoid the hop). Slugs come from
 * src/data/scythene-catalog.ts.
 *
 * Amazon Associates is a *fallback* tier for supplements Scythene does not sell
 * (e.g. sodium bicarbonate, tart cherry, standalone beta-alanine). It is inert
 * until AMAZON_ASSOCIATES_TAG is populated — no untagged Amazon links ship.
 */

import { getScytheneProduct } from '../data/scythene-catalog';

export const SCYTHENE_ORIGIN = 'https://scythene.com';
export const SCYTHENE_PRODUCT_PATH = '/supplements';

/** Populate when the Amazon Associates account is live, e.g. 'combatdietitian-20'. */
export const AMAZON_ASSOCIATES_TAG = '';

export type UtmMedium = 'blog' | 'blog-cta' | 'nav' | 'footer' | 'store-page';

/**
 * Build a UTM-tagged Scythene product URL.
 * @param slug      product slug from the catalog
 * @param contentId usually the source post slug (utm_content), for per-post attribution
 * @param medium    surface the link lives on (inline body vs CTA card vs nav/footer)
 */
export function scytheneProductUrl(
  slug: string,
  contentId?: string,
  medium: UtmMedium = 'blog',
): string {
  return withUtm(`${SCYTHENE_ORIGIN}${SCYTHENE_PRODUCT_PATH}/${slug}`, contentId, medium);
}

/** UTM-tagged link to the Scythene storefront root. */
export function scytheneShopUrl(contentId?: string, medium: UtmMedium = 'blog'): string {
  return withUtm(SCYTHENE_ORIGIN, contentId, medium);
}

function withUtm(base: string, contentId: string | undefined, medium: UtmMedium): string {
  const params = new URLSearchParams({
    utm_source: 'combatdietitian',
    utm_medium: medium,
    utm_campaign: 'supplement-links',
  });
  if (contentId) params.set('utm_content', contentId);
  return `${base}?${params.toString()}`;
}

/**
 * Topic keyword → Scythene product slug. The fan-out uses this to decide which
 * product a given supplement mention should link to. Keys are lowercase and
 * matched against blog copy; longer/more-specific keys should be checked first.
 *
 * Deliberately unmapped (Scythene does not sell a matching product — leave as
 * plain text): standalone beta-alanine, standalone B-vitamins, sodium
 * bicarbonate, tart cherry, vitamin C, iron, zinc.
 */
export const TOPIC_TO_SLUG: Record<string, string> = {
  creatine: 'creatine-monohydrate',
  'pre-workout': 'pre-workout',
  'pre workout': 'pre-workout',
  preworkout: 'pre-workout',
  caffeine: 'pre-workout',
  citrulline: 'nitric-oxide',
  'nitric oxide': 'nitric-oxide',
  beetroot: 'beetroot',
  'beet juice': 'beetroot',
  nitrate: 'beetroot',
  whey: 'whey-protein',
  'whey protein': 'whey-protein',
  'protein powder': 'whey-protein',
  bcaa: 'bcaa-recovery',
  bcaas: 'bcaa-recovery',
  electrolyte: 'electrolytes',
  electrolytes: 'electrolytes',
  'omega-3': 'omega-3',
  'omega 3': 'omega-3',
  'fish oil': 'omega-3',
  magnesium: 'magnesium-glycinate',
  'vitamin d': 'vitamin-d3',
  multivitamin: 'multivitamin',
  collagen: 'collagen-peptides',
  glutamine: 'l-glutamine',
  greens: 'greens',
};

/** Resolve a topic keyword to a catalog product (or undefined if unmapped/unknown). */
export function productForTopic(topic: string) {
  const slug = TOPIC_TO_SLUG[topic.toLowerCase()];
  return slug ? getScytheneProduct(slug) : undefined;
}
