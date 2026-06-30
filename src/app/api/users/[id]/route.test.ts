import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH, DELETE } from './route';
import { db, resetTestDb } from '@/lib/db';
import { sql } from 'drizzle-orm';

const authMock = vi.hoisted(() => vi.fn());
vi.mock('@/auth', () => ({ auth: authMock }));

const hashSync = (pwd: string) => {
  const bcrypt = require('bcryptjs');
  return bcrypt.hashSync(pwd, 10);
};

const uuid = () => require('uuid').v4();

function seedUser(overrides: Record<string, any> = {}) {
  const data = {
    id: uuid(),
    email: `user-${Date.now()}@test.com`,
    name: 'Test User',
    role: 'viewer' as const,
    ...overrides,
  };

  db.run(sql`
    INSERT INTO users (id, name, email, hashed_password, role, created_at, updated_at)
    VALUES (${data.id}, ${data.name}, ${data.email}, ${hashSync('password123')}, ${data.role}, datetime('now'), datetime('now'))
  `);

  return data;
}

describe('User [id] API', () => {
  beforeEach(() => {
    resetTestDb();
    authMock.mockReset();
  });

  describe('PATCH', () => {
    it('updates user name', async () => {
      const user = seedUser({ email: 'target@test.com', role: 'viewer' });
      authMock.mockResolvedValue({ user: { id: 'admin-id', role: 'admin' } });

      const request = new Request(`http://localhost/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated Name', email: 'target@test.com', role: 'viewer' }),
      });

      const response = await PATCH(request as any, { params: Promise.resolve({ id: user.id }) });

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data.name).toBe('Updated Name');
    });

    it('prevents admin self-demotion', async () => {
      const user = seedUser({ email: 'self@test.com', role: 'admin' });
      authMock.mockResolvedValue({ user: { id: user.id, role: 'admin' } });

      const request = new Request(`http://localhost/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Self', email: 'self@test.com', role: 'editor' }),
      });

      const response = await PATCH(request as any, { params: Promise.resolve({ id: user.id }) });

      expect(response.status).toBe(400);
    });

    it('prevents editor from assigning admin role', async () => {
      const user = seedUser({ email: 'editor-target@test.com', role: 'editor' });
      authMock.mockResolvedValue({ user: { id: 'editor-id', role: 'editor' } });

      const request = new Request(`http://localhost/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: 'Target', email: 'editor-target@test.com', role: 'admin' }),
      });

      const response = await PATCH(request as any, { params: Promise.resolve({ id: user.id }) });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE', () => {
    it('deletes a user for admin', async () => {
      const user = seedUser({ email: 'delete@test.com', role: 'viewer' });
      authMock.mockResolvedValue({ user: { id: 'admin-id', role: 'admin' } });

      const request = new Request(`http://localhost/api/users/${user.id}`, { method: 'DELETE' });
      const response = await DELETE(request as any, { params: Promise.resolve({ id: user.id }) });

      expect(response.status).toBe(200);
    });

    it('prevents self-deletion', async () => {
      const user = seedUser({ email: 'self-delete@test.com', role: 'admin' });
      authMock.mockResolvedValue({ user: { id: user.id, role: 'admin' } });

      const request = new Request(`http://localhost/api/users/${user.id}`, { method: 'DELETE' });
      const response = await DELETE(request as any, { params: Promise.resolve({ id: user.id }) });

      expect(response.status).toBe(400);
    });
  });
});
