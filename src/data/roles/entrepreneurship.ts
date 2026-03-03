import { RoleTemplate } from '@/lib/types';

export const entrepreneurshipRoles: RoleTemplate[] = [
  {
    id: 'founder-entrepreneur',
    family: 'entrepreneurship',
    name: 'Founder / Entrepreneur',
    description: 'Business founding requiring very high risk tolerance, energy, creativity, and low structure need.',
    demands: [
      { dimensionId: 'risk-orientation', minScore: 6, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'energy-capacity', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'creative-thinking', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: false },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: false },
      { dimensionId: 'need-for-structure', minScore: 2, idealScore: 4, weight: 0.5, isDisqualifier: false },
    ],
  },
  {
    id: 'startup-operator',
    family: 'entrepreneurship',
    name: 'Startup Operator',
    description: 'Early-stage operations requiring adaptability, responsibility, and risk comfort.',
    demands: [
      { dimensionId: 'responsibility', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'risk-orientation', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 4, idealScore: 6, weight: 0.5, isDisqualifier: false },
    ],
  },
  {
    id: 'innovation-lead',
    family: 'entrepreneurship',
    name: 'Innovation Lead',
    description: 'Innovation leadership requiring creativity, risk orientation, and learning agility.',
    demands: [
      { dimensionId: 'creative-thinking', minScore: 6, idealScore: 8, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'risk-orientation', minScore: 6, idealScore: 8, weight: 0.8, isDisqualifier: true },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
  {
    id: 'scale-up-operator',
    family: 'entrepreneurship',
    name: 'Scale-Up Operator',
    description: 'Growth-stage operations requiring accountability and adaptability with moderate structure.',
    demands: [
      { dimensionId: 'responsibility', minScore: 7, idealScore: 9, weight: 0.9, isDisqualifier: true },
      { dimensionId: 'need-for-structure', minScore: 4, idealScore: 6, weight: 0.5, isDisqualifier: false },
      { dimensionId: 'learning-adaptability', minScore: 6, idealScore: 8, weight: 0.7, isDisqualifier: true },
    ],
  },
];
