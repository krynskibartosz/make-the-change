# P0-9 — Stripe : paiement réel, prototype ou hybride ?

**Objectif :** clarifier le statut réel de Stripe dans le projet, sans modifier le code.

**Contraintes :**
- Ne modifie pas le code applicatif.
- Ne modifie pas les mocks.
- Ne modifie pas Supabase.
- Ne modifie pas les routes.
- Ne modifie pas les metadata Stripe.
- Travaille uniquement dans la documentation.

---

## 1. Contexte déjà validé

- Don pur = Graines, pas Credits Impact.
- Soutien producteur = Credits Impact, éventuellement bonus symbolique en Graines.
- Achat produit = produit / boutique, ne crée pas d'impact direct seul.
- `investment` est legacy et doit migrer plus tard vers `producer_support`.
- `points` est legacy et doit migrer plus tard selon les cas vers `impact_credits`, Graines, score, etc.
- Supabase actuel = legacy V0 à ne pas toucher.
- Mocks = source prototype.
- La preuve d'impact doit être prudente.
- Ne pas promettre "impact validé", "reçu fiscal", ou équivalent sans base robuste.

---

## 2. Analyse des routes API Stripe

### 2.1 Initialisation Stripe

**Fichier :** `src/lib/stripe.ts`

```typescript
export function getStripe() {
  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(apiKey, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  return stripeSingleton
}
```

**Statut :** `[ACTUEL_CODE] [REEL]` - Stripe est réellement initialisé avec une clé API. Si `STRIPE_SECRET_KEY` n'est pas set, l'application crash.

---

### 2.2 Route create-intent

**Fichier :** `src/app/api/payments/create-intent/route.ts`

**Metadata actuelles :**
```typescript
metadata: z.object({
  order_type: z.enum(['investment', 'product_purchase', 'subscription']).optional(),
  reference_id: z.string().uuid().optional(),
  points_used: z.number().int().nonnegative().optional(),
})
```

**Flux :**
1. Vérifie l'authentification utilisateur
2. Récupère ou crée un Stripe customer via Supabase profiles
3. Crée un PaymentIntent avec metadata whitelistées
4. Retourne le client_secret

**Statut :** `[ACTUEL_CODE] [REEL]` - Route fonctionnelle avec Stripe réel.

**Metadata actuelles :** `[ACTUEL_CODE] [LEGACY]` - `order_type` utilise 'investment', 'product_purchase', 'subscription' mais pas 'donation' ni 'producer_support'.

**Incohérence :** `[ACTUEL_CODE] [PARTIEL]` - Le schema n'accepte pas 'donation' alors que le flow donation l'utilise.

---

### 2.3 Route mobile-sheet

**Fichier :** `src/app/api/payments/mobile-sheet/route.ts`

**Metadata :** Identiques à create-intent.

**Flux :**
1. Identique à create-intent
2. Crée en plus une ephemeral key pour mobile (Stripe mobile SDK)

**Statut :** `[ACTUEL_CODE] [REEL]` - Route fonctionnelle avec Stripe réel pour mobile.

**Metadata :** `[ACTUEL_CODE] [LEGACY]` - Même problème que create-intent.

---

### 2.4 Webhook Stripe

**Fichier :** `src/app/api/webhooks/stripe/route.ts`

**Événements gérés :**
- `payment_intent.succeeded` - Appelle RPC `handle_payment_intent_succeeded`
- `payment_intent.payment_failed` - Log uniquement
- `charge.refunded` - Log uniquement, logique non implémentée

**Statut :** `[ACTUEL_CODE] [PARTIEL]` - Webhook fonctionnel mais logique de remboursement incomplète.

---

## 3. Analyse des flows de paiement

### 3.1 Flow donation

**Fichier :** `src/app/[locale]/(screens)/projects/[slug]/donate/_actions/create-donation.action.ts`

**Architecture :** `[ACTUEL_CODE] [PARTIEL] [RISQUE]` - Ce flow crée directement un PaymentIntent Stripe via `stripe.paymentIntents.create()` SANS passer par la route `api/payments/create-intent`. C'est une divergence d'architecture.

