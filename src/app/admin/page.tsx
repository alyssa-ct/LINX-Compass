'use client';

import { useState, useEffect } from 'react';
import { colors } from '@/lib/constants';

interface ClientSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  createdAt: string;
  assignments: { status: string }[];
}

export default function AdminDashboard() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(res => res.json())
      .then(data => setClients(data.clients || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending = clients.reduce((n, c) => n + c.assignments.filter(a => a.status === 'pending').length, 0);
  const inProgress = clients.reduce((n, c) => n + c.assignments.filter(a => a.status === 'in-progress').length, 0);
  const completed = clients.reduce((n, c) => n + c.assignments.filter(a => a.status === 'completed').length, 0);

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
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.indigo }}>Admin Dashboard</h1>
        <p className="text-sm mb-8" style={{ color: colors.slate }}>Manage clients and assessments</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Clients', value: clients.length, color: colors.indigo },
            { label: 'Pending', value: pending, color: '#92400E' },
            { label: 'In Progress', value: inProgress, color: '#1E40AF' },
            { label: 'Completed', value: completed, color: '#166534' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-5 text-center"
              style={{ backgroundColor: colors.white, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
            >
              <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: colors.slate }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <a
            href="/admin/clients"
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            Manage Clients
          </a>
          <a
            href="/admin/assignments"
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-sm"
            style={{ color: colors.indigo, border: `1.5px solid ${colors.indigo}` }}
          >
            View All Assignments
          </a>
          <a
            href="/api/admin/export?format=csv"
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-sm"
            style={{ color: colors.slate, border: `1.5px solid #e5e5e5` }}
          >
            Export CSV
          </a>
        </div>

        {/* Recent Clients */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: '#f0f0f0' }}>
            <h2 className="text-sm font-bold" style={{ color: colors.indigo }}>Recent Clients</h2>
          </div>
          {clients.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: colors.slate }}>No clients yet. Add your first client to get started.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#f0f0f0' }}>
              {clients.slice(0, 10).map(client => (
                <a
                  key={client.id}
                  href={`/admin/clients/${client.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.indigo }}>
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-xs" style={{ color: colors.slate }}>{client.email}</p>
                  </div>
                  <div className="text-xs" style={{ color: colors.slate }}>
                    {client.assignments.length} assignment{client.assignments.length !== 1 ? 's' : ''}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
