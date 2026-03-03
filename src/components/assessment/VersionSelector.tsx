'use client';

import { AssessmentVersion } from '@/lib/types';
import { VERSION_CONFIGS, colors } from '@/lib/constants';

interface VersionSelectorProps {
  onSelect: (version: AssessmentVersion) => void;
}

export default function VersionSelector({ onSelect }: VersionSelectorProps) {
  const versions = ['light', 'standard', 'max'] as AssessmentVersion[];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.indigo }}>
          Choose Your Assessment
        </h1>
        <p className="text-sm max-w-lg mx-auto" style={{ color: colors.slate }}>
          Select the version that best fits your needs. All versions include a free 30-question preview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {versions.map((version) => {
          const config = VERSION_CONFIGS[version];
          const isPopular = version === 'standard';

          return (
            <div
              key={version}
              className="relative rounded-xl p-6 flex flex-col"
              style={{
                backgroundColor: colors.white,
                border: isPopular ? `2px solid ${colors.scarlet}` : '1px solid #e5e5e5',
                boxShadow: isPopular ? '0 4px 20px rgba(220, 48, 60, 0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {isPopular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: colors.scarlet }}
                >
                  Most Popular
                </div>
              )}

              <h2 className="text-lg font-bold mb-1" style={{ color: colors.indigo }}>
                {config.name}
              </h2>

              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ color: colors.indigo }}>
                  ${config.priceUsd}
                </span>
              </div>

              <p className="text-xs mb-3" style={{ color: colors.slate }}>
                {config.totalQuestions} questions &middot; {config.questionsPerDimension} per dimension
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {config.features.map((feature, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: colors.charcoal }}>
                    <span style={{ color: colors.scarlet }}>&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelect(version)}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: isPopular ? colors.scarlet : colors.indigo,
                  color: colors.white,
                }}
              >
                Select {config.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
