# Expo SDK 55 - Nouvelles Fonctionnalités Intégrées

Ce document récapitule les nouvelles fonctionnalités Expo SDK 55 intégrées dans le projet `apps/mobile`.

## 🚀 Fonctionnalités Ajoutées

### 1. **Base de Données Locale avec Expo SQLite**
- **Package**: `expo-sqlite ~14.0.0`
- **Fichiers**: 
  - `src/app/lib/database.ts` - Service de base de données complet
  - Interface TypeScript pour les projets et utilisateurs
  - CRUD operations, transactions, et gestion des investissements
- **Fonctionnalités**:
  - Tables projects, users, et user_projects
  - Transactions atomiques
  - React hook `useDatabase()` pour intégration facile

### 2. **Widgets iOS et Live Activities**
- **Package**: `expo-widgets ~1.0.0`
- **Fichiers**:
  - `src/app/widgets/ProjectWidget.tsx` - Widget responsive pour projets
  - `src/app/lib/widgets.ts` - Service de gestion des widgets
- **Fonctionnalités**:
  - Widgets adaptatifs (small, medium, large)
  - Timeline pour mises à jour automatiques
  - Support SwiftUI avec `@expo/ui/swift-ui`

### 3. **Avis App Store**
- **Package**: `expo-storereview ~7.0.0`
- **Fichier**: `src/app/lib/store-review.ts`
- **Fonctionnalités**:
  - Demande d'avis conditionnelle
  - Vérification de disponibilité par plateforme
  - React hook `useStore()` pour intégration UI

### 4. **Split View pour iPad**
- **Package**: `expo-router/unstable-split-view`
- **Fichier**: `src/app/(tablet)/_layout.tsx`
- **Fonctionnalités**:
  - Layout 3 colonnes pour iPad
  - Sidebar + contenu principal + inspector
  - Fallback automatique sur autres plateformes

### 5. **Composants UI Natifs**
- **Package**: `@expo/ui ^1.0.0`
- **Fichier**: `src/app/components/NativeUIComponents.tsx`
- **Fonctionnalités**:
  - Exemples SwiftUI (iOS)
  - Exemples Jetpack Compose (Android)
  - Composants cross-platform

## 📱 Configuration

### Plugins ajoutés dans `app.json`:
```json
{
  "plugins": [
    "expo-router",
    "expo-secure-store", 
    "expo-glass-effect",
    "expo-sqlite",
    "expo-widgets",
    ["expo-build-properties", {
      "buildReactNativeFromSource": true,
      "useHermesV1": true
    }]
  ]
}
```

### Dépendances ajoutées dans `package.json`:
```json
{
  "dependencies": {
    "@expo/ui": "^1.0.0",
    "expo-sqlite": "~14.0.0",
    "expo-storereview": "~7.0.0",
    "expo-widgets": "~1.0.0"
  }
}
```

## 🛠️ Utilisation

### Base de Données
```typescript
import { useDatabase } from '@/app/lib/database'

function MyComponent() {
  const { isReady, database } = useDatabase()
  
  const createProject = async () => {
    const project = await database.createProject({
      name: "Nouveau Projet",
      description: "Description",
      target_budget: 10000,
      current_funding: 0,
      status: 'active'
    })
  }
}
```

### Widgets
```typescript
import { updateProjectWidget } from '@/app/lib/widgets'

// Mettre à jour un widget
await updateProjectWidget({
  projectName: "Projet Écologique",
  currentFunding: 5000,
  targetFunding: 10000,
  progress: 50
})
```

### Store Review
```typescript
import { useStoreReview } from '@/app/lib/store-review'

function ReviewButton() {
  const { requestReview } = useStoreReview()
  
  return (
    <Button onPress={requestReview}>
      Noter l'application
    </Button>
  )
}
```

## 🎯 Prochaines Étapes

1. **Installer les dépendances**: `npm install`
2. **Configurer les widgets iOS**: Ajouter la configuration dans Xcode
3. **Tester la base de données**: Valider les opérations CRUD
4. **Implémenter les widgets**: Connecter aux données réelles
5. **Optimiser Split View**: Adapter le contenu pour tablettes

## 📚 Notes

- Les erreurs TypeScript sont normales : les packages ne sont pas encore installés
- `expo-widgets` fonctionne uniquement sur iOS
- `SplitView` est iOS-only avec fallback sur autres plateformes
- La base de données fonctionne sur iOS, Android, et Web (avec configuration Metro)

## 🔗 Liens Utiles

- [Expo SQLite Documentation](https://docs.expo.dev/versions/v55.0.0/sdk/sqlite/)
- [Expo Widgets Documentation](https://docs.expo.dev/versions/v55.0.0/sdk/widgets/)
- [Expo Store Review Documentation](https://docs.expo.dev/versions/v55.0.0/sdk/storereview/)
- [Router Split View Documentation](https://docs.expo.dev/versions/v55.0.0/sdk/router-split-view/)
- [Expo UI Documentation](https://docs.expo.dev/versions/v55.0.0/sdk/ui/)
