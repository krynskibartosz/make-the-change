# P0-8 — Statut de `Artisans Locaux`

**Objectif :** clarifier le statut du terme `Artisans Locaux`, qui semble être un ancien nom de faction ou une ancienne catégorie encore présente dans le code/mocks.

**Contraintes :**
- Ne modifie pas le code applicatif.
- Ne modifie pas les mocks.
- Ne modifie pas Supabase.
- Ne modifie pas Stripe.
- Travaille uniquement dans la documentation.

---

## 1. Contexte

### 1.1 Factions cibles actuelles

Les factions cibles validées sont :

| Mascotte | Nom faction | Thème |
|---|---|---|
| Melli | Vie Sauvage | Pollinisateurs / faune |
| Sylva | Terres & Forêts | Sols / forêts / régénération |
| Ondine | Gardiens des mers | Océans / récifs / eau |

Ces factions sont alignées avec :
- des grands écosystèmes (pollinisateurs, forêts, océans) ;
- des mascottes narratives (Melli, Sylva, Ondine) ;
- des couleurs et thèmes visuels cohérents (amber, emerald, blue).

### 1.2 Problème identifié

Le terme `Artisans Locaux` apparaît encore dans le code et les mocks, mais :
- ne correspond pas aux trois factions cibles actuelles ;
- semble être un héritage d'un ancien modèle d'app ;
- n'est pas aligné avec la direction narrative actuelle (grands écosystèmes) ;
- est déjà documenté comme `[DEPRECIE]` dans plusieurs fichiers.

---

## 2. Analyse des occurrences

### 2.1 Occurrences dans le code

| Fichier | Lignes | Contexte | Statut |
|---|---|---|---|
| `src/lib/mock/mock-session.ts` | 75-76 | Normalisation de 'artisans locaux' vers 'Artisans Locaux' | `[ACTUEL_CODE]` `[DEPRECIE]` |
| `src/lib/mock/mock-viewer.ts` | 72, 82 | `defaultFaction: 'Artisans Locaux'` dans deux viewers | `[ACTUEL_CODE]` `[DEPRECIE]` |
| `src/lib/mock/types.ts` | 4 | Type `Faction` inclut 'Artisans Locaux' | `[ACTUEL_CODE]` `[DEPRECIE]` |
| `src/lib/mock/mock-ids.ts` | 123 | Mapping `'Artisans Locaux': 'zero-dechet'` | `[ACTUEL_CODE]` `[DEPRECIE]` |
| `src/app/[locale]/(tabs)/impact/_lib/mock-seasons.ts` | 45, 69, 102 | Faction 'Artisans Locaux' dans des saisons impact | `[ACTUEL_CODE]` `[DEPRECIE]` |
| `src/app/[locale]/(screens)/onboarding/_features/onboarding-flow.tsx` | 97, 231 | Texte UI "artisans locaux" et title "Artisans Locaux" | `[ACTUEL_CODE]` `[DEPRECIE]` |
| `src/app/[locale]/(screens)/onboarding/_features/step-0-hook.tsx` | 55 | Texte UI "artisans locaux" | `[ACTUEL_CODE]` `[DEPRECIE]` |
| `src/app/[locale]/(auth)/actions.ts` | 213 | Condition `factionValue === 'Artisans Locaux'` | `[ACTUEL_CODE]` `[DEPRECIE]` |

**Total code :** 8 fichiers affectés.

### 2.2 Occurrences dans la documentation

| Fichier | Contexte | Statut actuel |
|---|---|---|
| `00-CONTEXTE-COMMUN.md` | Mentionné comme terme sensible déprécié | `[DEPRECIE]` |
| `02-ETAT-ACTUEL-CODE.md` | Tableau des termes dépréciés | `[ACTUEL_CODE]` + `[DEPRECIE]` |
| `02-PRODUIT.md` | Bug connu sur valeurs de faction | `[DEPRECIE]` |
| `03-DECISIONS-VALIDEES.md` | Non-décision importante | `[DEPRECIE]` |
| `03-TECHNIQUE.md` | Tableau d'incohérences faction | `[DEPRECIE]` |
| `09-GAMIFICATION-ECONOMIE.md` | Mention dans section gamification | `[ACTUEL_CODE]` + `[DEPRECIE]` |
| `11-TECHNIQUE-DATA.md` | Tableau des termes legacy | `[DEPRECIE]` |
| `99-GLOSSAIRE-LEXIQUE.md` | Tableau des termes sensibles | `[ACTUEL_CODE]` + `[DEPRECIE]` |
| `doc/_audit/CODE-VS-DOC.md` | Incohérence code vs doc | `[ACTUEL_CODE]` mais `[DEPRECIE]` |
| `doc/_audit/CHANGELOG-REFACTO-DOC.md` | Changelog mentionne le terme | `[DEPRECIE]` |
| `doc/_audit/BUSINESS-INITIAL-PROMISE-AUDIT.md` | Mentionné comme prochaine P0 | `[A_DECIDER]` |