**Metadata Stripe :**
```typescript
metadata: {
  order_type: 'donation',
  reference_id: created.id,
  user_id: user.id,
}
```

**Flux :**
1. Crée un enregistrement dans `donations` table avec status 'pending'
2. Crée un PaymentIntent Stripe avec `order_type: 'donation'`
3. Retourne client_secret

**Statut :** `[ACTUEL_CODE] [REEL]` - Flow donation avec Stripe réel.

**Note :** `[ACTUEL_CODE] [PARTIEL] [RISQUE]` - Le flow donation utilise `order_type: 'donation'` mais le schema de `create-intent` n'accepte que 'investment', 'product_purchase', 'subscription'. Il y a une incohérence à corriger plus tard.

---

### 3.2 Flow invest / support legacy

**Fichier :** `src/app/[locale]/(screens)/projects/[slug]/invest/_actions/create-investment.action.ts`

**Architecture :** `[ACTUEL_CODE] [PARTIEL] [RISQUE]` - Ce flow crée directement un PaymentIntent Stripe via `stripe.paymentIntents.create()` SANS passer par la route `api/payments/create-intent`. Même divergence que le flow donation.

**Metadata Stripe :**
```typescript
metadata: {
  order_type: 'investment',
  reference_id: created.id,
  user_id: user.id,
  // No points_used for investment flow usually
}
```

**Flux :**
1. Calcule les points via `investment.calculateInvestmentPoints`
2. Crée un enregistrement dans `investments` table avec status 'pending'
3. Crée un PaymentIntent Stripe avec `order_type: 'investment'`
4. Retourne client_secret

**Statut :** `[ACTUEL_CODE] [REEL] [LEGACY]` - Flow invest avec Stripe réel, mais le nom métier `investment` est legacy et devra migrer vers `producer_support`.

**Terme :** `[ACTUEL_CODE] [LEGACY]` - Utilise le terme legacy 'investment' au lieu de 'producer_support'.

**Monnaie :** `[ACTUEL_CODE] [LEGACY]` - Utilise 'points' au lieu de 'Credits Impact' dans les calculs et la table investments.

---

### 3.3 Flow produit / boutique

**Fichier :** `src/app/[locale]/(screens)/products/[id]/_features/product-fiat-checkout-view.tsx`

**Code :**
```typescript
const handlePayment = (method: PaymentMethod) => {
  setActiveMethod(method)
  setPaymentState('processing')
  // Simule le temps de réponse Stripe / Apple Pay
  setTimeout(() => {
    setPaymentState('success')
  }, 1500)
}
```

**Statut :** `[ACTUEL_CODE] [SIMULE] [RISQUE]` - Flow produit est SIMULÉ avec setTimeout 1500ms, PAS de Stripe réel.

**UI :** `[ACTUEL_CODE] [RISQUE]` - Affiche "Paiement sécurisé par Stripe" mais ne l'utilise pas réellement.

**Récompense :** `[ACTUEL_CODE] [RISQUE]` - Affiche "Credits Impact gagnés" sans créer de transaction réelle.

**Risque :** `[RISQUE]` - L'utilisateur pense payer réellement mais c'est une simulation.

---

## 4. Metadata Stripe actuelles vs cibles

### 4.1 Metadata actuelles

| order_type | Utilisé dans | Statut |
|---|---|---|
| `donation` | create-donation.action.ts | `[ACTUEL_CODE]` mais absent du schema create-intent |
| `investment` | create-investment.action.ts, schema create-intent | `[ACTUEL_CODE] [A_MIGRER_PLUS_TARD]` |
| `product_purchase` | schema create-intent | `[ACTUEL_CODE] [PARTIEL]` non utilisé dans flows |
| `subscription` | schema create-intent | `[ACTUEL_CODE] [PARTIEL]` non utilisé dans flows |
| `producer_support` | Aucun | `[CIBLE_VALIDEE] [A_MIGRER_PLUS_TARD]` |

