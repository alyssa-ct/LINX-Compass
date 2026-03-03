import { promises as fs } from 'fs';
import path from 'path';
import { AssessmentSession, SessionStore } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

async function ensureFile(): Promise<void> {
  try {
    await fs.access(SESSIONS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SESSIONS_FILE, '[]', 'utf-8');
  }
}

async function readSessions(): Promise<AssessmentSession[]> {
  await ensureFile();
  const data = await fs.readFile(SESSIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeSessions(sessions: AssessmentSession[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

export class LocalStore implements SessionStore {
  async create(session: AssessmentSession): Promise<void> {
    const sessions = await readSessions();
    sessions.push(session);
    await writeSessions(sessions);
  }

  async read(id: string): Promise<AssessmentSession | null> {
    const sessions = await readSessions();
    return sessions.find(s => s.id === id) ?? null;
  }

  async readAll(): Promise<AssessmentSession[]> {
    return readSessions();
  }

  async update(id: string, updates: Partial<AssessmentSession>): Promise<void> {
    const sessions = await readSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error(`Session not found: ${id}`);
    sessions[index] = { ...sessions[index], ...updates, updatedAt: new Date().toISOString() };
    await writeSessions(sessions);
  }
}
