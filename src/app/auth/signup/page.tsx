'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { colors } from '@/lib/constants';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          company: form.company,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        return;
      }

      // Auto-login after successful registration
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed, redirect to login
        router.push('/auth/login');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold" style={{ color: colors.indigo }}>
            LINX <span style={{ color: colors.scarlet }}>Compass</span>
          </a>
          <h1 className="text-2xl font-bold mt-6 mb-2" style={{ color: colors.indigo }}>
            Create your account
          </h1>
          <p className="text-sm" style={{ color: colors.slate }}>
            Sign up to save your results and access your dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-700" style={{ backgroundColor: '#FEE2E2' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
                First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
                style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
                style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Company <span className="text-xs font-normal" style={{ color: colors.slate }}>(optional)</span>
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: colors.slate }}>
          Already have an account?{' '}
          <a href="/auth/login" className="font-medium underline hover:no-underline" style={{ color: colors.indigo }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
