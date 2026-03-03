import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAssignmentStore } from '@/lib/storage';

/**
 * GET /api/users/assignments — get assignments for the current user (client role)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignmentStore = getAssignmentStore();
    const assignments = await assignmentStore.findByClient(session.user.id);

    return NextResponse.json({
      assignments: assignments.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error('Failed to fetch user assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}
