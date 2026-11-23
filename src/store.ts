import { Task, User } from './types';
import crypto from 'crypto';

class InMemoryStore {
  private usersById = new Map<string, User>();
  private usersByUsername = new Map<string, User>();
  private usersByToken = new Map<string, User>();
  private tasksById = new Map<string, Task>();

  createUser(username: string, password: string): User {
    const existing = this.usersByUsername.get(username);
    if (existing) {
      throw new Error('Username already taken');
    }
    const id = crypto.randomUUID();
    const token = this.generateToken(id);
    const user: User = { id, username, password, token };
    this.usersById.set(id, user);
    this.usersByUsername.set(username, user);
    this.usersByToken.set(token, user);
    return { ...user, password: '***' };
  }

  findUserByUsername(username: string): User | undefined {
    const user = this.usersByUsername.get(username);
    return user ? { ...user, password: '***' } : undefined;
  }

  verifyUser(username: string, password: string): User | undefined {
    const user = this.usersByUsername.get(username);
    if (!user) return undefined;
    if (user.password !== password) return undefined;
    return { ...user, password: '***' };
  }

  refreshToken(username: string): User | undefined {
    const raw = this.usersByUsername.get(username);
    if (!raw) return undefined;
    // rotate token
    this.usersByToken.delete(raw.token);
    raw.token = this.generateToken(raw.id);
    this.usersByToken.set(raw.token, raw);
    return { ...raw, password: '***' };
  }

  getUserByToken(token: string): User | undefined {
    const user = this.usersByToken.get(token);
    return user ? { ...user, password: '***' } : undefined;
  }

  private generateToken(userId: string): string {
    return `tf_${userId}_${crypto.randomBytes(12).toString('hex')}`;
  }

  // Tasks
  listTasksByUser(userId: string): Task[] {
    const result: Task[] = [];
    for (const task of this.tasksById.values()) {
      if (task.userId === userId) {
        result.push({ ...task });
      }
    }
    // sort by createdAt desc
    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return result;
  }

  createTask(userId: string, data: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Task {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const task: Task = {
      id,
      userId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      completed: Boolean(data.completed),
      createdAt: now,
      updatedAt: now
    };
    this.tasksById.set(id, task);
    return { ...task };
  }

  getTask(userId: string, id: string): Task | undefined {
    const t = this.tasksById.get(id);
    if (!t || t.userId !== userId) return undefined;
    return { ...t };
  }

  updateTask(userId: string, id: string, update: Partial<Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Task | undefined {
    const t = this.tasksById.get(id);
    if (!t || t.userId !== userId) return undefined;
    const next: Task = {
      ...t,
      ...update,
      updatedAt: new Date().toISOString()
    };
    this.tasksById.set(id, next);
    return { ...next };
  }

  deleteTask(userId: string, id: string): boolean {
    const t = this.tasksById.get(id);
    if (!t || t.userId !== userId) return false;
    return this.tasksById.delete(id);
  }
}

export const store = new InMemoryStore();
