import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAssignmentStore } from '@/lib/storage';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = (session.user as Record<string, unknown>).role;
  if (role !== 'admin') return null;
  return session;
}

/**
 * PATCH /api/admin/assignments/[assignmentId] — update assignment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { assignmentId } = await params;
  const updates = await request.json();
  const assignmentStore = getAssignmentStore();
  const existing = await assignmentStore.read(assignmentId);

  if (!existing) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  }

  const safeUpdates: Record<string, unknown> = {};
  if (updates.deadline !== undefined) safeUpdates.deadline = updates.deadline;
  if (updates.notes !== undefined) safeUpdates.notes = updates.notes;
  if (updates.status) safeUpdates.status = updates.status;

  await assignmentStore.update(assignmentId, safeUpdates);
  const updated = await assignmentStore.read(assignmentId);

  return NextResponse.json({ assignment: updated });
}

/**
 * DELETE /api/admin/assignments/[assignmentId] — remove assignment
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { assignmentId } = await params;
  const assignmentStore = getAssignmentStore();
  const existing = await assignmentStore.read(assignmentId);

  if (!existing) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  }

  await assignmentStore.delete(assignmentId);
  return NextResponse.json({ success: true });
}
