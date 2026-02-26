# Guide de Déploiement

## Pré-requis
- Accès Admin au projet Supabase (Production).
- Accès Vercel (ou autre hébergeur Next.js).

## Étapes de Déploiement

### 1. Base de Données (Supabase)
1.  Vérifier que les migrations locales sont à jour : `supabase migration list`.
2.  Pousser les migrations vers le remote : `supabase db push`.
3.  Vérifier dans le dashboard Supabase que les nouvelles tables (`social.*`) existent et que les politiques RLS sont actives.

### 2. Variables d'Environnement
1.  Ajouter les nouvelles clés (si nécessaire, ex: API Key pour un service tiers d'image) dans Vercel.
2.  Vérifier `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 3. Build & Deploy
1.  Merger la PR sur la branche `main`.
2.  Vercel déclenchera automatiquement le build.
3.  Surveiller les logs de build pour toute erreur TypeScript ou Lint.

### 4. Vérification Post-Déploiement (Sanity Check)
1.  Se connecter avec un compte Producteur de test.
2.  Poster une update via la nouvelle interface `/partner/studio`.
3.  Se connecter avec un compte Utilisateur de test.
4.  Vérifier la visibilité de l'update et poster un commentaire.
