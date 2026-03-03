import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import { getUserStore, getAssignmentStore } from '@/lib/storage';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = (session.user as Record<string, unknown>).role;
  if (role !== 'admin') return null;
  return session;
}

/**
 * GET /api/admin/clients — list all clients
 */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const userStore = getUserStore();
  const assignmentStore = getAssignmentStore();
  const allUsers = await userStore.readAll();
  const clients = allUsers.filter(u => u.role === 'client');
  const allAssignments = await assignmentStore.readAll();

  const result = clients.map(client => {
    const assignments = allAssignments.filter(a => a.clientUserId === client.id);
    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      company: client.company,
      createdAt: client.createdAt,
      assignments,
    };
  });

  return NextResponse.json({ clients: result });
}

/**
 * POST /api/admin/clients — create a client account
 */
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { email, firstName, lastName, company, password } = await request.json();

  if (!email || !firstName || !lastName || !password) {
    return NextResponse.json(
      { error: 'Email, first name, last name, and password are required.' },
      { status: 400 }
    );
  }

  const userStore = getUserStore();
  const existing = await userStore.findByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: 'An account with this email already exists.' },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();
  const client = {
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    passwordHash,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    company: (company || '').trim(),
    role: 'client' as const,
    createdAt: now,
    updatedAt: now,
  };

  await userStore.create(client);

  return NextResponse.json({
    client: {
      id: client.id,
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      company: client.company,
    },
  }, { status: 201 });
}
