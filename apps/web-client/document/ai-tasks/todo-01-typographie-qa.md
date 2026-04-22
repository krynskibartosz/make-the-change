# Mission IA : Assurance Qualité (QA) et Typographie

## Contexte et Objectif
L'application souffre d'un manque critique d'accents sur de nombreux textes (ce qui crée un problème de confiance/trust) et d'un manque de cohérence sur la nomenclature. Ton objectif est de corriger ces erreurs textuelles sans modifier la logique fonctionnelle ou architecturale.

## Tâches à accomplir (Checklist)
- [ ] Faire une recherche globale dans le code frontend (`apps/web-client/src/`) pour corriger les mots suivants sans accents :
  - "Quête" (souvent écrit "Quete")
  - "Étalée" (souvent écrit "Etalee")
  - "Réflexe" (souvent écrit "Reflexe")
  - "Associé" (souvent écrit "Associe")
  - "SAUVÉES" (souvent écrit "SAUVEES" dans le dashboard profil)
  - "GÉNÉRÉ" (souvent écrit "GENERE")
  - "CAPTURÉ" (souvent écrit "CAPTURE")
  - "parrainé" (souvent écrit "parraine")
- [ ] Vérifier et corriger l'encodage/les accents sur les notifications générées (ex: "complete", "defi", "tete", "debloque" -> "complété", "défi", "tête", "débloqué").
- [ ] Uniformisation du lexique : Remplacer toutes les occurrences textuelles du mot "Boutique" par "Marché" dans l'UI (titres de page, bottom navigation bar, etc.) pour des raisons de cohérence sémantique.

## Fichiers probables à modifier
- Chemin racine : `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src`
- Exemples de fichiers contenant des erreurs : 
  - `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\lib\mock\mock-challenges.ts` (pour 'Etalee')
  - `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\profile\[id]\mock-public-profile.tsx` (pour 'SAUVEES')
  - `c:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\app\[locale]\(adventure)\community\_features\adventure-challenges.tsx` (pour 'Quete')
- Tu peux utiliser ton outil de recherche (`grep_search`) pour trouver toutes les occurrences.

## Règles de comportement
1. **Scope strict :** Ne modifie AUCUNE logique métier (Hooks, API calls). Ton intervention est purement textuelle.
2. Fais attention à ne pas modifier des clés techniques (ex: noms de variables `isComplete` ou chemins d'URL `/boutique` si cela risque de casser le routage, modifie uniquement les textes affichés à l'utilisateur).
