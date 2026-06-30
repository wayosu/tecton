import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { users } from '../src/db/schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function seed() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await hash('admin123', 12);

  db.insert(users)
    .values({
      id: uuid(),
      name: 'Admin',
      email: 'admin@tecton.dev',
      hashedPassword,
      role: 'admin',
    })
    .run();

  db.insert(users)
    .values({
      id: uuid(),
      name: 'Editor User',
      email: 'editor@tecton.dev',
      hashedPassword,
      role: 'editor',
    })
    .run();

  db.insert(users)
    .values({
      id: uuid(),
      name: 'Viewer User',
      email: 'viewer@tecton.dev',
      hashedPassword,
      role: 'viewer',
    })
    .run();

  console.log('✅ Seed complete!');
  console.log('   admin@tecton.dev / admin123 (admin)');
  console.log('   editor@tecton.dev / admin123 (editor)');
  console.log('   viewer@tecton.dev / admin123 (viewer)');
}

seed().catch(console.error);
