import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getStore } from '@/lib/storage';
import Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe - Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const compassSessionId = checkoutSession.metadata?.compassSessionId;

    if (compassSessionId) {
      try {
        const store = getStore();
        await store.update(compassSessionId, {
          payment: {
            status: 'completed',
            stripeCheckoutSessionId: checkoutSession.id,
            amount: checkoutSession.amount_total ?? 0,
            paidAt: new Date().toISOString(),
          },
          stage: 'assessment',
        });
        console.log(`Payment completed for session: ${compassSessionId}`);
      } catch (error) {
        console.error('Failed to update session after payment:', error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
