import { VERSION_CONFIGS, colors } from '@/lib/constants';

const versionOrder = ['light', 'standard', 'max'] as const;

export default function PricingCards() {
  return (
    <section id="pricing" className="py-20 px-4" style={{ backgroundColor: colors.white }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.indigo }}>
            Choose Your Assessment
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: colors.slate }}>
            All versions include the same 30-question free preview. Choose the depth of analysis that fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {versionOrder.map((versionId) => {
            const config = VERSION_CONFIGS[versionId];
            const isPopular = versionId === 'standard';

            return (
              <div
                key={versionId}
                className="rounded-2xl p-6 relative flex flex-col transition-all duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: colors.white,
                  border: isPopular ? '2px solid transparent' : '1px solid #e5e5e5',
                  backgroundImage: isPopular ? 'linear-gradient(#fff, #fff), linear-gradient(135deg, #4F46E5, #7C3AED)' : 'none',
                  backgroundOrigin: 'border-box',
                  backgroundClip: isPopular ? 'padding-box, border-box' : 'padding-box',
                  boxShadow: isPopular ? '0 8px 30px rgba(79, 70, 229, 0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                {isPopular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6 pt-2">
                  <h3 className="text-lg font-bold mb-1" style={{ color: colors.indigo }}>
                    {config.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold" style={{ color: colors.indigo }}>
                      ${config.priceUsd}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: colors.slate }}>
                    {config.totalQuestions} questions &middot; {config.questionsPerDimension} per dimension
                  </p>
                </div>

                <div className="flex-1 mb-6">
                  <ul className="space-y-2.5">
                    {config.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: colors.charcoal }}>
                        <span className="mt-0.5 shrink-0" style={{ color: '#10b981' }}>&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="/assess"
                  className="block text-center px-6 py-3 rounded-full font-medium text-sm transition-all hover:opacity-90"
                  style={{
                    background: isPopular ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : colors.indigo,
                    color: colors.white,
                  }}
                >
                  Get Started
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center mt-8" style={{ color: colors.slate }}>
          Secure payment via Stripe. 30-day satisfaction guarantee.
        </p>
      </div>
    </section>
  );
}
