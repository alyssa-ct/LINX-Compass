'use client';

import { useState } from 'react';
import { UserInfo } from '@/lib/types';
import { colors } from '@/lib/constants';
import Button from '../shared/Button';

interface UserCaptureFormProps {
  onSubmit: (info: UserInfo) => void;
}

export default function UserCaptureForm({ onSubmit }: UserCaptureFormProps) {
  const [form, setForm] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const inputStyle = {
    borderColor: '#d1d5db',
    color: colors.charcoal,
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: colors.porcelain }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="rounded-xl p-8" style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <h2 className="text-2xl font-bold mb-1" style={{ color: colors.indigo }}>
            Before We Begin
          </h2>
          <p className="text-sm mb-6" style={{ color: colors.slate }}>
            Tell us a bit about yourself. Your information is kept confidential.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ ...inputStyle, '--tw-ring-color': colors.scarlet } as React.CSSProperties}
                />
                {errors.firstName && <p className="text-xs mt-1" style={{ color: colors.scarlet }}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ ...inputStyle, '--tw-ring-color': colors.scarlet } as React.CSSProperties}
                />
                {errors.lastName && <p className="text-xs mt-1" style={{ color: colors.scarlet }}>{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ ...inputStyle, '--tw-ring-color': colors.scarlet } as React.CSSProperties}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: colors.scarlet }}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: colors.charcoal }}>
                Company
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ ...inputStyle, '--tw-ring-color': colors.scarlet } as React.CSSProperties}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
            Start Free Preview
          </Button>

          <p className="text-xs text-center mt-3" style={{ color: colors.slate }}>
            You&apos;ll answer 30 free preview questions before choosing to continue.
          </p>
        </div>
      </form>
    </div>
  );
}
