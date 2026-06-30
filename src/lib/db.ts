import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { sql } from 'drizzle-orm';
import path from 'path';

const isTest = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';

const sqlite = new Database(isTest ? ':memory:' : 'sqlite.db');

// Enable WAL mode for better concurrent read performance (not needed for :memory:)
if (!isTest) {
  sqlite.pragma('journal_mode = WAL');
}
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite);

// Run migrations automatically in test mode
if (isTest) {
  migrate(db, { migrationsFolder: path.resolve(__dirname, '../../drizzle') });
}

/**
 * Reset test database — clears all rows but keeps schema.
 * Only available when VITEST or NODE_ENV=test is set.
 */
export function resetTestDb() {
  if (!isTest) return;
  db.run(sql`DELETE FROM sessions`);
  db.run(sql`DELETE FROM accounts`);
  db.run(sql`DELETE FROM users`);
}
