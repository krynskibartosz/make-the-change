# Spécifications Techniques

## Stack Technologique
- **Frontend Framework :** Next.js 16 (App Router, Turbo).
- **Langage :** TypeScript 5.9 (Strict mode).
- **Styling :** Tailwind CSS 4 + Framer Motion (Animations).
- **Database :** Supabase (PostgreSQL 15+).
- **ORM :** Drizzle ORM (pour la sécurité des types).
- **State Management (Client) :** React Context + Hooks (pour formulaires simples), Zustand (si besoin global complexe).
- **Data Fetching :** Server Components (RSC) pour le GET, Server Actions pour le POST/PUT.

## Sécurité & Performance

### Row Level Security (RLS)
Toutes les tables DOIVENT avoir RLS activé.
- `social.comments` :
    - `SELECT` : `true` (Public).
    - `INSERT` : `auth.uid() = user_id`.
    - `UPDATE/DELETE` : `auth.uid() = user_id` (Seul l'auteur peut modifier).

### Optimisation des Images
- Les images uploadées par les producteurs doivent être redimensionnées et converties en WebP/AVIF côté client ou via Supabase Edge Functions avant stockage pour économiser la bande passante.
- Utilisation du composant `<Image />` de Next.js pour le lazy loading.

### Realtime
- Utilisation de `supabase-js` client-side pour s'abonner aux changements sur la table `social.notifications` afin d'afficher les alertes en temps réel sans rechargement.
