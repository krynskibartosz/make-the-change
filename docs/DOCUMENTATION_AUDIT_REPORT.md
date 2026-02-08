# Rapport d'Analyse Complète de la Documentation

**Date**: 5 Février 2026
**Statut**: Post-Migration & Restauration

## 🚨 Incident de Migration
Lors de la tentative de déplacement du dossier `_legacy_archive`, une erreur de script a entraîné la suppression accidentelle de certains fichiers avant leur déplacement complet.

**État des Lieux :**
- ✅ **Restaurés avec succès (Mémoire IA)** : `tech-stack.md`, `CLAUDE.md`, `GLOSSARY.md`, `HANDOFF_PROMPT.md` (partiel).
- ❌ **Perdus** : Dossier `04-specifications` (Specs MVP, Admin, E-commerce) et `architecture-overview.md`.

---

## 📊 Bilan de Cohérence (Code vs Docs)

Suite à la mise à jour des fichiers `tech-stack` et `GLOSSARY` vers **Base UI**, la documentation principale est alignée sur la stack cible. Cependant, des incohérences majeures héritées subsistent.

### 1. ⚠️ Modèle de Sécurité (Web Client)
- **Documentation (`apps/web-client/README.md`)** : Affirme que le client n'a "jamais d'accès DB direct" et utilise uniquement Supabase RLS.
- **Réalité Code** : Le code utilise `@make-the-change/core/db` pour des accès directs via Drizzle (ex: `api/partners/route.ts`).
- **Risque** : Confusion sur les pratiques de sécurité. Le code actuel contourne le RLS via le client admin Drizzle.

### 2. 🎨 Design System (Implémentation)
- **Documentation (`design-system.md`)** : Interdit formellement l'usage de `cn` / `clsx` et la logique JS pour les styles.
- **Réalité Code** : Les composants `packages/core/src/shared/ui` (e.g., `button.tsx`) utilisent massivement `cn` et `cva` pour gérer les variantes.
- **Alignement** : La documentation est trop restrictive par rapport aux standards modernes (Tailwind + CVA).

### 3. 📱 Application Mobile
- **Documentation** : Contradictoire sur les versions (Expo SDK 55 vs NativeWind versions).
- **Réalité Code** : Dépendances manquantes (`expo-sqlite`, `expo-widgets`) citées dans les READMEs. L'application mobile semble être dans un état intermédiaire.

### 4. 🛠 Scripts & Tooling
- Le script `types:generate` pointe vers un dossier `packages/api` qui n'existe plus/est considéré legacy.
- Les fichiers `.env.example` contiennent des variables (Google Maps, Stripe) qui ne sont pas encore implémentées dans le code.

---

## ✅ État de la Migration Base UI

Les fichiers suivants sont maintenant **EXACTEMENT** alignés avec votre demande de remplacement Shadcn -> Base UI :

| Fichier | Statut |
|---------|--------|
| `docs/03-technical/tech-stack.md` | ✅ À jour (Base UI explicite) |
| `docs/10-reference-content/GLOSSARY.md` | ✅ À jour |
| `docs/CLAUDE.md` | ✅ À jour |
| `docs/HANDOFF_PROMPT.md` | ✅ À jour |

---

## ⏭ Recommandations

1. **Reconstituer les Specs** : Si des backups locaux existent (git reflog?), tenter une récupération du dossier `04-specifications`.
2. **Clarifier Web Client** : Mettre à jour le README web-client pour refléter l'usage hybride (Server Actions/Route Handlers avec accès DB sécurisé).
3. **Assouplir Design System** : Mettre à jour `design-system.md` pour autoriser officiellement `cn/cva`.
