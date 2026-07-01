# tecton

**Open-source admin dashboard starter.** Production-ready Next.js template with authentication, role-based access control, and a clean, extensible architecture. Clone, install, and start building.

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-blue">
  <img alt="Tests" src="https://img.shields.io/badge/tests-22-passing-green">
</p>

## Screenshots

> _Screenshots coming soon! Run `npm run dev` to see the dashboard in action._

| Desktop                           | Mobile                     |
| --------------------------------- | -------------------------- |
| _Dashboard with sidebar expanded_ | _Responsive mobile drawer_ |

## ✨ Features

- 🔐 **Auth built-in** — Login, register, forgot/reset password, session management via NextAuth.js v5
- 🌐 **OAuth** — Google + GitHub sign-in (optional, enable via env vars)
- ✉️ **Email verification** — Built-in flow (auto-verified in dev, configurable for production)
- 🛡️ **RBAC** — Admin, editor, viewer roles with permission-based access
- 🌗 **Dark mode** — System-aware theme with manual toggle
- 🧩 **shadcn/ui** — Beautiful, accessible components you own
- 🗄️ **SQLite zero-setup** — No external database needed to run locally
- 🏗️ **Feature-based architecture** — Code organized by domain, not file type
- 🚀 **Next.js 16** — App Router, Server Components, streaming
- 📱 **Responsive** — Sidebar drawer on mobile, collapse on desktop
- 📊 **CSV export** — Export user data to CSV with one click
- ⚡ **Rate limiting** — Brute force protection on auth endpoints
- ♿ **Accessible** — Keyboard navigation, focus trap, ARIA labels

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

| Email             | Password | Role   |
| ----------------- | -------- | ------ |
| admin@tecton.dev  | admin123 | Admin  |
| editor@tecton.dev | admin123 | Editor |
| viewer@tecton.dev | admin123 | Viewer |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, register, password reset)
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

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | Next.js 16 (App Router)     |
| Language  | TypeScript (strict)         |
| UI        | shadcn/ui + Tailwind CSS v4 |
| Auth      | NextAuth.js v5 (Auth.js)    |
| Database  | SQLite (Drizzle ORM)        |
| State     | Zustand + TanStack Query    |
| Forms     | react-hook-form + Zod       |
| Charts    | Recharts                    |
| Icons     | Lucide React                |

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
npm test           # Run tests
npm run seed       # Seed database with sample users
```

## ⚙️ Configuration

### OAuth Providers

To enable Google or GitHub sign-in, add the following to your `.env`:

```bash
# Google OAuth (optional, omit to disable)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# GitHub OAuth (optional, omit to disable)
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

### Email Verification

By default, new registrations are auto-verified for development convenience. To require email verification in production:

1. Remove `emailVerified: new Date()` from `src/app/api/register/route.ts`
2. Uncomment the `emailVerified` check in `src/auth.ts`
3. Configure an email service (SMTP) to send verification links

## 📝 Roadmap

- [x] Advanced data table (TanStack Table with sorting, filtering, pagination)
- [x] User CRUD with forms
- [x] OAuth providers (Google, GitHub)
- [x] CSV data export
- [x] Rate limiting on auth endpoints
- [x] Forgot / Reset password
- [x] Email verification
- [x] Responsive sidebar (mobile drawer + desktop collapse)
- [x] Keyboard navigation & focus management
- [ ] Charts and analytics dashboard
- [ ] PostgreSQL/MySQL adapter
- [ ] E2E tests with Playwright
- [ ] Component documentation
- [ ] CLI tool for scaffolding

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. All contributions welcome — from bug fixes to new features.

## 📄 License

MIT © [Wayosu](https://github.com/wayosu)
