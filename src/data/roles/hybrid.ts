import { RoleTemplate } from '@/lib/types';

export const hybridRoles: RoleTemplate[] = [
  {
    id: 'revenue-operations-manager',
    family: 'hybrid',
    name: 'Revenue Operations Manager',
    description: 'Cross-functional revenue operations requiring analytical, structural, and communication skills.',
    demands: [
      { dimensionId: 'logical-thinking', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'chief-of-staff',
    family: 'hybrid',
    name: 'Chief of Staff',
    description: 'Strategic support and coordination requiring high responsibility, communication, and adaptability.',
    demands: [
      { dimensionId: 'responsibility', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'internal-consultant-change-agent',
    family: 'hybrid',
    name: 'Internal Consultant / Change Agent',
    description: 'Organizational change management requiring learning agility, communication, and integrity.',
    demands: [
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.8, isDisqualifier: true },
    ],
  },
];
