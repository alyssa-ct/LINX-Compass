import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserStore } from '@/lib/storage';
import { getEmailProvider } from '@/lib/email';
import { welcomeEmail } from '@/lib/email/templates';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, company, role } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required.' },
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
    const existing = await store.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();

    await store.create({
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: (company || '').trim(),
      role: role || 'user',
      createdAt: now,
      updatedAt: now,
    });

    // Send welcome email (fire-and-forget)
    const { subject, html, text } = welcomeEmail(firstName.trim());
    getEmailProvider().send({ to: email.toLowerCase().trim(), subject, html, text })
      .catch(err => console.error('Failed to send welcome email:', err));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
