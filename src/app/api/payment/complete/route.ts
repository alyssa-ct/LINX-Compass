import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getStore, getUserStore } from '@/lib/storage';

/**
 * POST /api/payment/complete — finalize payment + create user account
 *
 * Called by the payment success page after the user sets their password.
 * Creates an account from the session's captured name/email + chosen password.
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, password } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const store = getStore();
    const session = await store.read(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.user) {
      return NextResponse.json({ error: 'Session has no user info' }, { status: 400 });
    }

    if (!session.version) {
      return NextResponse.json({ error: 'Session has no version selected' }, { status: 400 });
    }

    const userStore = getUserStore();
    const existingUser = await userStore.findByEmail(session.user.email);

    if (existingUser) {
      // User already has an account — just link the session and proceed
      await store.update(sessionId, {
        userId: existingUser.id,
        stage: 'assessment',
      });

      return NextResponse.json({
        alreadyRegistered: true,
        email: existingUser.email,
      });
    }

    // New account — password is required
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();
    const userId = crypto.randomUUID();

    await userStore.create({
      id: userId,
      email: session.user.email.toLowerCase().trim(),
      passwordHash,
      firstName: session.user.firstName.trim(),
      lastName: session.user.lastName.trim(),
      company: (session.user.company || '').trim(),
      role: 'user',
      createdAt: now,
      updatedAt: now,
    });

    // Link user to session and move to assessment stage
    await store.update(sessionId, {
      userId,
      stage: 'assessment',
    });

    return NextResponse.json({
      alreadyRegistered: false,
      email: session.user.email,
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete payment setup' },
      { status: 500 }
    );
  }
}
