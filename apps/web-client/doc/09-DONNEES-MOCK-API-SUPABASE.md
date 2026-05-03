# Make the Change - Donnees, Mocks, API et Supabase

> Source pour les Gems Tech, Data, Produit et QA.
> Perimetre: `apps/web-client`.

---

## 1. Resume

`web-client` est actuellement mock-first.

Cela signifie:

- les mocks representent le prototype produit vivant;
- Supabase est present mais partiel;
- les contrats de donnees cible ne sont pas tous figes;
- les Gems doivent separer "donnee actuelle" et "modele cible".

## 2. Bascule De Source

Fichier:

```ts
src / lib / mock / data - source.ts;
```

Variable:

```env
NEXT_PUBLIC_MTC_DATA_SOURCE=mock
NEXT_PUBLIC_MTC_DATA_SOURCE=supabase
```

Regle:

- `mock` par defaut;
- `supabase` si la valeur vaut explicitement `supabase`.

## 3. Mocks Structurants

| Fichier                                                       | Role                                       |
| ------------------------------------------------------------- | ------------------------------------------ |
| `src/lib/mock/mock-biodex.ts`                                 | especes, BioDex, contexte biodiversite     |
| `src/lib/mock/mock-challenges.ts`                             | challenges, missions, themes du jour       |
| `src/lib/mock/mock-factions.ts`                               | objectif collectif, contributions factions |
| `src/lib/mock/mock-member-data.ts`                            | profils et stats utilisateur               |
| `src/lib/mock/mock-session.ts`                                | session mock client                        |
| `src/lib/mock/mock-viewer.ts`                                 | viewer/profil courant                      |
| `src/lib/mock/mock-order-history.ts`                          | historique commandes                       |
| `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts` | projets                                    |
| `src/app/[locale]/(tabs)/products/_features/mock-products.ts` | produits                                   |

## 4. Concepts De Donnees Cible

### User / Profile

- identite;
- faction;
- avatar;
- soldes Graines / Points d'Impact;
- progression;
- historique;
- abonnement.

### Project

- type: don pur ou soutien producteur;
- producteur;
- localisation;
- objectif financier;
- impact attendu;
- espece principale;
- especes secondaires;
- produits associes si producteur.

### Donation

- projet;
- montant;
- Graines accordees;
- espece debloquee si liee;
- statut paiement.

### Producer Support

- projet producteur;
- montant;
- Points d'Impact accordes;
- bonus Graines eventuel;
- espece debloquee si liee.

### Product

- producteur;
- prix euros;
- cout Points d'Impact;
- stock ou disponibilite;
- projets/especes lies;
- mode fulfillment.

### Species / BioDex

- fiche publique;
- statut de conservation;
- image;
- projet lie;
- statut utilisateur;
- niveaux ou contenus debloques.

### Company / RSE

- entreprise;
- budget;
- projets finances;
- employes invites;
- campagnes;
- rapports.

## 5. Services Actuels

### Species

Fichiers:

- `src/lib/api/species-context.service.ts`
- `src/lib/api/biodex-preview.service.ts`

Role:

- lire les especes depuis mocks ou Supabase;
- mapper vers `SpeciesContext`;
- fournir la preview BioDex.

### Projects

Fichiers:

- `src/app/[locale]/(tabs)/projects/_features/get-projects.ts`
- `src/app/[locale]/(tabs)/projects/_features/mock-projects.ts`
- `src/app/[locale]/(tabs)/projects/_features/create-donation.action.ts`
- `src/app/[locale]/(tabs)/projects/_features/create-investment.action.ts`

Role:

- liste projets;
- filtres;
- creation de don/soutien;
- Stripe PaymentIntent;
- Supabase partiel.

### Products

Fichiers:

- `src/app/[locale]/(tabs)/products/_features/get-products.ts`
- `src/app/[locale]/(tabs)/products/_features/mock-products.ts`
- `src/app/[locale]/(tabs)/products/_api/product-context.service.ts`

Role:

- catalogue;
- filtres;
- detail produit;
- contexte projet/espece.

### Challenges

Fichiers:

- `src/lib/mock/mock-challenges.ts`
- `src/lib/mock/mock-challenge-progress.ts`
- `src/lib/mock/mock-challenge-progress-server.ts`
- `src/app/[locale]/(tabs)/challenges/_actions/quest.actions.ts`

Role:

- missions;
- progression;
- reclamation de recompenses.

### Adventure

Fichiers:

- `src/app/[locale]/(tabs)/adventure/page.tsx`
- `src/app/[locale]/(tabs)/adventure/_features/adventure-tab.tsx`

Role:

- agreger les donnees mock existantes;
- afficher la surface quotidienne principale;
- relier challenges, projets, BioDex, collectif et avantages;
- ne pas creer encore un modele de donnees separe si les sources existantes suffisent.

## 6. API Routes Actuelles

| Route                        | Role                 |
| ---------------------------- | -------------------- |
| `api/projects`               | projets              |
| `api/projects/featured`      | projets mis en avant |
| `api/products`               | produits             |
| `api/partners`               | partenaires          |
| `api/payments/create-intent` | paiement             |
| `api/payments/mobile-sheet`  | paiement mobile      |
| `api/webhooks/stripe`        | webhook Stripe       |
| `api/revalidate`             | revalidation         |

## 7. Supabase

Actuel:

- clients dans `src/lib/supabase`;
- actions auth/profil/projets utilisent parfois Supabase;
- vues/tables supposees dans certains services;
- pas encore source complete de verite produit.

Regle pour Gems:

- ne pas inventer un schema final depuis les appels actuels;
- documenter les besoins produit avant migration;
- garder les chemins mock fonctionnels tant que le prototype depend d'eux.

## 8. Stripe

Actuel:

- PaymentIntent pour donation/soutien;
- webhook Stripe;
- metadata utilisee pour identifier les references.

Cible:

- don pur;
- soutien producteur;
- achat produit;
- abonnement Ambassadeur;
- B2B/RSE plus tard.

Chaque flux doit clarifier:

- ce que l'utilisateur paye;
- quelle monnaie est accordee;
- quelle preuve d'impact est creee;
- quel objet est mis a jour.

## 9. Mocks Vs Cible

| Sujet      | Actuel                  | Cible                          |
| ---------- | ----------------------- | ------------------------------ |
| projets    | mock + Supabase partiel | contrats propres               |
| produits   | mock + services         | marketplace partenaire         |
| BioDex     | mock riche              | donnees validees + progression |
| Aventure   | agregation mock V0      | hub personnalise               |
| Academy    | contenu local/lab       | produit integre                |
| RSE        | peu/pas present         | modele B2B                     |
| abonnement | page/idee               | Ambassadeur avec budget        |

## 10. Risques

| Risque                               | Garde-fou                            |
| ------------------------------------ | ------------------------------------ |
| Supabase pris comme cible definitive | partir des docs produit              |
| mocks ignores                        | ils portent la vision recente        |
| Points crees sans producteur         | appliquer regles business            |
| don confondu avec soutien            | separer Donation et Producer Support |
| espece debloquee sans lien           | verifier projet-espece               |

## 11. Questions A Decider

- Schema donnees cible.
- Noms definitifs des entites.
- Representation du budget Ambassadeur.
- Representation des campagnes RSE.
- Source de verite pour les contenus BioDex.
