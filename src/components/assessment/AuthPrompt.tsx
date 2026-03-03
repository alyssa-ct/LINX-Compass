'use client';

import { colors } from '@/lib/constants';

interface AuthPromptProps {
  onCreateAccount: () => void;
  onContinueAsGuest: () => void;
}

export default function AuthPrompt({ onCreateAccount, onContinueAsGuest }: AuthPromptProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-3" style={{ color: colors.indigo }}>
          Save Your Progress
        </h2>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: colors.slate }}>
          Create a free account to save your results, access your dashboard, and resume assessments anytime.
        </p>

        <div className="space-y-3">
          <button
            onClick={onCreateAccount}
            className="w-full py-3 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            Create Free Account
          </button>

          <button
            onClick={onContinueAsGuest}
            className="w-full py-3 rounded-full font-medium text-sm transition-all hover:shadow-sm"
            style={{ color: colors.indigo, border: `1.5px solid ${colors.indigo}`, backgroundColor: 'transparent' }}
          >
            Continue as Guest
          </button>
        </div>

        <p className="text-xs mt-6" style={{ color: colors.slate }}>
          Already have an account?{' '}
          <a href="/auth/login" className="underline hover:no-underline" style={{ color: colors.indigo }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
