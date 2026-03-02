import { DIMENSIONS, DIMENSION_IDS, colors } from '@/lib/constants';

const accentColors = [
  '#4F46E5', '#7C3AED', '#DC303C', '#EA580C', '#D97706',
  '#16A34A', '#0891B2', '#2563EB', '#9333EA', '#C026D3',
  '#E11D48', '#059669', '#0284C7', '#7C3AED', '#4F46E5',
];

export default function DimensionShowcase() {
  return (
    <section id="dimensions" className="py-20 px-4" style={{ backgroundColor: colors.white }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        {/* Illustration Placeholder */}
        <div className="w-full lg:w-5/12">
          <div
            className="w-full aspect-square rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#f0eeeb' }}
          >
            <span className="text-sm" style={{ color: colors.slate }}>Illustration placeholder</span>
          </div>
        </div>

        {/* Dimensions */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colors.indigo }}>
            15 Behavioral Dimensions
          </h2>
          <p className="text-base mb-8" style={{ color: colors.slate }}>
            Each dimension captures a distinct facet of workplace behavior.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIMENSION_IDS.map((dimId, idx) => {
              const dim = DIMENSIONS[dimId];
              return (
                <div
                  key={dimId}
                  className="flex items-center gap-3 rounded-lg p-3 transition-shadow hover:shadow-sm"
                  style={{ backgroundColor: colors.porcelain }}
                >
                  <div
                    className="w-1 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: accentColors[idx] }}
                  />
                  <div>
                    <p className="text-sm font-bold" style={{ color: colors.indigo }}>{dim.name}</p>
                    <p className="text-xs" style={{ color: colors.slate }}>{dim.lowLabel} &#8596; {dim.highLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