### 4.2 Metadata cibles selon P0-1

| order_type | Statut cible | Remplace |
|---|---|---|
| `donation` | `[CIBLE_VALIDEE]` | `donation` (déjà utilisé) |
| `producer_support` | `[CIBLE_VALIDEE]` | `investment` (legacy) |
| `product_purchase` | `[CIBLE_VALIDEE]` | `product_purchase` (déjà dans schema) |
| `subscription` | `[PLUS_TARD]` | `subscription` (abonnement Ambassadeur) |

---

## 5. Classification des zones

### `[ACTUEL_CODE] [HYBRIDE]`

- Stripe est présent et utilisé réellement par certains flows, mais l'intégration paiement n'est pas encore complète ni homogène.

### `[ACTUEL_CODE] [REEL]`

- Initialisation Stripe (getStripe)
- Route create-intent
- Route mobile-sheet
- Flow donation (create-donation.action.ts) - crée réellement un PaymentIntent Stripe
- Flow invest (create-investment.action.ts) - crée réellement un PaymentIntent Stripe

### `[ACTUEL_CODE] [LEGACY]`

- Flow invest utilise Stripe réellement, mais le nom métier `investment` est legacy et devra migrer vers `producer_support`
- `order_type: 'investment'` - doit migrer vers 'producer_support'
- `points_used` dans metadata Stripe - champ cible à clarifier selon migration `impact_credits`
- Table `investments` - doit migrer vers `producer_support` (ou rester avec mapping)

### `[ACTUEL_CODE] [SIMULE] [RISQUE]`

- Flow produit (product-fiat-checkout-view.tsx) - setTimeout 1500ms, pas de Stripe réel, mais affiche "Paiement sécurisé par Stripe"

### `[ACTUEL_CODE] [PARTIEL]`

- Webhook Stripe (logique de remboursement incomplète)
- Schema create-intent (ne couvre pas 'donation' utilisé en pratique)
- Alignement metadata
- Abonnements
- Achats produits

### `[ACTUEL_CODE] [PARTIEL] [RISQUE]` - divergence architecture

- Flow donation et flow invest créent directement des PaymentIntents Stripe sans passer par la route `api/payments/create-intent`

### `[ACTUEL_CODE] [PARTIEL] [RISQUE]` - schema incomplet

- Le schema de `create-intent` n'accepte pas 'donation' alors que le flow donation l'utilise

### `[A_DECIDER]`

- Logique de remboursement dans webhook (non implémentée)
- Gestion des erreurs Stripe côté client
- Fallback si Stripe échoue

### `[A_MIGRER_PLUS_TARD]`

- Migration `order_type: 'investment'` vers `producer_support`
- Migration `points_used` vers champ cible à clarifier selon migration `impact_credits`
- Implémentation réelle du flow produit avec Stripe
- Implémentation logique remboursement webhook
- Correction de la divergence d'architecture (harmoniser les flows pour passer par create-intent)

---

## 6. Réponses aux questions

### 1. Stripe est-il réellement branché ?

`[OUI]` `[ACTUEL_CODE] [REEL]` Stripe est réellement branché via `STRIPE_SECRET_KEY`. Si la clé n'est pas set, l'application crash.

### 2. Quels flows utilisent Stripe réellement ?

`[ACTUEL_CODE] [REEL]` :
- Flow donation (create-donation.action.ts)
- Flow invest (create-investment.action.ts)

### 3. Quels flows sont encore simulés ?

`[ACTUEL_CODE] [SIMULE] [RISQUE]` :
- Flow produit (product-fiat-checkout-view.tsx) - setTimeout 1500ms

### 4. Quels `order_type` existent actuellement ?

- `donation` - utilisé dans flow donation
- `investment` - utilisé dans flow invest et schema create-intent
- `product_purchase` - dans schema create-intent mais non utilisé
- `subscription` - dans schema create-intent mais non utilisé

