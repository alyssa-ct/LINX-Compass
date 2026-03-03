'use client';

import { useState } from 'react';
import { ARCHETYPES } from '@/data/archetypes';
import { ARCHETYPE_ORDER, ARCHETYPE_META } from '@/data/archetype-meta';
import { ArchetypeId } from '@/lib/types';
import { colors } from '@/lib/constants';

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

export default function ArchetypeGrid() {
  const [activeId, setActiveId] = useState<ArchetypeId>('driver');
  const archetypeMap = Object.fromEntries(ARCHETYPES.map(a => [a.id, a]));
  const active = archetypeMap[activeId];
  const meta = ARCHETYPE_META[activeId];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-base mb-10 max-w-2xl mx-auto" style={{ color: colors.slate }}>
          Each archetype represents a distinct pattern of behavioral strengths.
          Select one to explore it in detail.
        </p>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {ARCHETYPE_ORDER.map(id => {
            const m = ARCHETYPE_META[id];
            const isActive = id === activeId;
            return (
              <button
                key={id}
                onClick={() => setActiveId(id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? colors.white : 'transparent',
                  color: isActive ? colors.indigo : colors.slate,
                  boxShadow: isActive ? '0 2px 12px rgba(0,0,0,0.1)' : 'none',
                  border: isActive ? `2px solid ${m.accentColor}` : '2px solid transparent',
                }}
              >
                <span className="text-base">{m.icon}</span>
                <span className="hidden sm:inline">{archetypeMap[id]?.name.replace('The ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Active archetype detail */}
        {active && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.white,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="px-8 py-8 text-center"
              style={{ borderBottom: `4px solid ${meta.accentColor}` }}
            >
              <span className="text-4xl block mb-3">{meta.icon}</span>
              <h3 className="text-2xl font-bold mb-1" style={{ color: colors.indigo }}>
                {active.name}
              </h3>
              <p className="text-sm italic" style={{ color: colors.slate }}>
                &ldquo;{active.tagline}&rdquo;
              </p>
            </div>

            {/* Body */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: illustration + description */}
                <div className="space-y-5">
                  {/* Illustration placeholder */}
                  <div
                    className="w-full aspect-[4/3] rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#f0eeeb' }}
                  >
                    <span className="text-xs" style={{ color: colors.slate }}>Illustration placeholder</span>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
                    {active.description}
                  </p>
                </div>

                {/* Right: strengths, watch-outs, roles */}
                <div className="space-y-6">
                  {/* Strengths */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: colors.indigo }}>
                      Key Strengths
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {active.strengths.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Watch-Outs */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: colors.indigo }}>
                      Watch-Outs
                    </p>
                    <ul className="space-y-2">
                      {active.watchOuts.map((w, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: colors.charcoal }}>
                          <span className="mt-0.5 shrink-0" style={{ color: colors.scarlet }}>&#9679;</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compatible Role Families */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: colors.indigo }}>
                      Compatible Roles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {active.compatibleRoleFamilies.map(f => (
                        <span
                          key={f}
                          className="text-xs px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: '#EEF2FF', color: '#4338CA' }}
                        >
                          {ROLE_FAMILY_LABELS[f] || f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
