import { RoleTemplate } from '@/lib/types';

export const marketingRoles: RoleTemplate[] = [
  {
    id: 'brand-marketing-manager',
    family: 'marketing',
    name: 'Brand / Marketing Manager',
    description: 'Brand strategy and creative campaign management requiring creativity and communication.',
    demands: [
      { dimensionId: 'creative-thinking', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'world-outlook', minScore: 5, idealScore: 7, weight: 0.6, isDisqualifier: true },
    ],
  },
  {
    id: 'content-marketing-lead',
    family: 'marketing',
    name: 'Content Marketing Lead',
    description: 'Content strategy and creation requiring creativity, communication, and learning agility.',
    demands: [
      { dimensionId: 'creative-thinking', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'growth-marketing-manager',
    family: 'marketing',
    name: 'Growth Marketing Manager',
    description: 'Data-driven growth marketing blending creativity with analytical rigor.',
    demands: [
      { dimensionId: 'creative-thinking', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'logical-thinking', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'risk-orientation', minScore: 5, idealScore: 6, weight: 0.6, isDisqualifier: false },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'marketing-operations-manager',
    family: 'marketing',
    name: 'Marketing Operations Manager',
    description: 'Marketing systems and process management requiring structure and analytical skills.',
    demands: [
      { dimensionId: 'logical-thinking', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
];
