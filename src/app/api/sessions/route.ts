import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';
import { auth } from '@/lib/auth';
import { selectQuestionsForSession, selectPreviewQuestions } from '@/lib/question-selection';
import { AssessmentSession, AssessmentVersion } from '@/lib/types';
import { VERSION_CONFIGS } from '@/lib/constants';

/**
 * POST /api/sessions - Create a new assessment session
 *
 * Two modes:
 * 1. No version → preview-only session (self-service flow, zero friction)
 * 2. With version → full session (admin-assigned flow)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { version, user, assignedBy } = body;

    const authSession = await auth();

    if (version) {
      // Full session creation (admin-assigned or direct)
      if (!VERSION_CONFIGS[version]) {
        return NextResponse.json(
          { error: 'Invalid assessment version' },
          { status: 400 }
        );
      }

      const { previewQuestionIds, fullQuestionIds } = selectQuestionsForSession(
        version as AssessmentVersion
      );

      const session: AssessmentSession = {
        id: crypto.randomUUID(),
        userId: authSession?.user?.id,
        version: version as AssessmentVersion,
        user: user ? {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          company: user.company || '',
        } : null,
        stage: assignedBy ? 'assessment' : 'preview',
        previewQuestionIds,
        fullQuestionIds,
        previewAnswers: [],
        fullAnswers: [],
        payment: assignedBy ? null : {
          status: 'pending',
          amount: VERSION_CONFIGS[version].priceCents,
        },
        assignedBy: assignedBy || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const store = getStore();
      await store.create(session);
      return NextResponse.json({ session }, { status: 201 });
    } else {
      // Preview-only session (self-service, zero friction)
      const previewQuestionIds = selectPreviewQuestions();

      const session: AssessmentSession = {
        id: crypto.randomUUID(),
        userId: authSession?.user?.id,
        version: null,
        user: null,
        stage: 'preview',
        previewQuestionIds,
        fullQuestionIds: [],
        previewAnswers: [],
        fullAnswers: [],
        payment: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const store = getStore();
      await store.create(session);
      return NextResponse.json({ session }, { status: 201 });
    }
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions - List all sessions (admin)
 */
export async function GET() {
  try {
    const store = getStore();
    const sessions = await store.readAll();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Failed to list sessions:', error);
    return NextResponse.json(
      { error: 'Failed to list sessions' },
      { status: 500 }
    );
  }
}
