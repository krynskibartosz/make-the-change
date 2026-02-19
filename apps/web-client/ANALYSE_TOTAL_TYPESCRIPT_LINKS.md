# Analyse Approfondie des 30 Liens Total TypeScript

Date de l'analyse : 2026-02-19  
Périmètre : `apps/web-client` (analyse documentaire + mapping vers le repo)  
Approche éditoriale : paraphrase technique, exemples synthétiques, citations minimales

## Résumé exécutif

Cette analyse couvre 30 articles Total TypeScript autour de 8 axes: modélisation (`type`/`interface`), génériques, React+TS, utilitaires (`Extract`, `Exclude`, `satisfies`, `NoInfer`), config TS, évolutions de versions (TS 5.2-5.8), robustesse type-level et maintenabilité long terme.

Conclusion globale:

- Le socle recommandé est cohérent: privilégier `type` par défaut, garder `interface` pour les cas d’héritage objet explicite.
- Les articles convergent vers une même direction: maximiser l’inférence, réduire la magie implicite, éviter les constructions à coût cognitif élevé (`enum`, sur-dérivation, sur-contrainte des `children`).
- Pour `web-client`, les gains immédiats sont surtout organisationnels:
  - convention claire `type` vs `interface`,
  - politique `React.FC` explicite,
  - adoption ciblée de `satisfies`, `ComponentProps*`, et utilitaires conditionnels.

## Méthodologie

1. Vérification de disponibilité des 30 URLs: `HTTP 200` pour tous les liens.
2. Extraction des métadonnées et contenu via `__NEXT_DATA__` (titre, slug, dates, description, body).
3. Lecture et synthèse technique par article (thèses, implications, limites).
4. Mapping systématique vers le code réel de `web-client`.
5. Consolidation en recommandations priorisées et plan 30/60/90 jours.

## État actuel du repo web-client (baseline technique)

Constats vérifiés sur `src/**/*.ts(x)`:

- `interface`: **44** occurrences
- `type`: **143** occurrences
- déclarations `enum`: **0**
- usages `React.FC` / `FC<...>`: **42**
- usages `satisfies`: **3**
- usages `ComponentProps*`: **0**
- usages `Extract`: **0**
- usages `Exclude`: **0**
- usages `NoInfer`: **0**
- imports relatifs avec extension explicite (`.js`, `.ts`, ...): **0**
- imports relatifs totaux: **108**

Exemples concrets observés:

- `React.FC` fortement présent dans `src/components/ui/page-hero.tsx` et plusieurs composants layout/UI.
- `satisfies` déjà utilisé en rédaction de contenu blog: `src/app/[locale]/(marketing)/blog/_features/actions/blog-actions.ts`.
- `as const` présent dans plusieurs zones de config: `src/app/[locale]/(marketing)/(home)/_features/marketing-steps-section.tsx`, `src/lib/placeholder-images.ts`, etc.

Contexte `tsconfig` actuel (`apps/web-client/tsconfig.json`):

- `strict: true`, `moduleResolution: bundler`, `noEmit: true`, `isolatedModules: true`.
- Pas d’activation explicite locale de réglages comme `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions`.

## Fiches détaillées (30/30)

### [1] Type vs Interface: Which Should You Use?
- URL: https://www.totaltypescript.com/type-vs-interface-which-should-you-use
- Date publication / mise à jour: 2023-07-31 / 2023-12-18

#### TL;DR
L’article recommande `type` par défaut, car plus expressif (unions, conditionnels, mapped types). `interface` garde une valeur forte pour les hiérarchies objet via `extends` et certains cas de perf de checker. Point clé: les interfaces peuvent fusionner par déclaration, ce qui introduit des bugs subtils en base large.

#### Ce que l’article affirme
- `type` couvre davantage de formes de type que `interface`.
- `interface` est utile quand on modélise de l’héritage d’objets.
- La déclaration merging d’interface peut surprendre en grand codebase.

#### Analyse critique
- Très utile pour fixer une convention d’équipe et réduire les débats stériles.
- Le vrai enjeu n’est pas dogmatique: lisibilité + prévisibilité + coût de maintenance.
- Dans un repo multi-contributeurs, éviter les mécaniques implicites (merging) est souvent gagnant.

#### Exemple synthétique
```ts
// Convention simple
export type User = { id: string; name: string }

export interface Entity {
  id: string
}
export interface Customer extends Entity {
  company: string
}
```

#### Pièges / anti-patterns
- Mélanger sans règle `type`/`interface` selon préférences individuelles.
- Utiliser `interface` alors qu’on a besoin d’unions/conditionnels.

#### Applicabilité web-client
**Élevée**. Le ratio actuel (143 `type` vs 44 `interface`) est déjà orienté `type-first`, mais sans règle formalisée.

#### Action recommandée
1. Documenter une convention: `type` par défaut, `interface` pour héritage objet explicite.
2. Ajouter un guide court dans la doc technique interne.

---

### [2] TypeScript 5.8 Ships --erasableSyntaxOnly To Disable Enums
- URL: https://www.totaltypescript.com/erasable-syntax-only
- Date publication / mise à jour: 2025-01-24 / 2025-02-05

#### TL;DR
`erasableSyntaxOnly` interdit les syntaxes TS non effaçables sans transformation runtime (`enum`, `namespace`, parameter properties). Le message stratégique: rapprocher TS d’un modèle “types supprimables” compatible avec l’écosystème Node et les futurs standards JS.

#### Ce que l’article affirme
- Les syntaxes non erasable compliquent la chaîne d’outils.
- Node renforce la valeur d’un TS “effaçable”.
- Le flag sert autant de garde-fou technique que de direction d’architecture.

#### Analyse critique
- Important surtout pour les environnements qui exécutent TS “strip types”.
- Dans un projet Next moderne, l’impact direct est faible si on n’utilise déjà pas ces syntaxes.
- Bon signal pour éviter un retour de patterns legacy.

#### Exemple synthétique
```json
{
  "compilerOptions": {
    "erasableSyntaxOnly": true
  }
}
```

#### Pièges / anti-patterns
- Introduire des `enum`/`namespace` “par habitude” dans un codebase moderne.
- Supposer que tous les outils gèrent la même sémantique runtime TS.

#### Applicabilité web-client
**Moyenne**. Vous avez déjà `enum_decl_count = 0`; c’est surtout une politique de prévention.

#### Action recommandée
1. Tester `erasableSyntaxOnly` sur une branche technique.
2. Si compatible, l’ajouter pour verrouiller les conventions.

---

### [3] This Crazy Syntax Lets You Get An Array Element's Type
- URL: https://www.totaltypescript.com/get-the-type-of-an-array-element
- Date publication / mise à jour: 2024-09-02 / 2024-09-02

#### TL;DR
L’article explique `Array[number]` (indexed access type) pour obtenir le type élément d’un tableau, particulièrement puissant combiné à `as const` pour dériver des unions littérales depuis des valeurs runtime.

#### Ce que l’article affirme
- `typeof arr[number]` extrait le type élément.
- `as const` est crucial pour garder les littéraux.
- Deriving from values réduit la duplication entre runtime et types.

#### Analyse critique
- Pattern extrêmement utile pour config statique et clés de navigation.
- À utiliser avec discipline: trop de dérivation peut rendre les types “magiques”.
- Bien adapté aux objets de configuration UI et mapping métier.

#### Exemple synthétique
```ts
const statuses = ['draft', 'published', 'archived'] as const
export type Status = (typeof statuses)[number]
```

