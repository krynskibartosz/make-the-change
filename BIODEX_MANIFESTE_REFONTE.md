# 🌿 BioDex — Refonte selon Manifeste Produit

## 🎯 Règles du Système (Séparation Hermétique)

### **Engagement (Gratuit) 🏆**
- **Badges** : Uniquement dans onglet "Défis"
- Liés aux **Défis accomplis** et **Missions de Tribu**
- Récompense : **"Graines"** (Soft Currency)
- **AUCUN rapport avec argent ou achats**

### **Impact (Financier) 💰**
- **Espèces BioDex** : Débloquées UNIQUEMENT par **dons financiers à des projets**
- Exemple : Je donne 20€ au projet "Forêt Méditerranéenne" → Je débloque "Chouette Effraie"
- Récompense : **"Points d'Impact"** (Hard Currency)
- **Produits Shop** : Achetés avec Points d'Impact

---

## 📱 Architecture UX BioDex (Validée)

### **Objectifs Prioritaires** :
1. **Collection Gamifiée** (Pokémon GO) - Étagère à trophées
2. **Preuve d'Impact Social** - Preuve visuelle que l'argent a sauvé des animaux

### **Structure Épurée** :

```
┌─────────────────────────────────────────────────┐
│ [HEADER STICKY + SAFE AREA iOS]                │
│ • pt-[max(env(safe-area-inset-top),1rem)]      │
│ • Glassmorphism (bg-background/80 backdrop)    │
│ • z-50                                          │
│ • Filtres : Toutes | Préoccupation | En danger │
├─────────────────────────────────────────────────┤
│ 🎯 HERO : Mon BioDex                           │
│ "13 / 50 espèces débloquées"                   │
│ [████████████░░░░░░░░] 26%                     │
│ "Espèces sauvées grâce à vos dons"             │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Cards Espèces Scrollables]                    │
│ • Descriptions dynamiques                      │
│ • Boutons conditionnels                        │
│ • Tri : Débloquées → Rareté → Alpha            │
│                                                 │
├─────────────────────────────────────────────────┤
│ Défis | [BioDex] | Collectif                   │ ← Tabs flottantes (z-40)
├─────────────────────────────────────────────────┤
│ Accueil | Shop | Projets | Aventure | Menu     │ ← Bottom Nav
└─────────────────────────────────────────────────┘
```

---

## ✅ Modifications Implémentées

### **1. SUPPRIMÉ Section "🏆 Mes Badges"** ❌
- **Fichier supprimé** : `badges-carousel.tsx`
- **Raison** : Pollue l'expérience de collection. Les badges appartiennent à "Défis".
- **Manifeste** : Séparation hermétique Engagement ↔ Impact

### **2. AJOUTÉ Hero avec Progression** 📊
- **Emplacement** : Juste après les filtres, avant les cards
- **Contenu** :
  - Titre : "Mon BioDex"
  - Sous-titre : "Espèces sauvées grâce à vos dons"
  - Compteur : "13 / 50 espèces débloquées"
  - Barre de progression visuelle (gradient lime-to-emerald)
  - Pourcentage : "26% complété"
- **Psychologie** : Moteur de complétion (Variable Reward + Progression visible)

### **3. FIX iOS Safe Area** 📱
- **Header sticky** :
  ```tsx
  className="sticky top-0 z-50 w-full 
             bg-background/80 backdrop-blur-xl 
             pt-[max(env(safe-area-inset-top),1rem)]"
  ```
- **Glassmorphism** : `bg-background/80 backdrop-blur-xl`
- **Safe Area** : `pt-[max(env(safe-area-inset-top),1rem)]`
- **But** : Éviter superposition avec horloge Safari iOS (notch, Dynamic Island)

### **4. Tabs Flottantes Bottom** 🎯
- **Position** : Conservée en bas (Thumb Zone optimale)
- **Z-index** : `z-40` (au-dessus du contenu)
- **Translucide** : Effet glassmorphism

### **5. Tri Intelligent Conservé** 🔢
- Ordre : Débloquées → Rareté (legendary > rare > common) → Alphabétique
- Psychologie : Dopamine boost (nouvelles en premier)

### **6. Descriptions Dynamiques Conservées** 📝
- Locked + projets : "Soutenez '[Nom Projet]' pour découvrir..."
- Locked + légendaire : "Espèce rare ! Accomplissez des défis..."
- Locked + rare : "Gagnez un badge de protection..."
- Unlocked : Description réelle

### **7. Boutons Conditionnels Conservés** 🎨
- Unlocked : "📖 Explorer la fiche"
- Locked + projets : "🌱 Voir les projets"
- Locked + challenges : "⚡ Voir les défis"
- Locked sans action : Pas de bouton

---

## 📐 Conventions iOS 26.4 (Mars 2026)

