import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { sql } from 'drizzle-orm';
import path from 'path';

const sqlite = new Database(':memory:');
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const testDb = drizzle(sqlite);

// Run migrations once when the module is loaded
migrate(testDb, { migrationsFolder: path.resolve(__dirname, '../../drizzle') });

export function resetTestDb() {
  testDb.run(sql`DELETE FROM sessions`);
  testDb.run(sql`DELETE FROM accounts`);
  testDb.run(sql`DELETE FROM users`);
  return testDb;
}
