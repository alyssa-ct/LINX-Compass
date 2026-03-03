import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserStore, getAssignmentStore, getStore } from '@/lib/storage';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = (session.user as Record<string, unknown>).role;
  if (role !== 'admin') return null;
  return session;
}

/**
 * GET /api/admin/clients/[clientId] — single client details
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { clientId } = await params;
  const userStore = getUserStore();
  const client = await userStore.findById(clientId);

  if (!client || client.role !== 'client') {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  const assignmentStore = getAssignmentStore();
  const assignments = await assignmentStore.findByClient(clientId);

  // Get session progress for each assignment
  const sessionStore = getStore();
  const enriched = await Promise.all(
    assignments.map(async a => {
      if (a.sessionId) {
        const sess = await sessionStore.read(a.sessionId);
        return {
          ...a,
          progress: sess ? {
            stage: sess.stage,
            previewAnswered: sess.previewAnswers.length,
            fullAnswered: sess.fullAnswers.length,
            fullTotal: sess.fullQuestionIds.length,
            hasResults: !!sess.results,
          } : null,
        };
      }
      return { ...a, progress: null };
    })
  );

  return NextResponse.json({
    client: {
      id: client.id,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      company: client.company,
      createdAt: client.createdAt,
    },
    assignments: enriched,
  });
}

/**
 * PATCH /api/admin/clients/[clientId] — update client info
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { clientId } = await params;
  const updates = await request.json();

  const userStore = getUserStore();
  const client = await userStore.findById(clientId);
  if (!client || client.role !== 'client') {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  // Only allow updating safe fields
  const safeUpdates: Record<string, string> = {};
  if (updates.firstName) safeUpdates.firstName = updates.firstName;
  if (updates.lastName) safeUpdates.lastName = updates.lastName;
  if (updates.company !== undefined) safeUpdates.company = updates.company;

  await userStore.update(clientId, safeUpdates);
  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/admin/clients/[clientId] — remove client
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { clientId } = await params;
  const userStore = getUserStore();
  const client = await userStore.findById(clientId);
  if (!client || client.role !== 'client') {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  // Soft-delete: mark as inactive by changing role
  await userStore.update(clientId, { role: 'user' } as Record<string, string>);
  return NextResponse.json({ success: true });
}
