import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, import.meta.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Idempotency check
    const { data: existing } = await supabaseAdmin
      .from('enrollments')
      .select('id, calsanova_provisioned')
      .eq('stripe_checkout_session_id', session.id)
      .limit(1)
      .single();

    if (existing?.calsanova_provisioned) {
      return new Response('Already fully processed', { status: 200 });
    }

    // Find user
    let userId = session.metadata?.user_id;
    if (!userId && session.customer_email) {
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const matchedUser = users?.users?.find(u => u.email === session.customer_email);
      userId = matchedUser?.id;
    }

    if (!userId) {
      console.error('No user found for checkout session:', session.id);
      return new Response('No user found', { status: 200 });
    }

    // Create enrollment if it doesn't exist yet (success page may have created it already)
    if (!existing) {
      const { error } = await supabaseAdmin
        .from('enrollments')
        .insert({
          user_id: userId,
          course_slug: session.metadata?.course || 'performance-nutrition-foundation',
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          price_paid_cents: session.amount_total,
          calsanova_provisioned: false,
        });

      if (error) {
        console.error('Failed to create enrollment:', error);
      }
    }

    // Provision Calsanova account
    const customerEmail = session.customer_email || session.customer_details?.email;
    if (customerEmail) {
      const provisioned = await provisionCalsanovaAccount(customerEmail, session);

      // Update provisioning status
      await supabaseAdmin
        .from('enrollments')
        .update({ calsanova_provisioned: provisioned })
        .eq('stripe_checkout_session_id', session.id);
    }
  }

  // C-3: a refunded/charged-back course must not leave the buyer with the 30-day Calsanova Pro grant
  // (the advertised money-back guarantee). Revoke via the Calsanova academy/revoke endpoint, which is
  // idempotent (already_canceled = no-op) so duplicate/late deliveries are safe.
  // NOTE: requires the Stripe webhook on this account to subscribe to `charge.refunded`.
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const piId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
    if (piId) {
      const { data: enr } = await supabaseAdmin
        .from('enrollments')
        .select('id, user_id')
        .eq('stripe_payment_intent_id', piId)
        .limit(1)
        .single();
      if (enr?.user_id) {
        const { data: u } = await supabaseAdmin.auth.admin.getUserById(enr.user_id);
        const email = u?.user?.email;
        if (email) {
          await revokeCalsanovaAccount(email);
        } else {
          console.error(`[charge.refunded] no email for enrollment user ${enr.user_id} (charge ${charge.id})`);
        }
      } else {
        console.warn(`[charge.refunded] no enrollment for payment_intent ${piId} (charge ${charge.id})`);
      }
    }
  }

  return new Response('OK', { status: 200 });
};


async function provisionCalsanovaAccount(
  email: string,
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  const apiUrl = import.meta.env.CALSANOVA_API_URL;
  const secret = import.meta.env.CALSANOVA_PROVISION_SECRET;

  if (!apiUrl || !secret) {
    console.warn('Calsanova provisioning not configured — skipping');
    return false;
  }

  const name = session.customer_details?.name || email.split('@')[0];
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || name;
  const lastName = nameParts.slice(1).join(' ') || firstName;

  // Each course grants 30 days of Calsanova Pro access (stacks across courses)
  const extendDays = 30;

  try {
    const response = await fetch(`${apiUrl}/api/v1/admin/academy/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        extend_days: extendDays,
        // C-4: stable per-purchase key so a duplicate webhook delivery doesn't stack a 2nd 30-day grant.
        idempotency_key: session.id,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      // C-5: include the checkout session id for correlation.
      console.error(`Calsanova API returned ${response.status} (session ${session.id}): ${text}`);
      return false;
    }

    const result = await response.json();
    console.log('Calsanova provisioning result:', result);
    return result.status === 'provisioned' || result.status === 'extended';
  } catch (err) {
    console.error(`Calsanova provisioning failed (session ${session.id}):`, err);
    return false;
  }
}


/**
 * C-3 — revoke an Academy-granted Calsanova trial when a course is refunded/charged back.
 * Mirrors provisionCalsanovaAccount; the Calsanova endpoint only cancels academy-sourced subs and is
 * idempotent (already_canceled = no-op).
 */
async function revokeCalsanovaAccount(email: string): Promise<boolean> {
  const apiUrl = import.meta.env.CALSANOVA_API_URL;
  const secret = import.meta.env.CALSANOVA_PROVISION_SECRET;

  if (!apiUrl || !secret) {
    console.warn('Calsanova revoke not configured — skipping');
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/admin/academy/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
      body: JSON.stringify({ email, reason: 'course_refund' }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Calsanova revoke returned ${response.status}: ${text}`);
      return false;
    }

    const result = await response.json();
    console.log('Calsanova revoke result:', result);
    return result.status === 'revoked' || result.status === 'already_canceled';
  } catch (err) {
    console.error('Calsanova revoke failed:', err);
    return false;
  }
}
