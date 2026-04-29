# Academy Writing Spec — Production V1

> Contrat de rédaction pour les exercices Academy. Toute leçon livrée doit respecter cette spec **avant merge**. Si une règle te semble bloquante, ouvre un débat plutôt qu'un contournement silencieux : la cohérence pédagogique du module en dépend.

## 0. Référentiel scientifique

Cette spec s'appuie sur des résultats expérimentaux solides en psychologie cognitive, **pas sur du marketing EdTech**. Citations canoniques :

| Concept | Source | Application Biolingo |
|---|---|---|
| Effet d'espacement | Cepeda, Pashler, Vul, Wixted, Rohrer (2006), *Psychological Bulletin* | Leçons Practice/Mastery rappellent les unités précédentes |
| Effet de test (récupération active) | Roediger & Karpicke (2006), *Psychological Science* | ≥ 75 % des écrans demandent une action avant toute info |
| Difficultés désirables | Bjork (1994), *Memory* | Cible 75-85 % de réussite première tentative |
| Charge cognitive | Sweller, van Merriënboer & Paas (1998/2019) | 1 concept par écran, ≤ 2 phrases courtes |
| Principes multimédia | Mayer (2001/2020) | Image + texte court contigus, jamais de mur de texte |
| Effet de génération | Slamecka & Graf (1978) | Faire deviner avant de révéler |
| Pre-testing effect | Richland, Kornell & Kao (2009) | Première Swipe = avant l'explication |
| Misconceptions ciblées | Haladyna, Downing & Rodriguez (2002) | Distracteurs = idées reçues réelles |
| Métacognition (judgement of learning) | Dunlosky & Metcalfe (2009) | `confidenceCheck` sur 30 % des Mastery |

Sources rejetées (à ne PAS citer dans les contenus, trop floues ou exagérées) : « Nature Reviews Psychology 2026 », « MIT Media Lab 2026 », tout chiffre Duolingo non publié (TTA 4s, LCR 90%, 20% drop Hick).

---

## 1. Anatomie d'une leçon Découverte (12 écrans)

C'est le **template canonique** que tu dois écrire à la main pour chaque unité. Il applique en cascade : pre-test → génération → récupération active → boss mini.

