import { RoleTemplate } from '@/lib/types';

export const financeRoles: RoleTemplate[] = [
  {
    id: 'staff-accountant',
    family: 'finance',
    name: 'Staff Accountant',
    description: 'Entry-level accounting requiring high structure, analytical thinking, and integrity.',
    demands: [
      { dimensionId: 'need-for-structure', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'logical-thinking', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'risk-orientation', minScore: 2, idealScore: 4, weight: 0.5, isDisqualifier: false },
    ],
  },
  {
    id: 'senior-accountant',
    family: 'finance',
    name: 'Senior Accountant',
    description: 'Senior accounting requiring deep analytical skills, structure, and high integrity.',
    demands: [
      { dimensionId: 'need-for-structure', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'logical-thinking', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
    ],
  },
  {
    id: 'controller',
    family: 'finance',
    name: 'Controller',
    description: 'Financial control and reporting requiring integrity, responsibility, and structured thinking.',
    demands: [
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 7, idealScore: 9, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'control', minScore: 5, idealScore: 6, weight: 0.5, isDisqualifier: false },
    ],
  },
  {
    id: 'payroll-compliance-manager',
    family: 'finance',
    name: 'Payroll / Compliance Manager',
    description: 'Payroll and compliance requiring extreme precision, integrity, and low anxiety.',
    demands: [
      { dimensionId: 'need-for-structure', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'integrity', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'anxiety', minScore: 2, idealScore: 4, weight: 0.7, isDisqualifier: false },
    ],
  },
];
