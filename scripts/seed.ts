import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { users } from '../src/db/schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function seed() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await hash('admin123', 12);

  const seedUsers = [
    { email: 'admin@tecton.dev', name: 'Admin', role: 'admin' as const },
    { email: 'editor@tecton.dev', name: 'Editor User', role: 'editor' as const },
    { email: 'viewer@tecton.dev', name: 'Viewer User', role: 'viewer' as const },
  ];

  let created = 0;
  let skipped = 0;

  for (const user of seedUsers) {
    const existing = db.select().from(users).where(eq(users.email, user.email)).get();

    if (existing) {
      console.log(`   ⏭️  Skipped ${user.email} (already exists)`);
      skipped++;
    } else {
      db.insert(users)
        .values({
          id: uuid(),
          name: user.name,
          email: user.email,
          hashedPassword,
          emailVerified: new Date(),
          role: user.role,
        })
        .run();
      console.log(`   ✅ Created ${user.email} (${user.role})`);
      created++;
    }
  }

  console.log('');
  console.log('🎉 Seed complete!');
  console.log(`   Created: ${created}, Skipped: ${skipped}`);
  console.log('');
  console.log('   Test accounts:');
  console.log('   admin@tecton.dev / admin123 (admin)');
  console.log('   editor@tecton.dev / admin123 (editor)');
  console.log('   viewer@tecton.dev / admin123 (viewer)');
}

seed().catch(console.error);
