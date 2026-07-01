import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { users, analyticsEvents } from '../src/db/schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await hash('admin123', 12);

  const seedUsers = [
    { email: 'admin@tecton.dev', name: 'Admin', role: 'admin' as const },
    { email: 'editor@tecton.dev', name: 'Editor User', role: 'editor' as const },
    { email: 'viewer@tecton.dev', name: 'Viewer User', role: 'viewer' as const },
  ];

  let created = 0;
  let _skipped = 0;
  const userIds: string[] = [];

  for (const user of seedUsers) {
    const existing = db.select().from(users).where(eq(users.email, user.email)).get();

    if (existing) {
      console.log(`   ⏭️  Skipped ${user.email} (already exists)`);
      _skipped++;
      userIds.push(existing.id);
    } else {
      const id = uuid();
      db.insert(users)
        .values({
          id,
          name: user.name,
          email: user.email,
          hashedPassword,
          emailVerified: new Date(),
          role: user.role,
        })
        .run();
      console.log(`   ✅ Created ${user.email} (${user.role})`);
      created++;
      userIds.push(id);
    }
  }

  // Seed analytics events
  console.log('');
  console.log('📊 Seeding analytics events...');

  // Check if events already exist
  const existingEvents = db.select().from(analyticsEvents).all();
  if (existingEvents.length > 0) {
    console.log(`   ⏭️  Skipped — ${existingEvents.length} events already exist`);
  } else {
    let eventCount = 0;

    // Generate 90 days of sample data
    const now = Date.now();
    for (let day = 90; day >= 0; day--) {
      const dayStart = new Date(now - day * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);

      for (const userId of userIds) {
        // Signup event on day 0 for each user (their creation date)
        if (day === 90 - userIds.indexOf(userId) * 30) {
          db.insert(analyticsEvents)
            .values({
              id: uuid(),
              type: 'signup',
              userId,
              createdAt: new Date(dayStart.getTime() + randInt(0, 4 * 60 * 60 * 1000)),
            })
            .run();
          eventCount++;
        }

        // Login events: 1-3 per day for admin, 0-2 for others
        const loginChance = userId === userIds[0] ? 0.7 : 0.4;
        if (Math.random() < loginChance) {
          const loginCount = randInt(1, userId === userIds[0] ? 3 : 2);
          for (let l = 0; l < loginCount; l++) {
            db.insert(analyticsEvents)
              .values({
                id: uuid(),
                type: 'login',
                userId,
                createdAt: new Date(
                  dayStart.getTime() +
                    randInt(6, 22) * 60 * 60 * 1000 +
                    randInt(0, 59) * 60 * 1000,
                ),
              })
              .run();
            eventCount++;
          }
        }

        // Page views: 0-5 per user per day
        if (Math.random() < 0.6) {
          const pvCount = randInt(0, 5);
          for (let p = 0; p < pvCount; p++) {
            const paths = ['/dashboard', '/users', '/settings', '/'];
            db.insert(analyticsEvents)
              .values({
                id: uuid(),
                type: 'page_view',
                userId,
                metadata: JSON.stringify({ path: paths[randInt(0, paths.length - 1)] }),
                createdAt: new Date(
                  dayStart.getTime() +
                    randInt(7, 23) * 60 * 60 * 1000 +
                    randInt(0, 59) * 60 * 1000,
                ),
              })
              .run();
            eventCount++;
          }
        }

        // Logout events: roughly 60% of login days
        if (Math.random() < 0.3 && Math.random() < loginChance) {
          db.insert(analyticsEvents)
            .values({
              id: uuid(),
              type: 'logout',
              userId,
              createdAt: new Date(
                dayStart.getTime() +
                  randInt(17, 23) * 60 * 60 * 1000 +
                  randInt(0, 59) * 60 * 1000,
              ),
            })
            .run();
          eventCount++;
        }
      }
    }

    console.log(`   ✅ Created ${eventCount} analytics events across ${userIds.length} users`);
  }

  console.log('');
  console.log('🎉 Seed complete!');
  console.log(`   Users: ${created > 0 ? `Created ${created}` : 'Already up-to-date'}`);
  console.log(`   Events: ${existingEvents.length > 0 ? 'Already up-to-date' : 'Generated'}`);
  console.log('');
  console.log('   Test accounts:');
  console.log('   admin@tecton.dev / admin123 (admin)');
  console.log('   editor@tecton.dev / admin123 (editor)');
  console.log('   viewer@tecton.dev / admin123 (viewer)');
}

seed().catch(console.error);