#### Pièges / anti-patterns
- Oublier `as const` et perdre la précision (`string[]`).
- Sur-dériver des types depuis des valeurs très dynamiques.

#### Applicabilité web-client
**Élevée**. Le pattern existe déjà par endroits; il peut être standardisé.

#### Action recommandée
1. Utiliser ce pattern pour vos sets de constantes métier.
2. Ajouter un snippet de référence dans la doc de conventions.

---

### [4] Why I Don't Like Enums
- URL: https://www.totaltypescript.com/why-i-dont-like-typescript-enums
- Date publication / mise à jour: 2024-08-14 / 2024-08-16

#### TL;DR
L’article critique les `enum` TS: comportement runtime particulier (surtout numeric enums), friction de lisibilité, et coûts de maintenance. Il pousse vers des alternatives plus explicites (`as const` + union de littéraux).

#### Ce que l’article affirme
- Numeric/string enums ont des comportements différents.
- Les enums introduisent des surprises nominales/runtime.
- Les alternatives littérales sont souvent plus simples à raisonner.

#### Analyse critique
- Aligné avec les pratiques modernes front-end et bundlers.
- Le gain principal est cognitif: moins de “cas spéciaux TS”.
- Peut être nuancé en code legacy interop, mais peu utile ici.

#### Exemple synthétique
```ts
const OrderStatus = {
  Pending: 'pending',
  Paid: 'paid',
  Cancelled: 'cancelled',
} as const

type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]
```

#### Pièges / anti-patterns
- Réintroduire `enum` pour “faire plus typé” alors que l’alternative est plus claire.
- Mélanger enum et unions littérales dans un même domaine.

#### Applicabilité web-client
**Élevée**. Le repo est déjà sans `enum` déclarés: il faut conserver cette ligne.

#### Action recommandée
1. Écrire explicitement “pas d’enum TS” dans les conventions.
2. Fournir un helper standard `as const` + union.

---

### [5] Sometimes, Object Property Order Matters
- URL: https://www.totaltypescript.com/property-order-matters
- Date publication / mise à jour: 2024-06-11 / 2024-06-17

#### TL;DR
Selon la forme d’API générique, l’ordre des propriétés d’un objet passé en argument peut influencer l’inférence TS. Ce n’est pas un bug “métier”, mais un edge case de l’algorithme d’inférence. `NoInfer` peut servir à verrouiller ce comportement.

#### Ce que l’article affirme
- L’ordre des champs peut impacter l’inférence dans certains patterns.
- Des signatures mieux conçues évitent cette dépendance implicite.
- `NoInfer` peut stabiliser l’intention.

#### Analyse critique
- Très pertinent pour APIs utilitaires internes.
- Moins impactant pour composants React simples.
- Rappelle qu’un design type-level doit être testé comme un API.

#### Exemple synthétique
```ts
function mapByKey<T extends object, K extends keyof T>(opts: {
  key: K
  items: T[]
}) {
  // ...
}
```

#### Pièges / anti-patterns
- Compter sur une inférence “accidentellement correcte”.
- Ignorer les tests de types sur helpers génériques.

#### Applicabilité web-client
**Moyenne**. Surtout utile pour vos utilitaires et couches de query-state.

#### Action recommandée
1. Ajouter des tests type-level sur les helpers génériques critiques.
2. Réviser les signatures ambiguës dans `src/lib` et features state.

---

### [6] Deriving vs Decoupling: When NOT To Be A TypeScript Wizard
- URL: https://www.totaltypescript.com/deriving-vs-decoupling
- Date publication / mise à jour: 2024-03-20 / 2024-03-25

#### TL;DR
L’article oppose deux stratégies: dériver des types automatiquement (source unique) vs découpler volontairement des contrats (stabilité, indépendance). Message clé: la dérivation n’est pas toujours le meilleur choix; parfois, découpler réduit les effets de bord.

#### Ce que l’article affirme
- Dériver est puissant mais peut propager trop de changements.
- Découpler protège des frontières de domaine.
- Le choix dépend du cycle de vie du type et de sa responsabilité.

#### Analyse critique
- Excellent cadre de décision pour un monorepo multi-domaines.
- Crucial pour éviter “wizardry” type-level difficile à maintenir.
- Demande une gouvernance claire des frontières (API vs implémentation).

#### Exemple synthétique
```ts
// Dérivé (couplé)
type UserCardModel = Pick<ApiUser, 'id' | 'displayName' | 'avatar'>

// Découplé (contrat stable)
type UserCardModel = { id: string; name: string; avatarUrl?: string }
```

#### Pièges / anti-patterns
- Dériver partout “par élégance” sans considérer la stabilité.
- Exposer des types internes de DB au niveau UI.

#### Applicabilité web-client
**Élevée**. Vos couches marketing/dashboard peuvent bénéficier de frontières plus explicites.

#### Action recommandée
1. Définir quelles couches doivent être dérivées vs découplées.
2. Éviter de faire fuiter des shapes DB vers la UI.

---

### [7] NoInfer: TypeScript 5.4's New Utility Type
- URL: https://www.totaltypescript.com/noinfer
- Date publication / mise à jour: 2024-03-19 / 2024-03-25

#### TL;DR
`NoInfer<T>` permet d’empêcher un paramètre de participer à l’inférence. C’est un outil de contrôle fin pour faire respecter l’API voulue quand plusieurs arguments “tirent” le type générique dans des directions différentes.

#### Ce que l’article affirme
- `NoInfer` règle des conflits d’inférence fréquents en fonctions génériques.
- Il améliore les messages d’erreur pour l’appelant.
- Son usage doit rester ciblé.

#### Analyse critique
- Très utile en bibliothèque interne de helpers.
- Sur-usage nuisible à la lisibilité pour l’équipe.
- À introduire avec conventions + exemples locaux.

#### Exemple synthétique
```ts
function pickOne<T>(options: T[], defaultValue: NoInfer<T>) {
  return options.includes(defaultValue) ? defaultValue : options[0]
}
```

#### Pièges / anti-patterns
- Utiliser `NoInfer` pour masquer un mauvais design d’API.
- Introduire le helper sans documentation d’équipe.

#### Applicabilité web-client
**Moyenne**. Aucun usage actuel (`noinfer_count = 0`), mais intéressant pour utilitaires partagés.

#### Action recommandée
1. Introduire un cas pilote sur un helper générique réel.
2. Documenter quand l’utiliser (et quand l’éviter).

---

### [8] Type Predicate Inference: The TS 5.5 Feature No One Expected
- URL: https://www.totaltypescript.com/type-predicate-inference
- Date publication / mise à jour: 2024-03-17 / 2024-03-18

#### TL;DR
TS 5.5 peut inférer automatiquement certains type predicates à partir du corps de la fonction. Cela réduit le besoin d’annotations manuelles `value is X` dans des gardes simples.

#### Ce que l’article affirme
- Les fonctions booléennes “propres” peuvent devenir des garde-types implicites.
- L’ergonomie des filtres et narrowing s’améliore.
- Certains cas comme `filter(Boolean)` restent limités.

#### Analyse critique
- Gain net de DX, mais il faut rester explicite dans les cas ambigus.
- Évite la répétition, mais ne remplace pas la conception de bons guards.
- Impact fort sur code de transformation/listes.

#### Exemple synthétique
```ts
const isNonNull = <T>(value: T | null | undefined) => value != null
const clean = values.filter(isNonNull) // T[]
```

