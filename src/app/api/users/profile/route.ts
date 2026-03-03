import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserStore } from '@/lib/storage';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = getUserStore();
  const user = await store.findById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { firstName, lastName, company } = await request.json();

    if (firstName === undefined && lastName === undefined && company === undefined) {
      return NextResponse.json(
        { error: 'At least one field (firstName, lastName, company) is required.' },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = {};
    if (firstName !== undefined) {
      if (!firstName.trim()) {
        return NextResponse.json({ error: 'First name cannot be empty.' }, { status: 400 });
      }
      updates.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
      if (!lastName.trim()) {
        return NextResponse.json({ error: 'Last name cannot be empty.' }, { status: 400 });
      }
      updates.lastName = lastName.trim();
    }
    if (company !== undefined) {
      updates.company = company.trim();
    }

    const store = getUserStore();
    await store.update(session.user.id, updates);

    const user = await store.findById(session.user.id);
    return NextResponse.json({
      user: {
        id: user!.id,
        email: user!.email,
        firstName: user!.firstName,
        lastName: user!.lastName,
        company: user!.company,
        role: user!.role,
        createdAt: user!.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
