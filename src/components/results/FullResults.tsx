'use client';

import { AssessmentResults, AssessmentVersion, UserInfo } from '@/lib/types';
import { colors } from '@/lib/constants';
import DimensionScoreCard from './DimensionScoreCard';
import ScoreRadarChart from './ScoreRadarChart';
import RoleFitSection from './RoleFitSection';
import ArchetypeCard from './ArchetypeCard';

interface FullResultsProps {
  results: AssessmentResults;
  userInfo: UserInfo;
  version: AssessmentVersion;
}

export default function FullResults({ results, userInfo, version }: FullResultsProps) {
  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-1" style={{ color: colors.indigo }}>
            LINX Compass Results
          </h1>
          <p className="text-sm" style={{ color: colors.slate }}>
            {userInfo.firstName} {userInfo.lastName} &middot; {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Radar Chart */}
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: colors.indigo }}>
            Behavioral Profile
          </h2>
          <ScoreRadarChart scores={results.dimensionScores} />
        </div>

        {/* Behavioral Archetype */}
        {results.archetype && (
          <div className="mb-8">
            <ArchetypeCard archetype={results.archetype} version={version} />
          </div>
        )}

        {/* Universal Disqualifiers */}
        {results.universalDisqualifiers.some(d => d.triggered) && (
          <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: '#FEF2F2', border: `1px solid ${colors.scarlet}33` }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.scarlet }}>
              Important Flags
            </h2>
            <div className="space-y-2">
              {results.universalDisqualifiers.filter(d => d.triggered).map(flag => (
                <div key={flag.id} className="text-sm" style={{ color: colors.charcoal }}>
                  <span className="font-medium">{flag.label}:</span> {flag.details}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dimension Scores */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.indigo }}>
            Dimension Scores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.dimensionScores.map(score => (
              <DimensionScoreCard key={score.dimensionId} score={score} />
            ))}
          </div>
        </div>

        {/* Cross-Dimension Insights */}
        {results.crossDimensionPairings.length > 0 && (
          <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.indigo }}>
              Cross-Dimension Insights
            </h2>
            <div className="space-y-4">
              {results.crossDimensionPairings.map(pairing => (
                <div key={pairing.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: colors.indigo }}>{pairing.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.cream, color: colors.indigo }}>
                      {pairing.pattern}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: colors.charcoal }}>
                    {pairing.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Fit */}
        <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: colors.indigo }}>
            Role Fit Analysis
          </h2>
          <RoleFitSection roleFits={results.roleFits} />
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs" style={{ color: colors.slate }}>
            LINX Compass &copy; {new Date().getFullYear()} LINX Consulting. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
