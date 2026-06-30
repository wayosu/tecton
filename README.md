# tecton

**Open-source admin dashboard starter.** Production-ready Next.js template with authentication, role-based access control, and a clean, extensible architecture. Clone, install, and start building.

## ✨ Features

- 🔐 **Auth built-in** — Login, register, session management via NextAuth.js v5
- 🛡️ **RBAC** — Admin, editor, viewer roles with permission-based access
- 🌗 **Dark mode** — System-aware theme with manual toggle
- 🧩 **shadcn/ui** — Beautiful, accessible components you own
- 🗄️ **SQLite zero-setup** — No external database needed to run locally
- 🏗️ **Feature-based architecture** — Code organized by domain, not file type
- 🚀 **Next.js 16** — App Router, Server Components, streaming
- 📱 **Responsive** — Sidebar adapts to mobile, tablet, desktop

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
# openssl rand -base64 32

# Initialize the database
npx drizzle-kit push
npm run seed

# Start developing
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to login.

### Default Accounts

| Email | Password | Role |
|---|---|---|
| admin@tecton.dev | admin123 | Admin |
| editor@tecton.dev | admin123 | Editor |
| viewer@tecton.dev | admin123 | Viewer |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (dashboard)/        # Protected dashboard routes
│   └── api/                # API routes
├── features/               # Domain logic by feature
│   ├── auth/               # Auth components & hooks
│   ├── users/              # User management
│   └── dashboard/          # Dashboard widgets
├── components/             # Shared components
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Shell, sidebar, header
├── config/                 # Navigation & app config
├── db/                     # Database schema (Drizzle)
└── lib/                    # Utilities, auth, RBAC
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Auth | NextAuth.js v5 (Auth.js) |
| Database | SQLite (Drizzle ORM) |
| State | Zustand + TanStack Query |
| Forms | react-hook-form + Zod |
| Charts | Recharts |
| Icons | Lucide React |

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
npm test           # Run tests
npm run seed       # Seed database with sample users
```

## 📝 Roadmap

- [x] Advanced data table (TanStack Table with sorting, filtering, pagination)
- [x] User CRUD with forms
- [ ] Charts and analytics dashboard
- [ ] Email verification
- [ ] OAuth providers (Google, GitHub)
- [ ] PostgreSQL/MySQL adapter
- [ ] E2E tests with Playwright
- [ ] Component documentation
- [ ] CLI tool for scaffolding

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. All contributions welcome — from bug fixes to new features.

## 📄 License

MIT © [Wayosu](https://github.com/wayosu)
