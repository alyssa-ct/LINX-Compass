'use client';

import { useMemo } from 'react';
import { AssessmentSession, DimensionScore } from '@/lib/types';
import { scoreAllDimensions } from '@/lib/scoring';
import { determineArchetype } from '@/lib/archetypes';
import { DIMENSIONS, colors } from '@/lib/constants';

interface PreviewResultsProps {
  session: AssessmentSession;
  onUpgrade: () => void;
}

function getTopFiveDimensions(scores: DimensionScore[]): DimensionScore[] {
  return [...scores]
    .sort((a, b) => Math.abs(b.rawScore - 5.5) - Math.abs(a.rawScore - 5.5))
    .slice(0, 5);
}

// (summary generation removed — archetype description + CTA handle the narrative)

// ─── Graphics ───────────────────────────────────────────────────────────────

function MiniRadar({ scores }: { scores: DimensionScore[] }) {
  // Simple 5-point radar placeholder using the top 5 scores
  const top = scores
    .slice()
    .sort((a, b) => Math.abs(b.rawScore - 5.5) - Math.abs(a.rawScore - 5.5))
    .slice(0, 5);

  const cx = 80;
  const cy = 80;
  const r = 60;
  const angleStep = (2 * Math.PI) / 5;

  const points = top.map((s, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const ratio = s.rawScore / 10;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
      label: DIMENSIONS[s.dimensionId].name.split(' ')[0],
      lx: cx + (r + 16) * Math.cos(angle),
      ly: cy + (r + 16) * Math.sin(angle),
    };
  });

  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-[200px] mx-auto">
      {/* Grid */}
      {rings.map(ring => {
        const ringPoints = Array.from({ length: 5 }, (_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return `${cx + r * ring * Math.cos(angle)},${cy + r * ring * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon
            key={ring}
            points={ringPoints}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Axes */}
      {Array.from({ length: 5 }, (_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Data polygon */}
      <polygon
        points={polygon}
        fill="rgba(79, 70, 229, 0.15)"
        stroke="#4F46E5"
        strokeWidth="1.5"
      />
      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#4F46E5" />
      ))}
      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={`l-${i}`}
          x={p.lx}
          y={p.ly}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          fill={colors.slate}
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

function ScoreBar({ score, maxScore = 10 }: { score: number; maxScore?: number }) {
  const pct = (score / maxScore) * 100;
  return (
    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e5e5' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        }}
      />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function PreviewResults({ session, onUpgrade }: PreviewResultsProps) {
  const allScores = useMemo(
    () => scoreAllDimensions(session.previewAnswers),
    [session.previewAnswers]
  );

  const top5 = useMemo(() => getTopFiveDimensions(allScores), [allScores]);
  const archetype = useMemo(() => determineArchetype(allScores), [allScores]);

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.indigo }}>
            Your Preview Results
          </h1>
          <p className="text-sm" style={{ color: colors.slate }}>
            Based on your 30 preview questions
          </p>
        </div>

        {/* 1. Archetype — hero card with description flowing into summary */}
        <div
          className="rounded-xl overflow-hidden mb-6"
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
              {archetype.primary.name}
            </h2>
            <p className="text-sm italic" style={{ color: '#C7D2FE' }}>
              &ldquo;{archetype.primary.tagline}&rdquo;
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-3" style={{ backgroundColor: colors.white }}>
            <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
              {archetype.primary.description}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
              Your preview scores suggest strengths in{' '}
              {archetype.primary.strengths.slice(0, -1).join(', ').toLowerCase()}
              {' '}and{' '}
              {archetype.primary.strengths[archetype.primary.strengths.length - 1].toLowerCase()}
              . These qualities tend to make {archetype.primary.name.replace('The ', '')}s
              {' '}particularly effective in{' '}
              {archetype.primary.compatibleRoleFamilies
                .slice(0, 3)
                .map(f => f.charAt(0).toUpperCase() + f.slice(1))
                .join(', ')}
              {' '}roles.
            </p>
            {archetype.secondary ? (
              <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
                Your profile also carries traits of{' '}
                <span className="font-medium">{archetype.secondary.name}</span>
                {' '}&mdash; &ldquo;{archetype.secondary.tagline}&rdquo; &mdash;{' '}
                suggesting a behavioral style that blends {archetype.primary.name.replace('The ', '')}
                {' '}drive with {archetype.secondary.name.replace('The ', '')} instincts.
              </p>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
                Your behavioral pattern is distinctly {archetype.primary.name.replace('The ', '')}
                {' '}&mdash; a focused profile without a strong secondary archetype pulling
                in another direction, which often signals clear self-awareness and consistency
                in how you approach work and decisions.
              </p>
            )}
          </div>
        </div>

        {/* 2. Top 5 Dimensions with mini radar */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: colors.indigo }}>
            Top 5 Dimensions
          </h3>

          {/* Mini radar placeholder */}
          <div className="mb-5">
            <MiniRadar scores={allScores} />
          </div>

          {/* Score bars */}
          <div className="space-y-5">
            {top5.map(score => {
              const dim = DIMENSIONS[score.dimensionId];
              return (
                <div key={score.dimensionId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: colors.indigo }}>
                      {dim.name}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                      backgroundColor: score.band === 'high' || score.band === 'very-high'
                        ? '#DCFCE7' : score.band === 'low' || score.band === 'very-low'
                        ? '#FEE2E2' : '#FEF3C7',
                      color: score.band === 'high' || score.band === 'very-high'
                        ? '#166534' : score.band === 'low' || score.band === 'very-low'
                        ? '#991B1B' : '#92400E',
                    }}>
                      {score.rawScore.toFixed(1)} / 10
                    </span>
                  </div>
                  <ScoreBar score={score.rawScore} />
                  <p className="text-xs mt-1.5" style={{ color: colors.slate }}>
                    {score.interpretation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Disclaimer */}
        <p className="text-xs text-center mb-6" style={{ color: colors.slate }}>
          These scores are based on just 2 questions per dimension. The full assessment uses 10–20 questions per dimension across all 15 dimensions, delivering significantly higher accuracy — plus blind spot detection, overuse patterns, and career-fit analysis.
        </p>

        {/* 5. What's locked + CTA */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: '#F8F4FF', border: '1px solid #E8DEFF' }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: colors.indigo }}>
            Unlock with the full assessment:
          </p>
          <ul className="space-y-2">
            {[
              'Full archetype profile with strengths & watch-outs',
              'All 15 dimensions scored with high precision',
              'Role-fit analysis across 50+ careers',
              'Cross-dimension pairing insights',
              'Overuse detection & blind spots',
            ].map((item, i) => (
              <li key={i} className="text-sm flex items-center gap-2" style={{ color: colors.charcoal }}>
                <span style={{ color: '#7C3AED' }}>&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={onUpgrade}
            className="px-10 py-3 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            Unlock Full Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
