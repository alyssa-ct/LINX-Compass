'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { colors } from '@/lib/constants';

export default function SettingsPage() {
  const { data: authSession, status } = useSession();
  const router = useRouter();

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetch('/api/users/profile')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setFirstName(data.user.firstName || '');
            setLastName(data.user.lastName || '');
            setCompany(data.user.company || '');
          }
        })
        .catch(() => setProfileError('Failed to load profile.'))
        .finally(() => setProfileLoading(false));
    }
  }, [status, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileSaving(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, company }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || 'Failed to update profile.');
        return;
      }

      setProfileSuccess('Profile updated successfully.');
    } catch {
      setProfileError('Something went wrong. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch('/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password.');
        return;
      }

      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('Something went wrong. Please try again.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (status === 'loading' || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
        <p className="text-sm" style={{ color: colors.slate }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <a href="/dashboard" className="text-sm hover:underline" style={{ color: colors.slate }}>
            &larr; Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold mt-4 mb-1" style={{ color: colors.indigo }}>
            Account Settings
          </h1>
          <p className="text-sm" style={{ color: colors.slate }}>
            Manage your profile and security.
          </p>
        </div>

        {/* Profile Information */}
        <form
          onSubmit={handleProfileSubmit}
          className="rounded-2xl p-8 mb-6"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ color: colors.indigo }}>
            Profile Information
          </h2>

          {profileSuccess && (
            <div className="mb-4 p-3 rounded-lg text-sm text-green-700" style={{ backgroundColor: '#DCFCE7' }}>
              {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-700" style={{ backgroundColor: '#FEE2E2' }}>
              {profileError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Email
            </label>
            <input
              type="email"
              value={authSession?.user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border text-sm bg-gray-50 cursor-not-allowed"
              style={{ borderColor: '#E5E7EB', color: colors.slate }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
                style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
              placeholder="Optional"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="py-3 px-8 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {profileSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Change Password */}
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-2xl p-8"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ color: colors.indigo }}>
            Change Password
          </h2>

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-lg text-sm text-green-700" style={{ backgroundColor: '#DCFCE7' }}>
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-700" style={{ backgroundColor: '#FEE2E2' }}>
              {passwordError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
              placeholder="At least 8 characters"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5" style={{ color: colors.charcoal }}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-indigo-500"
              style={{ borderColor: '#E5E7EB', color: colors.charcoal }}
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="py-3 px-8 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
