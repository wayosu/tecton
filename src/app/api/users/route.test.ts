import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
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

function makeRequest(url: string, init?: RequestInit) {
  const req = new Request(url, init);
  Object.defineProperty(req, 'nextUrl', {
    value: new URL(url, 'http://localhost'),
    enumerable: true,
  });
  return req;
}

describe('Users API', () => {
  beforeEach(() => {
    resetTestDb();
    authMock.mockReset();
  });

  describe('GET', () => {
    it('returns 403 for unauthenticated user', async () => {
      authMock.mockResolvedValue(null);
      const response = await GET(makeRequest('http://localhost/api/users') as any);
      expect(response.status).toBe(403);
    });

    it('returns paginated list for admin', async () => {
      authMock.mockResolvedValue({ user: { role: 'admin' } });
      seedUser({ email: 'admin@test.com', role: 'admin' });
      seedUser({ email: 'viewer@test.com', role: 'viewer' });

      const response = await GET(makeRequest('http://localhost/api/users?page=1&limit=10') as any);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data).toHaveLength(2);
      expect(body.total).toBe(2);
      expect(body.page).toBe(1);
    });

    it('filters users by search', async () => {
      authMock.mockResolvedValue({ user: { role: 'admin' } });
      seedUser({ email: 'alice@test.com', name: 'Alice' });
      seedUser({ email: 'bob@test.com', name: 'Bob' });

      const response = await GET(makeRequest('http://localhost/api/users?search=alice') as any);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data).toHaveLength(1);
      expect(body.data[0].name).toBe('Alice');
    });
  });

  describe('POST', () => {
    it('creates a new user with valid data', async () => {
      authMock.mockResolvedValue({ user: { role: 'admin' } });

      const response = await POST(
        makeRequest('http://localhost/api/users', {
          method: 'POST',
          body: JSON.stringify({
            name: 'New User',
            email: 'newuser@test.com',
            password: 'password123',
            role: 'viewer',
          }),
        }) as any,
      );

      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body.data.email).toBe('newuser@test.com');
    });

    it('prevents editor from creating admin user', async () => {
      authMock.mockResolvedValue({ user: { role: 'editor' } });

      const response = await POST(
        makeRequest('http://localhost/api/users', {
          method: 'POST',
          body: JSON.stringify({
            name: 'New Admin',
            email: 'na@test.com',
            password: 'p12345678',
            role: 'admin',
          }),
        }) as any,
      );

      expect(response.status).toBe(403);
    });

    it('returns 409 for duplicate email', async () => {
      authMock.mockResolvedValue({ user: { role: 'admin' } });
      seedUser({ email: 'dup@test.com' });

      const response = await POST(
        makeRequest('http://localhost/api/users', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Dup',
            email: 'dup@test.com',
            password: 'p12345678',
            role: 'viewer',
          }),
        }) as any,
      );

      expect(response.status).toBe(409);
    });
  });
});