### 5. Quels `order_type` devraient exister dans la cible ?

- `donation` - `[CIBLE_VALIDEE]`
- `producer_support` - `[CIBLE_VALIDEE]` (remplace `investment`)
- `product_purchase` - `[CIBLE_VALIDEE]`
- `subscription` - `[PLUS_TARD]` (abonnement Ambassadeur)

### 6. Les donations sont-elles vraiment couvertes par `create-intent` ?

`[NON]` `[ACTUEL_CODE] [PARTIEL] [RISQUE]` `create-intent` n'accepte pas `order_type: 'donation'` dans son schema (seulement 'investment', 'product_purchase', 'subscription'). Pourtant le flow donation utilise ce metadata. Il y a une incohérence à corriger plus tard.

### 7. Les soutiens producteurs sont-ils couverts ?

`[PARTIELLEMENT]` `[ACTUEL_CODE] [REEL] [LEGACY]` Le flow invest utilise `order_type: 'investment'` qui est legacy. Il devrait migrer vers `producer_support`.

### 8. Les achats produits sont-ils couverts ?

`[NON]` `[ACTUEL_CODE] [SIMULE] [RISQUE]` Le flow produit est simulé (setTimeout), pas de Stripe réel. Le schema create-intent accepte `product_purchase` mais ce n'est pas utilisé.

### 9. Les abonnements sont-ils présents ou non ?

`[NON]` Les abonnements ne sont pas implémentés. Le schema create-intent accepte `subscription` mais ce n'est pas utilisé.

### 10. Les webhooks sont-ils complets ou partiels ?

`[PARTIELS]` `[ACTUEL_CODE] [PARTIEL]` - `payment_intent.succeeded` est géré via RPC Supabase. `payment_intent.payment_failed` et `charge.refunded` sont seulement loggés. La logique de remboursement n'est pas implémentée.

### 11. Les metadata sont-elles alignées avec P0-1 ?

`[NON]` - Les metadata utilisent 'investment' au lieu de 'producer_support'. Elles utilisent aussi `points_used`, dont le champ cible reste à clarifier selon la migration `impact_credits`.

### 12. Les reçus / confirmations sont-ils fiables ?

`[PARTIELLEMENT]` - Le webhook gère le succès via RPC Supabase, mais la logique de remboursement est manquante. Le flow produit simulé affiche un faux reçu.

### 13. Y a-t-il des termes à risque ?

`[OUI]` :
- `investment` - terme legacy juridique/financier
- `points` - terme legacy ambigu
- "Paiement sécurisé par Stripe" dans flow produit simulé - trompeur
- "Credits Impact gagnés" dans flow produit simulé - trompeur

### 14. Que faut-il documenter comme réel, prototype ou hybride ?

`[ACTUEL_CODE] [HYBRIDE]` : Stripe est techniquement réel et fonctionnel pour donation et invest, mais l'intégration n'est pas complète ni homogène.

`[ACTUEL_CODE] [REEL]` : Les flows donation et invest créent réellement des PaymentIntents Stripe.

`[ACTUEL_CODE] [SIMULE] [RISQUE]` : Le flow produit est simulé et ne doit pas être présenté comme paiement Stripe réel.

`[ACTUEL_CODE] [PARTIEL] [RISQUE]` : Les flows donation et invest ne passent pas par la route create-intent.

---

## 7. Doctrine cible recommandée

### 7.1 Statut de Stripe

`[CIBLE_VALIDEE]` Les flows paiement cibles doivent être séparés clairement :
- `donation` - pour les dons purs
- `producer_support` - pour les soutiens producteurs
- `product_purchase` - pour les achats produits
- `subscription` - pour les abonnements Ambassadeur (plus tard)

`[CIBLE_VALIDEE]` Les reçus doivent être appelés "reçu de paiement" ou "reçu de contribution", pas "reçu fiscal" sans validation légale.

`[CIBLE_VALIDEE]` Paiement validé ne veut pas dire impact mesuré.