| # | Type | Rôle narratif | Règle |
|---|---|---|---|
| 1 | STORY (`hook`) | Énoncer un **paradoxe** ou une question intrigante. Pas la réponse. | ≤ 110 caractères. 1 image immersive. |
| 2 | SWIPE (`pre-test`) | Faire **deviner** avant d'expliquer. L'erreur ici est attendue (≥ 40 % d'échec normal). | Carte = idée reçue. Feedback = micro-révélation. |
| 3 | STORY (`reveal`) | Expliquer le mécanisme. Le « aha » du joueur. | Bold sur **le mot-clé** uniquement. |
| 4 | QUIZ (`generation`) | Fixer le concept en forçant le rappel. 3 options dont **2 distracteurs ≠ misconceptions ciblées**. | Feedback par option. |
| 5 | SWIPE (`misconception`) | Démolir un mythe écolo connu (catalogue `misconceptions.ts`). | `misconceptionId` obligatoire. |
| 6 | STORY (`build-up`) | Introduire un 2e angle du concept (ex: variation, exception, conséquence). | Optionnel : peut être un screen `kind: closure` partiel. |
| 7 | DRAG_DROP (somatique) | Le geste = le concept (vertical = profondeur/hiérarchie ; horizontal = chronologie). | `axis` doit être justifié, jamais cosmétique. |
| 8 | SWIPE (`sprint 1`) | Récupération active rapide. | Cible TTA bas (< 3 s). |
| 9 | SWIPE (`sprint 2`) | Récupération active rapide, autre angle. | Concept différent du sprint 1. |
| 10 | QUIZ (`misconception` + `metacognition`) | Question piège centrée sur une idée reçue. `confidenceCheck: true`. | 3-4 options. Feedback par option avec correction explicite du mythe. |
| 11 | DRAG_DROP (boss mini) | Synthèse logique. Souvent 4-5 items. | Peut inclure 1 `distractorItem`. |
| 12 | QUIZ (`closure`) | Question ouverte sur le **« pourquoi global »** de l'unité. | Feedback de victoire = transition vers l'unité suivante. |

Total : **5 SWIPE / 3 QUIZ / 2 DRAG_DROP / 2 STORY**. Ratio actif/passif = 10/2 = 5:1. ✅ règle anti-passivité respectée.

---

## 2. Anatomie d'une leçon Couronne (14 écrans)

Boss synthétique de l'unité. Doit donner la sensation d'un examen mérité.

| # | Type | Particularité |
|---|---|---|
| 1 | STORY (`hook`) | Reformule le défi global : « Tu es prêt ? » |
| 2-3 | QUIZ x 2 | Difficulté `hard`, ratio misconception 100 % |
| 4 | DRAG_DROP | 5+ items, axis somatique, ≥ 1 distractorItem |
| 5-6 | SWIPE x 2 | Vrai/faux nuancés (pas trivial) |
| 7 | QUIZ (`metacognition`) | `confidenceCheck: true`, hard |
| 8 | DRAG_DROP | Entrelacement avec une unité **antérieure** du même chapitre |
| 9-10 | SWIPE x 2 | Sprint final, rythme accéléré |
| 11 | QUIZ | Question intégrative (relie 2 concepts de l'unité) |
| 12 | STORY (`reveal`) | Révèle le « pourquoi » caché du concept (effet Aha final) |
| 13 | QUIZ (`closure`) | Question ouverte sur la pratique réelle |
| 14 | STORY (`closure`) | Phrase mémorable qui relie l'unité au chapitre. Annonce la suite. |

---

## 3. Pool d'exercices (~12-15 par unité, en plus des 26 écrits)

Le pool nourrit les leçons **Pratique** et **Maîtrise**. Règles :

- Au moins **40 %** des exercices du pool ciblent une `misconceptionId`.
- Au moins **30 %** ont `cognitiveTags: ['interleaved']` (rappellent une unité précédente).
- Distribution des types : ~50 % Swipe, ~25 % Quiz, ~15 % Drag&Drop, ~10 % Story (rare).
- Distribution de difficulté : 30 % easy, 50 % medium, 20 % hard.

**Anti-pattern** : un exo du pool ne doit PAS être une simple paraphrase d'un exo de Découverte. Il doit angle-shift (changer d'exemple, d'espèce, de contexte).

---

## 4. Règles d'écriture micro-learning

### Densité textuelle
- **STORY screen** : ≤ 140 caractères. Si tu dépasses, scinde en deux screens.
- **SWIPE card title** : ≤ 60 caractères.
- **QUIZ question** : ≤ 80 caractères.
- **QUIZ option** : ≤ 35 caractères. Idéal : 3-7 mots.
- **DRAG_DROP item text** : ≤ 30 caractères, idéalement avec emoji en tête.
- **DRAG_DROP instruction** : ≤ 60 caractères, impératif court (« Ordonne… »).
- **Feedback (correct/incorrect)** : ≤ 110 caractères. Format obligatoire :
  - **Correct** : `[Validation enthousiaste de 2-4 mots] + [Pourquoi en ≤ 90 caractères]`
  - **Incorrect** : `[Reconnaissance douce ("Presque", "Pas tout à fait")] + [Correction + Pourquoi]`

### Bold stratégique
1 token max par STORY screen. Le mot en gras = celui qu'on veut tester dans l'écran suivant. **Pas de bold décoratif.**

### Vocabulaire
- Pas de jargon scientifique non défini (« endémique » → définis-le dans une Story avant).
- Pas d'anglicismes inutiles.
- Tutoyer le joueur (« Tu vois… »), pas vouvoyer.
- Émojis : oui dans les Drag&Drop items et les feedbacks de victoire. Non dans les questions ou les Story descriptions.

### Ton
- **Cursus canonique** = `living-mechanics` (factuel, précis, légèrement émerveillé).
- Évite les exclamations en série (max 1 « ! » par écran).
- Évite le moralisme écolo (« il faut sauver la planète »). Préfère le constat factuel qui fait réfléchir.

---

## 5. Catalogue des misconceptions à exploiter

Ces idées reçues (codifiées dans `src/lib/academy/misconceptions.ts`) sont **la matière première** de tes distracteurs. Liste prioritaire V1 :

### Énergie & matière
- `plants-eat-soil` — « Les plantes tirent leur masse du sol »
- `co2-is-toxic` — « Le CO₂ est un poison »
- `oxygen-from-trees-only` — « Tout l'oxygène vient des forêts »
- `ocean-is-just-fish` — « L'océan, c'est surtout des poissons » (en réalité : phytoplancton domine)

### Vivant & adaptation
- `evolution-is-progress` — « Évoluer = progresser vers mieux »
- `predators-are-villains` — « Les prédateurs déstabilisent les écosystèmes »
- `species-perfectly-adapted` — « Une espèce bien adaptée est protégée pour toujours »
- `mutation-is-conscious` — « Les espèces choisissent leurs adaptations »

### Eau & climat
- `concrete-helps-drainage` — « Le béton aide l'eau à s'écouler »
- `rain-comes-from-clouds-only` — « La pluie vient juste des nuages »
- `forests-just-decoration` — « Les forêts ne servent qu'à faire joli »
- `local-actions-no-impact` — « Mes actions individuelles ne changent rien »

### Sols & vivant invisible
- `dead-soil-is-clean` — « Un sol stérile est un bon sol »
- `mushrooms-are-plants` — « Les champignons sont des plantes »
- `bacteria-always-bad` — « Toutes les bactéries sont dangereuses »

### Alimentation & agriculture
- `bio-means-no-pesticides` — « Bio = zéro pesticide »
- `organic-always-better` — « Bio = forcément meilleur écologiquement »
- `meat-is-only-protein` — « Pour les protéines il faut de la viande »
- `local-always-better` — « Local = toujours plus écologique » (faux pour serres chauffées hors-saison)

→ Cible V1 : **30-50 misconceptions** documentées avec source courte (un lien GIEC, IPBES, *The Conversation* science, ou ouvrage de référence).

---

## 6. Mapping somatique du Drag & Drop

Le geste **doit** signifier quelque chose. Si tu ne peux pas justifier l'axe, c'est probablement un Quiz déguisé.

### Vertical (haut → bas)
- Profondeur (canopée → sous-bois → sol → sous-sol)
- Hiérarchie trophique (super-prédateur → prédateur → herbivore → producteur)
- Taille (baleine bleue → dauphin → poisson-clown → krill)
- Hiérarchie atmosphérique (stratosphère → troposphère → sol)

### Horizontal (gauche → droite)
- Chronologie (graine → pousse → arbre → décomposition)
- Évolution (poisson → amphibien → reptile → mammifère)
- Succession écologique (roche nue → lichens → herbacées → forêt)
- Cycle linéaire d'un processus (évaporation → condensation → précipitation → infiltration)

### À éviter
- Drag & Drop **circulaire** (V1 ne le supporte pas, le geste linéaire le rendrait incohérent).
- Plus de 6 items (charge cognitive trop forte).
- Items qui ne se distinguent que par 1 mot (le joueur joue au hasard).

---

## 7. Checklist qualité par exercice (à valider avant commit)

Pour CHAQUE exercice écrit, coche mentalement ces 10 points :

1. **Objectif clair** : `learningObjective` rédigé en 1 phrase active.
2. **Récupération active** : l'utilisateur fait quelque chose avant de recevoir l'info.
3. **Distracteurs solides** : si Quiz/Swipe, les mauvaises réponses correspondent à des idées reçues réelles (`misconceptionId` rempli).
4. **Feedback explicatif** : chaque option a un `feedback` qui dit *pourquoi*, pas juste *vrai/faux*.
5. **Charge cognitive** : 1 seul concept testé. Si tu testes deux choses, scinde.
6. **Densité textuelle** : tous les compteurs caractères respectés (cf §4).
7. **Bold pertinent** : 0 ou 1 token gras par screen, jamais décoratif.
8. **Geste somatique** : si Drag&Drop, l'axe est justifié et signifiant.
9. **Pas de moralisme** : le contenu informe, ne sermonne pas.
10. **Lien narratif** : l'exercice s'inscrit dans la tension de la leçon (pas un fait isolé).

---

## 8. Structure du JSON cible (résumé)

Voir `src/lib/academy/schema.ts` pour la spec Zod complète. Aperçu :

```ts
type AcademyQuizExercise = {
  id: string
  type: 'QUIZ'
  conceptId: string
  difficulty: 'easy' | 'medium' | 'hard'
  cognitiveTags: CognitiveTag[]
  learningObjective: string
  question: string
  options: Array<{
    text: string
    isCorrect: boolean
    feedback: string                // par option, OBLIGATOIRE
    misconceptionId?: string
  }>
  hint?: string
  confidenceCheck?: boolean
  interleavesConceptIds?: string[]
}
```

---

## 9. Exemple avant / après

### ❌ Version médiocre (existante actuellement)

```ts
{
  id: 'c1u1q1',
  type: 'QUIZ',
  question: "Quel rôle joue le Soleil dans la nature ?",
  options: [
    { text: "Source d'énergie primaire", isCorrect: true },
    { text: 'Simple décor du ciel', isCorrect: false },
    { text: 'Réserve de minéraux', isCorrect: false },
  ],
  successFeedback: 'Parfait ! Le Soleil est acquis.',
  failureFeedback: "La bonne réponse était : Source d'énergie primaire.",
}
```

**Problèmes** : distracteurs trop évidents (« décor du ciel »), feedback global générique, aucune misconception ciblée, pas de `learningObjective`, pas de `feedback` par option.

### ✅ Version qualité prod

```ts
{
  id: 'c1-sun-q-energy-source',
  type: 'QUIZ',
  conceptId: 'sun-energy-source',
  difficulty: 'medium',
  cognitiveTags: ['misconception', 'generation'],
  learningObjective: "Identifier le Soleil comme source d'énergie primaire des écosystèmes terrestres.",
  question: "D'où vient l'énergie qui fait pousser un arbre ?",
  options: [
    {
      text: 'De la lumière du Soleil',
      isCorrect: true,
      feedback: "Exact. La feuille capte les photons et les transforme en sucre. C'est la photosynthèse.",
    },
    {
      text: 'Des minéraux du sol',
      isCorrect: false,
      feedback: "Idée reçue très commune. Les minéraux sont des vitamines, pas le carburant. Le carburant vient de la lumière.",
      misconceptionId: 'plants-eat-soil',
    },
    {
      text: 'De la chaleur du noyau terrestre',
      isCorrect: false,
      feedback: "Le noyau chauffe les profondeurs, mais sa chaleur n'arrive pas jusqu'aux feuilles.",
    },
  ],
  hint: "Pense à ce qui se passe quand on met une plante dans le noir.",
}
```

**Pourquoi c'est meilleur** :
- Distracteur 1 = misconception réelle et documentée (`plants-eat-soil`).
- Chaque option enseigne, même la bonne.
- Le feedback de l'erreur démolit le mythe sans humilier.
- `learningObjective` permet de tester si la leçon atteint son but.

---

## 10. Workflow de rédaction recommandé

Pour chaque unité, dans l'ordre :

1. **Définir 3-5 `conceptId` clés** de l'unité (ex: `sun-energy-source`, `producers-vs-consumers`, `food-chain-link`).
2. **Lister les misconceptions associées** (puiser dans le catalogue, en proposer de nouvelles si besoin).
3. **Écrire la leçon Découverte (12 écrans)** selon le template §1, en mode storytelling cohérent.
4. **Construire le pool (~12-15 exos)** : variantes Swipe sur misconceptions, Quiz hard, Drag&Drop alternatifs.
5. **Écrire la Couronne (14 écrans)** selon le template §2.
6. **Passer la checklist §7 sur chaque exercice** avant commit.
7. **Commit atomique par unité** (1 fichier `units/<chapter>/<unit-slug>.ts`).

---

## 11. Ce que cette spec n'autorise PAS

- Réutiliser un même feedback générique (« Bravo ! Bien joué ! ») sur plusieurs exos.
- Distracteurs de paille (« Une voiture », « Du goudron » dans une question sur le Soleil).
- STORY screens > 140 caractères « parce que c'est plus clair ».
- Drag & Drop avec `axis` choisi par défaut sans justification somatique.
- Quiz à 4 options dont 2 sont quasi-synonymes.
- Feedback qui dit juste « Faux. » ou « Correct ! ».
- Moralisme écolo dans les feedbacks (« il faut protéger… »).

> En cas de doute, ouvrir une discussion plutôt que de baisser la barre. La qualité intrinsèque de chaque exercice est le seul vrai différenciateur de Biolingo face à Duolingo et Brilliant.
