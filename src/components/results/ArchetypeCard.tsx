'use client';

import { ArchetypeResult, AssessmentVersion } from '@/lib/types';
import { colors } from '@/lib/constants';

interface ArchetypeCardProps {
  archetype: ArchetypeResult;
  version: AssessmentVersion;
}

const ROLE_FAMILY_LABELS: Record<string, string> = {
  sales: 'Sales',
  marketing: 'Marketing',
  operations: 'Operations',
  finance: 'Finance',
  admin: 'Admin',
  leadership: 'Leadership',
  entrepreneurship: 'Entrepreneurship',
  hybrid: 'Hybrid',
};

export default function ArchetypeCard({ archetype, version }: ArchetypeCardProps) {
  const { primary, secondary } = archetype;
  const showDescription = version === 'standard' || version === 'max';
  const showWatchOuts = version === 'max';
  const showSecondary = version === 'max';

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      {/* Gradient header */}
      <div
        className="px-6 py-8 text-center"
        style={{ background: 'linear-gradient(135deg, #1B2845, #4F46E5)' }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#C7D2FE' }}>
          Your Behavioral Archetype
        </p>
        <h2 className="text-2xl font-bold text-white mb-1">
          {primary.name}
        </h2>
        <p className="text-sm italic" style={{ color: '#C7D2FE' }}>
          &ldquo;{primary.tagline}&rdquo;
        </p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5" style={{ backgroundColor: colors.white }}>
        {/* Description — Standard + Max */}
        {showDescription && (
          <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
            {primary.description}
          </p>
        )}

        {/* Strengths — Standard + Max */}
        {showDescription && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: colors.indigo }}>
              Key Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {primary.strengths.map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Watch-Outs — Max only */}
        {showWatchOuts && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: colors.indigo }}>
              Watch-Outs
            </h3>
            <ul className="space-y-1">
              {primary.watchOuts.map((w, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: colors.charcoal }}>
                  <span className="mt-0.5" style={{ color: colors.scarlet }}>&#9679;</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Compatible Roles — Max only */}
        {showWatchOuts && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: colors.indigo }}>
              Compatible Role Families
            </h3>
            <div className="flex flex-wrap gap-2">
              {primary.compatibleRoleFamilies.map(f => (
                <span
                  key={f}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
                >
                  {ROLE_FAMILY_LABELS[f] || f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Archetype — Max only */}
        {showSecondary && secondary && (
          <div
            className="rounded-lg p-4 mt-2"
            style={{ backgroundColor: '#F8F4FF', border: '1px solid #E8DEFF' }}
          >
            <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#7C3AED' }}>
              Secondary Archetype
            </p>
            <p className="text-sm font-bold" style={{ color: colors.indigo }}>
              {secondary.name}
            </p>
            <p className="text-xs italic" style={{ color: colors.slate }}>
              &ldquo;{secondary.tagline}&rdquo;
            </p>
          </div>
        )}

        {/* Light version upsell */}
        {version === 'light' && (
          <p className="text-xs text-center" style={{ color: colors.slate }}>
            Upgrade to Standard or Max to see your full archetype description, strengths, and more.
          </p>
        )}
      </div>
    </div>
  );
}
