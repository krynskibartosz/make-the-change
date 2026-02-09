# @make-the-change/web

> The Admin Dashboard for Make the CHANGE, built with Next.js App Router.
a
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-0.45-green)](https://orm.drizzle.team/)

## 🚀 Features

- **Full Admin Control**: Manage Products, Orders, Users, Projects, and Subscriptions.
- **Internationalization**: Full i18n support (fr, en, nl) via `next-intl`.
- **Data Visualization**: Charts via `@nivo` and Maps via `react-leaflet`.
- **Secure Authentication**: Supabase SSR Auth with Role-Based Access Control (RBAC).
- **Type-Safe Database**: Direct PostgreSQL access via Drizzle ORM (Server Actions).

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + CSS Variables
- **State Management**: TanStack Query v5
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest (Unit/Integration) + Playwright (E2E)

## 📦 Project Structure

```bash
src/
├── app/                  # Next.js App Router
│   ├── [locale]/         # Localized routes
│   │   ├── admin/        # Dashboard pages
│   │   └── api/          # API Handlers
├── components/           # React components
│   └── ui/               # Shared UI elements
├── lib/                  # Utilities & Logic
│   ├── db.ts             # Database client (from core)
│   └── validators/       # Zod schemas
└── supabase/             # Supabase configuration
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Access to Supabase project & PostgreSQL database

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (Connection string)

### Development

```bash
pnpm dev
# Starts server at http://localhost:3000
```

### Building

```bash
pnpm build
pnpm start
```

## 🧪 Testing

```bash
# Unit & Integration Tests
pnpm test

# E2E Tests
pnpm test:e2e
```

## 🤝 Dependencies

Internal dependencies from workspace:
- `@make-the-change/core`: Shared business logic, database schema, and types.
