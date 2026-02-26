# Manuel de Maintenance

## Monitoring
- **Supabase Dashboard :** Surveiller les logs de la base de données pour détecter les erreurs RLS (403 Forbidden) ou les requêtes lentes.
- **Vercel Analytics :** Surveiller les Core Web Vitals, en particulier sur la page `/dashboard` qui va devenir plus lourde avec le Feed.

## Procédures Courantes

### Modération de Contenu
En cas de commentaire inapproprié :
1.  Accéder à la table `social.comments` via le Dashboard Supabase (ou un outil admin interne).
2.  Passer le champ `status` (à créer) de `published` à `hidden` ou `deleted`.
3.  L'auteur ne doit pas être notifié immédiatement (Shadow ban) ou recevoir un avertissement.

### Gestion des Images
- Vérifier périodiquement l'utilisation du stockage dans le bucket `project-updates-images`.
- Mettre en place une politique de cycle de vie (Lifecycle Policy) si nécessaire pour archiver les vieilles images non consultées (optionnel).

### Mise à jour des Types
- Si le schéma DB change, exécuter `npm run typegen` (ou équivalent) pour régénérer les types TypeScript Supabase/Drizzle et éviter les désynchronisations.
