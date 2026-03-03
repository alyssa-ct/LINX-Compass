import { promises as fs } from 'fs';
import path from 'path';
import { ClientAssignment, AssignmentStore } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');

async function ensureFile(): Promise<void> {
  try {
    await fs.access(ASSIGNMENTS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(ASSIGNMENTS_FILE, '[]', 'utf-8');
  }
}

async function readAssignments(): Promise<ClientAssignment[]> {
  await ensureFile();
  const data = await fs.readFile(ASSIGNMENTS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeAssignments(assignments: ClientAssignment[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2), 'utf-8');
}

export class LocalAssignmentStore implements AssignmentStore {
  async create(assignment: ClientAssignment): Promise<void> {
    const assignments = await readAssignments();
    assignments.push(assignment);
    await writeAssignments(assignments);
  }

  async read(id: string): Promise<ClientAssignment | null> {
    const assignments = await readAssignments();
    return assignments.find(a => a.id === id) ?? null;
  }

  async readAll(): Promise<ClientAssignment[]> {
    return readAssignments();
  }

  async findByClient(clientUserId: string): Promise<ClientAssignment[]> {
    const assignments = await readAssignments();
    return assignments.filter(a => a.clientUserId === clientUserId);
  }

  async findByAdmin(adminUserId: string): Promise<ClientAssignment[]> {
    const assignments = await readAssignments();
    return assignments.filter(a => a.assignedBy === adminUserId);
  }

  async update(id: string, updates: Partial<ClientAssignment>): Promise<void> {
    const assignments = await readAssignments();
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) throw new Error(`Assignment not found: ${id}`);
    assignments[index] = { ...assignments[index], ...updates, updatedAt: new Date().toISOString() };
    await writeAssignments(assignments);
  }

  async delete(id: string): Promise<void> {
    const assignments = await readAssignments();
    const filtered = assignments.filter(a => a.id !== id);
    await writeAssignments(filtered);
  }
}
