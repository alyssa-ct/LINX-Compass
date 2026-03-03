import { RoleTemplate } from '@/lib/types';
import { salesRoles } from './sales';
import { marketingRoles } from './marketing';
import { operationsRoles } from './operations';
import { financeRoles } from './finance';
import { adminRoles } from './admin';
import { leadershipRoles } from './leadership';
import { entrepreneurshipRoles } from './entrepreneurship';
import { hybridRoles } from './hybrid';

export const ALL_ROLE_TEMPLATES: RoleTemplate[] = [
  ...salesRoles,
  ...marketingRoles,
  ...operationsRoles,
  ...financeRoles,
  ...adminRoles,
  ...leadershipRoles,
  ...entrepreneurshipRoles,
  ...hybridRoles,
];
