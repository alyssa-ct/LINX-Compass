import { DimensionScore } from '@/lib/types';
import { DIMENSIONS, colors } from '@/lib/constants';

interface DimensionScoreCardProps {
  score: DimensionScore;
}

export default function DimensionScoreCard({ score }: DimensionScoreCardProps) {
  const dimension = DIMENSIONS[score.dimensionId];
  const pct = ((score.rawScore - 1) / 9) * 100;
  const healthyMin = ((dimension.healthyRange[0] - 1) / 9) * 100;
  const healthyMax = ((dimension.healthyRange[1] - 1) / 9) * 100;

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: colors.white, border: '1px solid #e5e5e5' }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold" style={{ color: colors.indigo }}>{dimension.name}</h3>
        <span className="text-lg font-bold" style={{ color: colors.scarlet }}>
          {score.rawScore.toFixed(1)}
        </span>
      </div>

      {/* Score bar with healthy range */}
      <div className="relative h-3 rounded-full mb-2" style={{ backgroundColor: '#f3f4f6' }}>
        {/* Healthy range indicator */}
        <div
          className="absolute h-full rounded-full opacity-20"
          style={{
            left: `${healthyMin}%`,
            width: `${healthyMax - healthyMin}%`,
            backgroundColor: colors.indigo,
          }}
        />
        {/* Score position */}
        <div
          className="absolute h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: colors.scarlet,
          }}
        />
      </div>

      <div className="flex justify-between text-xs mb-2" style={{ color: colors.slate }}>
        <span>{dimension.lowLabel}</span>
        <span>{dimension.highLabel}</span>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: colors.charcoal }}>
        {score.interpretation}
      </p>

      {score.overuseFlag && (
        <div className="mt-2 px-3 py-1.5 rounded-md text-xs" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
          Overuse Alert: Overuse Index {score.overuseIndex?.toFixed(1)} &mdash; this trait may be counterproductive at this level.
        </div>
      )}
    </div>
  );
}
