import {
  DimensionScore,
  RoleFitResult,
  RoleFitResults,
  RoleTemplate,
  AssessmentVersion,
  DimensionId,
} from './types';
import { DIMENSIONS } from './constants';
import { ALL_ROLE_TEMPLATES } from '@/data/roles';

/**
 * Compute fitness score for a single dimension demand.
 * Returns 0-100 based on how well the candidate's score matches the demand.
 */
function scoreDimensionFit(
  candidateScore: number,
  minScore: number,
  idealScore: number
): number {
  // If idealScore is low (e.g., anxiety should be low), handle inverse
  const isInverse = idealScore < minScore;

  if (isInverse) {
    // For inverse dimensions (e.g., anxiety: ideal=4, we want LOW scores)
    // Perfect if at or below ideal
    if (candidateScore <= idealScore) return 100;
    // Acceptable if between ideal and min
    if (candidateScore <= minScore) {
      return 100 - ((candidateScore - idealScore) / (minScore - idealScore)) * 25;
    }
    // Penalty for exceeding min (going too high)
    const overage = candidateScore - minScore;
    return Math.max(0, 75 - overage * 15);
  }

  // Normal: higher is better
  if (candidateScore >= idealScore) return 100;
  if (candidateScore >= minScore) {
    return 75 + ((candidateScore - minScore) / (idealScore - minScore)) * 25;
  }
  // Below minimum
  const shortfall = minScore - candidateScore;
  return Math.max(0, 75 - shortfall * 15);
}

/**
 * Compute overall fit score for a role template against candidate scores.
 */
function computeRoleFit(
  role: RoleTemplate,
  scores: DimensionScore[]
): RoleFitResult {
  const getScore = (id: DimensionId): number =>
    scores.find(s => s.dimensionId === id)?.rawScore ?? 5;

  let totalWeightedFit = 0;
  let totalWeight = 0;
  const strengths: string[] = [];
  const gaps: string[] = [];
  let hasDisqualifyingGap = false;

  for (const demand of role.demands) {
    const candidateScore = getScore(demand.dimensionId);
    const dimensionName = DIMENSIONS[demand.dimensionId]?.name ?? demand.dimensionId;
    const fit = scoreDimensionFit(candidateScore, demand.minScore, demand.idealScore);

    totalWeightedFit += fit * demand.weight;
    totalWeight += demand.weight;

    // Determine if this is a strength or gap
    if (fit >= 90) {
      strengths.push(dimensionName);
    } else if (fit < 75) {
      gaps.push(dimensionName);
      if (demand.isDisqualifier) {
        hasDisqualifyingGap = true;
      }
    }
  }

  const fitScore = totalWeight > 0
    ? Math.round(totalWeightedFit / totalWeight)
    : 0;

  // Categorize
  let category: 'top-fit' | 'stretch-fit' | 'avoid-for-now';
  if (fitScore >= 75 && !hasDisqualifyingGap) {
    category = 'top-fit';
  } else if (fitScore >= 55 && !hasDisqualifyingGap) {
    category = 'stretch-fit';
  } else {
    category = 'avoid-for-now';
  }

  return {
    roleId: role.id,
    roleName: role.name,
    roleFamily: role.family,
    fitScore,
    category,
    strengths,
    gaps,
  };
}

/**
 * Compute role fits for all role templates.
 *
 * For Light version: only return top fits
 * For Standard: return top 5 fits
 * For Max: return full analysis
 */
export function computeRoleFits(
  scores: DimensionScore[],
  version: AssessmentVersion
): RoleFitResults {
  const allFits = ALL_ROLE_TEMPLATES.map(role => computeRoleFit(role, scores));

  // Sort by fit score descending
  allFits.sort((a, b) => b.fitScore - a.fitScore);

  const topFits = allFits.filter(f => f.category === 'top-fit');
  const stretchFits = allFits.filter(f => f.category === 'stretch-fit');
  const avoidForNow = allFits.filter(f => f.category === 'avoid-for-now');

  // Version-based filtering
  switch (version) {
    case 'light':
      return {
        topFits: topFits.slice(0, 3),
        stretchFits: [],
        avoidForNow: [],
      };
    case 'standard':
      return {
        topFits: topFits.slice(0, 5),
        stretchFits: stretchFits.slice(0, 3),
        avoidForNow: [],
      };
    case 'max':
      return {
        topFits,
        stretchFits,
        avoidForNow,
      };
  }
}
