import { ARCHETYPES } from '@/data/archetypes';
import { TEASER_ARCHETYPE_IDS, ARCHETYPE_META } from '@/data/archetype-meta';
import { colors } from '@/lib/constants';

export default function ArchetypeTeaser() {
  const archetypeMap = Object.fromEntries(ARCHETYPES.map(a => [a.id, a]));

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#F5F3FF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.indigo }}>
            Which Archetype Are You?
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: colors.slate }}>
            LINX Compass identifies your behavioral archetype from 10 distinct profiles.
            Here are a few &mdash; which one resonates with you?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {TEASER_ARCHETYPE_IDS.map(id => {
            const archetype = archetypeMap[id];
            const meta = ARCHETYPE_META[id];
            if (!archetype) return null;
            return (
              <a
                key={id}
                href="/archetypes"
                className="rounded-2xl p-5 block transition-all duration-200 hover:-translate-y-1"
                style={{
                  backgroundColor: colors.white,
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  borderTop: `4px solid ${meta.accentColor}`,
                }}
              >
                {/* Illustration placeholder */}
                <div
                  className="w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#f0eeeb' }}
                >
                  <span className="text-xs" style={{ color: colors.slate }}>Illustration placeholder</span>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: colors.indigo }}>
                  {archetype.name}
                </h3>
                <p className="text-xs italic leading-relaxed" style={{ color: colors.slate }}>
                  &ldquo;{archetype.tagline}&rdquo;
                </p>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href="/archetypes"
            className="inline-block px-8 py-3 rounded-full text-white text-sm font-medium transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            Explore All 10 Archetypes
          </a>
          <p className="text-xs mt-3" style={{ color: colors.slate }}>
            Discover which one fits you best
          </p>
        </div>
      </div>
    </section>
  );
}
