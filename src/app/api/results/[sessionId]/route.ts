import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';
import { scoreAllDimensions, checkDisqualifiers } from '@/lib/scoring';
import { analyzeCrossDimensions } from '@/lib/cross-dimensions';
import { computeRoleFits } from '@/lib/role-fit';
import { determineArchetype } from '@/lib/archetypes';
import { AssessmentResults } from '@/lib/types';

/**
 * GET /api/results/[sessionId] - Compute and return full assessment results
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

    if (!session.version) {
      return NextResponse.json(
        { error: 'Session has no version selected — cannot compute full results' },
        { status: 400 }
      );
    }

    // Combine preview and full answers
    const allAnswers = [...session.previewAnswers, ...session.fullAnswers];

    if (allAnswers.length === 0) {
      return NextResponse.json(
        { error: 'No answers submitted yet' },
        { status: 400 }
      );
    }

    // Score all dimensions
    const dimensionScores = scoreAllDimensions(allAnswers);

    // Analyze cross-dimension pairings
    const crossDimensionPairings = analyzeCrossDimensions(dimensionScores);

    // Check universal disqualifiers
    const universalDisqualifiers = checkDisqualifiers(dimensionScores);

    // Compute role fits
    const roleFits = computeRoleFits(dimensionScores, session.version);

    // Determine behavioral archetype
    const archetype = determineArchetype(dimensionScores);

    const results: AssessmentResults = {
      dimensionScores,
      crossDimensionPairings,
      universalDisqualifiers,
      roleFits,
      archetype,
    };

    // Save results to session
    await store.update(sessionId, {
      results,
      stage: 'results',
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Failed to compute results:', error);
    return NextResponse.json(
      { error: 'Failed to compute results' },
      { status: 500 }
    );
  }
}
