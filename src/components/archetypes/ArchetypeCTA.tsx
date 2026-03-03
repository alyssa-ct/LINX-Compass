import { colors } from '@/lib/constants';

export default function ArchetypeCTA() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.indigo }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Discover Your Archetype
        </h2>
        <p className="text-base leading-relaxed mb-8" style={{ color: `${colors.white}90` }}>
          Take the 10-minute behavioral assessment to find out which
          archetype fits you best &mdash; plus detailed dimension scores,
          role-fit analysis, and more.
        </p>
        <a
          href="/assess"
          className="inline-block px-10 py-4 rounded-full text-white font-medium text-base transition-all hover:opacity-90 hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          Take the Free Test
        </a>
        <p className="text-xs mt-5" style={{ color: `${colors.white}50` }}>
          or{' '}
          <a href="/#pricing" className="underline hover:no-underline" style={{ color: `${colors.white}70` }}>
            learn more about our pricing
          </a>
        </p>
      </div>
    </section>
  );
}
