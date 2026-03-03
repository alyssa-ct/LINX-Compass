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
 * GET /api/admin/assignments — list all assignments
 */
export async function GET(request: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');

  const assignmentStore = getAssignmentStore();
  let assignments = await assignmentStore.readAll();

  if (statusFilter) {
    assignments = assignments.filter(a => a.status === statusFilter);
  }

  return NextResponse.json({ assignments });
}

/**
 * POST /api/admin/assignments — create a new assignment
 * Creates a pre-configured session for the client.
 */
export async function POST(request: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { clientUserId, version, deadline, notes } = await request.json();

  if (!clientUserId || !version || !VERSION_CONFIGS[version]) {
    return NextResponse.json(
      { error: 'clientUserId and valid version are required.' },
      { status: 400 }
    );
  }

  // Create the pre-configured assessment session
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sessionStore = getStore();
  await sessionStore.create(assessmentSession);

  // Create the assignment record
  const now = new Date().toISOString();
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

  const assignmentStore = getAssignmentStore();
  await assignmentStore.create(assignment);

  // Send assignment notification email (fire-and-forget)
  const userStore = getUserStore();
  const clientUser = await userStore.findById(clientUserId);
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

  return NextResponse.json({ assignment }, { status: 201 });
}
