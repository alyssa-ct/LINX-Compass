import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';
import { auth } from '@/lib/auth';
import { selectRemainingQuestions } from '@/lib/question-selection';
import { AssessmentVersion } from '@/lib/types';
import { VERSION_CONFIGS } from '@/lib/constants';

/**
 * GET /api/sessions/[sessionId] - Read a single session
 * If the session has a userId, only the owner (or guest sessions) can access it.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const store = getStore();
    const session = await store.read(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Owner check: if session belongs to a user, verify caller is that user
    if (session.userId) {
      const authSession = await auth();
      if (!authSession?.user?.id || authSession.user.id !== session.userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Failed to read session:', error);
    return NextResponse.json(
      { error: 'Failed to read session' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/sessions/[sessionId] - Update a session
 *
 * Handles:
 * - Submitting answers (previewAnswers / fullAnswers)
 * - Advancing stage
 * - Upgrade: when `version` is set and existing.version is null,
 *   selects remaining questions and sets up for full assessment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const updates = await request.json();

    const store = getStore();
    const existing = await store.read(sessionId);

    if (!existing) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Upgrade logic: version provided + existing has no version = upgrade from preview
    if (updates.version && existing.version === null) {
      const version = updates.version as AssessmentVersion;
      if (!VERSION_CONFIGS[version]) {
        return NextResponse.json(
          { error: 'Invalid assessment version' },
          { status: 400 }
        );
      }

      const fullQuestionIds = selectRemainingQuestions(
        version,
        existing.previewQuestionIds
      );

      updates.fullQuestionIds = fullQuestionIds;
      updates.payment = {
        status: 'pending',
        amount: VERSION_CONFIGS[version].priceCents,
      };
    }

    await store.update(sessionId, updates);
    const updated = await store.read(sessionId);

    return NextResponse.json({ session: updated });
  } catch (error) {
    console.error('Failed to update session:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
