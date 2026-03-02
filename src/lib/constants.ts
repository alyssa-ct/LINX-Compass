import {
  DimensionId,
  DimensionDefinition,
  VersionConfig,
  ScoreBand,
} from './types';

// ─── Brand Colors ────────────────────────────────────────────────────────────

export const colors = {
  porcelain: '#FFFCF9',
  indigo: '#1B2845',
  scarlet: '#DC303C',
  cream: '#E6C79C',
  slate: '#737B81',
  charcoal: '#2D3436',
  white: '#FFFFFF',
} as const;

// ─── Assessment Version Configs ──────────────────────────────────────────────

export const VERSION_CONFIGS: Record<string, VersionConfig> = {
  light: {
    id: 'light',
    name: 'Compass Light',
    questionsPerDimension: 10,
    totalQuestions: 150,
    previewQuestions: 30,
    paidQuestions: 120,
    priceUsd: 149,
    priceCents: 14900,
    features: [
      '15 dimension scores with score bands',
      'Basic interpretation per dimension',
      'Universal disqualifier flags',
    ],
  },
  standard: {
    id: 'standard',
    name: 'Compass Standard',
    questionsPerDimension: 15,
    totalQuestions: 225,
    previewQuestions: 30,
    paidQuestions: 195,
    priceUsd: 249,
    priceCents: 24900,
    features: [
      'Everything in Light',
      'Overuse index per dimension',
      'Cross-dimension pairing insights',
      'Top 5 role-fit recommendations',
    ],
  },
  max: {
    id: 'max',
    name: 'Compass Max',
    questionsPerDimension: 20,
    totalQuestions: 300,
    previewQuestions: 30,
    paidQuestions: 270,
    priceUsd: 349,
    priceCents: 34900,
    features: [
      'Everything in Standard',
      'Full role-fit analysis (50+ roles)',
      'Stretch-fit & avoid-for-now roles',
      'Detailed strength & gap analysis per role',
      'Executive summary narrative',
    ],
  },
};

// ─── Preview Questions Per Dimension ─────────────────────────────────────────

export const PREVIEW_QUESTIONS_PER_DIMENSION = 2;
export const TOTAL_PREVIEW_QUESTIONS = 30;

// ─── Likert Scale Labels ─────────────────────────────────────────────────────

export const LIKERT_LABELS: Record<number, string> = {
  1: 'Disagree',
  2: 'Slightly Disagree',
  3: 'Neutral',
  4: 'Slightly Agree',
  5: 'Agree',
};

// ─── Scoring Constants ───────────────────────────────────────────────────────

export const FORWARD_POINT_MAP: Record<number, number> = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
};

export const REVERSE_POINT_MAP: Record<number, number> = {
  1: 10,
  2: 8,
  3: 6,
  4: 4,
  5: 2,
};

export const OVERUSE_THRESHOLD = 8;

// ─── Score Band Thresholds ───────────────────────────────────────────────────

export function getScoreBand(score: number): ScoreBand {
  if (score < 3) return 'very-low';
  if (score < 5) return 'low';
  if (score < 7) return 'moderate';
  if (score < 8.5) return 'high';
  return 'very-high';
}

// ─── Universal Disqualifier Thresholds ───────────────────────────────────────

export const DISQUALIFIER_RULES = {
  integrityMin: 5,
  responsibilityMin: 5,
  energyMin: 4,
  controlFeelingsGapMax: 1.5,
} as const;

// ─── All 15 Dimension IDs (ordered) ─────────────────────────────────────────

export const DIMENSION_IDS: DimensionId[] = [
  'responsibility',
  'control',
  'feelings',
  'risk-orientation',
  'energy-capacity',
  'communication',
  'world-outlook',
  'need-for-structure',
  'logical-thinking',
  'creative-thinking',
  'anxiety',
  'self-esteem',
  'motivation-values',
  'learning-adaptability',
  'integrity',
];

// ─── Dimension Definitions ───────────────────────────────────────────────────

