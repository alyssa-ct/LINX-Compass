import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getUserStore } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: 'Email, token, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const store = getUserStore();
    const user = await store.findByEmail(email);

    if (!user || !user.passwordResetToken || !user.passwordResetExpiresAt) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link.' },
        { status: 400 }
      );
    }

    // Verify token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    if (hashedToken !== user.passwordResetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link.' },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date(user.passwordResetExpiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Update password and clear reset fields
    const passwordHash = await bcrypt.hash(password, 12);
    await store.update(user.id, {
      passwordHash,
      passwordResetToken: undefined,
      passwordResetExpiresAt: undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
