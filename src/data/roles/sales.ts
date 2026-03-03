import { RoleTemplate } from '@/lib/types';

export const salesRoles: RoleTemplate[] = [
  {
    id: 'sales-hunter',
    family: 'sales',
    name: 'Sales Hunter (New Business)',
    description: 'Aggressive new business acquisition requiring high risk tolerance, energy, and communication skills.',
    demands: [
      { dimensionId: 'risk-orientation', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'energy-capacity', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'self-esteem', minScore: 5, idealScore: 7, weight: 0.7, isDisqualifier: false },
      { dimensionId: 'world-outlook', minScore: 5, idealScore: 7, weight: 0.6, isDisqualifier: false },
    ],
  },
  {
    id: 'sales-farmer',
    family: 'sales',
    name: 'Sales Farmer (Account Management)',
    description: 'Relationship-focused account management requiring patience, consistency, and communication.',
    demands: [
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'world-outlook', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'integrity', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: false },
    ],
  },
  {
    id: 'sales-engineer',
    family: 'sales',
    name: 'Sales Engineer / Technical Sales',
    description: 'Technical solution selling requiring analytical skills combined with communication ability.',
    demands: [
      { dimensionId: 'logical-thinking', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 5, idealScore: 7, weight: 0.6, isDisqualifier: false },
      { dimensionId: 'learning-adaptability', minScore: 5, idealScore: 7, weight: 0.6, isDisqualifier: false },
    ],
  },
  {
    id: 'sales-leader',
    family: 'sales',
    name: 'Sales Leader / VP Sales',
    description: 'Sales leadership requiring strategic thinking, people management, and high integrity.',
    demands: [
      { dimensionId: 'communication', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'self-esteem', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.6, isDisqualifier: false },
    ],
  },
];