export const DIMENSIONS: Record<DimensionId, DimensionDefinition> = {
  responsibility: {
    id: 'responsibility',
    name: 'Responsibility',
    shortDescription: 'Measures accountability, dependability, and ownership of tasks and outcomes.',
    lowLabel: 'Avoids ownership',
    highLabel: 'Takes full accountability',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'May avoid commitments or deflect blame. Struggles with follow-through and accountability.',
      'low': 'Inconsistent with commitments. May need external accountability structures.',
      'moderate': 'Generally reliable but may occasionally avoid difficult ownership situations.',
      'high': 'Consistently dependable. Takes ownership of outcomes and follows through on commitments.',
      'very-high': 'Extremely accountable, possibly to the point of over-burdening themselves with others\' responsibilities.',
    },
  },
  control: {
    id: 'control',
    name: 'Control',
    shortDescription: 'Measures need for control over environment, decisions, and outcomes.',
    lowLabel: 'Go-with-the-flow',
    highLabel: 'Needs to direct',
    healthyRange: [4, 7],
    bandInterpretations: {
      'very-low': 'Very passive in directing outcomes. May feel helpless or defer excessively to others.',
      'low': 'Comfortable letting others lead. May struggle when personal agency is required.',
      'moderate': 'Balanced between directing and deferring. Adapts control style to context.',
      'high': 'Prefers to be in charge. Proactive in shaping outcomes and environment.',
      'very-high': 'May become controlling or rigid. Struggles to delegate or share decision-making.',
    },
  },
  feelings: {
    id: 'feelings',
    name: 'Feelings',
    shortDescription: 'Measures emotional awareness, expression, and comfort with emotions.',
    lowLabel: 'Emotionally reserved',
    highLabel: 'Emotionally expressive',
    healthyRange: [4, 7],
    bandInterpretations: {
      'very-low': 'Suppresses or disconnects from emotions. May appear cold or detached.',
      'low': 'Tends to keep emotions private. May struggle to connect emotionally with others.',
      'moderate': 'Balanced emotional awareness. Can access and express feelings appropriately.',
      'high': 'Emotionally open and expressive. Attuned to own and others\' feelings.',
      'very-high': 'May be overwhelmed by emotions or overly reactive to emotional stimuli.',
    },
  },
  'risk-orientation': {
    id: 'risk-orientation',
    name: 'Risk Orientation',
    shortDescription: 'Measures comfort with uncertainty, ambiguity, and taking calculated risks.',
    lowLabel: 'Risk-averse',
    highLabel: 'Risk-seeking',
    healthyRange: [4, 7],
    bandInterpretations: {
      'very-low': 'Avoids risk at all costs. May miss opportunities due to excessive caution.',
      'low': 'Prefers safe, predictable paths. Takes risks only when well-supported.',
      'moderate': 'Balanced approach to risk. Can take calculated risks when the situation calls for it.',
      'high': 'Comfortable with uncertainty. Seeks out challenges and new opportunities.',
      'very-high': 'May take excessive risks without adequate analysis. Thrill-seeking tendencies.',
    },
  },
  'energy-capacity': {
    id: 'energy-capacity',
    name: 'Energy & Capacity',
    shortDescription: 'Measures stamina, drive, and sustained effort capacity.',
    lowLabel: 'Low drive',
    highLabel: 'High stamina',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'Frequently exhausted or disengaged. Struggles to maintain effort over time.',
      'low': 'Limited stamina for sustained effort. May need frequent breaks or lighter workloads.',
      'moderate': 'Adequate energy for typical demands. Can push through when needed.',
      'high': 'Strong drive and stamina. Maintains high output consistently.',
      'very-high': 'Extremely high energy, possibly to the point of burnout risk or inability to rest.',
    },
  },
  communication: {
    id: 'communication',
    name: 'Communication',
    shortDescription: 'Measures interpersonal communication effectiveness and style.',
    lowLabel: 'Reserved communicator',
    highLabel: 'Assertive communicator',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'Struggles to express ideas clearly. Avoids confrontation and difficult conversations.',
      'low': 'Communicates adequately in comfortable settings but may withdraw under pressure.',
      'moderate': 'Generally effective communicator. Adapts style to audience and context.',
      'high': 'Confident and clear communicator. Handles difficult conversations well.',
      'very-high': 'May dominate conversations or come across as overly forceful.',
    },
  },
  'world-outlook': {
    id: 'world-outlook',
    name: 'World Outlook',
    shortDescription: 'Measures optimism, positivity, and general outlook on life and work.',
    lowLabel: 'Pessimistic',
    highLabel: 'Optimistic',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'Predominantly negative outlook. May struggle with cynicism or hopelessness.',
      'low': 'Tends toward skepticism. May focus on problems rather than solutions.',
      'moderate': 'Realistic outlook with balanced perspective on positive and negative.',
      'high': 'Generally positive and solution-oriented. Sees opportunity in challenges.',
      'very-high': 'May be unrealistically optimistic, potentially ignoring genuine risks or problems.',
    },
  },
  'need-for-structure': {
    id: 'need-for-structure',
    name: 'Need for Structure',
    shortDescription: 'Measures preference for order, planning, and systematic approaches.',
    lowLabel: 'Flexible / spontaneous',
    highLabel: 'Highly structured',
    healthyRange: [4, 7],
    bandInterpretations: {
      'very-low': 'Resists structure and planning. May appear disorganized or scattered.',
      'low': 'Prefers flexibility over rigid systems. Adapts well to change but may lack follow-through.',
      'moderate': 'Comfortable with moderate structure. Can work within systems while maintaining flexibility.',
      'high': 'Prefers clear processes and plans. Organized and systematic in approach.',
      'very-high': 'May become rigid or anxious without clear structure. Struggles with ambiguity.',
    },
  },
  'logical-thinking': {
    id: 'logical-thinking',
    name: 'Logical Thinking',
    shortDescription: 'Measures analytical reasoning, data-driven decision-making, and critical thinking.',
    lowLabel: 'Intuitive thinker',
    highLabel: 'Analytical thinker',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'Relies heavily on gut feeling. May struggle with complex analysis or data interpretation.',
      'low': 'Prefers intuitive approaches. Can analyze when guided but doesn\'t default to it.',
      'moderate': 'Balanced use of logic and intuition. Adequate analytical skills for most situations.',
      'high': 'Strong analytical thinker. Prefers data-driven decisions and systematic reasoning.',
      'very-high': 'May over-analyze or struggle to act without complete data. Analysis paralysis risk.',
    },
  },
  'creative-thinking': {
    id: 'creative-thinking',
    name: 'Creative Thinking',
    shortDescription: 'Measures imagination, innovation, and ability to think outside conventional bounds.',
    lowLabel: 'Conventional thinker',
    highLabel: 'Innovative thinker',
    healthyRange: [4, 7],
    bandInterpretations: {
      'very-low': 'Sticks strictly to established methods. Uncomfortable with novel approaches.',
      'low': 'Prefers proven solutions. Can be creative when specifically prompted.',
      'moderate': 'Reasonably creative. Generates good ideas while also valuing practical approaches.',
      'high': 'Naturally innovative. Enjoys brainstorming and thinking beyond conventional limits.',
      'very-high': 'Highly imaginative but may struggle to execute or prioritize practical considerations.',
    },
  },
  anxiety: {
    id: 'anxiety',
    name: 'Anxiety',
    shortDescription: 'Measures tendency toward worry, stress, and anxious responses.',
    lowLabel: 'Calm / composed',
    highLabel: 'Anxious / worried',
    healthyRange: [3, 6],
    bandInterpretations: {
      'very-low': 'Extremely calm, possibly under-responsive to genuine threats or deadlines.',
      'low': 'Generally composed under pressure. Handles stress well.',
      'moderate': 'Normal anxiety levels. Appropriate concern for deadlines and responsibilities.',
      'high': 'Tends to worry frequently. May struggle with high-pressure situations.',
      'very-high': 'Chronic worry or stress. May be significantly impaired by anxiety in the workplace.',
    },
  },
  'self-esteem': {
    id: 'self-esteem',
    name: 'Self-Esteem',
    shortDescription: 'Measures self-confidence, self-worth, and belief in own capabilities.',
    lowLabel: 'Low self-confidence',
    highLabel: 'High self-confidence',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'Significant self-doubt. May avoid challenges and underestimate abilities.',
      'low': 'Tends to lack confidence. May seek excessive validation from others.',
      'moderate': 'Adequate self-confidence. Believes in own abilities in familiar domains.',
      'high': 'Strong self-belief. Confidently takes on challenges and advocates for self.',
      'very-high': 'May appear arrogant or dismissive of feedback. Possible blind spots about weaknesses.',
    },
  },
  'motivation-values': {
    id: 'motivation-values',
    name: 'Motivation & Values',
    shortDescription: 'Measures intrinsic motivation, purpose-driven behavior, and alignment with values.',
    lowLabel: 'Externally motivated',
    highLabel: 'Intrinsically driven',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'Primarily motivated by external rewards. May lack direction or sense of purpose.',
      'low': 'Needs external incentives to sustain effort. Values alignment is secondary.',
      'moderate': 'Mix of intrinsic and extrinsic motivation. Generally purposeful.',
      'high': 'Strongly purpose-driven. Works hardest when aligned with personal values.',
      'very-high': 'So values-driven that may struggle in roles that conflict with personal beliefs.',
    },
  },
  'learning-adaptability': {
    id: 'learning-adaptability',
    name: 'Learning & Adaptability',
    shortDescription: 'Measures openness to learning, adaptability, and growth mindset.',
    lowLabel: 'Change-resistant',
    highLabel: 'Highly adaptable',
    healthyRange: [5, 8],
    bandInterpretations: {
      'very-low': 'Resistant to change and new learning. Prefers familiar routines exclusively.',
      'low': 'Slow to adapt. Can learn new things but strongly prefers established approaches.',
      'moderate': 'Reasonably adaptable. Open to learning when the value is clear.',
      'high': 'Embraces learning and change. Quick to adapt to new situations and requirements.',
      'very-high': 'May be restless or unfocused, constantly seeking novelty over mastery.',
    },
  },
  integrity: {
    id: 'integrity',
    name: 'Integrity',
    shortDescription: 'Measures honesty, ethical behavior, and consistency between values and actions.',
    lowLabel: 'Flexible ethics',
    highLabel: 'Strong ethical standards',
    healthyRange: [6, 9],
    bandInterpretations: {
      'very-low': 'May cut corners ethically. Disqualifying flag for most professional roles.',
      'low': 'Inconsistent ethical standards. May rationalize questionable behavior.',
      'moderate': 'Generally ethical but may compromise under pressure or competing interests.',
      'high': 'Strong ethical compass. Consistent and trustworthy in professional conduct.',
      'very-high': 'Extremely principled. May struggle in environments requiring pragmatic compromises.',
    },
  },
};