**Total doc :** 11 fichiers mentionnent le terme, déjà documenté comme déprécié dans la plupart.

### 2.3 Variantes trouvées

| Terme | Occurrences | Contexte |
|---|---|---|
| `Artisans Locaux` | Multiple | Nom de faction dans types, mocks, UI |
| `artisans locaux` | 2 | Textes UI dans onboarding (minuscule) |
| `artisans` | 1 | Documentation business-model.md (contexte producteurs) |

**Note :** La mention dans `docs/10-reference-content/business-model.md` utilise "artisans" dans le contexte de producteurs/partenaires (apiculteurs, oléiculteurs), ce qui est distinct de la notion de faction utilisateur.

---

## 3. Réponses aux questions

### 1. `Artisans Locaux` est-il encore une faction actuelle ?

`[NON]` Non, ce n'est pas une faction cible actuelle. Les factions cibles sont :
- Vie Sauvage / Melli
- Terres & Forêts / Sylva
- Gardiens des mers / Ondine

`Artisans Locaux` est une faction legacy encore présente dans le code mais ne correspond plus à la direction narrative actuelle.

### 2. Est-ce une ancienne catégorie produit ?

`[PARTIELLEMENT]` Le terme semble avoir été lié à un ancien modèle d'app où les factions étaient basées sur des catégories de producteurs (artisans locaux, zéro déchet) plutôt que sur des grands écosystèmes. C'est une ancienne logique qui ne correspond plus à la direction actuelle.

### 3. Est-ce une ancienne faction à supprimer ?

`[OUI]` C'est une ancienne faction qui devrait être supprimée progressivement du code et des mocks, mais pas brutalement pour éviter de casser les prototypes.

### 4. Est-ce une ancienne valeur technique à garder en compatibilité ?

`[OUI]` Tant que la migration n'est pas planifiée, cette valeur reste dans le type `Faction` et les mocks pour compatibilité. Elle doit être documentée comme `[ACTUEL_CODE] [DEPRECIE] [A_MIGRER_PLUS_TARD]`.

### 5. Faction par defaut

`[A_DECIDER]` Faction par defaut apres migration.

`[A_DECIDER]` Strategie pour les utilisateurs ou mocks qui ont encore `Artisans Locaux`.

Options possibles :
- repasser par un choix onboarding ;
- fallback temporaire vers Vie Sauvage ;
- fallback selon preferences/projet ;
- fallback neutre.

### 6. Est-ce lié à la boutique / producteurs ?

`[CONFUSION_RISQUE]` Il y a un risque de confusion entre :
- `Artisans Locaux` comme faction utilisateur (ancienne logique) ;
- producteurs/partenaires comme entités business (apiculteurs, oléiculteurs, etc.).

Les producteurs/partenaires ne sont pas des factions utilisateur. Ils sont des entités business distinctes qui portent des projets. Ne pas confondre ces deux concepts.

### 7. Est-ce lié au soutien producteur ?

`[NON]` Le soutien producteur est un modèle économique (contribution à un projet porté par un producteur/partenaire), indépendant de la faction utilisateur. La faction est une préférence narrative/thématique de l'utilisateur, pas une catégorie de producteur.

### 8. Est-ce lié à un ancien modèle d'app ?

`[OUI]` `Artisans Locaux` semble être un héritage d'un ancien modèle d'app où les factions étaient basées sur des catégories socio-économiques (artisans locaux, zéro déchet) plutôt que sur des grands écosystèmes biodiversité. Ce modèle a été remplacé par une logique plus narrative et écosystémique.

### 9. Quels fichiers utilisent encore cette valeur ?

Voir section 2.1 pour la liste complète des 8 fichiers de code.

### 10. Quels risques si on la supprime trop vite ?

`[RISQUE]` Supprimer brutalement `Artisans Locaux` peut :
- casser les prototypes qui l'utilisent comme defaultFaction ;
- créer des erreurs TypeScript si le type Faction est modifié sans mise à jour des usages ;
- casser l'onboarding qui présente encore cette faction ;
- casser les saisons impact qui référencent cette faction ;
- créer des incohérences dans les tests ou les mocks qui dépendent de cette valeur.

---

## 4. Doctrine cible recommandée

### 4.1 Statut de `Artisans Locaux`

`[CIBLE_VALIDEE]` La decision est de considerer `Artisans Locaux` comme une ancienne faction depreciee.

`[CIBLE_VALIDEE]` Les seules factions cibles sont :
- Vie Sauvage / Melli
- Terres & Forets / Sylva
- Gardiens des mers / Ondine

`[CIBLE_VALIDEE]` Producteurs / partenaires ne sont pas des factions utilisateur.

