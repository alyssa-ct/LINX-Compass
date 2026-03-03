'use client';

import { useState } from 'react';
import { colors } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
        return;
      }

      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold" style={{ color: colors.indigo }}>
            LINX <span style={{ color: colors.scarlet }}>Compass</span>
          </a>
          <h1 className="text-2xl font-bold mt-6 mb-2" style={{ color: colors.indigo }}>
            Forgot your password?
          </h1>
          <p className="text-sm" style={{ color: colors.slate }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          {sent ? (
            <div>
              <div className="mb-4 p-3 rounded-lg text-sm text-green-700" style={{ backgroundColor: '#DCFCE7' }}>
                Check your email. If an account exists with that address, we&apos;ve sent a password reset link.
              </div>
              <a
                href="/auth/login"
                className="block w-full py-3 rounded-full text-white font-medium text-sm text-center transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
              >
                Back to Log In
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 rounded-lg text-sm text-red-700" style={{ backgroundColor: '#FEE2E2' }}>
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
                  style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: colors.slate }}>
          Remember your password?{' '}
          <a href="/auth/login" className="font-medium underline hover:no-underline" style={{ color: colors.indigo }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
