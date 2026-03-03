import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getStore } from '@/lib/storage';
import { VERSION_CONFIGS } from '@/lib/constants';

/**
 * POST /api/checkout - Create a Stripe Checkout Session
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const store = getStore();
    const session = await store.read(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (!session.version) {
      return NextResponse.json(
        { error: 'Session has no version selected' },
        { status: 400 }
      );
    }

    const config = VERSION_CONFIGS[session.version];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Dev bypass: skip Stripe when no secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      await store.update(sessionId, {
        payment: {
          status: 'completed' as const,
          amount: config.priceCents,
          stripeCheckoutSessionId: `dev_${Date.now()}`,
        },
      });
      return NextResponse.json({
        url: `${baseUrl}/payment/success?session_id=${sessionId}`,
      });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `LINX Compass - ${config.name}`,
              description: `${config.totalQuestions}-question behavioral assessment with ${config.features.length} features`,
            },
            unit_amount: config.priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/payment/success?session_id=${sessionId}`,
      cancel_url: `${baseUrl}/payment/cancel?session_id=${sessionId}`,
      customer_email: session.user?.email || undefined,
      metadata: {
        compassSessionId: sessionId,
      },
    });

    // Store the Stripe checkout session ID
    await store.update(sessionId, {
      payment: {
        ...(session.payment || { status: 'pending' as const, amount: config.priceCents }),
        stripeCheckoutSessionId: checkoutSession.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
