import { colors } from '@/lib/constants';

export default function Hero() {
  return (
    <section id="hero" className="py-24 md:py-32 px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6" style={{ color: colors.indigo }}>
            It&apos;s so incredible to finally be{' '}
            <span style={{ color: colors.scarlet }}>understood.</span>
          </h1>

          <p className="text-lg md:text-xl mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed" style={{ color: colors.slate }}>
            Only 10 minutes to discover how you think, feel, and act &mdash; with role-fit
            recommendations backed by psychometric science.
          </p>

          <p className="text-sm mb-8" style={{ color: colors.slate }}>
            No signup required. Start answering immediately.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/assess"
              className="inline-block px-8 py-4 rounded-full text-white font-medium text-base transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
            >
              Take the Free Test
            </a>
          </div>

          <p className="text-xs mt-5" style={{ color: colors.slate }}>
            Already have an account?{' '}
            <a href="/auth/login" className="underline hover:no-underline" style={{ color: colors.indigo }}>
              Log in
            </a>
          </p>
        </div>

        {/* Illustration Placeholder */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg">
          <div
            className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: '#f0eeeb' }}
          >
            <span className="text-sm" style={{ color: colors.slate }}>Illustration placeholder</span>
          </div>
        </div>
      </div>
    </section>
  );
}
