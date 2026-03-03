'use client';

import { useState, useEffect } from 'react';
import { AssessmentVersion } from '@/lib/types';
import { colors, VERSION_CONFIGS } from '@/lib/constants';

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  createdAt: string;
  assignments: { id: string; status: string; version: string; deadline?: string }[];
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');

  // Add client form state
  const [newClient, setNewClient] = useState({
    firstName: '', lastName: '', email: '', company: '', password: '',
  });
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  // Bulk assignment state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkVersion, setBulkVersion] = useState<AssessmentVersion>('standard');
  const [bulkDeadline, setBulkDeadline] = useState('');
  const [bulkAssigning, setBulkAssigning] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    fetch('/api/admin/clients')
      .then(res => res.json())
      .then(data => setClients(data.clients || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAdding(true);

    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      if (!res.ok) {
        const err = await res.json();
        setAddError(err.error || 'Failed to create client');
        return;
      }

      setNewClient({ firstName: '', lastName: '', email: '', company: '', password: '' });
      setShowAddForm(false);
      loadClients();
    } catch {
      setAddError('Network error');
    } finally {
      setAdding(false);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedIds.size === 0) return;
    setBulkAssigning(true);

    try {
      await fetch('/api/admin/assignments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientUserIds: Array.from(selectedIds),
          version: bulkVersion,
          deadline: bulkDeadline || undefined,
        }),
      });
      setSelectedIds(new Set());
      loadClients();
    } catch {
      console.error('Bulk assign failed');
    } finally {
      setBulkAssigning(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)));
    }
  };

  const filtered = clients.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return `${c.firstName} ${c.lastName}`.toLowerCase().includes(s) || c.email.toLowerCase().includes(s);
  });

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <a href="/admin" className="text-xs underline hover:no-underline mb-1 inline-block" style={{ color: colors.slate }}>
              &larr; Back to Dashboard
            </a>
            <h1 className="text-2xl font-bold" style={{ color: colors.indigo }}>Clients</h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {showAddForm ? 'Cancel' : 'Add Client'}
          </button>
        </div>

        {/* Add Client Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddClient}
            className="rounded-xl p-6 mb-6 space-y-3"
            style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text" placeholder="First Name" required value={newClient.firstName}
                onChange={e => setNewClient(p => ({ ...p, firstName: e.target.value }))}
                className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#e5e5e5' }}
              />
              <input
                type="text" placeholder="Last Name" required value={newClient.lastName}
                onChange={e => setNewClient(p => ({ ...p, lastName: e.target.value }))}
                className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#e5e5e5' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="email" placeholder="Email" required value={newClient.email}
                onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))}
                className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#e5e5e5' }}
              />
              <input
                type="text" placeholder="Company (optional)" value={newClient.company}
                onChange={e => setNewClient(p => ({ ...p, company: e.target.value }))}
                className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#e5e5e5' }}
              />
            </div>
            <input
              type="password" placeholder="Temporary Password (min 8 chars)" required value={newClient.password}
              onChange={e => setNewClient(p => ({ ...p, password: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#e5e5e5' }}
            />
            {addError && <p className="text-xs" style={{ color: colors.scarlet }}>{addError}</p>}
            <button
              type="submit" disabled={adding}
              className="px-6 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: colors.indigo }}
            >
              {adding ? 'Creating...' : 'Create Client'}
            </button>
          </form>
        )}

        {/* Bulk Actions Bar */}
        {selectedIds.size > 0 && (
          <div
            className="rounded-xl p-4 mb-4 flex items-center gap-4"
            style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE' }}
          >
            <span className="text-sm font-medium" style={{ color: colors.indigo }}>
              {selectedIds.size} selected
            </span>
            <select
              value={bulkVersion}
              onChange={e => setBulkVersion(e.target.value as AssessmentVersion)}
              className="px-2 py-1 text-sm rounded border" style={{ borderColor: '#C7D2FE' }}
            >
              <option value="light">{VERSION_CONFIGS.light.name}</option>
              <option value="standard">{VERSION_CONFIGS.standard.name}</option>
              <option value="max">{VERSION_CONFIGS.max.name}</option>
            </select>
            <input
              type="date" value={bulkDeadline}
              onChange={e => setBulkDeadline(e.target.value)}
              className="px-2 py-1 text-sm rounded border" style={{ borderColor: '#C7D2FE' }}
              placeholder="Deadline (optional)"
            />
            <button
              onClick={handleBulkAssign} disabled={bulkAssigning}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-white disabled:opacity-40"
              style={{ backgroundColor: colors.indigo }}
            >
              {bulkAssigning ? 'Assigning...' : 'Assign Test'}
            </button>
          </div>
        )}

        {/* Search */}
        <input
          type="text" placeholder="Search clients..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm border mb-4"
          style={{ borderColor: '#e5e5e5', backgroundColor: colors.white }}
        />

        {/* Client Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: colors.porcelain }}>
                <th className="px-4 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Assignments</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: colors.slate }}>Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase" style={{ color: colors.slate }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => {
                const latest = client.assignments[0];
                return (
                  <tr key={client.id} className="border-t" style={{ borderColor: '#f0f0f0' }}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(client.id)}
                        onChange={() => toggleSelect(client.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium" style={{ color: colors.indigo }}>
                        {client.firstName} {client.lastName}
                      </p>
                      {client.company && (
                        <p className="text-xs" style={{ color: colors.slate }}>{client.company}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: colors.charcoal }}>{client.email}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: colors.charcoal }}>
                      {client.assignments.length}
                    </td>
                    <td className="px-4 py-3">
                      {latest ? (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                          backgroundColor: latest.status === 'completed' ? '#DCFCE7' : latest.status === 'in-progress' ? '#DBEAFE' : '#FEF3C7',
                          color: latest.status === 'completed' ? '#166534' : latest.status === 'in-progress' ? '#1E40AF' : '#92400E',
                        }}>
                          {latest.status}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: colors.slate }}>No tests</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/admin/clients/${client.id}`}
                        className="text-xs font-medium underline hover:no-underline"
                        style={{ color: colors.indigo }}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: colors.slate }}>
                {search ? 'No clients match your search.' : 'No clients yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