`[ACTUEL_CODE] [LEGACY_FACTION] [DEPRECIE] [A_MIGRER_PLUS_TARD]` `Artisans Locaux` existe encore dans le code pour compatibilite.

`[A_MIGRER_PLUS_TARD]` Ne pas le renforcer dans les nouveaux ecrans, nouveaux mocks ou nouveaux flows.

`[A_MIGRER_PLUS_TARD]` Ne pas le supprimer brutalement sans plan de migration.

### 4.2 Factions cibles

`[CIBLE_VALIDEE]` Les seules factions cibles sont :
- Vie Sauvage / Melli
- Terres & Forêts / Sylva
- Gardiens des mers / Ondine

Ces factions sont alignées avec :
- des grands écosystèmes biodiversité ;
- des mascottes narratives cohérentes ;
- une logique de thèmes visuels et pédagogiques.

### 4.3 Migration progressive

`[A_MIGRER_PLUS_TARD]` La migration doit être progressive :
1. Documenter clairement `Artisans Locaux` comme déprécié dans tous les fichiers concernés.
2. Ne pas ajouter de nouveaux usages de `Artisans Locaux`.
3. Planifier une migration technique ultérieure (P2 ou P3) pour :
   - retirer `Artisans Locaux` du type Faction ;
   - remplacer les defaultFaction par l'une des trois factions cibles ;
   - mettre à jour les saisons impact ;
   - mettre à jour l'onboarding ;
   - nettoyer les mocks.

### 4.4 Distinction producteurs vs factions

`[CIBLE_VALIDEE]` Ne pas confondre :
- **Factions utilisateur** : préférences narratives/thématiques (Vie Sauvage, Terres & Forêts, Gardiens des mers).
- **Producteurs/partenaires** : entités business qui portent des projets biodiversité (apiculteurs, oléiculteurs, etc.).

Les producteurs ne sont pas des factions. Ils sont des partenaires business indépendants des préférences utilisateur.

---

## 5. Classification synthétique

### `[ACTUEL_CODE]`

- Type `Faction` dans `src/lib/mock/types.ts`
- Normalisation dans `src/lib/mock/mock-session.ts`
- DefaultFaction dans `src/lib/mock/mock-viewer.ts`
- Mapping dans `src/lib/mock/mock-ids.ts`
- Saisons impact dans `src/app/[locale]/(tabs)/impact/_lib/mock-seasons.ts`
- Onboarding UI dans `src/app/[locale]/(screens)/onboarding/_features/`
- Auth action dans `src/app/[locale]/(auth)/actions.ts`

### `[LEGACY_FACTION]`

- `Artisans Locaux` est une faction legacy d'un ancien modele d'app.

### `[DEPRECIE]`

- Tous les usages ci-dessus sont deprecies et ne doivent pas etre renforces.

### `[A_MIGRER_PLUS_TARD]`

- La suppression technique de `Artisans Locaux` du code doit etre planifiee plus tard (P2 ou P3) pour eviter de casser les prototypes.
- Ne pas le renforcer dans les nouveaux ecrans, nouveaux mocks ou nouveaux flows.
- Ne pas le supprimer brutalement sans plan de migration.

### `[RISQUE]`

- Suppression brutale : risque de casser les prototypes, l'onboarding, les saisons impact.
- Confusion producteurs vs factions : risque de mélanger entités business et préférences utilisateur.

### `[CIBLE_VALIDEE]`

- Les seules factions cibles sont Vie Sauvage, Terres & Forêts, Gardiens des mers.
- `Artisans Locaux` ne doit plus être présenté comme faction cible.
- Ne pas confondre producteurs/partenaires avec factions utilisateur.

### `[A_DECIDER]`

- Timing exact de la migration technique (P2 ou P3).
- Faction par défaut à utiliser lors de la migration (probablement Vie Sauvage).
- Traitement des données existantes qui utilisent `Artisans Locaux` (si applicable).

---

## 6. Décisions validables maintenant

`[CIBLE_VALIDEE]` `Artisans Locaux` est une faction legacy dépréciée.

`[CIBLE_VALIDEE]` Les seules factions cibles sont Vie Sauvage, Terres & Forêts, Gardiens des mers.

`[CIBLE_VALIDEE]` Ne pas confondre producteurs/partenaires avec factions utilisateur.

`[CIBLE_VALIDEE]` Ne pas renforcer `Artisans Locaux` dans le code ou les mocks.

`[A_MIGRER_PLUS_TARD]` La migration technique doit être planifiée plus tard (P2 ou P3).

---

## 7. Éléments encore à décider

### `[A_DECIDER]`

- Faction par defaut apres migration.
- Strategie pour les utilisateurs ou mocks qui ont encore `Artisans Locaux` (repasser par onboarding, fallback temporaire, fallback selon preferences, fallback neutre).

---

## 8. Recommandation de prochaine P0

P0-9 — Stripe doit-il être documenté comme paiement réel, prototype ou hybride ?
