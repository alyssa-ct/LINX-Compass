import { ArchetypeId } from '@/lib/types';

export interface ArchetypeMeta {
  id: ArchetypeId;
  icon: string;
  accentColor: string;
  accentBg: string;
}

export const ARCHETYPE_META: Record<ArchetypeId, ArchetypeMeta> = {
  driver:     { id: 'driver',     icon: '🎯', accentColor: '#DC303C', accentBg: '#FEF2F2' },
  strategist: { id: 'strategist', icon: '♟️', accentColor: '#4F46E5', accentBg: '#EEF2FF' },
  builder:    { id: 'builder',    icon: '🏗️', accentColor: '#D97706', accentBg: '#FFFBEB' },
  innovator:  { id: 'innovator',  icon: '💡', accentColor: '#7C3AED', accentBg: '#F5F3FF' },
  connector:  { id: 'connector',  icon: '🤝', accentColor: '#0891B2', accentBg: '#ECFEFF' },
  anchor:     { id: 'anchor',     icon: '⚓', accentColor: '#1B2845', accentBg: '#F1F5F9' },
  catalyst:   { id: 'catalyst',   icon: '⚡', accentColor: '#EA580C', accentBg: '#FFF7ED' },
  analyst:    { id: 'analyst',    icon: '🔍', accentColor: '#2563EB', accentBg: '#EFF6FF' },
  empath:     { id: 'empath',     icon: '💜', accentColor: '#C026D3', accentBg: '#FDF4FF' },
  maverick:   { id: 'maverick',   icon: '🔥', accentColor: '#E11D48', accentBg: '#FFF1F2' },
};

export const ARCHETYPE_ORDER: ArchetypeId[] = [
  'driver', 'strategist', 'builder', 'innovator', 'connector',
  'anchor', 'catalyst', 'analyst', 'empath', 'maverick',
];

export const TEASER_ARCHETYPE_IDS: ArchetypeId[] = [
  'driver', 'innovator', 'connector', 'strategist',
];
