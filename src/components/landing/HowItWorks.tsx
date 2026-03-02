import { colors } from '@/lib/constants';

const steps = [
  {
    number: '01',
    title: 'Start Answering',
    description: 'Jump right in. 30 questions, no signup or payment needed. Takes about 5 minutes.',
  },
  {
    number: '02',
    title: 'See Your Preview',
    description: 'Get real scores across 5 key behavioral dimensions with a personalized summary.',
  },
  {
    number: '03',
    title: 'Unlock Full Insights',
    description: 'Choose your plan for all 15 dimensions, role-fit analysis, cross-dimension insights, and more.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.indigo }}>
            How It Works
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: colors.slate }}>
            From free preview to full results in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl p-6 text-center"
              style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white mx-auto mb-5"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
              >
                {step.number}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: colors.indigo }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: colors.charcoal }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
