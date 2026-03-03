import { ArchetypeDefinition } from '@/lib/types';

/**
 * 10 Behavioral Archetypes
 *
 * Each archetype maps to a pattern of pillar & dimension scores.
 * Match rules use weighted conditions — the algorithm scores every
 * archetype against the user's profile and picks the best fit.
 *
 * Pillars:
 *   Drive            → Responsibility, Control, Energy & Capacity, Risk Orientation
 *   Thinking         → Logical Thinking, Creative Thinking, Need for Structure, Learning & Adaptability
 *   Social/Emotional → Feelings, Communication, Self-Esteem, Anxiety, World Outlook
 *   Values           → Motivation & Values, Integrity
 */
export const ARCHETYPES: ArchetypeDefinition[] = [
  // ── 1. The Driver ──────────────────────────────────────────────────────────
  {
    id: 'driver',
    name: 'The Driver',
    tagline: 'Relentless momentum meets unwavering accountability',
    description:
      'Drivers are defined by their extraordinary capacity to get things done. They combine high energy, strong personal responsibility, and a willingness to take control of situations. They thrive under pressure, set ambitious goals, and pursue them with a focused intensity that others find both inspiring and exhausting. Their drive is internal — not about recognition, but about meeting the standards they set for themselves.',
    strengths: [
      'Execution speed',
      'Reliability under pressure',
      'Goal achievement',
      'Leadership by example',
    ],
    watchOuts: [
      "May bulldoze others' input",
      'Burnout risk from relentless pace',
      'Difficulty delegating',
      'Can appear impatient with slower-paced colleagues',
    ],
    compatibleRoleFamilies: ['leadership', 'entrepreneurship', 'sales'],
    matchRules: [
      { target: 'drive', op: 'gte', value: 7, weight: 0.5 },
      { target: 'thinking', op: 'gte', value: 5.5, weight: 0.2 },
      { target: 'energy-capacity', op: 'gte', value: 7, weight: 0.15 },
      { target: 'responsibility', op: 'gte', value: 7, weight: 0.15 },
    ],
  },

  // ── 2. The Strategist ──────────────────────────────────────────────────────
  {
    id: 'strategist',
    name: 'The Strategist',
    tagline: 'Sees the whole board before making a move',
    description:
      "Strategists combine powerful analytical abilities with the drive to act on their insights. They naturally see systems, patterns, and leverage points that others miss. Where many people are either thinkers or doers, Strategists are both — they build frameworks and then execute against them. They're the ones who ask \"what's the second-order effect?\" while everyone else is still reacting to the first.",
    strengths: [
      'Long-term planning',
      'Systems thinking',
      'Analytical decision-making',
      'Connecting disparate information',
    ],
    watchOuts: [
      'May over-analyze (analysis paralysis)',
      'Can seem detached from emotional dynamics',
      'May undervalue intuitive input',
      "Impatience with those who can't keep up intellectually",
    ],
    compatibleRoleFamilies: ['leadership', 'finance', 'operations'],
    matchRules: [
      { target: 'thinking', op: 'gte', value: 7, weight: 0.4 },
      { target: 'drive', op: 'gte', value: 7, weight: 0.3 },
      { target: 'logical-thinking', op: 'gte', value: 7, weight: 0.15 },
      { target: 'learning-adaptability', op: 'gte', value: 6, weight: 0.15 },
    ],
  },

  // ── 3. The Builder ─────────────────────────────────────────────────────────
  {
    id: 'builder',
    name: 'The Builder',
    tagline: 'Creates order from chaos, one system at a time',
    description:
      "Builders are the architects of organizations. They combine high responsibility and energy with a strong need for structure, making them exceptionally skilled at creating processes, systems, and frameworks that others can follow. They don't just do the work — they build the infrastructure that makes the work sustainable. Builders are patient with complexity as long as they can see a path to bringing order to it.",
    strengths: [
      'Process design',
      'Organizational development',
      'Reliable execution',
      'Turning vision into systems',
    ],
    watchOuts: [
      'May resist change to established systems',
      'Can be rigid in approach',
      'Frustration with ambiguity',
      'Tendency to over-systematize creative problems',
    ],
    compatibleRoleFamilies: ['operations', 'admin', 'finance'],
    matchRules: [
      { target: 'drive', op: 'gte', value: 7, weight: 0.3 },
      { target: 'need-for-structure', op: 'gte', value: 7, weight: 0.3 },
      { target: 'responsibility', op: 'gte', value: 7, weight: 0.2 },
      { target: 'risk-orientation', op: 'range', value: 3.5, maxValue: 6.5, weight: 0.2 },
    ],
  },

  // ── 4. The Innovator ───────────────────────────────────────────────────────
  {
    id: 'innovator',
    name: 'The Innovator',
    tagline: 'Breaks the mold to build something better',
    description:
      'Innovators are natural disruptors. They combine creative thinking with a high tolerance for risk and a flexible approach to structure, enabling them to see possibilities where others see constraints. They\'re energized by novel challenges and frustrated by "the way we\'ve always done it." Innovators generate more ideas in an hour than most people do in a week — though not all of them are practical.',
    strengths: [
      'Idea generation',
      'Creative problem-solving',
      'Embracing uncertainty',
      'Challenging assumptions',
    ],
    watchOuts: [
      'May resist necessary structure',
      'Can abandon projects when novelty fades',
      'Difficulty with routine execution',
      'Ideas may lack practical grounding',
    ],
    compatibleRoleFamilies: ['entrepreneurship', 'marketing', 'hybrid'],
    matchRules: [
      { target: 'creative-thinking', op: 'gte', value: 7, weight: 0.35 },
      { target: 'risk-orientation', op: 'gte', value: 7, weight: 0.25 },
      { target: 'need-for-structure', op: 'lte', value: 5, weight: 0.2 },
      { target: 'learning-adaptability', op: 'gte', value: 6, weight: 0.2 },
    ],
  },

  // ── 5. The Connector ───────────────────────────────────────────────────────
  {
    id: 'connector',
    name: 'The Connector',
    tagline: 'Builds bridges between people, ideas, and teams',
    description:
      "Connectors are the human infrastructure of any organization. They combine emotional intelligence, strong communication skills, and genuine interest in others to create networks of trust and collaboration. They instinctively understand group dynamics and know how to bring the right people together. Connectors don't just participate in relationships — they actively cultivate and maintain them.",
    strengths: [
      'Relationship building',
      'Team cohesion',
      'Conflict mediation',
      'Cross-functional collaboration',
    ],
    watchOuts: [
      'May avoid necessary confrontation',
      'Can over-prioritize harmony at the expense of directness',
      "Emotional energy drain from absorbing others' feelings",
      'Difficulty making unpopular decisions',
    ],
    compatibleRoleFamilies: ['sales', 'marketing', 'leadership', 'admin'],
    matchRules: [
      { target: 'social-emotional', op: 'gte', value: 7, weight: 0.4 },
      { target: 'communication', op: 'gte', value: 7, weight: 0.35 },
      { target: 'feelings', op: 'gte', value: 6, weight: 0.25 },
    ],
  },

  // ── 6. The Anchor ──────────────────────────────────────────────────────────
  {
    id: 'anchor',
    name: 'The Anchor',
    tagline: 'The steady hand that holds everything together',
    description:
      'Anchors are the moral and operational backbone of their teams. They combine unwavering integrity with deep personal responsibility and a structured approach to work, making them the people others trust implicitly. When things get chaotic, the Anchor is the person everyone looks to for stability and principled guidance. They may not seek the spotlight, but they are often the most respected person in the room.',
    strengths: [
      'Trustworthiness',
      'Ethical leadership',
      'Consistency',
      'Institutional knowledge',
    ],
    watchOuts: [
      'May struggle with rapid change',
      'Can be seen as inflexible or overly cautious',
      "Tendency to hold others to standards they can't meet",
      'Difficulty embracing necessary rule-breaking',
    ],
    compatibleRoleFamilies: ['finance', 'operations', 'admin', 'leadership'],
    matchRules: [
      { target: 'values', op: 'gte', value: 7, weight: 0.35 },
      { target: 'responsibility', op: 'gte', value: 7, weight: 0.25 },
      { target: 'need-for-structure', op: 'gte', value: 7, weight: 0.2 },
      { target: 'integrity', op: 'gte', value: 7, weight: 0.2 },
    ],
  },

  // ── 7. The Catalyst ────────────────────────────────────────────────────────
  {
    id: 'catalyst',
    name: 'The Catalyst',
    tagline: 'Ignites action and energizes everyone around them',
    description:
      "Catalysts are high-energy activators who combine boundless stamina with strong communication skills and a willingness to take risks. They don't just do things — they inspire others to do things. Catalysts are the spark that gets projects moving, the voice that rallies a demoralized team, and the force of nature that turns \"we should do this\" into \"we're doing this now.\"",
    strengths: [
      'Motivation',
      'Initiative',
      'Team energizing',
      'Bias toward action',
    ],
    watchOuts: [
      'May prioritize action over planning',
      'Can overwhelm quieter colleagues',
      'Sustainability of high-energy pace',
      'Tendency to start more than they finish',
    ],
    compatibleRoleFamilies: ['sales', 'entrepreneurship', 'leadership', 'marketing'],
    matchRules: [
      { target: 'energy-capacity', op: 'gte', value: 8, weight: 0.35 },
      { target: 'communication', op: 'gte', value: 7, weight: 0.3 },
      { target: 'risk-orientation', op: 'gte', value: 6, weight: 0.2 },
      { target: 'world-outlook', op: 'gte', value: 6, weight: 0.15 },
    ],
  },

  // ── 8. The Analyst ─────────────────────────────────────────────────────────
  {
    id: 'analyst',
    name: 'The Analyst',
    tagline: 'Precision thinking meets methodical execution',
    description:
      'Analysts are methodical thinkers who trust data over instinct. They combine strong logical reasoning with a high need for structure and a cautious approach to risk, making them invaluable for decisions that demand accuracy and thoroughness. Analysts are the ones who find the flaw in the business case, the error in the spreadsheet, and the assumption everyone else overlooked.',
    strengths: [
      'Data-driven decision making',
      'Quality assurance',
      'Risk management',
      'Detailed analysis',
    ],
    watchOuts: [
      'May be slow to decide',
      'Can miss opportunities from over-caution',
      'Tendency to dismiss gut instincts',
      'Frustration with ambiguous or incomplete information',
    ],
    compatibleRoleFamilies: ['finance', 'operations', 'admin'],
    matchRules: [
      { target: 'logical-thinking', op: 'gte', value: 7, weight: 0.35 },
      { target: 'need-for-structure', op: 'gte', value: 7, weight: 0.3 },
      { target: 'risk-orientation', op: 'lte', value: 5, weight: 0.2 },
      { target: 'thinking', op: 'gte', value: 6.5, weight: 0.15 },
    ],
  },

  // ── 9. The Empath ──────────────────────────────────────────────────────────
  {
    id: 'empath',
    name: 'The Empath',
    tagline: 'Understands what you feel before you do',
    description:
      'Empaths possess a rare combination of emotional depth, optimism, and self-awareness. They genuinely feel what others are feeling and use this emotional intelligence to create psychological safety around them. Their positive world outlook prevents their sensitivity from becoming cynicism, and their healthy self-esteem means they can absorb emotional complexity without being consumed by it.',
    strengths: [
      'Emotional intelligence',
      'Creating psychological safety',
      'Understanding unspoken dynamics',
      'Coaching and mentoring',
    ],
    watchOuts: [
      "May take on others' emotional burdens",
      'Can struggle with tough-love decisions',
      'Risk of emotional exhaustion',
      'May avoid data-driven arguments in favor of feelings-based reasoning',
    ],
    compatibleRoleFamilies: ['leadership', 'admin', 'hybrid'],
    matchRules: [
      { target: 'feelings', op: 'gte', value: 7, weight: 0.35 },
      { target: 'world-outlook', op: 'gte', value: 7, weight: 0.25 },
      { target: 'self-esteem', op: 'gte', value: 5.5, weight: 0.2 },
      { target: 'communication', op: 'gte', value: 5.5, weight: 0.2 },
    ],
  },

  // ── 10. The Maverick ───────────────────────────────────────────────────────
  {
    id: 'maverick',
    name: 'The Maverick',
    tagline: 'Charts their own course, consequences be damned',
    description:
      "Mavericks combine supreme self-confidence with high risk tolerance and creative thinking. They trust their own judgment above conventional wisdom and are willing to bet on themselves when others won't. Mavericks are not rebels without a cause — they're rebels with a vision. They break rules strategically, not impulsively, and their confidence is often validated by unconventional successes.",
    strengths: [
      'Bold decision-making',
      'Unconventional solutions',
      'Self-belief under adversity',
      'Trailblazing',
    ],
    watchOuts: [
      'May ignore valuable input from others',
      'Confidence can tip into arrogance',
      'Blind spots from self-assurance',
      'Difficulty working within institutional constraints',
    ],
    compatibleRoleFamilies: ['entrepreneurship', 'sales', 'leadership'],
    matchRules: [
      { target: 'risk-orientation', op: 'gte', value: 8, weight: 0.3 },
      { target: 'self-esteem', op: 'gte', value: 7, weight: 0.25 },
      { target: 'creative-thinking', op: 'gte', value: 7, weight: 0.25 },
      { target: 'need-for-structure', op: 'lte', value: 5, weight: 0.2 },
    ],
  },
];
