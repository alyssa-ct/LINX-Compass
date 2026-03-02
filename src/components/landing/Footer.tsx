import { colors } from '@/lib/constants';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Take the Test', href: '/assess' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'For Teams', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: '15 Dimensions', href: '/#dimensions' },
      { label: '10 Archetypes', href: '/archetypes' },
      { label: 'The Science', href: '#' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact Us', href: '#' },
      { label: 'Support', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="py-16 px-4" style={{ backgroundColor: colors.indigo }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold mb-3" style={{ color: colors.white }}>
              LINX <span style={{ color: colors.scarlet }}>Compass</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: `${colors.white}70` }}>
              A 15-dimension behavioral assessment platform that reveals how people think, feel, and act in the workplace.
            </p>
          </div>

          {/* Link Columns */}
          {columns.map(col => (
            <div key={col.title}>
              <p className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: `${colors.white}90` }}>
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-opacity hover:opacity-100"
                      style={{ color: `${colors.white}60` }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8" style={{ borderTop: `1px solid ${colors.white}15` }}>
          <p className="text-xs text-center" style={{ color: `${colors.white}40` }}>
            &copy; {new Date().getFullYear()} LINX Consulting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
