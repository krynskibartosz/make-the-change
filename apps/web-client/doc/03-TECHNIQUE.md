# Make the Change - Reference Technique Web Client

> Source technique pour les Gems.
> Perimetre strict: `apps/web-client`.
> Ce document decrit l'architecture actuelle et les points d'attention pour les refactorings futurs.

---

## 1. Resume

`apps/web-client` est l'application cliente active de Make the Change.

Caracteristiques actuelles:

- Next.js App Router;
- TypeScript strict;
- React 19;
- Tailwind CSS v4;
- next-intl;
- mock-first avec bascule Supabase partielle;
- Stripe partiel;
- UI mobile-first;
- route groups: `(auth)`, `(tabs)`, `(screens)`, `(site)`, `(lab)`, `@modal`.

La source produit de verite pour les Gems est `apps/web-client/doc`, pas les anciennes documentations globales.

## 2. Stack

| Couche      | Technologie                   |
| ----------- | ----------------------------- |
| Framework   | Next.js 16                    |
| Langage     | TypeScript                    |
| UI          | React 19                      |
| Styling     | Tailwind CSS v4 + CSS imports |
| i18n        | next-intl                     |
| Forms       | react-hook-form + Zod         |
| Auth/data   | Supabase SSR partiel          |
| Paiement    | Stripe                        |
| Animation   | Framer Motion, GSAP, Lenis    |
| Icons       | lucide-react                  |
| UI headless | Base UI via package core      |

Fichiers importants:

- `package.json`
- `next.config.js`
- `src/app/globals.css`
- `src/i18n/routing.ts`
- `src/lib/mock/data-source.ts`

## 3. Mode Donnees

Le code utilise une bascule:

```env
NEXT_PUBLIC_MTC_DATA_SOURCE=mock
NEXT_PUBLIC_MTC_DATA_SOURCE=supabase
```

Fichier:

```ts
src / lib / mock / data - source.ts;
```

Regle:

- `mock` est le mode par defaut;
- `supabase` est partiel;
- les Gems ne doivent pas supposer que la base reelle couvre deja toute la cible produit.

## 4. Route Groups

### 4.1 `(tabs)`

Routes principales mobiles:

- `/challenges`
- `/projects`
- `/impact`
- `/products`
- `/profile`

Composant nav:

- `src/app/[locale]/(tabs)/_components/mobile-bottom-nav.tsx`

Cible produit:

- remplacer conceptuellement `challenges` par `Aventure`;
- la route peut evoluer plus tard vers `/adventure` ou `/aventure`;
- ne pas faire ce renommage sans decision technique explicite.

### 4.2 `(screens)`

Ecrans immersifs:

- challenges detail;
- onboarding;
- profile subpages;
- project detail;
- donate/invest flows;
- impact reward/sanctuary.

Role:

- pages plein ecran;
- parcours specifiques;
- souvent sans navigation basse.

### 4.3 `(lab)`

Labs importants:

- `academy`;
- `kinnu`;
- `kinnu-v2`;
- `ecosysteme`;
- `brand-guidelines`;
- `appearance`.

Attention:

- ces labs ne sont pas forcement experimentaux a long terme;
- l'Academy est validee comme brique produit importante;
- le code peut encore etre prototype, volumineux ou client-only.

### 4.4 `(site)`

Pages publiques:

- home;
- about;
- blog;
- contact;
- faq;
- privacy;
- producers.

Role:

- acquisition;
- information;
- SEO;
- confiance.

### 4.5 `(auth)` Et `@modal`

Routes auth:

- login;
- register;
- forgot-password;
- modales paralleles.

Onboarding/faction:

- carousel mascottes dans `(auth)/_features/faction-carousel.tsx`;
- setup mock dans `(screens)/onboarding/setup`.

## 5. Donnees Mock Principales

Les mocks sont structurants et doivent etre traites comme le prototype vivant.

Fichiers cles:

- `src/lib/mock/mock-biodex.ts`
- `src/lib/mock/mock-challenges.ts`
- `src/lib/mock/mock-factions.ts`
- `src/lib/mock/mock-member-data.ts`
- `src/lib/mock/mock-session.ts`
- `src/lib/mock/mock-viewer.ts`
- `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts`
- `src/app/[locale]/(tabs)/products/_features/mock-products.ts`

Ces fichiers contiennent souvent plus de verite produit recente que les anciennes docs globales.

## 6. Services Et API Internes

Services:

- `src/lib/api/species-context.service.ts`
- `src/lib/api/biodex-preview.service.ts`
- `src/app/[locale]/(tabs)/projects/_features/get-projects.ts`
- `src/app/[locale]/(tabs)/products/_features/get-products.ts`

API routes:

- `src/app/api/projects/route.ts`
- `src/app/api/projects/featured/route.ts`
- `src/app/api/products/route.ts`
- `src/app/api/partners/route.ts`
- `src/app/api/payments/create-intent/route.ts`
- `src/app/api/payments/mobile-sheet/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/api/revalidate/route.ts`

## 7. Paiements

Actuel:

- Stripe est present;
- PaymentIntent utilise pour soutien/don;
- webhooks Stripe existent;
- l'integration finale dependra du modele donnees cible.

Regles produit a preserver:

- don pur -> Graines, pas Points d'Impact;
- soutien producteur -> Points d'Impact;
- achat produit -> euros ou Points d'Impact;
- abonnement Ambassadeur -> budget de soutien, pas Points gratuits.

## 8. Supabase

Actuel:

- clients Supabase: `src/lib/supabase/*`;
- usage partiel dans actions et services;
- routes et services gardent souvent un chemin mock.

Attention:

- ne pas supposer que les noms de tables actuels sont definitifs;
- ne pas faire de refactoring lourd DB depuis les docs Gems sans audit technique separe;
- le web-client doit documenter ses contrats de donnees avant de figer le schema.

## 9. i18n

Actuel:

- routing via `next-intl`;
- locales importees depuis `@make-the-change/core/i18n`;
- routes sous `[locale]`.

Cible contenu:

- francais comme langue de travail;
- anglais et neerlandais a garder en preparation;
- eviter les textes hardcodes dans les nouvelles features lorsque cela devient production-ready.

## 10. Design Technique

Actuel:

- Tailwind v4;
- imports CSS globaux;
- `@make-the-change/core/css`;
- themes client;
- beaucoup de classes Tailwind directes dans les ecrans.

Points de vigilance:

- ne pas refactorer le design system global hors `web-client` sans demande explicite;
- les labs peuvent contenir des patterns visuels utiles;
- le hub Aventure doit probablement extraire des composants reutilisables, mais sans sur-abstraction prematuree.

## 11. Dettes Techniques Observees

| Dette                                                                   | Impact                            |
| ----------------------------------------------------------------------- | --------------------------------- |
| `ignoreBuildErrors: true` dans `next.config.js`                         | risque production                 |
| gros fichiers mock                                                      | difficile a maintenir             |
| gros ecrans Academy / flows projets                                     | refactoring progressif necessaire |
| ancien nom `Artisans Locaux` encore present dans certains types/actions | incoherence faction               |
| melange mock/supabase                                                   | source de confusion               |
| routes actuelles pas encore alignees avec `Aventure` cible              | migration a planifier             |

## 12. Regle Pour Les Gems Tech

Quand un Gem technique travaille sur `web-client`, il doit distinguer:

- **prototype actuel**: ce qui existe dans les routes et mocks;
- **cible produit**: ce qui est valide dans les docs;
- **migration**: ce qu'il faut changer sans casser le prototype.

Il ne doit pas prendre les anciennes docs globales comme source de verite.
