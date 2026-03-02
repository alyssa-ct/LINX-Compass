import { colors } from '@/lib/constants';

const stats = [
  { value: '125,000+', label: 'Tests Completed' },
  { value: '94%', label: 'Rated Accurate' },
  { value: '15', label: 'Dimensions Measured' },
  { value: '50+', label: 'Role Templates' },
];

export default function StatsBar() {
  return (
    <section className="py-12 px-4" style={{ backgroundColor: colors.indigo }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: colors.white }}>
              {stat.value}
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: `${colors.white}80` }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
