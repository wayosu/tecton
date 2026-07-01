# tecton

**Open-source admin dashboard starter.** Production-ready Next.js 16 template with authentication, role-based access control, analytics, and a clean, extensible architecture. Clone, install, and start building.

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-blue">
  <img alt="Tests" src="https://img.shields.io/badge/tests-22%20passing-brightgreen">
  <img alt="Build" src="https://img.shields.io/badge/build-18%20routes-success">
  <img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-8A2BE2">
</p>

![image](https://github.com/user-attachments/assets/3b76095f-f73b-4012-9968-94f271090722)
![image](https://github.com/user-attachments/assets/83b7d66f-51ce-41fe-8766-eef3f85e6cbf)
![image](https://github.com/user-attachments/assets/d0e91e88-9fc7-486f-a0be-338aab41e660)
![image](https://github.com/user-attachments/assets/473e8e4f-b8be-4ef7-96bb-913e288aaeae)

## ✨ Features

- 🔐 **Auth built-in** — Login, register, forgot/reset password, session management via NextAuth.js v5
- 🌐 **OAuth providers** — Google + GitHub sign-in (optional, enable via env vars)
- ✅ **Email verification** — Toggle via `VERIFY_EMAIL` env var; disabled by default in dev, enforced in production
- 🛡️ **RBAC** — Admin, editor, viewer roles with permission-based access
- 📊 **Charts & analytics** — Live dashboard with Recharts: registration trends, role distribution, activity charts
- 📥 **CSV export** — Export user data to CSV with one click
- 🌗 **Dark mode** — System-aware theme with manual toggle
- 🧩 **shadcn/ui** — Beautiful, accessible components you own and customize
- 🗄️ **SQLite zero-setup** — No external database needed to run locally
- 📱 **Responsive** — Sidebar drawer on mobile, collapse on desktop
- ♿ **Accessible** — Keyboard navigation, focus trap, ARIA labels throughout
- ⚡ **Rate limiting** — Brute force protection on auth endpoints
- 🏗️ **Feature-based architecture** — Code organized by domain, not file type
- 🚀 **Next.js 16** — App Router, Server Components, Turbopack, streaming

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/wayosu/tecton.git
cd tecton

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Generate your own AUTH_SECRET:
#   openssl rand -base64 32

# (Optional) Skip email verification for local dev:
echo "VERIFY_EMAIL=false" >> .env

# Initialize the database & seed sample data
npx drizzle-kit push
npm run seed

# Start developing
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to login.

### Default Accounts

| Email             | Password | Role   |
| ----------------- | -------- | ------ |
| admin@tecton.dev  | admin123 | Admin  |
| editor@tecton.dev | admin123 | Editor |
| viewer@tecton.dev | admin123 | Viewer |

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth pages (login, register, password reset)
│   ├── (dashboard)/            # Protected dashboard routes
│   │   └── dashboard/          # Dashboard page with analytics tabs
│   └── api/                    # API routes (auth, users, export, verify-email)
├── features/                   # Domain logic by feature
│   ├── auth/                   # Auth components, hooks, login form
│   ├── users/                  # User management (table, CRUD, hooks)
│   └── dashboard/              # Dashboard widgets
│       ├── queries.ts          # Analytics SQL queries via Drizzle
│       └── components/         # Recharts components (Area, Bar, Pie, Sparkline)
├── components/                 # Shared components
│   ├── ui/                     # shadcn/ui components (button, card, tabs, etc.)
│   ├── layout/                 # Shell, sidebar, header, page-shell
│   └── shared/                 # StatusBadge, DataTable, etc.
├── config/                     # Navigation & app configuration
├── db/                         # Database schema (Drizzle ORM)
│   └── schema.ts               # Users, accounts, sessions, tokens, analytics_events
├── lib/                        # Utilities
│   ├── auth.ts                 # NextAuth.js configuration
│   ├── rbac.ts                 # Role-based access control
│   ├── db.ts                   # Database client
│   ├── rate-limit.ts           # Rate limiting helpers
│   └── utils.ts                # General utilities (cn, etc.)
├── drizzle/                    # Drizzle Kit generated migrations
└── scripts/
    └── seed.ts                 # Seed script (users + 708 analytics events)
```

## 🛠️ Tech Stack

| Layer       | Technology                              |
| ----------- | --------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)      |
| Language    | TypeScript (strict)                     |
| UI          | shadcn/ui + Tailwind CSS v4             |
| Auth        | NextAuth.js v5 (Auth.js)               |
| Database    | SQLite via better-sqlite3 (Drizzle ORM) |
| State       | Zustand + TanStack Query                |
| Forms       | react-hook-form + Zod                   |
| Charts      | Recharts (Area, Bar, Pie, Sparkline)    |
| Icons       | Lucide React                            |
| Testing     | Vitest + Testing Library             |

## 🔧 Scripts

```bash
npm run dev              # Start development server (Turbopack)
npm run build            # Production build
npm run lint             # Run ESLint
npm test                 # Run Vitest (22 tests)
npm run seed             # Seed database with sample users + analytics events

npx drizzle-kit generate # Generate new migration after schema changes
npx drizzle-kit push     # Push schema to database (create tables)
npx drizzle-kit migrate  # Apply pending migrations
npx drizzle-kit studio   # Open Drizzle Studio (GUI database browser)
```

## ⚙️ Environment Variables

All configuration is done via `.env`. Copy `.env.example` to get started.

```bash
# Required
AUTH_SECRET=your-secret-here    # Generate: openssl rand -base64 32

# Email Verification Policy
# Set to "false" to skip email verification (convenient for local dev)
# Default: true (production-safe)
VERIFY_EMAIL=false

# OAuth (optional — omit to use credentials-only auth)
# Google: https://console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub: https://github.com/settings/developers → OAuth Apps
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Email Verification

Email verification is controlled entirely by the `VERIFY_EMAIL` environment variable:

| Value     | Behaviour                                                                 |
| --------- | ------------------------------------------------------------------------- |
| `true`    | New users must verify their email before first login (production-safe)    |
| `false`   | New registrations are auto-verified — no email required (local dev)       |
| *(unset)* | Same as `true` — enforcement is on by default                             |

In production, configure a real email service to deliver verification links. In development, the verification link is printed in the API response and also logged to the terminal.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with UI
npx vitest --ui

# Run specific test file
npx vitest run src/lib/rbac.test.ts

# Watch mode
npm test -- --watch
```

The test suite covers:
- ✅ **RBAC permissions** — 7 unit tests for role-based access
- ✅ **User API** — 11 integration tests (CRUD, validation, pagination)
- ✅ **Sidebar** — 4 component tests (collapse, mobile drawer, focus trap)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines. All contributions welcome — from bug fixes to new features.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Run lint + tests (`npm run lint && npm test && npm run build`)
5. Commit with conventional commits (`feat:`, `fix:`, `docs:`, etc.)
6. Open a Pull Request

## 📝 Roadmap

- [x] Authentication (credentials + OAuth)
- [x] Role-based access control (admin, editor, viewer)
- [x] User management CRUD with TanStack Table
- [x] CSV data export
- [x] Forgot / Reset password
- [x] Email verification (env-var toggle)
- [x] Rate limiting on auth endpoints
- [x] Responsive sidebar (mobile drawer + desktop collapse)
- [x] Keyboard navigation & focus management
- [x] Charts & analytics dashboard (Recharts)
- [ ] PostgreSQL / MySQL adapter
- [ ] E2E tests with Playwright
- [ ] Component documentation (Storybook)
- [ ] CLI scaffolding tool
- [ ] Multi-tenancy support

## 📄 License

MIT © [Wayosu](https://github.com/wayosu)
