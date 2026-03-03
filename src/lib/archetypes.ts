import {
  DimensionId,
  DimensionScore,
  PillarId,
  PillarScore,
  ArchetypeMatchRule,
  ArchetypeDefinition,
  ArchetypeResult,
} from './types';
import { ARCHETYPES } from '@/data/archetypes';

// ─── Pillar Definitions ─────────────────────────────────────────────────────

const PILLAR_DIMENSIONS: Record<PillarId, DimensionId[]> = {
  drive: ['responsibility', 'control', 'energy-capacity', 'risk-orientation'],
  thinking: ['logical-thinking', 'creative-thinking', 'need-for-structure', 'learning-adaptability'],
  'social-emotional': ['feelings', 'communication', 'self-esteem', 'anxiety', 'world-outlook'],
  values: ['motivation-values', 'integrity'],
};

const PILLAR_IDS: PillarId[] = ['drive', 'thinking', 'social-emotional', 'values'];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getScoreMap(scores: DimensionScore[]): Map<DimensionId, number> {
  const map = new Map<DimensionId, number>();
  for (const s of scores) {
    map.set(s.dimensionId, s.rawScore);
  }
  return map;
}

/**
 * Compute pillar averages from dimension scores.
 * Anxiety is inverted (10 - score) so that low anxiety = high Social/Emotional pillar.
 */
export function computePillarScores(scores: DimensionScore[]): PillarScore[] {
  const scoreMap = getScoreMap(scores);

  return PILLAR_IDS.map(pillarId => {
    const dimensionIds = PILLAR_DIMENSIONS[pillarId];
    const dimensions = dimensionIds.map(dimId => {
      let score = scoreMap.get(dimId) ?? 5;
      // Invert anxiety: low anxiety is positive for social/emotional pillar
      if (dimId === 'anxiety') score = 10 - score;
      return { dimensionId: dimId, score };
    });

    const average =
      dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;

    return { pillarId, average: Math.round(average * 100) / 100, dimensions };
  });
}

// ─── Rule Evaluation ────────────────────────────────────────────────────────

function isPillarId(target: string): target is PillarId {
  return PILLAR_IDS.includes(target as PillarId);
}

/**
 * Evaluate a single match rule, returning a score between 0 and 1.
 * Uses a smooth sigmoid-like falloff so near-misses still partially match.
 */
function evaluateRule(
  rule: ArchetypeMatchRule,
  scoreMap: Map<DimensionId, number>,
  pillarMap: Map<PillarId, number>
): number {
  const value = isPillarId(rule.target)
    ? pillarMap.get(rule.target) ?? 5
    : scoreMap.get(rule.target as DimensionId) ?? 5;

  switch (rule.op) {
    case 'gte': {
      // Perfect match at or above threshold, smooth falloff below
      if (value >= rule.value) return 1;
      const diff = rule.value - value;
      // 2 points below threshold → ~0.14 match
      return Math.max(0, 1 - diff / 3);
    }
    case 'lte': {
      if (value <= rule.value) return 1;
      const diff = value - rule.value;
      return Math.max(0, 1 - diff / 3);
    }
    case 'range': {
      const min = rule.value;
      const max = rule.maxValue ?? rule.value + 3;
      if (value >= min && value <= max) return 1;
      const below = min - value;
      const above = value - max;
      const diff = Math.max(below, above);
      return Math.max(0, 1 - diff / 3);
    }
  }
}

/**
 * Score a single archetype definition against the user's profile.
 * Returns a confidence value from 0 to 1.
 */
function scoreArchetype(
  archetype: ArchetypeDefinition,
  scoreMap: Map<DimensionId, number>,
  pillarMap: Map<PillarId, number>
): number {
  let totalWeight = 0;
  let weightedScore = 0;

  for (const rule of archetype.matchRules) {
    const ruleScore = evaluateRule(rule, scoreMap, pillarMap);
    weightedScore += ruleScore * rule.weight;
    totalWeight += rule.weight;
  }

  return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

// ─── Main Entry Point ───────────────────────────────────────────────────────

/**
 * Determine primary and secondary archetype from dimension scores.
 */
export function determineArchetype(scores: DimensionScore[]): ArchetypeResult {
  const scoreMap = getScoreMap(scores);
  const pillarScores = computePillarScores(scores);
  const pillarMap = new Map<PillarId, number>();
  for (const ps of pillarScores) {
    pillarMap.set(ps.pillarId, ps.average);
  }

  // Score all archetypes
  const ranked = ARCHETYPES.map(archetype => ({
    archetype,
    confidence: scoreArchetype(archetype, scoreMap, pillarMap),
  })).sort((a, b) => b.confidence - a.confidence);

  const primary = ranked[0];
  const secondaryCandidate = ranked.length > 1 ? ranked[1] : null;

  // Only include secondary if it's a meaningful match (> 0.3)
  const secondary =
    secondaryCandidate && secondaryCandidate.confidence > 0.3
      ? {
          archetypeId: secondaryCandidate.archetype.id,
          name: secondaryCandidate.archetype.name,
          tagline: secondaryCandidate.archetype.tagline,
          confidence: Math.round(secondaryCandidate.confidence * 100) / 100,
        }
      : null;

  return {
    primary: {
      archetypeId: primary.archetype.id,
      name: primary.archetype.name,
      tagline: primary.archetype.tagline,
      description: primary.archetype.description,
      strengths: primary.archetype.strengths,
      watchOuts: primary.archetype.watchOuts,
      compatibleRoleFamilies: primary.archetype.compatibleRoleFamilies,
      confidence: Math.round(primary.confidence * 100) / 100,
    },
    secondary,
    pillarScores,
  };
}