// ─── Cross-Dimension Pairing Definitions ─────────────────────────────────────

export const CROSS_DIMENSION_PAIRINGS = [
  {
    id: 'control-feelings',
    dimensionA: 'control' as DimensionId,
    dimensionB: 'feelings' as DimensionId,
    label: 'Emotional Regulation',
    description: 'How control orientation interacts with emotional expression.',
  },
  {
    id: 'anxiety-self-esteem',
    dimensionA: 'anxiety' as DimensionId,
    dimensionB: 'self-esteem' as DimensionId,
    label: 'Inner Resilience',
    description: 'How anxiety levels interact with self-confidence.',
  },
  {
    id: 'risk-structure',
    dimensionA: 'risk-orientation' as DimensionId,
    dimensionB: 'need-for-structure' as DimensionId,
    label: 'Decision Style',
    description: 'How risk appetite interacts with need for structure.',
  },
  {
    id: 'logical-creative',
    dimensionA: 'logical-thinking' as DimensionId,
    dimensionB: 'creative-thinking' as DimensionId,
    label: 'Thinking Style',
    description: 'How analytical reasoning interacts with creative thinking.',
  },
  {
    id: 'energy-responsibility',
    dimensionA: 'energy-capacity' as DimensionId,
    dimensionB: 'responsibility' as DimensionId,
    label: 'Sustainable Performance',
    description: 'How energy and stamina interact with sense of accountability.',
  },
] as const;
