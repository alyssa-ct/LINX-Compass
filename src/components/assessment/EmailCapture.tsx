'use client';

import { useState } from 'react';
import { colors } from '@/lib/constants';

interface EmailCaptureProps {
  onSubmit: (info: { firstName: string; lastName: string; email: string }) => void;
  isLoading?: boolean;
}

export default function EmailCapture({ onSubmit, isLoading }: EmailCaptureProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const isValid = firstName.trim() && lastName.trim() && email.trim() && email.includes('@');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.porcelain }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.indigo }}>
            Almost there!
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: colors.slate }}>
            Enter your details to see your preview results.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-6 space-y-4"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2"
                style={{ borderColor: '#e5e5e5', color: colors.charcoal }}
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2"
                style={{ borderColor: '#e5e5e5', color: colors.charcoal }}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none focus:ring-2"
              style={{ borderColor: '#e5e5e5', color: colors.charcoal }}
              placeholder="jane@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full py-3 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: isValid ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#9CA3AF' }}
          >
            {isLoading ? 'Loading...' : 'See My Results'}
          </button>
        </form>

        <p className="text-xs text-center mt-4" style={{ color: colors.slate }}>
          We&apos;ll never share your information without permission.
        </p>
      </div>
    </div>
  );
}