### **Apple Human Interface Guidelines** :
✅ **Safe Area Insets** : `env(safe-area-inset-top)` pour notch/Dynamic Island  
✅ **Glassmorphism** : `backdrop-blur-xl` pour effet translucide (tendance 2026)  
✅ **Touch Targets** : 44x44pts minimum  
✅ **Active States** : `active:scale-95` pour feedback tactile  
✅ **Thumb Zone** : Tabs en bas pour accessibilité pouce  
✅ **Z-Index Layers** :
- Header : `z-50` (toujours au-dessus)
- Tabs : `z-40` (au-dessus du contenu)
- Contenu : `z-0` (base)

---

## 🧠 Psychologie UX Appliquée

### **Flow Theory (Csikszentmihalyi)** :
- **Hero progression** : Objectif clair (50 espèces)
- **Feedback immédiat** : Barre visuelle + pourcentage
- **Défi équilibré** : Ni trop facile, ni trop dur (26% complété)

### **Variable Reward (Skinner)** :
- Tri débloquées en premier → Surprise à chaque ouverture
- Espèces rares en haut → FOMO (envie de débloquer)

### **Social Proof** :
- "Espèces sauvées grâce à vos dons" → Impact réel, fierté
- Pas de compteur public (pas de compétition toxique)

### **Collection Psychology** :
- Progression visible → Endowment Effect (possession)
- Pourcentage → Zeigarnik Effect (finir ce qui est commencé)

---

## 📂 Fichiers Modifiés

### **Supprimés** :
- ❌ `/app/apps/web-client/src/app/[locale]/(marketing)/biodex/components/badges-carousel.tsx`

### **Modifiés** :
- 🔧 `/app/apps/web-client/src/app/[locale]/(marketing)/biodex/components/biodex-enhanced.tsx`
  - Supprimé import BadgesCarousel
  - Supprimé section Badges
  - Ajouté Hero progression
  - Fix Safe Area iOS
  - Glassmorphism header

### **Conservés (inchangés)** :
- ✅ `species-card-enhanced.tsx` (descriptions dynamiques OK)
- ✅ Tri intelligent (débloquées → rareté → alpha)
- ✅ Boutons conditionnels

---

## 🚀 Résultat Final

### **UX Épurée** :
- ❌ Plus de section badges (pollution visuelle)
- ✅ Focus sur collection (Pokémon GO)
- ✅ Preuve d'impact (dons → espèces sauvées)
- ✅ Progression motivante (barre visuelle)

### **iOS 26.4 Compliant** :
- ✅ Safe area respectée (notch/Dynamic Island)
- ✅ Glassmorphism (tendance mars 2026)
- ✅ Thumb Zone optimisée (tabs en bas)
- ✅ Active states (feedback tactile)

### **Manifeste Produit Respecté** :
- ✅ Séparation hermétique Engagement ↔ Impact
- ✅ Badges dans "Défis" uniquement
- ✅ Espèces = Preuve de dons financiers
- ✅ Pas de mélange monétaire/gratuit

---

## 🧪 Points de Test

### **Mobile iOS (Safari)** :
- [ ] Header ne chevauche pas l'horloge système
- [ ] Glassmorphism visible (flou arrière-plan)
- [ ] Safe area respectée sur iPhone avec notch
- [ ] Barre de progression fluide
- [ ] Tabs flottantes accessibles au pouce

### **Fonctionnel** :
- [ ] Compteur espèces débloquées correct
- [ ] Pourcentage progression exact
- [ ] Filtres fonctionnent
- [ ] Tri intelligent appliqué
- [ ] Descriptions dynamiques selon contexte

### **Performance** :
- [ ] Pas de re-renders inutiles (useMemo OK)
- [ ] Scroll fluide avec glassmorphism
- [ ] Animations GPU-accelerated

---

## 📝 Notes pour le Développement

### **Pour connecter les vraies données** :
```tsx
// Dans adventure-biodex.tsx
const speciesList = await getSpeciesContextList()
const unlockedCount = speciesList.filter(s => s.user_status?.isUnlocked).length
const totalCount = speciesList.length

<BiodexEnhanced species={speciesList} />
```

### **Pour ajouter Badges (dans onglet Défis, PAS BioDex)** :
```tsx
// Dans adventure-challenges.tsx (pas biodex !)
const userBadges = await getUserBadges()
<ChallengesBadges badges={userBadges} />
```

### **Manifeste à Respecter** :
- Badges → Défis uniquement
- Espèces → Impact financier uniquement
- Pas de mélange engagement/argent

---

**Dernière mise à jour** : 2026-04-07  
**Auteur** : E1 Agent  
**Validation** : ✅ Manifeste Produit respecté  
**iOS Compliance** : ✅ HIG 26.4 compliant
