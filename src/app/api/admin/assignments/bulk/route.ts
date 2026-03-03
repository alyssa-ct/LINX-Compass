import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAssignmentStore, getStore, getUserStore } from '@/lib/storage';
import { selectQuestionsForSession } from '@/lib/question-selection';
import { AssessmentVersion, AssessmentSession, ClientAssignment } from '@/lib/types';
import { VERSION_CONFIGS } from '@/lib/constants';
import { getEmailProvider } from '@/lib/email';
import { assignmentNotificationEmail } from '@/lib/email/templates';

async function requireAdmin(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = (session.user as Record<string, unknown>).role;
  if (role !== 'admin') return null;
  return session.user.id;
}

/**
 * POST /api/admin/assignments/bulk — bulk create assignments
 * Body: { clientUserIds: string[], version: string, deadline?: string, notes?: string }
 */
export async function POST(request: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { clientUserIds, version, deadline, notes } = await request.json();

  if (!Array.isArray(clientUserIds) || clientUserIds.length === 0 || !version || !VERSION_CONFIGS[version]) {
    return NextResponse.json(
      { error: 'clientUserIds (non-empty array) and valid version are required.' },
      { status: 400 }
    );
  }

  const sessionStore = getStore();
  const assignmentStore = getAssignmentStore();
  const userStore = getUserStore();
  const now = new Date().toISOString();
  const created: ClientAssignment[] = [];

  // Pre-fetch all target users for email notifications
  const clientUsers = await Promise.all(
    clientUserIds.map((id: string) => userStore.findById(id))
  );
  const clientUserMap = new Map(
    clientUsers.filter(Boolean).map(u => [u!.id, u!])
  );

  for (const clientUserId of clientUserIds) {
    const { previewQuestionIds, fullQuestionIds } = selectQuestionsForSession(
      version as AssessmentVersion
    );

    const assessmentSession: AssessmentSession = {
      id: crypto.randomUUID(),
      userId: clientUserId,
      version: version as AssessmentVersion,
      user: null,
      stage: 'assessment',
      previewQuestionIds,
      fullQuestionIds,
      previewAnswers: [],
      fullAnswers: [],
      payment: null,
      assignedBy: adminId,
      createdAt: now,
      updatedAt: now,
    };

    await sessionStore.create(assessmentSession);

    const assignment: ClientAssignment = {
      id: crypto.randomUUID(),
      clientUserId,
      assignedBy: adminId,
      version: version as AssessmentVersion,
      sessionId: assessmentSession.id,
      deadline: deadline || undefined,
      notes: notes || undefined,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await assignmentStore.create(assignment);
    created.push(assignment);

    // Send assignment notification email (fire-and-forget)
    const clientUser = clientUserMap.get(clientUserId);
    if (clientUser) {
      const versionName = VERSION_CONFIGS[version as AssessmentVersion]?.name || version;
      const { subject, html, text } = assignmentNotificationEmail(
        clientUser.firstName,
        versionName,
        deadline
      );
      getEmailProvider().send({ to: clientUser.email, subject, html, text })
        .catch(err => console.error('Failed to send assignment notification:', err));
    }
  }

  return NextResponse.json({ assignments: created, count: created.length }, { status: 201 });
}

/**
 * PATCH /api/admin/assignments/bulk — bulk update assignments
 * Body: { assignmentIds: string[], updates: { deadline?, status?, notes? } }
 */
export async function PATCH(request: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { assignmentIds, updates } = await request.json();

  if (!Array.isArray(assignmentIds) || assignmentIds.length === 0) {
    return NextResponse.json(
      { error: 'assignmentIds (non-empty array) is required.' },
      { status: 400 }
    );
  }

  const assignmentStore = getAssignmentStore();
  const safeUpdates: Record<string, unknown> = {};
  if (updates.deadline !== undefined) safeUpdates.deadline = updates.deadline;
  if (updates.notes !== undefined) safeUpdates.notes = updates.notes;
  if (updates.status) safeUpdates.status = updates.status;

  let updated = 0;
  for (const id of assignmentIds) {
    try {
      await assignmentStore.update(id, safeUpdates);
      updated++;
    } catch {
      // Skip not-found
    }
  }

  return NextResponse.json({ updated });
}