#### Pièges / anti-patterns
- Croire que toute fonction booléenne devient un type guard parfait.
- Remplacer des predicates explicites quand la logique est complexe.

#### Applicabilité web-client
**Moyenne à élevée**. Utile dans parsing CMS, data mapping et filtres UI.

#### Action recommandée
1. Normaliser un petit set de guards partagés (`isRecord`, `isNonNull`, etc.).
2. Garder les predicates explicites quand la logique est non triviale.

---

### [9] You Can't Make Children "Type Safe" in React & TypeScript
- URL: https://www.totaltypescript.com/type-safe-children-in-react-and-typescript
- Date publication / mise à jour: 2024-03-15 / 2024-06-07

#### TL;DR
On ne peut pas verrouiller strictement “le type de composant enfant” via `children` en React TS de manière fiable. JSX produit `JSX.Element` et les restrictions théoriques ne tiennent pas au callsite réel.

#### Ce que l’article affirme
- `children` strictement typés au composant précis est un faux objectif.
- Les tentatives avancées contournent mal la réalité JSX.
- Mieux vaut des APIs explicites (props dédiées, render props).

#### Analyse critique
- Point clé pour éviter des abstractions React fragiles.
- Réduit la complexité inutile côté typings UI.
- Encourage des patterns API plus explicites et testables.

#### Exemple synthétique
```tsx
// Préférer une API explicite
type ModalProps = {
  header: React.ReactNode
  body: React.ReactNode
}
```

#### Pièges / anti-patterns
- Essayer d’imposer `<Only<MyChild>>` via `children`.
- Créer des types très complexes qui n’apportent pas de sécurité réelle.

#### Applicabilité web-client
**Élevée**. Pertinent pour vos composants layout/marketing composés.

#### Action recommandée
1. Éviter les contraintes artificielles sur `children`.
2. Favoriser des slots nommés explicites (comme `PageHero.*`).

---

### [10] Make Your Functions More Reusable With Generics
- URL: https://www.totaltypescript.com/make-your-functions-more-reusable-with-generics
- Date publication / mise à jour: 2024-03-13 / 2024-03-13

#### TL;DR
L’article rappelle la base la plus rentable: remplacer `any` par des paramètres de type pour conserver la réutilisabilité sans sacrifier la sécurité. Une fonction générique bien conçue garde le lien entrée/sortie.

#### Ce que l’article affirme
- `any` casse la relation entre input et output.
- Les type parameters préservent cette relation.
- Les génériques simplifient la réutilisation inter-features.

#### Analyse critique
- Fondamental, surtout pour utils partagées.
- Attention à ne pas sur-contraindre avec des génériques inutiles.
- L’intérêt est maximal quand la relation de types est non triviale.

#### Exemple synthétique
```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
```

#### Pièges / anti-patterns
- Génériques “cosmétiques” qui n’apportent aucune relation de type.
- Conserver des `any` dans des fonctions utilitaires centrales.

#### Applicabilité web-client
**Élevée**. Très utile pour `src/lib/utils.ts` et helpers features.

#### Action recommandée
1. Auditer les helpers avec `any` implicite/explicite.
2. Migrer vers des signatures génériques minimales.

---

### [11] The TypeScript 5.3 Feature They Didn't Tell You About
- URL: https://www.totaltypescript.com/the-typescript-5-3-feature-they-didn-t-tell-you-about
- Date publication / mise à jour: 2023-11-29 / 2023-12-01

#### TL;DR
L’article met en avant une amélioration TS 5.3 sur l’interaction `as const`/readonly arrays et inférence (notamment avec `satisfies` et const type params). Résultat: moins de friction pour conserver des types précis sans compromis sur validation de shape.

#### Ce que l’article affirme
- TS 5.3 relâche des contraintes gênantes readonly vs mutable.
- Les patterns `as const` + `satisfies` deviennent plus naturels.
- L’inférence de tuples/littéraux est mieux préservée.

#### Analyse critique
- Très concret pour les tableaux de config/routes statiques.
- Diminue les workarounds bruyants (`readonly` partout à la main).
- Dépend de la version TS effective du projet.

#### Exemple synthétique
```ts
const routes = ['/', '/projects'] as const satisfies readonly string[]
```

#### Pièges / anti-patterns
- Coder selon des limitations anciennes de TS 5.2.
- Oublier de vérifier la version TS active en CI.

#### Applicabilité web-client
**Élevée**. Le projet est en TS 5.9.x, donc peut profiter de ces améliorations.

#### Action recommandée
1. Simplifier les patterns readonly legacy inutiles.
2. Standardiser `as const` + `satisfies` pour configs arrays.

---

### [12] Event Types in React and TypeScript
- URL: https://www.totaltypescript.com/event-types-in-react-and-typescript
- Date publication / mise à jour: 2023-10-24 / 2024-06-07

#### TL;DR
L’article couvre plusieurs stratégies pour typer les events React: hover/inspection, handler inline, `ComponentProps` et helper générique. Idée centrale: minimiser le bruit tout en restant précis sur le type d’événement.

#### Ce que l’article affirme
- Plusieurs méthodes existent avec différents compromis de lisibilité.
- `ComponentProps` permet d’extraire proprement des types d’events.
- Le meilleur choix dépend du niveau d’abstraction du composant.

#### Analyse critique
- Très pratique pour harmoniser les handlers dans un gros front.
- L’approche helper est utile mais à limiter aux cas récurrents.
- Bonne porte d’entrée pour adopter `ComponentProps*` (absent du repo aujourd’hui).

#### Exemple synthétique
```tsx
type InputOnChange = React.ComponentProps<'input'>['onChange']
const onChange: InputOnChange = (e) => console.log(e.currentTarget.value)
```

#### Pièges / anti-patterns
- Taper les events en `any` pour aller vite.
- Copier/coller des types d’event sans lien avec le composant réel.

#### Applicabilité web-client
**Élevée**. Directement utile sur formulaires auth/profile/settings.

#### Action recommandée
1. Introduire `ComponentProps<'...'>['on...']` pour handlers réutilisés.
2. Créer un mini-guide “event typing” dans le repo.

---

### [13] Relative import paths need explicit file extensions in EcmaScript imports
- URL: https://www.totaltypescript.com/relative-import-paths-need-explicit-file-extensions-in-ecmascript-imports
- Date publication / mise à jour: 2023-10-10 / 2023-10-16

#### TL;DR
En mode `NodeNext`, les imports relatifs ESM exigent des extensions explicites runtime (souvent `.js`). Ce n’est pas un caprice TS: c’est l’alignement avec la résolution ESM Node.

#### Ce que l’article affirme
- L’erreur vient de la stratégie de résolution, pas du fichier en lui-même.
- Mettre `.ts` en import n’est généralement pas la bonne solution runtime.
- Les contextes bundler et Node pur n’ont pas les mêmes contraintes.

#### Analyse critique
- Important pour libs/outils Node purs.
- Moins critique en Next `moduleResolution: bundler`.
- Nécessite une stratégie claire si des scripts Node TS apparaissent hors pipeline Next.

#### Exemple synthétique
```ts
// En NodeNext pur (émission JS):
import { foo } from './foo.js'
```

#### Pièges / anti-patterns
- Mélanger conventions d’import entre contexte app bundlée et scripts Node.
- Forcer `.ts` en import sans stratégie d’exécution cohérente.

#### Applicabilité web-client
**Moyenne**. Aujourd’hui: 0 import relatif avec extension explicite, et config bundler.

