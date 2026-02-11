# @make-the-change/web-client

> The Public-facing Application and Client Dashboard for Make the CHANGE.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-RLS-green)](https://supabase.com/)

## 🚀 Features

- **Public Marketing Site**: SEO-optimized landing pages, project listings, and product catalog.
- **Client Dashboard**: Secure area for users to manage investments and profile.
- **E-Commerce**: Browse products, manage orders (Point system).
- **Investment Platform**: View and fund biodiversity projects.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Data Access**: Supabase Client (Browser & Server) with RLS
- **Auth**: Supabase Auth
- **Forms**: React Hook Form + Zod

## 📦 Project Structure

```bash
src/
├── app/
│   ├── (marketing)/      # Public pages (Home, Projects, About)
│   └── (app)/            # Authenticated User Dashboard
├── lib/
│   └── supabase/         # Supabase client configuration
└── components/           # UI Components
```

## 🔒 Security Model

Unlike `apps/web` (Admin), this application does **not** have direct database access.
- ✅ Uses Supabase Row Level Security (RLS) for all data access.
- ❌ No Drizzle ORM / Direct DB connection.
- 🔒 Users can only read/write their own data.

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 20+
- pnpm

### Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Development
```bash
# Runs on localhost:3001 to avoid conflict with Admin (3000)
pnpm dev
```
