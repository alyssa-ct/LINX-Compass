import { colors } from '@/lib/constants';

const testimonials = [
  {
    quote: 'The role-fit analysis was spot-on. It identified strengths I knew I had but couldn\'t articulate, and flagged blind spots I\'d been ignoring.',
    name: 'Sarah M.',
    type: 'High Responsibility, High Energy',
  },
  {
    quote: 'I was skeptical of another personality test, but the cross-dimension insights gave me a completely new lens on how I work under pressure.',
    name: 'James K.',
    type: 'High Logical Thinking, Low Anxiety',
  },
  {
    quote: 'We used Compass for our leadership team offsite. The results sparked the most honest conversation we\'ve had in years.',
    name: 'Priya R.',
    type: 'HR Director',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.indigo }}>
            What People Are Saying
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: colors.slate }}>
            Hear from professionals who&apos;ve used LINX Compass to understand themselves and their teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col"
              style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            >
              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: colors.charcoal }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: '#f3f4f6', color: colors.slate }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: colors.indigo }}>{t.name}</p>
                  <p className="text-xs" style={{ color: colors.slate }}>{t.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
