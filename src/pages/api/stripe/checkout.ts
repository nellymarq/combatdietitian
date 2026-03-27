import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { getUser, isEnrolled } from '../../../lib/supabase/server';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

// Map course slugs to Stripe price IDs
const COURSE_PRICES: Record<string, string> = {
  'performance-nutrition-foundation': import.meta.env.STRIPE_PRICE_ID,
  'combat-sports-specialization': import.meta.env.STRIPE_PRICE_COMBAT,
  'tactical-nutrition-specialization': import.meta.env.STRIPE_PRICE_TACTICAL,
};

const COURSE_NAMES: Record<string, string> = {
  'performance-nutrition-foundation': 'CD Academy: Foundation',
  'combat-sports-specialization': 'CD Academy: Combat Sports Specialization',
  'tactical-nutrition-specialization': 'CD Academy: Tactical Nutrition Specialization',
};

export const POST: APIRoute = async ({ cookies, redirect, url, request }) => {
  const user = await getUser(cookies);

  const formData = await request.formData();
  const courseSlug = formData.get('course')?.toString() || 'performance-nutrition-foundation';

  // Validate course slug
  const priceId = COURSE_PRICES[courseSlug];
  if (!priceId) {
    return new Response('Invalid course', { status: 400 });
  }

  // If logged in and buying foundation, check if already enrolled
  if (user && courseSlug === 'performance-nutrition-foundation') {
    const enrolled = await isEnrolled(cookies, user.id);
    if (enrolled) {
      return redirect('/academy/dashboard');
    }
  }

  const siteUrl = import.meta.env.PUBLIC_SITE_URL || url.origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/academy/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/academy?canceled=true`,
    ...(user?.email ? { customer_email: user.email } : {}),
    metadata: {
      user_id: user?.id || '',
      course: courseSlug,
      provision_calsanova: 'true',
    },
  });

  if (!session.url) {
    return new Response('Failed to create checkout session', { status: 500 });
  }

  return redirect(session.url);
};
