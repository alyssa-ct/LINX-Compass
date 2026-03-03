'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AssessmentVersion } from '@/lib/types';
import { colors, VERSION_CONFIGS } from '@/lib/constants';

interface ClientDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  createdAt: string;
}

interface AssignmentDetail {
  id: string;
  version: string;
  status: string;
  deadline?: string;
  notes?: string;
  sessionId?: string;
  createdAt: string;
  progress?: {
    stage: string;
    fullAnswered: number;
    fullTotal: number;
    hasResults: boolean;
  } | null;
}

export default function AdminClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [assignments, setAssignments] = useState<AssignmentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState(false);

  // Assign form
  const [showAssign, setShowAssign] = useState(false);
  const [assignVersion, setAssignVersion] = useState<AssessmentVersion>('standard');
  const [assignDeadline, setAssignDeadline] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/clients/${clientId}`)
      .then(res => res.json())
      .then(data => {
        setClient(data.client);
        setAssignments(data.assignments || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [clientId]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);

    try {
      await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientUserId: clientId,
          version: assignVersion,
          deadline: assignDeadline || undefined,
          notes: assignNotes || undefined,
        }),
      });

      setShowAssign(false);
      setAssignNotes('');
      setAssignDeadline('');

      // Reload
      const res = await fetch(`/api/admin/clients/${clientId}`);
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch {
      console.error('Failed to assign');
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateNotes = async (assignmentId: string, newNotes: string) => {
    await fetch(`/api/admin/assignments/${assignmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: newNotes }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
        <p style={{ color: colors.slate }}>Loading...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
        <p style={{ color: colors.scarlet }}>Client not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-3xl mx-auto">
        <a href="/admin/clients" className="text-xs underline hover:no-underline mb-4 inline-block" style={{ color: colors.slate }}>
          &larr; Back to Clients
        </a>

        {/* Client Info */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ color: colors.indigo }}>
              {client.firstName} {client.lastName}
            </h1>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs underline hover:no-underline"
              style={{ color: colors.indigo }}
            >
              {editing ? 'Done' : 'Edit'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs" style={{ color: colors.slate }}>Email</span>
              <p style={{ color: colors.charcoal }}>{client.email}</p>
            </div>
            <div>
              <span className="text-xs" style={{ color: colors.slate }}>Company</span>
              <p style={{ color: colors.charcoal }}>{client.company || '—'}</p>
            </div>
            <div>
              <span className="text-xs" style={{ color: colors.slate }}>Created</span>
              <p style={{ color: colors.charcoal }}>{new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Assignments */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: colors.indigo }}>Assignments</h2>
          <button
            onClick={() => setShowAssign(!showAssign)}
            className="px-5 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {showAssign ? 'Cancel' : 'Assign New Test'}
          </button>
        </div>

        {/* Assign Form */}
        {showAssign && (
          <form
            onSubmit={handleAssign}
            className="rounded-xl p-5 mb-4 space-y-3"
            style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium" style={{ color: colors.charcoal }}>Version</label>
                <select
                  value={assignVersion}
                  onChange={e => setAssignVersion(e.target.value as AssessmentVersion)}
                  className="w-full px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#e5e5e5' }}
                >
                  <option value="light">{VERSION_CONFIGS.light.name} ({VERSION_CONFIGS.light.totalQuestions} Qs)</option>
                  <option value="standard">{VERSION_CONFIGS.standard.name} ({VERSION_CONFIGS.standard.totalQuestions} Qs)</option>
                  <option value="max">{VERSION_CONFIGS.max.name} ({VERSION_CONFIGS.max.totalQuestions} Qs)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: colors.charcoal }}>Deadline</label>
                <input
                  type="date" value={assignDeadline}
                  onChange={e => setAssignDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#e5e5e5' }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: colors.charcoal }}>Notes</label>
              <textarea
                value={assignNotes}
                onChange={e => setAssignNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border resize-none"
                style={{ borderColor: '#e5e5e5' }}
                rows={2}
                placeholder="Admin notes (optional)"
              />
            </div>
            <button
              type="submit" disabled={assigning}
              className="px-5 py-2 rounded-full text-sm font-medium text-white disabled:opacity-40"
              style={{ backgroundColor: colors.indigo }}
            >
              {assigning ? 'Assigning...' : 'Create Assignment'}
            </button>
          </form>
        )}

        {/* Assignment List */}
        <div className="space-y-3">
          {assignments.length === 0 ? (
            <div
              className="rounded-xl p-8 text-center"
              style={{ backgroundColor: colors.white, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
            >
              <p className="text-sm" style={{ color: colors.slate }}>No assignments yet.</p>
            </div>
          ) : (
            assignments.map(a => (
              <div
                key={a.id}
                className="rounded-xl p-5"
                style={{ backgroundColor: colors.white, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium" style={{ color: colors.indigo }}>
                      {VERSION_CONFIGS[a.version]?.name || a.version}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                      backgroundColor: a.status === 'completed' ? '#DCFCE7' : a.status === 'in-progress' ? '#DBEAFE' : '#FEF3C7',
                      color: a.status === 'completed' ? '#166534' : a.status === 'in-progress' ? '#1E40AF' : '#92400E',
                    }}>
                      {a.status}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: colors.slate }}>
                    {a.deadline && `Due: ${new Date(a.deadline).toLocaleDateString()}`}
                  </div>
                </div>

                {/* Progress */}
                {a.progress && (
                  <div className="mb-2">
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e5e5' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: a.progress.fullTotal > 0 ? `${(a.progress.fullAnswered / a.progress.fullTotal) * 100}%` : '0%',
                          backgroundColor: colors.indigo,
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: colors.slate }}>
                      {a.progress.fullAnswered} / {a.progress.fullTotal} questions answered
                    </p>
                  </div>
                )}

                {/* Notes */}
                {a.notes && (
                  <p className="text-xs italic" style={{ color: colors.slate }}>
                    Note: {a.notes}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-3">
                  {a.progress?.hasResults && a.sessionId && (
                    <a
                      href={`/results/${a.sessionId}`}
                      className="text-xs font-medium underline hover:no-underline"
                      style={{ color: colors.scarlet }}
                    >
                      View Results
                    </a>
                  )}
                  <span className="text-xs" style={{ color: colors.slate }}>
                    Created {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
