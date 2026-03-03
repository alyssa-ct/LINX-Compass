import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAssignmentStore, getStore, getUserStore } from '@/lib/storage';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = (session.user as Record<string, unknown>).role;
  if (role !== 'admin') return null;
  return session;
}

/**
 * GET /api/admin/export — export client results
 * Query params: format (json|csv), clientIds (comma-separated, optional)
 */
export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const clientIdsParam = searchParams.get('clientIds');
  const clientIds = clientIdsParam ? clientIdsParam.split(',') : null;

  const userStore = getUserStore();
  const assignmentStore = getAssignmentStore();
  const sessionStore = getStore();

  const allUsers = await userStore.readAll();
  const clients = allUsers.filter(u => u.role === 'client');
  const filteredClients = clientIds
    ? clients.filter(c => clientIds.includes(c.id))
    : clients;

  const rows: Record<string, unknown>[] = [];

  for (const client of filteredClients) {
    const assignments = await assignmentStore.findByClient(client.id);

    for (const assignment of assignments) {
      let resultData: Record<string, unknown> = {};

      if (assignment.sessionId) {
        const sess = await sessionStore.read(assignment.sessionId);
        if (sess?.results) {
          resultData = {
            hasResults: true,
            dimensionScores: sess.results.dimensionScores.map(s => ({
              dimension: s.dimensionId,
              score: s.rawScore,
              band: s.band,
            })),
          };
        }
      }

      rows.push({
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        clientEmail: client.email,
        company: client.company,
        assignmentId: assignment.id,
        version: assignment.version,
        status: assignment.status,
        deadline: assignment.deadline || '',
        notes: assignment.notes || '',
        createdAt: assignment.createdAt,
        ...resultData,
      });
    }
  }

  if (format === 'csv') {
    const headers = [
      'clientId', 'clientName', 'clientEmail', 'company',
      'assignmentId', 'version', 'status', 'deadline', 'notes', 'createdAt', 'hasResults',
    ];
    const csvRows = [headers.join(',')];

    for (const row of rows) {
      const values = headers.map(h => {
        const val = row[h];
        const str = val === undefined || val === null ? '' : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=linx-compass-export.csv',
      },
    });
  }

  return NextResponse.json({ data: rows, count: rows.length });
}
