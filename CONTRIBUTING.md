# Contributing to tecton

Thanks for your interest in contributing! 🎉

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/tecton.git`
3. **Install** dependencies: `npm install`
4. **Set up** environment: `cp .env.example .env`
5. **Initialize** database: `npx drizzle-kit push && npm run seed`
6. **Create** a branch: `git checkout -b feat/your-feature`

## Development Workflow

- Write **TypeScript** (strict mode)
- Format code with **Prettier** (config included)
- Use **ESLint** for linting: `npm run lint`
- Run **tests**: `npm test`
- Follow the **feature-based architecture** pattern

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user management table
fix: sidebar collapse on mobile
docs: update README with setup instructions
refactor: extract auth logic to separate module
```

## Pull Requests

1. Keep PRs focused — one feature/fix per PR
2. Update relevant documentation
3. Add tests for new functionality
4. Ensure CI passes (lint + test)
5. Use the PR template

## Code Style

- **Components**: Server Components by default, `'use client'` only when needed
- **Imports**: Use `@/` path alias
- **State**: Server data → TanStack Query, UI state → Zustand
- **Forms**: react-hook-form + Zod validation
- **Naming**: PascalCase for components, camelCase for functions/variables

## Need Help?

Open an [issue](https://github.com/wayosu/tecton/issues) or start a [discussion](https://github.com/wayosu/tecton/discussions).
