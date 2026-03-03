'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { colors } from '@/lib/constants';

type Status = 'verifying' | 'set-password' | 'creating-account' | 'confirmed' | 'error';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<Status>('verifying');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldError, setFieldError] = useState('');

  // Poll for payment confirmation, then show password form
  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const poll = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        const data = await res.json();

        const paymentDone = data.session?.payment?.status === 'completed';

        // Check if user already has an account (e.g. was logged in)
        if (paymentDone && data.session?.userId) {
          setStatus('confirmed');
          setTimeout(() => router.push('/dashboard'), 1500);
          return;
        }

        if (paymentDone) {
          setEmail(data.session?.user?.email || '');
          setStatus('set-password');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1500);
        } else {
          // Stripe webhook may be slow — proceed anyway
          setEmail(data.session?.user?.email || '');
          setStatus('set-password');
        }
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1500);
        } else {
          setStatus('error');
        }
      }
    };

    poll();
  }, [sessionId, router]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');

    if (password.length < 8) {
      setFieldError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setFieldError('Passwords do not match.');
      return;
    }

    setStatus('creating-account');

    try {
      const res = await fetch('/api/payment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setFieldError(err.error || 'Something went wrong.');
        setStatus('set-password');
        return;
      }

      const result = await res.json();

      if (result.alreadyRegistered) {
        setStatus('confirmed');
        setTimeout(() => router.push('/dashboard'), 1500);
        return;
      }

      // Auto-sign in with the password they just set
      const signInResult = await signIn('credentials', {
        email: result.email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        setStatus('confirmed');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        // Account created but sign-in failed — send them to login
        setStatus('confirmed');
        setTimeout(() => router.push('/auth/login'), 2000);
      }
    } catch {
      setFieldError('Something went wrong. Please try again.');
      setStatus('set-password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
      <div className="text-center max-w-md px-6 w-full">
        {/* Verifying payment */}
        {status === 'verifying' && (
          <>
            <div
              className="animate-spin rounded-full h-8 w-8 border-2 mx-auto mb-4"
              style={{ borderColor: '#e5e5e5', borderTopColor: colors.scarlet }}
            />
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.indigo }}>
              Confirming Payment
            </h1>
            <p className="text-sm" style={{ color: colors.slate }}>
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {/* Set password form */}
        {status === 'set-password' && (
          <>
            <div className="text-4xl mb-4" style={{ color: '#16a34a' }}>&#10003;</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.indigo }}>
              Payment Confirmed!
            </h1>
            <p className="text-sm mb-6" style={{ color: colors.slate }}>
              Set a password to create your account and access your full assessment.
            </p>

            <form onSubmit={handleSetPassword} className="text-left space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                  Email
                </label>
                <div
                  className="px-3 py-2.5 rounded-lg text-sm"
                  style={{ backgroundColor: '#f5f5f5', color: colors.charcoal }}
                >
                  {email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setFieldError(''); }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2"
                  style={{ borderColor: '#e5e5e5', color: colors.charcoal }}
                  placeholder="Minimum 8 characters"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setFieldError(''); }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2"
                  style={{ borderColor: '#e5e5e5', color: colors.charcoal }}
                  placeholder="Confirm your password"
                />
              </div>

              {fieldError && (
                <p className="text-xs" style={{ color: colors.scarlet }}>{fieldError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
              >
                Create Account &amp; Start Assessment
              </button>
            </form>
          </>
        )}

        {/* Creating account spinner */}
        {status === 'creating-account' && (
          <>
            <div
              className="animate-spin rounded-full h-8 w-8 border-2 mx-auto mb-4"
              style={{ borderColor: '#e5e5e5', borderTopColor: colors.indigo }}
            />
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.indigo }}>
              Setting Up Your Account
            </h1>
            <p className="text-sm" style={{ color: colors.slate }}>
              Creating your account and preparing your assessment...
            </p>
          </>
        )}

        {/* All done */}
        {status === 'confirmed' && (
          <>
            <div className="text-4xl mb-4" style={{ color: '#16a34a' }}>&#10003;</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.indigo }}>
              You&apos;re All Set!
            </h1>
            <p className="text-sm" style={{ color: colors.slate }}>
              Redirecting to your dashboard...
            </p>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.scarlet }}>
              Something went wrong
            </h1>
            <p className="text-sm mb-4" style={{ color: colors.slate }}>
              We couldn&apos;t verify your payment. Please contact support.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: colors.indigo }}
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
