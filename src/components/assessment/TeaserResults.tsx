'use client';

import { colors, DIMENSIONS, DIMENSION_IDS } from '@/lib/constants';
import Button from '../shared/Button';

interface TeaserResultsProps {
  onPay: () => void;
  isLoading: boolean;
}

export default function TeaserResults({ onPay, isLoading }: TeaserResultsProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="text-center mb-8 max-w-lg">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.indigo }}>
          Preview Complete!
        </h1>
        <p className="text-sm" style={{ color: colors.slate }}>
          You&apos;ve completed the free preview. Here&apos;s a glimpse of your 15 dimensions &mdash; unlock your full results by completing the assessment.
        </p>
      </div>

      <div className="w-full max-w-2xl rounded-xl p-6 mb-8" style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <div className="space-y-3">
          {DIMENSION_IDS.map((dimId) => {
            const dim = DIMENSIONS[dimId];
            // Fake blurred score for teaser
            const fakeWidth = 30 + Math.random() * 50;

            return (
              <div key={dimId} className="flex items-center gap-3">
                <div className="w-40 text-xs font-medium shrink-0" style={{ color: colors.charcoal }}>
                  {dim.name}
                </div>
                <div className="flex-1 h-6 rounded-full overflow-hidden relative" style={{ backgroundColor: '#f3f4f6' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${fakeWidth}%`,
                      backgroundColor: colors.cream,
                      filter: 'blur(8px)',
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium" style={{ color: colors.slate }}>
                      Locked
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onPay} variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Unlock Full Assessment'}
        </Button>
        <p className="text-xs mt-3" style={{ color: colors.slate }}>
          Complete the remaining questions and get your full scored report.
        </p>
      </div>
    </div>
  );
}
