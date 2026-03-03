'use client';

import { useState, useEffect } from 'react';
import { colors, VERSION_CONFIGS } from '@/lib/constants';

interface AssignmentRow {
  id: string;
  clientUserId: string;
  version: string;
  status: string;
  deadline?: string;
  notes?: string;
  sessionId?: string;
  createdAt: string;
}

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const url = statusFilter
      ? `/api/admin/assignments?status=${statusFilter}`
      : '/api/admin/assignments';

    fetch(url)
      .then(res => res.json())
      .then(data => setAssignments(data.assignments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
        <p style={{ color: colors.slate }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: colors.porcelain }}>
      <div className="max-w-5xl mx-auto">
        <a href="/admin" className="text-xs underline hover:no-underline mb-4 inline-block" style={{ color: colors.slate }}>
          &larr; Back to Dashboard
        </a>
        <h1 className="text-2xl font-bold mb-6" style={{ color: colors.indigo }}>All Assignments</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['', 'pending', 'in-progress', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: statusFilter === s ? colors.indigo : 'transparent',
                color: statusFilter === s ? colors.white : colors.indigo,
                border: `1px solid ${statusFilter === s ? colors.indigo : '#e5e5e5'}`,
              }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colors.porcelain }}>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Version</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Deadline</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Notes</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Created</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase" style={{ color: colors.slate }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-t" style={{ borderColor: '#f0f0f0' }}>
                  <td className="px-4 py-3 text-sm" style={{ color: colors.indigo }}>
                    {VERSION_CONFIGS[a.version]?.name || a.version}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                      backgroundColor: a.status === 'completed' ? '#DCFCE7' : a.status === 'in-progress' ? '#DBEAFE' : '#FEF3C7',
                      color: a.status === 'completed' ? '#166534' : a.status === 'in-progress' ? '#1E40AF' : '#92400E',
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: colors.charcoal }}>
                    {a.deadline ? new Date(a.deadline).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs truncate max-w-[200px]" style={{ color: colors.slate }}>
                    {a.notes || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: colors.charcoal }}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.status === 'completed' && a.sessionId && (
                      <a
                        href={`/results/${a.sessionId}`}
                        className="text-xs font-medium underline hover:no-underline"
                        style={{ color: colors.scarlet }}
                      >
                        Results
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {assignments.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: colors.slate }}>
                {statusFilter ? `No ${statusFilter} assignments.` : 'No assignments yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
