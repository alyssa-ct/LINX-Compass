import {
  DimensionId,
  DimensionScore,
  AnsweredQuestion,
  LikertResponse,
  QuestionKeying,
  DisqualifierFlag,
} from './types';
import {
  FORWARD_POINT_MAP,
  REVERSE_POINT_MAP,
  OVERUSE_THRESHOLD,
  DISQUALIFIER_RULES,
  DIMENSIONS,
  getScoreBand,
} from './constants';
import { getQuestionById } from './question-selection';

// ─── Point Conversion ────────────────────────────────────────────────────────

/**
 * Convert a Likert response to points based on the item keying.
 *
 * For the main dimension score:
 * - F items always use Forward mapping
 * - R items always use Reverse mapping
 * - O items use Forward mapping by default
 *   EXCEPT for Need for Structure (O items scored as Reverse per spec)
 */
export function responseToPoints(
  response: LikertResponse,
  keying: QuestionKeying,
  dimensionId: DimensionId
): number {
  if (keying === 'F') return FORWARD_POINT_MAP[response];
  if (keying === 'R') return REVERSE_POINT_MAP[response];

  // O items: mostly Forward, except Need for Structure where O = Reverse
  if (dimensionId === 'need-for-structure') {
    return REVERSE_POINT_MAP[response];
  }
  return FORWARD_POINT_MAP[response];
}

/**
 * Convert a Likert response to Overuse Index points (always Forward mapping).
 */
export function responseToOverusePoints(response: LikertResponse): number {
  return FORWARD_POINT_MAP[response];
}

// ─── Dimension Score Computation ─────────────────────────────────────────────

/**
 * Compute score on 1-10 scale from mean points.
 * Formula: (9 * mean_points - 10) / 8, clamped to [1, 10]
 */
export function pointsToScore(meanPoints: number): number {
  const raw = (9 * meanPoints - 10) / 8;
  return Math.max(1, Math.min(10, raw));
}

/**
 * Score a single dimension from answered questions.
 */
export function scoreDimension(
  dimensionId: DimensionId,
  answers: AnsweredQuestion[]
): DimensionScore {
  // Filter answers belonging to this dimension
  const dimensionAnswers = answers.filter(a => {
    const q = getQuestionById(a.questionId);
    return q?.dimensionId === dimensionId;
  });

  if (dimensionAnswers.length === 0) {
    return {
      dimensionId,
      rawScore: 0,
      band: 'very-low',
      overuseIndex: null,
      overuseFlag: false,
      interpretation: 'Insufficient data to score this dimension.',
    };
  }

  // Main dimension score
  const points: number[] = [];
  const overusePoints: number[] = [];

  for (const answer of dimensionAnswers) {
    const question = getQuestionById(answer.questionId);
    if (!question) continue;

    const pt = responseToPoints(
      answer.response as LikertResponse,
      question.keying,
      dimensionId
    );
    points.push(pt);

    // Collect overuse points separately
    if (question.keying === 'O') {
      overusePoints.push(responseToOverusePoints(answer.response as LikertResponse));
    }
  }

  const meanPoints = points.reduce((sum, p) => sum + p, 0) / points.length;
  const rawScore = pointsToScore(meanPoints);
  const band = getScoreBand(rawScore);

  // Overuse Index
  let overuseIndex: number | null = null;
  let overuseFlag = false;
  if (overusePoints.length > 0) {
    const overuseMean = overusePoints.reduce((sum, p) => sum + p, 0) / overusePoints.length;
    overuseIndex = pointsToScore(overuseMean);
    overuseFlag = overuseIndex >= OVERUSE_THRESHOLD;
  }

  const dimension = DIMENSIONS[dimensionId];
  const interpretation = dimension.bandInterpretations[band];

  return {
    dimensionId,
    rawScore: Math.round(rawScore * 100) / 100,
    band,
    overuseIndex: overuseIndex !== null ? Math.round(overuseIndex * 100) / 100 : null,
    overuseFlag,
    interpretation,
  };
}

// ─── Full Assessment Scoring ─────────────────────────────────────────────────

/**
 * Score all 15 dimensions from a combined set of answers.
 */
export function scoreAllDimensions(
  answers: AnsweredQuestion[]
): DimensionScore[] {
  const dimensionIds: DimensionId[] = [
    'responsibility', 'control', 'feelings', 'risk-orientation',
    'energy-capacity', 'communication', 'world-outlook', 'need-for-structure',
    'logical-thinking', 'creative-thinking', 'anxiety', 'self-esteem',
    'motivation-values', 'learning-adaptability', 'integrity',
  ];

  return dimensionIds.map(id => scoreDimension(id, answers));
}

// ─── Universal Disqualifiers ─────────────────────────────────────────────────

/**
 * Check universal disqualifier flags based on dimension scores.
 */
export function checkDisqualifiers(
  scores: DimensionScore[]
): DisqualifierFlag[] {
  const getScore = (id: DimensionId): number =>
    scores.find(s => s.dimensionId === id)?.rawScore ?? 0;

  const integrityScore = getScore('integrity');
  const responsibilityScore = getScore('responsibility');
  const energyScore = getScore('energy-capacity');
  const controlScore = getScore('control');
  const feelingsScore = getScore('feelings');
  const controlFeelingsGap = Math.abs(controlScore - feelingsScore);

  return [
    {
      id: 'integrity-low',
      label: 'Low Integrity',
      description: `Integrity score below ${DISQUALIFIER_RULES.integrityMin}`,
      triggered: integrityScore < DISQUALIFIER_RULES.integrityMin,
      details: `Integrity score: ${integrityScore.toFixed(1)}. Scores below ${DISQUALIFIER_RULES.integrityMin} indicate potential ethical concerns that may disqualify from most professional roles.`,
    },
    {
      id: 'responsibility-low',
      label: 'Low Responsibility',
      description: `Responsibility score below ${DISQUALIFIER_RULES.responsibilityMin}`,
      triggered: responsibilityScore < DISQUALIFIER_RULES.responsibilityMin,
      details: `Responsibility score: ${responsibilityScore.toFixed(1)}. Scores below ${DISQUALIFIER_RULES.responsibilityMin} indicate accountability concerns that may impact role suitability.`,
    },
    {
      id: 'energy-low',
      label: 'Low Energy',
      description: `Energy & Capacity score below ${DISQUALIFIER_RULES.energyMin}`,
      triggered: energyScore < DISQUALIFIER_RULES.energyMin,
      details: `Energy score: ${energyScore.toFixed(1)}. Scores below ${DISQUALIFIER_RULES.energyMin} suggest sustained effort may be a challenge across most roles.`,
    },
    {
      id: 'control-feelings-gap',
      label: 'Control-Feelings Imbalance',
      description: `Control-Feelings gap exceeds ${DISQUALIFIER_RULES.controlFeelingsGapMax}`,
      triggered: controlFeelingsGap > DISQUALIFIER_RULES.controlFeelingsGapMax,
      details: `Control score: ${controlScore.toFixed(1)}, Feelings score: ${feelingsScore.toFixed(1)} (gap: ${controlFeelingsGap.toFixed(1)}). A gap exceeding ${DISQUALIFIER_RULES.controlFeelingsGapMax} indicates potential emotional regulation concerns.`,
    },
  ];
}
