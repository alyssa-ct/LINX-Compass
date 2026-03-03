import { RoleTemplate } from '@/lib/types';

export const operationsRoles: RoleTemplate[] = [
  {
    id: 'operations-manager',
    family: 'operations',
    name: 'Operations Manager',
    description: 'Operational excellence requiring responsibility, structure, and continuous improvement.',
    demands: [
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: false },
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.8, isDisqualifier: true },
    ],
  },
  {
    id: 'project-manager',
    family: 'operations',
    name: 'Project Manager',
    description: 'Project delivery requiring communication, structure, and accountability.',
    demands: [
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
    ],
  },
  {
    id: 'implementation-manager',
    family: 'operations',
    name: 'Implementation Manager',
    description: 'Client implementation and onboarding requiring accountability and clear communication.',
    demands: [
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'process-improvement-lead',
    family: 'operations',
    name: 'Process Improvement Lead',
    description: 'Continuous improvement and optimization requiring analytical skills and learning agility.',
    demands: [
      { dimensionId: 'logical-thinking', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
];
