'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { colors } from '@/lib/constants';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token || !email) {
    return (
      <div className="rounded-2xl p-8" style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="mb-4 p-3 rounded-lg text-sm text-red-700" style={{ backgroundColor: '#FEE2E2' }}>
          Invalid reset link. Please request a new password reset.
        </div>
        <a
          href="/auth/forgot-password"
          className="block w-full py-3 rounded-full text-white font-medium text-sm text-center transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          Request New Reset Link
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl p-8" style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="mb-4 p-3 rounded-lg text-sm text-green-700" style={{ backgroundColor: '#DCFCE7' }}>
          Your password has been reset successfully.
        </div>
        <a
          href="/auth/login"
          className="block w-full py-3 rounded-full text-white font-medium text-sm text-center transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
        >
          Log In
        </a>
      </div>
    );
  }

  return (
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

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
          style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
          placeholder="Re-enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold" style={{ color: colors.indigo }}>
            LINX <span style={{ color: colors.scarlet }}>Compass</span>
          </a>
          <h1 className="text-2xl font-bold mt-6 mb-2" style={{ color: colors.indigo }}>
            Set a new password
          </h1>
          <p className="text-sm" style={{ color: colors.slate }}>
            Choose a strong password for your account.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <p className="text-sm" style={{ color: colors.slate }}>Loading...</p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

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
