import { CompassQuestion, AssessmentVersion, DimensionId } from './types';
import { DIMENSION_IDS, VERSION_CONFIGS, PREVIEW_QUESTIONS_PER_DIMENSION } from './constants';
import { QUESTION_BANK } from '@/data/questions';

/**
 * Fisher-Yates shuffle (in-place)
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Select questions for a dimension maintaining proportional F/R/O representation.
 * Returns the selected questions in shuffled order.
 */
function selectForDimension(
  dimensionId: DimensionId,
  count: number
): CompassQuestion[] {
  const allItems = QUESTION_BANK[dimensionId];

  const fItems = allItems.filter(q => q.keying === 'F');
  const rItems = allItems.filter(q => q.keying === 'R');
  const oItems = allItems.filter(q => q.keying === 'O');

  const total = allItems.length;
  const fRatio = fItems.length / total;
  const rRatio = rItems.length / total;

  // Calculate proportional counts
  let fCount = Math.round(count * fRatio);
  let rCount = Math.round(count * rRatio);
  let oCount = count - fCount - rCount;

  // Clamp to available items
  fCount = Math.min(fCount, fItems.length);
  rCount = Math.min(rCount, rItems.length);
  oCount = Math.min(oCount, oItems.length);

  // Adjust if we're short
  const selected = fCount + rCount + oCount;
  if (selected < count) {
    const deficit = count - selected;
    // Fill from whichever pool has the most remaining
    const pools = [
      { items: fItems, used: fCount },
      { items: rItems, used: rCount },
      { items: oItems, used: oCount },
    ].sort((a, b) => (b.items.length - b.used) - (a.items.length - a.used));

    let remaining = deficit;
    for (const pool of pools) {
      const canAdd = Math.min(remaining, pool.items.length - pool.used);
      pool.used += canAdd;
      remaining -= canAdd;
      if (remaining <= 0) break;
    }
    fCount = pools.find(p => p.items === fItems)!.used;
    rCount = pools.find(p => p.items === rItems)!.used;
    oCount = pools.find(p => p.items === oItems)!.used;
  }

  const chosen = [
    ...shuffle(fItems).slice(0, fCount),
    ...shuffle(rItems).slice(0, rCount),
    ...shuffle(oItems).slice(0, oCount),
  ];

  return shuffle(chosen);
}

export interface SelectedQuestions {
  previewQuestionIds: string[];
  fullQuestionIds: string[];
  allQuestions: CompassQuestion[];
}

/**
 * Select all questions for an assessment session.
 * - Preview: 2 questions per dimension (30 total), randomly selected
 * - Full: remaining questions for the version's count per dimension
 *
 * Returns question IDs separated into preview and full sets.
 */
export function selectQuestionsForSession(
  version: AssessmentVersion
): SelectedQuestions {
  const config = VERSION_CONFIGS[version];
  const perDimension = config.questionsPerDimension;

  const previewIds: string[] = [];
  const fullIds: string[] = [];
  const allQuestions: CompassQuestion[] = [];

  for (const dimId of DIMENSION_IDS) {
    const selected = selectForDimension(dimId, perDimension);

    // First 2 go to preview, rest to full
    const preview = selected.slice(0, PREVIEW_QUESTIONS_PER_DIMENSION);
    const full = selected.slice(PREVIEW_QUESTIONS_PER_DIMENSION);

    previewIds.push(...preview.map(q => q.id));
    fullIds.push(...full.map(q => q.id));
    allQuestions.push(...selected);
  }

  return {
    previewQuestionIds: previewIds,
    fullQuestionIds: fullIds,
    allQuestions,
  };
}

/**
 * Select preview-only questions (no version needed).
 * Returns 2 questions per dimension (30 total).
 */
export function selectPreviewQuestions(): string[] {
  const previewIds: string[] = [];

  for (const dimId of DIMENSION_IDS) {
    const selected = selectForDimension(dimId, PREVIEW_QUESTIONS_PER_DIMENSION);
    previewIds.push(...selected.map(q => q.id));
  }

  return previewIds;
}

/**
 * Select remaining questions for a full assessment, excluding already-used preview IDs.
 * Returns question IDs for the full (paid) portion.
 */
export function selectRemainingQuestions(
  version: AssessmentVersion,
  existingPreviewIds: string[]
): string[] {
  const config = VERSION_CONFIGS[version];
  const perDimension = config.questionsPerDimension;
  const remainingPerDim = perDimension - PREVIEW_QUESTIONS_PER_DIMENSION;

  if (remainingPerDim <= 0) return [];

  const excludeSet = new Set(existingPreviewIds);
  const fullIds: string[] = [];

  for (const dimId of DIMENSION_IDS) {
    const allItems = QUESTION_BANK[dimId];
    const available = allItems.filter(q => !excludeSet.has(q.id));
    const selected = shuffle(available).slice(0, remainingPerDim);
    fullIds.push(...selected.map(q => q.id));
  }

  return fullIds;
}

/**
 * Get a CompassQuestion by its ID from the full bank.
 */
export function getQuestionById(id: string): CompassQuestion | undefined {
  const dimensionId = id.replace(/-\d+$/, '') as DimensionId;
  const questions = QUESTION_BANK[dimensionId];
  return questions?.find(q => q.id === id);
}