`[CIBLE_VALIDEE]` Les écrans de succès doivent rester prudents sur l'impact.

### 7.2 État code confirmé

`[ACTUEL_CODE] [REEL]` Donation utilise Stripe réellement (crée un PaymentIntent Stripe).

`[ACTUEL_CODE] [REEL] [LEGACY]` Invest utilise Stripe réellement mais avec metadata legacy `investment`.

`[ACTUEL_CODE] [SIMULE] [RISQUE]` Produit est simulé (setTimeout) et ne doit pas être présenté comme paiement Stripe réel.

`[ACTUEL_CODE] [PARTIEL]` Webhook partiel (logique de remboursement non implémentée).

`[ACTUEL_CODE] [PARTIEL] [RISQUE]` Les flows donation et invest ne passent pas par la route create-intent.

### 7.3 Migration progressive

`[A_MIGRER_PLUS_TARD]` `investment` -> `producer_support` (metadata Stripe)

`[A_MIGRER_PLUS_TARD]` `points_used` -> champ cible à clarifier selon migration `impact_credits`

`[A_MIGRER_PLUS_TARD]` flow produit simulé -> Stripe réel

`[A_MIGRER_PLUS_TARD]` webhooks remboursement / post-paiement

`[A_MIGRER_PLUS_TARD]` correction de la divergence d'architecture (harmoniser les flows pour passer par create-intent)

---

## 8. Risques principaux

### `[RISQUE]` Juridique

- Utilisation du terme "investment" dans metadata Stripe peut être interprété comme un investissement financier.
- Flow produit simulé affiche "Paiement sécurisé par Stripe" mais ne l'utilise pas.
- Faux reçu affiché dans flow produit simulé.

### `[RISQUE]` UX

- Incohérence entre schema create-intent et flows réels.
- Flow produit donne l'impression d'un paiement réel alors que c'est une simulation.
- Utilisateurs peuvent penser avoir payé réellement dans le flow produit.

### `[RISQUE]` Technique

- Logique de remboursement non implémentée dans webhook.
- Schema create-intent ne couvre pas 'donation' utilisé en pratique.
- Migration metadata risquée si mal planifiée.

---

## 9. Décisions validées maintenant

`[CIBLE_VALIDEE]` Les flows paiement cibles doivent être séparés clairement : `donation`, `producer_support`, `product_purchase`, `subscription` plus tard.

`[CIBLE_VALIDEE]` Les reçus doivent être appelés "reçu de paiement" ou "reçu de contribution", pas "reçu fiscal" sans validation légale.

`[CIBLE_VALIDEE]` Paiement validé ne veut pas dire impact mesuré.

`[CIBLE_VALIDEE]` Les écrans de succès doivent rester prudents sur l'impact.

---

## 10. État code confirmé

`[ACTUEL_CODE] [REEL]` Donation utilise Stripe réellement (crée un PaymentIntent Stripe).

`[ACTUEL_CODE] [REEL] [LEGACY]` Invest utilise Stripe réellement mais avec metadata legacy `investment`.

`[ACTUEL_CODE] [SIMULE] [RISQUE]` Produit est simulé (setTimeout) et ne doit pas être présenté comme paiement Stripe réel.

`[ACTUEL_CODE] [PARTIEL]` Webhook partiel (logique de remboursement non implémentée).

`[ACTUEL_CODE] [PARTIEL] [RISQUE]` Les flows donation et invest ne passent pas par la route create-intent.

---

## 11. Éléments encore à décider

`[A_DECIDER]` Timing exact de la migration metadata Stripe.

`[A_DECIDER]` Stratégie de migration du flow produit vers Stripe réel.

`[A_DECIDER]` Implémentation de la logique de remboursement webhook.

`[A_DECIDER]` Gestion des données existantes avec metadata legacy.

`[A_DECIDER]` Stratégie pour harmoniser l'architecture (faire passer les flows par create-intent).

---

## 12. Recommandation de prochaine P0

P0-10 — Quelle est la source de vérité data à court terme ?
