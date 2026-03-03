'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AssessmentSession, ClientAssignment } from '@/lib/types';
import { colors, VERSION_CONFIGS } from '@/lib/constants';

function stageBadge(stage: string) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    'results': { label: 'Completed', bg: '#DCFCE7', fg: '#166534' },
    'assessment': { label: 'In Progress', bg: '#DBEAFE', fg: '#1E40AF' },
    'preview': { label: 'Preview', bg: '#FEF3C7', fg: '#92400E' },
    'email-capture': { label: 'Preview Done', bg: '#FEF3C7', fg: '#92400E' },
    'preview-results': { label: 'Preview Done', bg: '#FEF3C7', fg: '#92400E' },
    'upgrade': { label: 'Awaiting Upgrade', bg: '#FEE2E2', fg: '#991B1B' },
  };
  const s = map[stage] || { label: stage, bg: '#F3F4F6', fg: '#374151' };
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

function assignmentStatusBadge(status: string) {
  const map: Record<string, { bg: string; fg: string }> = {
    'pending': { bg: '#FEF3C7', fg: '#92400E' },
    'in-progress': { bg: '#DBEAFE', fg: '#1E40AF' },
    'completed': { bg: '#DCFCE7', fg: '#166534' },
  };
  const s = map[status] || { bg: '#F3F4F6', fg: '#374151' };
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const { data: authSession, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [assignments, setAssignments] = useState<ClientAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = (authSession?.user as Record<string, unknown> | undefined)?.role as string || 'user';
  const isClient = userRole === 'client';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/dashboard');
      return;
    }

    if (status === 'authenticated') {
      if (isClient) {
        // Client: load assigned tests
        fetch('/api/users/assignments')
          .then(res => res.json())
          .then(data => setAssignments(data.assignments || []))
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        // Regular user: load self-service sessions
        fetch('/api/users/sessions')
          .then(res => res.json())
          .then(data => setSessions(data.sessions || []))
          .catch(console.error)
          .finally(() => setLoading(false));
      }
    }
  }, [status, router, isClient]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
        <p style={{ color: colors.slate }}>Loading...</p>
      </div>
    );
  }

  // ─── Client Dashboard ───────────────────────────────────────────────────

  if (isClient) {
    return (
      <div className="min-h-screen px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: colors.indigo }}>
              My Assessments
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.slate }}>
              Welcome back, {authSession?.user?.name || 'there'}.
            </p>
          </div>

          {assignments.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center"
              style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            >
              <p className="text-lg font-medium mb-2" style={{ color: colors.indigo }}>
                No assessments assigned
              </p>
              <p className="text-sm" style={{ color: colors.slate }}>
                Your assessments will appear here once assigned by your administrator.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map(a => (
                <div
                  key={a.id}
                  className="rounded-xl p-5 flex items-center justify-between"
                  style={{ backgroundColor: colors.white, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-bold" style={{ color: colors.indigo }}>
                        {VERSION_CONFIGS[a.version]?.name || a.version}
                      </p>
                      {assignmentStatusBadge(a.status)}
                    </div>
                    <p className="text-xs" style={{ color: colors.slate }}>
                      Assigned {new Date(a.createdAt).toLocaleDateString()}
                      {a.deadline && ` \u2022 Due ${new Date(a.deadline).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div>
                    {a.status === 'completed' && a.sessionId ? (
                      <a
                        href={`/results/${a.sessionId}`}
                        className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                      >
                        View Results
                      </a>
                    ) : a.sessionId ? (
                      <a
                        href={`/assess?resume=${a.sessionId}`}
                        className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                      >
                        {a.status === 'pending' ? 'Start Test' : 'Resume'}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Regular User Dashboard ─────────────────────────────────────────────

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.indigo }}>
              Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.slate }}>
              Welcome back, {authSession?.user?.name || 'there'}.
            </p>
          </div>
          <a
            href="/assess"
            className="px-6 py-2.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            Start New Assessment
          </a>
        </div>

        {sessions.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ backgroundColor: colors.white, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
          >
            <p className="text-lg font-medium mb-2" style={{ color: colors.indigo }}>
              No assessments yet
            </p>
            <p className="text-sm mb-6" style={{ color: colors.slate }}>
              Take your first LINX Compass assessment to discover your behavioral profile.
            </p>
            <a
              href="/assess"
              className="inline-block px-8 py-3 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
            >
              Take the Test
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(s => (
              <div
                key={s.id}
                className="rounded-xl p-5 flex items-center justify-between"
                style={{ backgroundColor: colors.white, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-bold" style={{ color: colors.indigo }}>
                      {s.version
                        ? `${s.version.charAt(0).toUpperCase() + s.version.slice(1)} Assessment`
                        : 'Preview Assessment'}
                    </p>
                    {stageBadge(s.stage)}
                  </div>
                  <p className="text-xs" style={{ color: colors.slate }}>
                    Started {new Date(s.createdAt).toLocaleDateString()}
                    {s.stage === 'preview' && ` \u2022 ${s.previewAnswers.length}/${s.previewQuestionIds.length} preview questions`}
                    {s.stage === 'assessment' && ` \u2022 ${s.fullAnswers.length}/${s.fullQuestionIds.length} questions`}
                  </p>
                </div>
                <div>
                  {s.stage === 'results' ? (
                    <a
                      href={`/results/${s.id}`}
                      className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                    >
                      View Results
                    </a>
                  ) : (
                    <a
                      href={`/assess?resume=${s.id}`}
                      className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:shadow-sm"
                      style={{ color: colors.indigo, border: `1.5px solid ${colors.indigo}` }}
                    >
                      Resume
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
