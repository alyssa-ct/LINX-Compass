import { RoleTemplate } from '@/lib/types';

export const leadershipRoles: RoleTemplate[] = [
  {
    id: 'team-lead',
    family: 'leadership',
    name: 'Team Lead',
    description: 'Front-line team leadership requiring responsibility, communication, and balanced control.',
    demands: [
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'control', minScore: 4, idealScore: 6, weight: 0.6, isDisqualifier: false },
    ],
  },
  {
    id: 'people-manager',
    family: 'leadership',
    name: 'People Manager',
    description: 'People-focused management requiring communication, positive outlook, and self-confidence.',
    demands: [
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'world-outlook', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'self-esteem', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'department-head',
    family: 'leadership',
    name: 'Department Head',
    description: 'Department leadership requiring integrity, responsibility, and continuous learning.',
    demands: [
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'director',
    family: 'leadership',
    name: 'Director',
    description: 'Strategic leadership requiring learning agility, communication, and high integrity.',
    demands: [
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
    ],
  },
];
