import { promises as fs } from 'fs';
import path from 'path';
import { User, UserStore } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function ensureFile(): Promise<void> {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, '[]', 'utf-8');
  }
}

async function readUsers(): Promise<User[]> {
  await ensureFile();
  const data = await fs.readFile(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeUsers(users: User[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export class LocalUserStore implements UserStore {
  async create(user: User): Promise<void> {
    const users = await readUsers();
    users.push(user);
    await writeUsers(users);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await readUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const users = await readUsers();
    return users.find(u => u.id === id) ?? null;
  }

  async readAll(): Promise<User[]> {
    return readUsers();
  }

  async update(id: string, updates: Partial<User>): Promise<void> {
    const users = await readUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error(`User not found: ${id}`);
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    await writeUsers(users);
  }
}
