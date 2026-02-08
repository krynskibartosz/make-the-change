# Résumé complet — Playwright Test Agents pour apps/web-client

## 🎭 Ce que tu as maintenant

Après avoir lancé `npx playwright init-agents --loop=vscode`, ton repo est équipé de :

### Structure créée
```
apps/web-client/
├── .github/
│   └── agents/
│       ├── playwright-test-planner.agent.md
│       ├── playwright-test-generator.agent.md
│       └── playwright-test-healer.agent.md
├── specs/
│   └── README.md
├── tests/
└── seed.spec.ts
```

### Agents disponibles
1. **🎭 Planner** — Crée des plans de test en Markdown
2. **🎭 Generator** — Transforme les plans en tests Playwright exécutables  
3. **🎭 Healer** — Répare automatiquement les tests cassés

### Configuration VS Code
- **MCP Server** configuré pour communiquer avec les agents
- **Copilot** peut maintenant utiliser les agents Playwright

---

## 🚀 Workflow complet pour tes tests E2E

### Étape 1 : Planifier avec Planner Agent
Dans VS Code, ouvre un chat et demande :

```
Utilise le Planner Agent pour générer un plan de test complet pour le flow :
1. Login utilisateur (E2E_USER_EMAIL / E2E_USER_PASSWORD)
2. Navigation vers un produit spécifique
3. Ajout au panier
4. Processus de checkout complet
5. Retour dashboard

Le plan doit inclure :
- Toutes les étapes avec les sélecteurs recommandés
- Données de test attendues
- Assertions claires
- Gestion des erreurs potentielles
```

**Le Planner va créer** : `specs/checkout-complet.md`

### Étape 2 : Générer avec Generator Agent
Une fois le plan validé :

```
Utilise le Generator Agent pour transformer le plan specs/checkout-complet.md en tests Playwright complets dans tests/checkout-complet.spec.ts

Assure-toi que les tests utilisent :
- getByRole() en priorité
- Les bonnes fixtures (seed.spec.ts pour auth)
- Les assertions pertinentes
- La structure de pages existantes (LoginPage, CheckoutPage, etc.)
```

### Étape 3 : Exécuter et débugger
```bash
pnpm --filter @make-the-change/web-client test:e2e --project=checkout-complet
```

### Étape 4 : Réparer avec Healer Agent (si besoin)
Si un test échoue :

```
Utilise le Healer Agent pour analyser l'échec du test checkout-complet et proposer une correction automatique
```

---

## 🎯 Prompts types à utiliser

### Pour Planner Agent
```
Tu es un expert Playwright. Génère un plan de test détaillé pour le flow E2E de checkout dans l'app Make the Change (apps/web-client).

Contexte :
- App Next.js sur localhost:3001
- Locale : fr
- Tests existants : auth.setup.ts, commerce-flow.spec.ts, investment-flow.spec.ts
- Pages disponibles : LoginPage, CheckoutPage, ProjectPage
- Fixtures : env.ts, supabase.ts

Le plan doit couvrir :
1. Authentification automatique via storage state
2. Navigation produit
3. Ajout panier
4. Checkout complet (adresse + paiement Stripe)
5. Confirmation commande

Génère le plan dans specs/checkout-complet.md avec :
- Étapes claires et numérotées
- Sélecteurs getByRole() en priorité
- Données de test requises
- Gestion des cas d'erreur
- Intégration avec les fixtures existantes
```

### Pour Generator Agent
```
Tu es un expert Playwright. Transforme le plan specs/checkout-complet.md en tests Playwright exécutables dans tests/checkout-complet.spec.ts.

Exigences :
- Utiliser la structure de pages existantes (LoginPage, CheckoutPage, etc.)
- Intégrer les fixtures env.ts et supabase.ts
- Prioriser getByRole() et les best practices
- Inclure toutes les assertions nécessaires
- Gérer les étapes d'attente et les timeouts
- Commenter le code pour la maintenance
```

### Pour Healer Agent
```
Tu es un expert Playwright debug. Analyse l'échec du test tests/checkout-complet.spec.ts et propose une correction.

L'échec concerne :
[Coller ici l'erreur exacte du test]

Propose une solution qui :
- Corrige le sélecteur problématique
- Ajuste le timing ou l'attente
- Modifie l'assertion si nécessaire
- Garde la compatibilité avec les fixtures existantes
```

---

## 🔧 Configuration technique

### Variables d'environnement requises
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ebmjxinsyyjwshnynwwu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_YP46LVcoks4DKSDsGCqetg_Ca9UZI5k
SUPABASE_SERVICE_ROLE_KEY=[À_Renseigner]
E2E_USER_EMAIL=final-client@test.be
E2E_USER_PASSWORD=TestPassword123!
E2E_LOCALE=fr
PLAYWRIGHT_BASE_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[Clé_test_pk]
STRIPE_SECRET_KEY=[Clé_test_sk]
```

### Données requises dans Supabase
- `public_projects` : au moins un projet pour test d'investissement
- `public_products` : au moins un produit pour test commerce

---

## 🎉 Résultats attendus

À la fin du processus, tu devrais avoir :
1. **Un plan structuré** dans `specs/checkout-complet.md`
2. **Des tests fonctionnels** dans `tests/checkout-complet.spec.ts`
3. **Une exécution réussie** des tests E2E
4. **Un workflow répétable** pour futurs tests

---

## 💡 Prochaines améliorations

Une fois ce workflow maîtrisé :
1. **Créer des specs pour tous les flows** (login, profil, messagerie)
2. **Automatiser le seeding** de données via les agents
3. **Intégrer les tests dans CI/CD**
4. **Utiliser le Healer pour la maintenance continue**

---

Ce résumé te donne **tout ce qu'il faut** pour utiliser les agents Playwright efficacement dans ton repo et accélérer massivement le développement de tes tests E2E.
