# Make the Change — Référence Produit

> **Audience :** Fondateur, partenaire business, futures IAs reprenant le projet.
> Ce document est la source de vérité pour toutes les features, leur statut et leur logique métier.

---

## 1. Navigation Principale (Mobile-First)

L'application est conçue exclusivement pour **mobile**. La navigation principale est une barre de 5 onglets fixée en bas de l'écran.

```
[ 🔥 Défis ] [ 🌍 Projets ] [ 👥 Collectif ] [ 🛍 Récompense ] [ 👤 Profil ]
```

Les routes internes sont des alias de redirection :
- `/defis` → `/aventure?tab=defis`
- `/projets` → `/projects`
- `/marche` → `/products`

La navigation disparaît sur les pages immersives (Academy, flux d'investissement, settings).

---

## 2. Les Mascottes & Factions

### Principe
Au choix d'une mascotte correspond une faction, une couleur d'interface et un univers de projets mis en avant. Le système est déjà implémenté dans le code.

### Mapping complet

| Mascotte | Image | Faction (valeur interne) | Thème UI | Couleur |
|---|---|---|---|---|
| **Melli** | `public/abeille-transparente.png` | `'Vie Sauvage'` | `pollinisateurs` | Amber 🟡 |
| **Sylva** | `public/sylva.png` | `'Terres & Forêts'` | `forets` | Emerald 🟢 |
| **Ondine** | `public/ondine.png` | `'Gardiens des mers'` | `mers` | Bleu 🔵 |

### Ce qui reste à faire (V1)
L'onboarding doit afficher les **images des mascottes** (style choix Pokémon) au lieu d'un texte brut pour le choix de faction. L'architecture technique est prête.

> ⚠️ **Bug connu dans le code** : `actions.ts` (auth setup) utilise `'Artisans Locaux'` pour la 3e faction mais la vraie valeur interne est `'Gardiens des mers'`. À corriger.

---

## 3. L'Économie : Monnaies & Projets

### Les deux monnaies

| Monnaie | Comment gagner | Comment dépenser |
|---|---|---|
| 🌱 **Graines** | Don pur à un projet, défis complétés, leçons Academy réussies | Progression BioDex, recharge vies Academy, récompenses quêtes |
| ⭐ **Points d'Impact** | Soutien financier à un projet producteur | Échange de produits dans la boutique |

### Les deux types de projets

#### Projet "Don pur"
- Le projet ne peut pas offrir de contrepartie produit (ex : restauration de récifs coralliens).
- Contribution → **Graines** accordées à l'utilisateur.
- Pas de retour économique direct.

#### Projet "Soutien producteur"
- Le projet génère des produits (ex : miellerie artisanale, savonnerie).
- L'utilisateur investit de l'argent réel (ex : 50 €).
- En contrepartie → **Points d'Impact** qui peuvent être échangés en boutique contre des produits issus de ces projets.

---

## 4. La Boutique (Récompense)

### Modes de paiement coexistants
1. **Achat en euros** (Stripe) — achat classique, aucune récompense accordée.
2. **Échange Points d'Impact** — le solde de Points est utilisé pour obtenir des produits partenaires.

> ⚠️ **À évaluer plus tard** : option "les Points réduisent le prix en euros" (modèle crédits hybride).

### Produits
Issus des projets producteurs soutenus sur la plateforme et de partenaires sélectionnés (ex : miel Ilanga Nature, savons, huiles).

---

## 5. Le BioDex

Collection interactive d'espèces animales et végétales liées aux projets soutenus.

### Mécaniques
- **Déblocage** : soutenir un projet débloque automatiquement les espèces associées à ce projet.
- **Rareté** : Commun / Rare / Épique / Légendaire — selon le statut de menace réel de l'espèce.
- **Évolution** (V2) : dépenser des Graines pour faire progresser le "niveau de protection" d'une espèce.

### Statut V1
Le BioDex est présent en V1 mais **secondaire** par rapport aux projets et à la boutique. La grille d'espèces débloquées est visible. L'évolution est une feature V2.

---

## 6. L'Académie

Module d'apprentissage interactif sur la biodiversité, style Duolingo.

### Structure pédagogique
```
Cursus → Chapitre → Unité → 4 Leçons (discovery / practice / mastery / legendary)
                                    ↓
                              Exercices (STORY / SWIPE / QUIZ / DRAG_DROP)
```

### Système de vies
- 5 vies maximum. Une vie perdue à chaque mauvaise réponse.
- Régénération automatique toutes les 30 minutes.
- Recharge possible : attendre / dépenser 400 Graines / faire un mini-quiz d'entraînement (+1 vie).
- Les utilisateurs avec ≥ 10 000 Graines ont des vies illimitées (statut Ambassadeur).

### Statut actuel
🔬 **Lab interne — non accessible en production.**
- Contenu pédagogique à revoir et valider.
- Décision d'inclusion en V1 à valider avec le partenaire.
- `kinnu-v2` est une variante visuelle (interface hexagonale) du même parcours — également en lab.

---

## 7. Les Défis

Défis quotidiens et missions proposés à l'utilisateur pour maintenir l'engagement.

### Types
- `eco-fact` : apprendre un fait écologique, valider par un quiz rapide.
- `daily-harvest` : action quotidienne (contribution, partage).
- `give-bravo` : encourager un autre membre de la communauté.

### Récompenses
Compléter un défi → **Graines** accordées.

---

## 8. Le Collectif (Community)

Section communautaire allégée.

### Ce qui est conservé en V1
- **Feed d'activité** : flux des actions récentes de la communauté (dons, défis complétés, badges).
- **Posts** : contenus publiés et gérés par l'équipe Make the Change (pas de contenu utilisateur libre).
- **Progression des factions** : objectif collectif mensuel partagé entre les 3 factions.

### Ce qui est supprimé du code (hors scope)
- ❌ Guilds / Tribus (ancienne feature, abandonnée)
- ❌ Reels (jamais pensé mobile)
- ❌ Hashtags
- ❌ Posts utilisateurs libres

> Le Collectif est optionnel pour le bon fonctionnement de l'app. L'app tourne sans cette section.

---

## 9. Le Profil Utilisateur

Accessible depuis le 5e onglet de navigation.

### Contenu
- Photo / nom / mascotte & faction
- Solde Graines + Points d'Impact
- Niveau (explorateur → protecteur → ambassadeur)
- BioDex personnel (espèces débloquées)
- Accès aux Paramètres

### Niveaux utilisateur
Calculés depuis le score d'impact :

| Niveau | Score d'impact |
|---|---|
| Explorateur | 0 – 999 |
| Protecteur | 1 000 – 4 999 |
| Ambassadeur | 5 000 + |

> Score d'impact = `(points × 1) + (projets soutenus × 250) + (euros investis × 0.5)`

---

## 10. Les Paramètres

Page full-screen mobile accessible depuis le Profil.

### Pour un utilisateur non connecté
- Bouton de connexion
- Blog, À propos, FAQ, Contact, Confidentialité

### Pour un utilisateur connecté
- Accès au profil complet (`/account`)
- Contributions & achats
- Notifications
- Abonnement & Avantages
- Blog, À propos, FAQ, Contact, Confidentialité

---

## 11. L'Onboarding

Tunnel d'inscription en plusieurs étapes (7 étapes dans le code).

### Rôle
Introduire l'utilisateur à l'app, lui faire choisir sa mascotte/faction, configurer son profil.

### Statut
✅ V1. Le flux existe. **À améliorer** : l'onboarding doit être contextuel selon l'action de l'utilisateur (premier don, première leçon...). Les contextes exacts sont à définir avec le partenaire.

---

## 12. Features à Supprimer du Code

Liste des modules qui existent dans le code mais sont **hors scope produit** :

| Route / Module | Raison |
|---|---|
| `/dashboard` (sidebar desktop) | Redesigné mobile-first. Remplacé par l'onglet Profil + settings full-screen. |
| `/dashboard/messages` | Messagerie producteurs non pensée pour mobile. |
| `/leaderboard` | Ancienne feature abandonnée. |
| `/community/guilds` | Système de tribus abandonné. |
| `/community/reels` | Jamais pensé mobile. |
| Hashtags community | Hors scope V1. |
| `(adventure)/community/posts/new` | Posts = gérés par l'équipe, pas par l'utilisateur. |

### Features en "Lab" (à garder dans le code, non publiques)
- `/kinnu-v2` — variante visuelle de l'Académie
- `/ecosysteme` — exploration carte de l'écosystème
- `/academy` — jusqu'à validation partenaire
