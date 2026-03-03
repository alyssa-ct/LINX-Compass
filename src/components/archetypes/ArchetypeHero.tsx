import { ARCHETYPE_ORDER, ARCHETYPE_META } from '@/data/archetype-meta';

export default function ArchetypeHero() {
  return (
    <section
      className="py-24 md:py-32 px-4 text-center"
      style={{ background: 'linear-gradient(135deg, #1B2845, #4F46E5)' }}
    >
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#C7D2FE' }}>
          Behavioral Profiling
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          10 Behavioral Archetypes
        </h1>
        <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: '#C7D2FE' }}>
          Every person has a distinct behavioral signature. LINX Compass distills your
          assessment into one of ten archetypes &mdash; a shorthand for how you think,
          act, and lead. Discover all ten below.
        </p>

        {/* Icon row */}
        <div className="flex flex-wrap justify-center gap-3">
          {ARCHETYPE_ORDER.map(id => (
            <div
              key={id}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              {ARCHETYPE_META[id].icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
