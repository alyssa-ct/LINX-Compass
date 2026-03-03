import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getUserStore } from '@/lib/storage';
import { getEmailProvider } from '@/lib/email';
import { passwordResetEmail } from '@/lib/email/templates';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    const store = getUserStore();
    const user = await store.findByEmail(email);

    // Always return success to prevent email enumeration
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await store.update(user.id, {
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: expiresAt,
      });

      const resetUrl = `${BASE_URL}/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
      const { subject, html, text } = passwordResetEmail(user.firstName, resetUrl);

      getEmailProvider().send({ to: user.email, subject, html, text })
        .catch(err => console.error('Failed to send password reset email:', err));
    }

    return NextResponse.json({
      message: 'If an account exists with that email, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
