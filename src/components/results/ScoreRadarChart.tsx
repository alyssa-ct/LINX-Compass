'use client';

import { DimensionScore } from '@/lib/types';
import { DIMENSIONS, colors } from '@/lib/constants';

interface ScoreRadarChartProps {
  scores: DimensionScore[];
}

export default function ScoreRadarChart({ scores }: ScoreRadarChartProps) {
  const cx = 200;
  const cy = 200;
  const maxR = 160;
  const n = scores.length;

  const angleStep = (2 * Math.PI) / n;

  const getPoint = (index: number, value: number): [number, number] => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 10) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  // Grid circles
  const gridCircles = [2, 4, 6, 8, 10];

  // Score polygon
  const scorePoints = scores.map((s, i) => getPoint(i, s.rawScore));
  const scorePath = scorePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';

  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 400" className="w-full">
        {/* Grid circles */}
        {gridCircles.map(v => (
          <circle
            key={v}
            cx={cx}
            cy={cy}
            r={(v / 10) * maxR}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth={0.5}
          />
        ))}

        {/* Axis lines and labels */}
        {scores.map((s, i) => {
          const [x, y] = getPoint(i, 10);
          const [lx, ly] = getPoint(i, 11.5);
          const name = DIMENSIONS[s.dimensionId]?.name ?? s.dimensionId;
          const shortName = name.length > 12 ? name.slice(0, 11) + '...' : name;

          return (
            <g key={s.dimensionId}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e5e5" strokeWidth={0.5} />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill={colors.slate}
                fontSize={8}
              >
                {shortName}
              </text>
            </g>
          );
        })}

        {/* Score polygon */}
        <path
          d={scorePath}
          fill={`${colors.scarlet}20`}
          stroke={colors.scarlet}
          strokeWidth={2}
        />

        {/* Score dots */}
        {scorePoints.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={4}
            fill={colors.scarlet}
          />
        ))}
      </svg>
    </div>
  );
}
