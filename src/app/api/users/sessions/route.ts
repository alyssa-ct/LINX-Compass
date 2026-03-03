import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getStore } from '@/lib/storage';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const store = getStore();
    const allSessions = await store.readAll();
    const userSessions = allSessions
      .filter(s => s.userId === session.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ sessions: userSessions });
  } catch (error) {
    console.error('Failed to fetch user sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