#### Action recommandée
1. Documenter “bundler app vs scripts Node” dans conventions import.
2. Si scripts NodeNext ajoutés, définir règle d’extension dédiée.

---

### [14] The TSConfig Cheat Sheet
- URL: https://www.totaltypescript.com/tsconfig-cheat-sheet
- Date publication / mise à jour: 2023-09-13 / 2024-08-05

#### TL;DR
L’article propose un socle `tsconfig` pragmatique, strict et orienté interop moderne. Les options ne sont pas “maximalistes”; elles visent un bon ratio sécurité/ergonomie sur projets réels.

#### Ce que l’article affirme
- Une base `tsconfig` standardisée évite les dérives d’équipe.
- Certaines options strictes apportent un gain immédiat de robustesse.
- Le contexte runtime/build doit guider les choix finaux.

#### Analyse critique
- Très utile comme baseline de revue de config.
- À adapter au contexte Next, monorepo et dépendances existantes.
- Le vrai gain vient du couplage config + conventions de code.

#### Exemple synthétique
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true
  }
}
```

#### Pièges / anti-patterns
- Copier une cheat sheet sans adaptation au projet.
- Ajouter des flags stricts sans plan de migration.

#### Applicabilité web-client
**Élevée**. Potentiel d’amélioration config explicite important.

#### Action recommandée
1. Faire un diff guidé `tsconfig` actuel vs baseline cible.
2. Migrer par étapes (flags opt-in sur branche dédiée).

---

### [15] Strongly Typing React Props with TypeScript
- URL: https://www.totaltypescript.com/react-props-typescript
- Date publication / mise à jour: 2023-09-04 / 2023-09-05

#### TL;DR
L’article compare 3 approches de typing props (inline, type alias, interface). Message pratique: sortir rapidement les types inline vers une forme nommée exportée améliore lisibilité et réutilisation.

#### Ce que l’article affirme
- Les props inline sont pratiques mais scalent mal.
- Type/interface nommés exportés facilitent maintenance.
- Les intersections complexes méritent une approche plus lisible.

#### Analyse critique
- Très pertinent pour homogénéiser un design system interne.
- Le débat `interface` vs `type` est secondaire face à la clarté du contrat.
- Les props nommées servent aussi la doc et les tests.

#### Exemple synthétique
```tsx
export type ProductCardProps = {
  id: string
  title: string
  onClick?: () => void
}
```

#### Pièges / anti-patterns
- Laisser des props inline longues dans des composants partagés.
- Ne pas exporter les types de props réutilisables.

#### Applicabilité web-client
**Élevée**. Utile sur composants UI/marketing réutilisés.

#### Action recommandée
1. Limiter les annotations props inline au trivial.
2. Exporter systématiquement les props types des composants partagés.

---

### [16] 5 Ways to Use 'Satisfies' in TypeScript
- URL: https://www.totaltypescript.com/how-to-use-satisfies-operator
- Date publication / mise à jour: 2023-08-02 / 2024-01-30

#### TL;DR
`satisfies` permet de valider une forme cible sans élargir excessivement le type inféré de la valeur. C’est idéal pour config objects, tuples, params sérialisés et mappings stricts.

#### Ce que l’article affirme
- `satisfies` préserve mieux l’inférence que l’annotation `:`.
- Très adapté aux objets `as const` et configurations.
- Permet de verrouiller la forme tout en gardant les littéraux.

#### Analyse critique
- Rapport signal/bruit excellent en code de config.
- Moins utile sur valeurs simples ad hoc.
- Nécessite une compréhension claire de “value beats type”.

#### Exemple synthétique
```ts
const routes = {
  home: '/',
  projects: '/projects',
} as const satisfies Record<string, `/${string}`>
```

#### Pièges / anti-patterns
- Utiliser `satisfies` partout “par style” sans besoin concret.
- Confondre validation de forme et changement de type runtime.

#### Applicabilité web-client
**Élevée**. `satisfies_count = 3` aujourd’hui, marge d’adoption large.

#### Action recommandée
1. Cibler d’abord les maps de config et routes.
2. Ajouter 3-4 patterns validés dans la doc d’équipe.

---

### [17] 6 Ways to Use Extract in TypeScript
- URL: https://www.totaltypescript.com/uses-for-extract-type-helper
- Date publication / mise à jour: 2023-08-02 / 2023-08-02

#### TL;DR
`Extract` sert à garder uniquement les membres compatibles d’une union (par discriminant, shape, primitives, fonctions). C’est un outil de “filtrage positif” très utile pour composer des APIs types.

#### Ce que l’article affirme
- `Extract` simplifie la sélection ciblée dans des unions.
- Très utile avec unions discriminées.
- Permet de construire des types plus précis sans duplication.

#### Analyse critique
- Excellente brique pour modèles d’état et événements.
- Peut devenir obscur si combiné avec trop de conditionnels imbriqués.
- Demande des alias nommés pour rester lisible.

#### Exemple synthétique
```ts
type Event = { type: 'open' } | { type: 'close'; reason: string }
type CloseEvent = Extract<Event, { type: 'close' }>
```

#### Pièges / anti-patterns
- Créer des types “one-liner” incompréhensibles.
- Ne pas nommer les sous-types extraits récurrents.

#### Applicabilité web-client
**Moyenne**. Aucun usage actuel (`extract_count = 0`), bon candidat dans flows état/UI.

#### Action recommandée
1. Introduire `Extract` sur une union discriminée pilote.
2. Favoriser des alias explicites (`type CloseEvent = ...`).

---

### [18] There Is No Such Thing As A Generic
- URL: https://www.totaltypescript.com/no-such-thing-as-a-generic
- Date publication / mise à jour: 2023-07-20 / 2023-10-05

#### TL;DR
L’article clarifie la terminologie: “generic” est un adjectif, pas un objet unique. Les notions utiles sont type parameters, type arguments, generic functions/types/classes. Cette précision améliore la communication technique d’équipe.

#### Ce que l’article affirme
- Mieux nommer = mieux raisonner.
- Distinguer clairement paramètre de type vs argument de type.
- L’inférence de type arguments fait partie du modèle mental clé.

#### Analyse critique
- Très bon article de normalisation sémantique.
- Gain indirect mais durable sur revues de code et mentoring.
- Important pour éviter la “mystification” des génériques.

#### Exemple synthétique
```ts
function identity<T>(value: T): T {
  return value
}
// T = type parameter, string = type argument
```

#### Pièges / anti-patterns
- Employer “un generic” pour tout et n’importe quoi.
- Mélanger terminologie et masquer les vrais problèmes de design.

#### Applicabilité web-client
**Moyenne**. Impact surtout culturel/documentaire.

#### Action recommandée
1. Standardiser le vocabulaire dans la doc engineering.
2. Utiliser cette terminologie dans les PR reviews.

---

### [19] TypeScript Generics in 3 Easy Patterns
- URL: https://www.totaltypescript.com/typescript-generics-in-three-easy-patterns
- Date publication / mise à jour: 2023-07-18 / 2023-07-19

#### TL;DR
L’article découpe les “génériques” en 3 patterns opérationnels: types appliqués à des types, types appliqués à des fonctions/classes, et inférence de type arguments depuis les paramètres runtime.

#### Ce que l’article affirme
- Ces 3 patterns couvrent la majorité des besoins concrets.
- Les confondre crée de la complexité inutile.
- Le pattern “inférence depuis arguments” est souvent le plus ergonomique.

#### Analyse critique
- Très utile pour former les devs à un modèle pratique, pas académique.
- Permet d’évaluer rapidement si un générique est nécessaire.
- Encourage des APIs où l’appelant fournit moins d’annotations manuelles.

#### Exemple synthétique
```ts
// Pattern 3: inférence depuis les arguments
const keysOf = <T extends object>(obj: T): Array<keyof T> => Object.keys(obj) as Array<keyof T>
```

#### Pièges / anti-patterns
- Introduire des type arguments explicites alors que TS peut inférer.
- Utiliser des contraintes trop larges (`extends any`).

#### Applicabilité web-client
**Élevée** pour utilitaires data et mapping.

#### Action recommandée
1. Revoir les helpers pour maximiser l’inférence côté appelant.
2. Éviter les signatures génériques verbeuses sans valeur.

---

### [20] How to Iterate Over Object Keys in TypeScript
- URL: https://www.totaltypescript.com/iterate-over-object-keys-in-typescript
- Date publication / mise à jour: 2023-07-18 / 2024-04-02

#### TL;DR
`Object.keys` renvoie `string[]`, pas `(keyof T)[]`, ce qui crée une friction classique. L’article propose des patterns pragmatiques: cast contrôlé ou helper/predicate pour préserver le typage.

#### Ce que l’article affirme
- Le comportement de `Object.keys` est volontairement large.
- Les cast `as Array<keyof T>` peuvent être acceptables si bornés.
- Les wrappers utilitaires rendent le pattern plus sûr et réutilisable.

#### Analyse critique
- Problème ultra courant dans les objets de config.
- Mieux d’encapsuler le cast dans un helper local plutôt que partout.
- Le compromis sûreté/ergonomie doit être explicite.

#### Exemple synthétique
```ts
function objectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>
}
```

#### Pièges / anti-patterns
- Répéter des casts ad hoc dans toute la base.
- Supposer que les clés runtime couvrent exactement `keyof T` sans contexte.

#### Applicabilité web-client
**Élevée**. Le repo manipule de nombreux objets record/config.

#### Action recommandée
1. Introduire un helper `objectKeys` centralisé.
2. Remplacer les casts dispersés les plus sensibles.

---

### [21] Four Essential TypeScript Patterns You Can't Work Without
- URL: https://www.totaltypescript.com/four-essential-typescript-patterns
- Date publication / mise à jour: 2023-07-14 / 2023-07-18

#### TL;DR
L’article présente 4 patterns structurants: branded types, globals, assertion functions/type predicates, classes. L’objectif n’est pas de “faire avancé”, mais de maîtriser les patterns qui créent des frontières de sécurité utiles.

#### Ce que l’article affirme
- Les branded types protègent des confusions de primitives compatibles.
- Les globals TS (`declare global`) sont parfois nécessaires et doivent être bien encadrés.
- Assertions/predicates améliorent la sûreté des flux dynamiques.

#### Analyse critique
- Très bon rappel d’architecture type-level.
- À appliquer avec parcimonie: pas besoin de brander tous les strings.
- Les patterns globals demandent une gouvernance stricte pour éviter la dette.

#### Exemple synthétique
```ts
type Brand<T, Name extends string> = T & { readonly __brand: Name }
type UserId = Brand<string, 'UserId'>
```

#### Pièges / anti-patterns
- Brander excessivement des domaines non critiques.
- Déclarer des globals sans conventions ni revue stricte.

#### Applicabilité web-client
**Moyenne**. Surtout utile pour IDs métiers sensibles et parsing runtime.

#### Action recommandée
1. Évaluer un pilote de branded IDs sur un domaine précis.
2. Formaliser une règle d’entrée pour `declare global`.

---

### [22] Optional Chaining for Assignments Lands in Stage 1
- URL: https://www.totaltypescript.com/optional-chaining-for-assignments
- Date publication / mise à jour: 2023-07-13 / 2023-07-18

#### TL;DR
L’article explique que `obj?.prop = x` n’est pas autorisé actuellement en JS/TS, puis suit la proposition TC39 (Stage 1) qui pourrait débloquer cette syntaxe à l’avenir.

#### Ce que l’article affirme
- L’optional chaining actuel est lecture-focused, pas affectation.
- Une évolution du standard est en discussion.
- L’ergonomie pourrait s’améliorer, mais rien n’est garanti à court terme.

#### Analyse critique
- Intérêt principal: veille syntaxique, pas action immédiate.
- Ne pas anticiper en prod une feature non standardisée.
- Reste utile pour comprendre les limites actuelles du langage.

#### Exemple synthétique
```ts
// Aujourd’hui, préférer:
if (obj) obj.foo = 'bar'
```

#### Pièges / anti-patterns
- Coder “comme si” la proposition était déjà adoptée.
- Complexifier le code en attendant une syntaxe future.

#### Applicabilité web-client
**Faible à moyenne**. Sujet de veille plus que de refactoring.

#### Action recommandée
1. Ne pas agir en code maintenant.
2. Revoir la question quand la proposition progresse (Stage 3+).

---

### [23] TypeScript 5.2's New Keyword: 'using'
- URL: https://www.totaltypescript.com/typescript-5-2-new-keyword-using
- Date publication / mise à jour: 2023-06-16 / 2023-09-14

#### TL;DR
`using` introduit une gestion de ressources explicite basée sur `Symbol.dispose` (et `await using` via `Symbol.asyncDispose`). Très pertinent pour scripts/services bas niveau; moins fréquent dans UI React standard.

#### Ce que l’article affirme
- `using` automatise la libération de ressources en sortie de scope.
- L’approche rapproche TS de patterns RAII-like.
- Cas d’usage: fichiers, connexions, ressources lifecycle.

#### Analyse critique
- Excellente feature pour code infra/back-office.
- Rarement nécessaire dans composants front classiques.
- À introduire seulement si le runtime/tooling est aligné.

#### Exemple synthétique
```ts
using resource = openResource()
// work...
// dispose automatique en fin de scope
```

#### Pièges / anti-patterns
- L’utiliser sans garantir support runtime/transpile.
- Le considérer comme replacement universel de `try/finally`.

#### Applicabilité web-client
**Faible** dans la couche UI, potentiellement **moyenne** dans scripts utilitaires.

#### Action recommandée
1. Garder en veille pour scripts Node internes.
2. Ne pas introduire côté composants React sans besoin clair.

---

### [24] Since TypeScript 5.1, React.FC is now "fine"
- URL: https://www.totaltypescript.com/you-can-stop-hating-react-fc
- Date publication / mise à jour: 2023-06-12 / 2024-08-16

#### TL;DR
L’article réhabilite `React.FC`: depuis TS 5.1 + React 18, les anciens griefs majeurs ont diminué (notamment `children` implicite). Position pragmatique: `React.FC` est acceptable, mais pas obligatoire.

#### Ce que l’article affirme
- `React.FC` n’est plus l’anti-pattern systématique d’avant.
- On peut garder/introduire `React.FC` avec cohérence d’équipe.
- Annoter directement les props reste souvent plus simple.

#### Analyse critique
- Important pour éviter des refactors “idéologiques”.
- Le vrai enjeu est la cohérence du style dans le repo.
- Le repo actuel (`react_fc_count = 42`) est déjà très aligné avec ce constat.

#### Exemple synthétique
```tsx
type ButtonProps = { label: string }
const Button: React.FC<ButtonProps> = ({ label }) => <button>{label}</button>
```

#### Pièges / anti-patterns
- Relancer un chantier massif pour “supprimer React.FC”.
- Mélanger 4 styles de typing composants sans règle commune.

#### Applicabilité web-client
**Élevée**. Directement lié à votre base actuelle.

#### Action recommandée
1. Décider une politique explicite `React.FC` (accepté/encadré).
2. Appliquer la règle seulement sur nouveau code ou modifications ciblées.

---

### [25] React.ReactNode vs JSX.Element vs React.ReactElement
- URL: https://www.totaltypescript.com/jsx-element-vs-react-reactnode
- Date publication / mise à jour: 2023-05-25 / 2024-12-06

#### TL;DR
`JSX.Element`/`ReactElement` décrivent le résultat d’une expression JSX; `ReactNode` représente tout ce que React peut rendre (string, number, null, etc.). En pratique UI: `ReactNode` est le bon default pour slots/children.

#### Ce que l’article affirme
- `JSX.Element` et `ReactElement` sont proches fonctionnellement.
- `ReactNode` est plus large et plus utile pour APIs de rendu.
- Le type de retour composant n’a pas besoin d’être sur-spécifié dans la plupart des cas.

#### Analyse critique
- Très pertinent pour nettoyer les signatures de props de slots.
- Réduit les erreurs de typage trop strictes sur contenu rendu.
- Aligne bien avec le pattern compositional React moderne.

#### Exemple synthétique
```tsx
type CardProps = {
  header?: React.ReactNode
  footer?: React.ReactNode
}
```

#### Pièges / anti-patterns
- Taper des slots en `JSX.Element` et bloquer des cas valides.
- Confondre type de retour composant et type de prop de rendu.

#### Applicabilité web-client
**Élevée**. Beaucoup de composants layout/section à slots.

#### Action recommandée
1. Standardiser `ReactNode` pour slots/children.
2. Réserver `JSX.Element` aux cas précis de contrat strict.

---

### [26] ComponentProps: React's Most Useful Type Helper
- URL: https://www.totaltypescript.com/react-component-props-type-helper
- Date publication / mise à jour: 2023-05-04 / 2023-05-29

#### TL;DR
`ComponentProps` (et variantes ref) permet de récupérer directement les props d’un élément HTML ou d’un composant React existant. Résultat: moins de duplication, meilleure robustesse face aux évolutions.

#### Ce que l’article affirme
- `ComponentProps<'button'>` évite de réécrire des signatures natives.
- `ComponentProps<typeof X>` permet des wrappers propres.
- `ComponentPropsWithRef` utile quand refs font partie du contrat.

#### Analyse critique
- Très rentable pour design system et wrappers UI.
- Réduit la dette de props redondantes et incorrectes.
- Doit être combiné à une convention claire d’override local.

#### Exemple synthétique
```tsx
type IconButtonProps = React.ComponentProps<'button'> & { icon: React.ReactNode }
```

#### Pièges / anti-patterns
- Re-déclarer manuellement des props déjà natives.
- Oublier les variantes avec ref quand nécessaire.

#### Applicabilité web-client
**Élevée**. `component_props_helper_count = 0`, fort potentiel d’amélioration.

#### Action recommandée
1. Introduire `ComponentProps<'...'>` sur les wrappers UI fréquents.
2. Ajouter un exemple officiel dans vos composants de base.

---

### [27] 9 Ways to Use Exclude in TypeScript
- URL: https://www.totaltypescript.com/uses-for-exclude-type-helper
- Date publication / mise à jour: 2023-04-05 / 2023-08-01

#### TL;DR
`Exclude` retire des membres d’union selon différentes stratégies (littéraux, discriminants, shape, pattern de string literal types). C’est l’outil de filtrage négatif complémentaire à `Extract`.

#### Ce que l’article affirme
- `Exclude` est polyvalent au-delà des unions simples.
- Utile pour raffiner APIs et contraintes.
- Fonctionne bien avec unions discriminées et template literal types.

#### Analyse critique
- Très puissant mais peut nuire à la lisibilité si surutilisé.
- Bien adapté aux types de filtres, permissions, états exclus.
- Demande une nomenclature claire pour les types dérivés.

#### Exemple synthétique
```ts
type Status = 'draft' | 'published' | 'archived'
type PublicStatus = Exclude<Status, 'archived'>
```

#### Pièges / anti-patterns
- Enchaîner des `Exclude` sans alias intermédiaires lisibles.
- Utiliser `Exclude` quand un type explicite serait plus clair.

#### Applicabilité web-client
**Moyenne**. `exclude_count = 0`, mais cas d’usage potentiels sur états d’UI.

#### Action recommandée
1. Introduire `Exclude` dans un cas lisible et documenté.
2. Éviter la complexité inutile sur types simples.

---

### [28] TypeScript Discriminated Unions for Frontend Developers
- URL: https://www.totaltypescript.com/discriminated-unions-are-a-devs-best-friend
- Date publication / mise à jour: 2023-03-29 / 2023-08-01

#### TL;DR
L’article oppose “bag of optionals” à l’union discriminée: un discriminant explicite (`status`, `kind`, `type`) rend les états UI/data plus sûrs et auto-documentés, avec un narrowing robuste.

#### Ce que l’article affirme
- Les unions discriminées modélisent mieux les états front-end.
- Elles évitent les objets partiellement valides incohérents.
- Le code de rendu gagne en exhaustivité et lisibilité.

#### Analyse critique
- C’est l’un des patterns les plus rentables en React + TS.
- Réduit fortement les bugs d’états impossibles.
- À coupler avec helpers exhaustifs (`never` checks).

#### Exemple synthétique
```ts
type LoadState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T }
```

#### Pièges / anti-patterns
- Revenir à des `foo?`, `bar?`, `baz?` sans discriminant central.
- Oublier la gestion exhaustive des branches.

#### Applicabilité web-client
**Très élevée**. Vos `DataState<T>` suivent déjà cette logique.

#### Action recommandée
1. Étendre ce pattern à d’autres flux UI asynchrones.
2. Ajouter un pattern exhaustif standard (`assertNever`).

---

### [29] Clarifying the `satisfies` Operator
- URL: https://www.totaltypescript.com/clarifying-the-satisfies-operator
- Date publication / mise à jour: 2023-03-13 / 2023-05-29

#### TL;DR
L’article clarifie le cœur de `satisfies`: avec `:`, le type déclaré domine; avec `satisfies`, la valeur conserve sa précision tout en étant vérifiée contre une forme attendue.

#### Ce que l’article affirme
- `satisfies` résout des pertes d’inférence causées par annotations larges.
- C’est un outil de validation structurelle, pas un cast.
- Particulièrement utile pour objets de config.

#### Analyse critique
- Complément parfait de l’article #16 (usages concrets).
- Aide à éviter les objets “trop larges” qui cassent l’autocomplétion.
- Bonne règle mentale à diffuser dans l’équipe.

#### Exemple synthétique
```ts
const features = {
  blog: true,
  commerce: false,
} satisfies Record<string, boolean>
```

#### Pièges / anti-patterns
- Confondre `satisfies` avec assertion `as`.
- Annoter en `Record<string, ...>` quand on veut garder des clés littérales.

#### Applicabilité web-client
**Élevée**. Beaucoup de maps/configs peuvent en bénéficier.

#### Action recommandée
1. Utiliser `satisfies` sur objets de configuration partagée.
2. Former l’équipe sur “value beats type”.

---

### [30] Building the Mental Model for Generics
- URL: https://www.totaltypescript.com/mental-model-for-typescript-generics
- Date publication / mise à jour: 2023-01-09 / 2023-07-18

#### TL;DR
L’article propose un modèle mental progressif des génériques (type helpers puis fonctions génériques), orienté lisibilité et réutilisation contrôlée plutôt que virtuosité type-level.

#### Ce que l’article affirme
- La compréhension des génériques doit partir d’exemples concrets.
- Les helpers génériques réduisent la répétition.
- Les fonctions génériques doivent préserver une relation utile entre entrées/sorties.

#### Analyse critique
- Très bon cadre de montée en compétence d’équipe.
- Réduit le risque de “types clever” non maintenables.
- Complète les articles #18 et #19 pour une base pédagogique solide.

#### Exemple synthétique
```ts
type ApiResponse<TData> = {
  data: TData
  error?: { message: string }
}
```

#### Pièges / anti-patterns
- Introduire des génériques avant de clarifier le besoin.
- Cacher la logique métier derrière des types trop abstraits.

#### Applicabilité web-client
**Élevée** pour harmoniser les helpers et modèles de réponses.

#### Action recommandée
1. Définir 3 patterns génériques “officiels” d’équipe.
2. Exiger une justification de relation de type en PR.

## Synthèse transversale (axes imposés)

### 1) Modélisation de types (`type` vs `interface`, unions discriminées, utilitaires)

- Convergence forte vers `type` par défaut.
- `interface` reste pertinente pour héritage objet explicite.
- Les unions discriminées sont le pattern phare pour états UI.
- `Extract`/`Exclude` servent de raffinage ciblé, pas de style global.

### 2) Génériques (modèle mental, patterns de réutilisation, NoInfer)

- 3 patterns pratiques à retenir (type→type, type→fonction, inférence).
- `NoInfer` est un scalpel d’API, pas un marteau.
- Priorité: maximiser l’inférence côté appelant.

### 3) Ergonomie React + TS (`React.FC`, `children`, `ReactNode`, `ComponentProps`)

- `React.FC` est acceptable depuis TS 5.1/React 18.
- Impossible de “sécuriser totalement” `children` par composant précis.
- `ReactNode` doit être le default pour slots/children.
- `ComponentProps*` est le levier principal encore sous-utilisé dans ce repo.

### 4) Config TS / build (`tsconfig`, imports relatifs, extensions ESM, erasable syntax)

- Le repo est strict, mais plusieurs options robustesse ne sont pas explicitement activées localement.
- Les règles d’extensions ESM concernent surtout NodeNext pur; ici, `bundler` réduit l’impact immédiat.
- `erasableSyntaxOnly` est surtout un garde-fou stratégique, cohérent avec l’absence d’enums actuelle.

### 5) Évolution TS par version (5.2, 5.3, 5.4, 5.5, 5.8+)

- TS 5.3: meilleure interaction readonly/const infer.
- TS 5.4: `NoInfer`.
- TS 5.5: inférence de predicates.
- TS 5.8: `erasableSyntaxOnly`.
- Le projet étant en TS 5.9.x, vous pouvez exploiter tous ces apports.

### 6) Robustesse API type-level (`satisfies`, `Extract`, `Exclude`, indexed access, `as const`)

- `satisfies` + `as const` = combo très rentable pour configs.
- `Array[number]` et indexed access facilitent deriving propre.
- `Extract`/`Exclude` à introduire graduellement avec lisibilité prioritaire.

### 7) Maintenabilité long terme (derive vs decouple, ordre de propriétés, enums)

- Éviter la sur-dérivation “wizard”.
- Encadrer les edges d’inférence (ordre de props).
- Maintenir la politique “pas d’enum TS” dans ce codebase.

### 8) Transposition immédiate au code actuel

- Les gains rapides ne sont pas des refactors massifs, mais des conventions stables + adoption ciblée.
- Les zones à fort ROI: wrappers UI, maps statiques, helpers génériques, typing d’events, modélisation d’états.

## Recommandations priorisées pour `web-client`

### Priorité P0 (immédiat, faible risque)

1. **Formaliser convention `type`/`interface`**
   - `type` par défaut.
   - `interface` pour héritage objet explicite.

2. **Décision explicite sur `React.FC`**
   - Le conserver est acceptable (42 usages existants).
   - Éviter les migrations cosmétiques massives.

3. **Standardiser `ReactNode` pour slots/children**
   - Especially dans composants layout et sections marketing.

### Priorité P1 (court terme, ROI élevé)

4. **Introduire `ComponentProps*` sur wrappers UI clés**
   - Cible: composants bouton/input/wrappers formulaires.

5. **Étendre l’usage de `satisfies` pour maps/configs**
   - Cible: routes internes, paramètres filtrage, mapping labels/couleurs.

6. **Créer un helper `objectKeys` typé**
   - Réduire les casts `keyof` dispersés.

### Priorité P2 (moyen terme, cadrage architecture)

7. **Lancer un pilote `Extract`/`Exclude`/`NoInfer`**
   - Sur un module avec unions discriminées réelles.

8. **Revue `tsconfig` guidée par check-list**
   - Évaluer `noUncheckedIndexedAccess`, `noImplicitOverride`, `verbatimModuleSyntax`.
   - Décider explicitement de la stratégie imports pour contextes non-Next.

9. **Décider la stratégie derive vs decouple par couche**
   - UI et contrats externes découplés,
   - types internes dérivés quand la stabilité est garantie.

## Plan d’adoption proposé (30/60/90 jours)

### J+30
- Écrire conventions TS/React (2 pages max).
- Valider politique `React.FC`.
- Ajouter snippets standards (`satisfies`, `ReactNode`, `Array[number]`, `objectKeys`).

### J+60
- Migrer 5 à 10 composants wrappers vers `ComponentProps*`.
- Introduire `satisfies` sur 3 maps/configs structurantes.
- Ajouter 1 à 2 tests type-level sur helpers critiques.

### J+90
- Piloter `Extract`/`Exclude`/`NoInfer` sur un domaine concret.
- Revue `tsconfig` avec plan de migration par flag.
- Évaluer impact: bugs de typing, lisibilité PR, vitesse de review.

## Annexes

### A) Tableau récapitulatif des 30 articles

| # | Slug | Thème principal | Applicabilité `web-client` |
|---:|---|---|---|
| 1 | `type-vs-interface-which-should-you-use` | Convention de modélisation | Élevée |
| 2 | `erasable-syntax-only` | Politique syntaxe TS | Moyenne |
| 3 | `get-the-type-of-an-array-element` | Indexed access + dérivation | Élevée |
| 4 | `why-i-dont-like-typescript-enums` | Anti-enum | Élevée |
| 5 | `property-order-matters` | Edge cases d’inférence | Moyenne |
| 6 | `deriving-vs-decoupling` | Architecture type-level | Élevée |
| 7 | `noinfer` | Contrôle d’inférence | Moyenne |
| 8 | `type-predicate-inference` | Narrowing TS 5.5 | Moyenne/Élevée |
| 9 | `type-safe-children-in-react-and-typescript` | Limites `children` | Élevée |
| 10 | `make-your-functions-more-reusable-with-generics` | Génériques pragmatiques | Élevée |
| 11 | `the-typescript-5-3-feature-they-didn-t-tell-you-about` | Readonly + const infer | Élevée |
| 12 | `event-types-in-react-and-typescript` | Typing events React | Élevée |
| 13 | `relative-import-paths-need-explicit-file-extensions-in-ecmascript-imports` | Résolution ESM | Moyenne |
| 14 | `tsconfig-cheat-sheet` | Baseline config TS | Élevée |
| 15 | `react-props-typescript` | Typage props React | Élevée |
| 16 | `how-to-use-satisfies-operator` | Usages pratiques `satisfies` | Élevée |
| 17 | `uses-for-extract-type-helper` | Filtrage positif unions | Moyenne |
| 18 | `no-such-thing-as-a-generic` | Terminologie génériques | Moyenne |
| 19 | `typescript-generics-in-three-easy-patterns` | Patterns génériques | Élevée |
| 20 | `iterate-over-object-keys-in-typescript` | Keys typing pragmatique | Élevée |
| 21 | `four-essential-typescript-patterns` | Patterns avancés essentiels | Moyenne |
| 22 | `optional-chaining-for-assignments` | Veille langage JS/TS | Faible/Moyenne |
| 23 | `typescript-5-2-new-keyword-using` | Lifecycle ressources | Faible/Moyenne |
| 24 | `you-can-stop-hating-react-fc` | Position `React.FC` moderne | Élevée |
| 25 | `jsx-element-vs-react-reactnode` | Contrats de rendu React | Élevée |
| 26 | `react-component-props-type-helper` | Réutilisation props | Élevée |
| 27 | `uses-for-exclude-type-helper` | Filtrage négatif unions | Moyenne |
| 28 | `discriminated-unions-are-a-devs-best-friend` | États UI robustes | Très élevée |
| 29 | `clarifying-the-satisfies-operator` | Modèle mental `satisfies` | Élevée |
| 30 | `mental-model-for-typescript-generics` | Fondations génériques | Élevée |

### B) Glossaire rapide TS/React

- **Type Parameter**: variable de type déclarée dans une signature générique (`<T>`).
- **Type Argument**: type fourni (explicitement ou inféré) pour un parameter.
- **Discriminated Union**: union d’objets partageant un discriminant (`status`, `type`, `kind`).
- **Narrowing**: réduction d’un type large vers un sous-type selon un test.
- **Type Predicate**: signature `value is X` pour guider le narrowing.
- **`satisfies`**: vérifie une forme cible sans élargir excessivement l’inférence de la valeur.
- **`ReactNode`**: ensemble des valeurs rendables par React.
- **`ComponentProps`**: extraction de props d’un élément/composant React.

### C) Liens officiels complémentaires

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TypeScript Utility Types: https://www.typescriptlang.org/docs/handbook/utility-types.html
- TSConfig Reference: https://www.typescriptlang.org/tsconfig
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Node.js TypeScript docs: https://nodejs.org/api/typescript.html

### D) Sources analysées (30 liens)

1. https://www.totaltypescript.com/type-vs-interface-which-should-you-use
2. https://www.totaltypescript.com/erasable-syntax-only
3. https://www.totaltypescript.com/get-the-type-of-an-array-element
4. https://www.totaltypescript.com/why-i-dont-like-typescript-enums
5. https://www.totaltypescript.com/property-order-matters
6. https://www.totaltypescript.com/deriving-vs-decoupling
7. https://www.totaltypescript.com/noinfer
8. https://www.totaltypescript.com/type-predicate-inference
9. https://www.totaltypescript.com/type-safe-children-in-react-and-typescript
10. https://www.totaltypescript.com/make-your-functions-more-reusable-with-generics
11. https://www.totaltypescript.com/the-typescript-5-3-feature-they-didn-t-tell-you-about
12. https://www.totaltypescript.com/event-types-in-react-and-typescript
13. https://www.totaltypescript.com/relative-import-paths-need-explicit-file-extensions-in-ecmascript-imports
14. https://www.totaltypescript.com/tsconfig-cheat-sheet
15. https://www.totaltypescript.com/react-props-typescript
16. https://www.totaltypescript.com/how-to-use-satisfies-operator
17. https://www.totaltypescript.com/uses-for-extract-type-helper
18. https://www.totaltypescript.com/no-such-thing-as-a-generic
19. https://www.totaltypescript.com/typescript-generics-in-three-easy-patterns
20. https://www.totaltypescript.com/iterate-over-object-keys-in-typescript
21. https://www.totaltypescript.com/four-essential-typescript-patterns
22. https://www.totaltypescript.com/optional-chaining-for-assignments
23. https://www.totaltypescript.com/typescript-5-2-new-keyword-using
24. https://www.totaltypescript.com/you-can-stop-hating-react-fc
25. https://www.totaltypescript.com/jsx-element-vs-react-reactnode
26. https://www.totaltypescript.com/react-component-props-type-helper
27. https://www.totaltypescript.com/uses-for-exclude-type-helper
28. https://www.totaltypescript.com/discriminated-unions-are-a-devs-best-friend
29. https://www.totaltypescript.com/clarifying-the-satisfies-operator
30. https://www.totaltypescript.com/mental-model-for-typescript-generics

## Annexe UX/UI 2026: Mega Menu (Light/Dark) avec Base UI

### Référence ajoutée

- Base UI Menubar: https://base-ui.com/react/components/menubar

### Vérification des composants déjà existants dans les packages parents

Les primitives nécessaires existent déjà dans `../../packages/core`:

- `../../packages/core/src/shared/ui/base/menubar.tsx`
- `../../packages/core/src/shared/ui/base/menu.tsx`
- `../../packages/core/src/shared/ui/base/navigation-menu.tsx`
- Exports publics: `../../packages/core/src/shared/ui/index.ts`

Conclusion: pas besoin d’ajouter une nouvelle dépendance UI pour refactoriser le mega menu du web-client.

### Mapping recommandé pour le Header/MegaMenu actuel

Contexte actuel:

- Header: `src/components/layout/header.tsx`
- Mega menu panel: `src/components/layout/mega-menu.tsx`
- Cards menu: `src/components/ui/category-card.tsx`

Cible Base UI:

- `NavigationMenu` (Root/List/Item/Trigger) pour la navigation desktop.
- `NavigationMenuBackdrop` pour la couche de fond (fermeture outside + lisibilité).
- `NavigationMenuPopup` ou panel custom piloté par la valeur active du Root.
- `Menu`/`Menubar` pour les menus compacts contextuels (pas le mega panel principal).

### Pattern d’interaction recommandé (best-in-class)

- Ouverture hover/focus avec délai court (`delay` ~80ms).
- Fermeture avec délai légèrement supérieur (`closeDelay` ~140-220ms).
- Fermeture robuste: `Escape`, click outside, `focusOut`.
- Focus ring visible (WCAG 2.2) sur triggers et liens.
- Une seule zone visuelle dominante dans le panel (featured), le reste en liens hiérarchisés.

### Recommandations light/dark spécifiques

- Éviter une simple transparence `bg-background/75` pour le panneau principal.
- Introduire des tokens dédiés menu:
  - `--menu-surface`
  - `--menu-border`
  - `--menu-shadow`
  - `--menu-item-hover`
  - `--menu-focus`
- Dark mode: surface d’overlay distincte du fond page pour une vraie élévation perceptible.
- Uniformiser les overlays d’images dans `CategoryCard` pour garantir le contraste texte.

### Plan d’implémentation proposé

1. Migrer la logique d’ouverture du header vers la state machine de `NavigationMenu` (au lieu des handlers manuels).
2. Conserver `MegaMenu` comme contenu, mais retirer la responsabilité de positionnement absolu.
3. Déplacer backdrop/positioning vers les primitives Base UI du root menu.
4. Ajouter les tokens de surface menu pour harmoniser light/dark.
5. Vérifier clavier + lecteur d’écran + contrastes (AA minimum).
