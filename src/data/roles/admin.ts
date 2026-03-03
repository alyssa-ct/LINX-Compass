import { RoleTemplate } from '@/lib/types';

export const adminRoles: RoleTemplate[] = [
  {
    id: 'executive-assistant',
    family: 'admin',
    name: 'Executive Assistant',
    description: 'High-level administrative support requiring responsibility, communication, and structure.',
    demands: [
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'office-manager',
    family: 'admin',
    name: 'Office Manager',
    description: 'Office operations management requiring structure, responsibility, and positive outlook.',
    demands: [
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'world-outlook', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'administrative-coordinator',
    family: 'admin',
    name: 'Administrative Coordinator',
    description: 'General administrative coordination requiring structure and dependability.',
    demands: [
      { dimensionId: 'need-for-structure', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
    ],
  },
  {
    id: 'customer-support-specialist',
    family: 'admin',
    name: 'Customer Support Specialist',
    description: 'Customer-facing support requiring patience, communication skills, and low anxiety.',
    demands: [
      { dimensionId: 'world-outlook', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'communication', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'anxiety', minScore: 2, idealScore: 4, weight: 0.7, isDisqualifier: false },
    ],
  },
];
