'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { colors } from '@/lib/constants';

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Test', href: '/#hero' },
    { label: 'Archetypes', href: '/archetypes' },
    { label: 'Dimensions', href: '/#dimensions' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
  ];

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(255,252,249,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="text-lg font-bold" style={{ color: colors.indigo }}>
          LINX <span style={{ color: colors.scarlet }}>Compass</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: colors.charcoal }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <>
              <a
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: colors.charcoal }}
              >
                {session.user.name || 'Dashboard'}
              </a>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: colors.slate }}
              >
                Log Out
              </button>
            </>
          ) : (
            <a
              href="/auth/login"
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: colors.charcoal }}
            >
              Log In
            </a>
          )}
          <a
            href="/assess"
            className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            Take the Test
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 rounded-full transition-all" style={{ backgroundColor: colors.indigo, transform: menuOpen ? 'rotate(45deg) translateY(4px)' : 'none' }} />
          <span className="block w-5 h-0.5 rounded-full transition-all" style={{ backgroundColor: colors.indigo, opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 rounded-full transition-all" style={{ backgroundColor: colors.indigo, transform: menuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4" style={{ backgroundColor: 'rgba(255,252,249,0.98)' }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium border-b"
              style={{ color: colors.charcoal, borderColor: '#f0f0f0' }}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 mt-4 items-center">
            {session?.user ? (
              <>
                <a href="/dashboard" className="text-sm font-medium py-2" style={{ color: colors.charcoal }}>
                  {session.user.name || 'Dashboard'}
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium py-2"
                  style={{ color: colors.slate }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <a href="/auth/login" className="text-sm font-medium py-2" style={{ color: colors.charcoal }}>
                Log In
              </a>
            )}
            <a
              href="/assess"
              className="px-5 py-2 rounded-full text-sm font-medium text-white"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
            >
              Take the Test
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
