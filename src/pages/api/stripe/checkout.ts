import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { getUser, isEnrolled } from '../../../lib/supabase/server';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ cookies, redirect, url }) => {
  const user = await getUser(cookies);

  // If logged in, check if already enrolled
  if (user) {
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
        price: import.meta.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/academy/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/academy?canceled=true`,
    ...(user?.email ? { customer_email: user.email } : {}),
    metadata: {
      user_id: user?.id || '',
      course: 'combat-nutrition-fundamentals',
    },
  });

  if (!session.url) {
    return new Response('Failed to create checkout session', { status: 500 });
  }

  return redirect(session.url);
};
