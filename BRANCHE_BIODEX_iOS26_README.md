# 🌿 Branche `feature/biodex-ios26-mobile`

## 📱 Refonte BioDex — iOS 26.4 Mobile-First

Cette branche contient toutes les modifications pour optimiser l'onglet BioDex selon les conventions iOS 26.4 (mars 2026).

---

## 🚀 Pour Tester Localement

### **1. Récupérer la branche**
```bash
git fetch origin
git checkout feature/biodex-ios26-mobile
```

### **2. Installer les dépendances**
```bash
pnpm install
```

### **3. Lancer le serveur de dev**
```bash
# Depuis la racine du projet
pnpm dev

# OU directement dans web-client
cd apps/web-client
pnpm dev
```

### **4. Accéder à la page BioDex**
- URL : `http://localhost:3001/aventure?tab=biodex`
- **Important** : Tester en mode **responsive mobile** (iPhone 15/16)
- Ouvrir DevTools → Mode responsive → iPhone 15 Pro

---

## ✅ Modifications Implémentées

### **Fichiers Créés** :
1. **`badges-carousel.tsx`**
   - Composant badges iOS natif
   - Scroll horizontal avec snap points
   - 6 badges mockés (3 débloqués, 3 locked)

2. **`CHANGELOG_BIODEX_iOS26.md`**
   - Documentation complète des changements
   - Psychologie UX et conventions iOS

### **Fichiers Modifiés** :
1. **`biodex-enhanced.tsx`**
   - ❌ Supprimé "13 / 13 espèces"
   - ✅ Ajouté BadgesCarousel (sticky top)
   - ✅ Tri intelligent : débloquées → rareté → alphabétique

2. **`species-card-enhanced.tsx`**
   - ❌ Supprimé "Projets (X)"
   - ✅ Descriptions dynamiques selon contexte
   - ✅ Boutons conditionnels (pas de bouton si pas d'action)

---

## 🎯 Ce Qui A Changé Visuellement

### **AVANT** :
```
┌─────────────────────────────┐
│ 13 / 13 espèces             │ ← Supprimé
├─────────────────────────────┤
│ Filtres : Toutes | Préocc...│
├─────────────────────────────┤
│ [Card Chouette Effraie]     │
│ Description : "Soutenez un  │ ← Toujours la même
│ projet lié à cet habitat"   │
│ Projets (4) ← Supprimé      │
│ [🌱 Découvrir les projets]  │ ← Toujours le même
└─────────────────────────────┘
```

### **APRÈS** :
```
┌─────────────────────────────┐
│ Filtres : Toutes | Préocc...│
├─────────────────────────────┤
│ 🏆 Mes Badges (3/6)         │ ← NOUVEAU !
│ [🌲][🐝][🦅][🔒][🔒][🔒] │ ← Scroll horizontal
├─────────────────────────────┤
│ [Card Chouette Effraie]     │
│ Description : "Soutenez     │ ← Dynamique !
│ 'Ruches Ardennes' pour      │ ← (nom du projet)
│ découvrir cette espèce."    │
│ [Ruches Ardennes] [...]     │ ← Chips projets seules
│ [🌱 Voir les projets]       │ ← CTA adapté
└─────────────────────────────┘
```

---

## 📊 Détails des Changements

### **1. Badges Carousel** 🏆
- **Position** : Sticky, après filtres, avant cards
- **Design** : iOS natif (scroll horizontal, snap points)
- **Badges mockés** :
  - ✅ 🌲 Gardien des Forêts
  - ✅ 🐝 Ami des Abeilles
  - ✅ 🦅 Observateur
  - 🔒 🛡️ Protecteur
  - 🔒 🔍 Explorateur
  - 🔒 🌿 Botaniste

### **2. Descriptions Dynamiques** 📝

| Contexte | Description affichée |
|----------|---------------------|
| Locked + a projets | "Soutenez '[Nom Projet]' pour découvrir..." |
| Locked + légendaire | "Espèce rare ! Accomplissez des défis..." |
| Locked + rare | "Gagnez un badge de protection..." |
| Unlocked | Description réelle de l'espèce |

### **3. Boutons Conditionnels** 🎯

| État Espèce | Bouton |
|-------------|--------|
| Unlocked | 📖 Explorer la fiche |
| Locked + projets | 🌱 Voir les projets |
| Locked + challenges | ⚡ Voir les défis |
| Locked sans action | **Aucun bouton** |

### **4. Tri Intelligent** 🔢
1. Espèces **débloquées** en premier (dopamine boost)
2. Puis par **rareté** (legendary > rare > common)
3. Puis **alphabétique** (A-Z)

---

## 🎨 Conventions iOS 26.4 Respectées

✅ **Safe area insets** (`env(safe-area-inset-top)`)  
✅ **Touch targets** 44x44pts minimum  
✅ **Active states** (`active:scale-95`)  
✅ **Scroll horizontal** avec snap points  
✅ **Backdrop blur** pour sections sticky  
✅ **Border radius** modernes (16-20px)  
✅ **Spacing généreux** iOS-style  

---

## 🧪 Points à Tester

### **Mobile** (Prioritaire) :
- [ ] Badges carousel scroll horizontal (snap points)
- [ ] Descriptions dynamiques selon espèce
- [ ] Boutons conditionnels (certaines cards sans bouton)
- [ ] Tri espèces (débloquées en haut)
- [ ] Active states au tap (scale effect)
- [ ] Safe area insets sur iPhone avec notch

### **Fonctionnel** :
- [ ] Filtres (Toutes, Préoccupation, En danger)
- [ ] Recherche (si + de 20 espèces)
- [ ] Clics sur chips projets
- [ ] Navigation vers fiches espèces

---

## 📝 Notes pour le Développement

### **Badges mockés** :
Les badges sont actuellement mockés dans `badges-carousel.tsx` :
```tsx
const DEFAULT_BADGES: Badge[] = [
  { id: '1', name: 'Gardien des Forêts', icon: '🌲', unlocked: true },
  // ...
]
```

**Pour connecter aux vraies données** :
```tsx
// Dans adventure-biodex.tsx
const userBadges = await getUserBadges() // À créer
<BiodexEnhanced species={speciesList} badges={userBadges} />
```

### **TypeScript** :
Tous les types sont stricts. Interface `Badge` disponible dans `badges-carousel.tsx`.

### **Performance** :
- Tri et filtrage utilisent `useMemo`
- Pas de re-renders inutiles
- CSS animations GPU-accelerated

---

## 🔗 Liens Utiles

- **Documentation complète** : `/CHANGELOG_BIODEX_iOS26.md`
- **Composant badges** : `/apps/web-client/src/app/[locale]/(marketing)/biodex/components/badges-carousel.tsx`
- **iOS HIG 2026** : https://developer.apple.com/design/human-interface-guidelines/

---

## ❓ Questions / Support

Si vous rencontrez un problème ou avez des questions :
1. Consultez `CHANGELOG_BIODEX_iOS26.md`
2. Vérifiez que vous êtes bien en mode mobile responsive
3. Assurez-vous d'être sur l'URL `/aventure?tab=biodex`

---

**Branche créée le** : 2026-04-07  
**Commits inclus** : 2 (auto-commits Emergent)  
**Statut** : ✅ Prêt à tester  
**Focus** : 📱 Mobile iOS 26.4 uniquement
