import { colors } from '@/lib/constants';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium" style={{ color: colors.slate }}>{label}</span>
          <span className="text-xs" style={{ color: colors.slate }}>{pct}%</span>
        </div>
      )}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e5e5' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: colors.scarlet }}
        />
      </div>
    </div>
  );
}
