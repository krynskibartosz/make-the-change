# Design System v2.0 Components

## 📦 Import

```tsx
import { ButtonV2, InputV2, CustomSelectV2 } from '@/components/ui/v2';
```

## 🔵 ButtonV2

### Variantes

```tsx
// Primary (Bleu → Turquoise)
<ButtonV2 variant="primary">Investir</ButtonV2>

// Secondary (Bordure gradient)
<ButtonV2 variant="secondary">Voir mes points</ButtonV2>

// Accent (Jaune → Or)
<ButtonV2 variant="accent">En savoir plus</ButtonV2>
```

### Tailles

```tsx
<ButtonV2 size="sm">Small</ButtonV2>
<ButtonV2 size="default">Default (52px)</ButtonV2>
<ButtonV2 size="lg">Large</ButtonV2>
```

### Props Avancées

```tsx
// Loading state
<ButtonV2 loading loadingText="Envoi...">Envoyer</ButtonV2>

// Avec icône
<ButtonV2 icon={<Star />}>Devenir Ambassadeur</ButtonV2>

// Pleine largeur
<ButtonV2 fullWidth>S'inscrire</ButtonV2>

// Disabled
<ButtonV2 disabled>Indisponible</ButtonV2>
```

## 📝 InputV2

### Usage Basique

```tsx
import { Mail } from 'lucide-react';

<InputV2
  label="Adresse e-mail"
  type="email"
  required
  leadingIcon={<Mail />}
  placeholder="votre@email.com"
/>
```

### États

```tsx
// État par défaut
<InputV2 label="Nom" />

// État d'erreur
<InputV2
  label="Email"
  error="Adresse e-mail invalide"
/>

// État de succès
<InputV2
  label="Email"
  state="success"
  value="valide@email.com"
/>

// Avec texte d'aide
<InputV2
  label="Mot de passe"
  helpText="Minimum 8 caractères"
/>
```

### Avec Contrôle

```tsx
const [email, setEmail] = useState('');

<InputV2
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  leadingIcon={<Mail />}
  required
/>
```

## 📋 CustomSelectV2

### Usage Basique

```tsx
const [value, setValue] = useState('');

<CustomSelectV2
  label="Choisissez un projet"
  options={[
    { value: 'ruche', label: 'Protéger une ruche' },
    { value: 'arbre', label: 'Planter un arbre' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="Sélectionnez..."
/>
```

### Options Riches

```tsx
import { Sparkles, TreeDeciduous } from 'lucide-react';

<CustomSelectV2
  label="Type de projet"
  options={[
    {
      value: 'ruche',
      label: 'Protéger une ruche',
      subtitle: 'Soutien à l\'apiculture locale',
      icon: <Sparkles className="text-accent" />,
    },
    {
      value: 'arbre',
      label: 'Planter un arbre',
      subtitle: 'Reforestation durable',
      icon: <TreeDeciduous className="text-success" />,
    },
  ]}
  value={value}
  onChange={setValue}
/>
```

### Navigation Clavier

- `Enter` / `Space` : Ouvrir / Sélectionner
- `Escape` : Fermer
- `↑` / `↓` : Naviguer entre les options
- `Home` / `End` : Première / Dernière option

## 📄 Exemple Complet

```tsx
'use client';

import { useState } from 'react';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { ButtonV2, InputV2, CustomSelectV2 } from '@/components/ui/v2';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [project, setProject] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectOptions = [
    {
      value: 'ruche',
      label: 'Protéger une ruche',
      subtitle: 'Apiculture locale',
      icon: <Sparkles />,
    },
    {
      value: 'arbre',
      label: 'Planter un arbre',
      subtitle: 'Reforestation',
      icon: <TreeDeciduous />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!email.includes('@')) {
      newErrors.email = 'Adresse e-mail invalide';
    }

    if (password.length < 8) {
      newErrors.password = 'Minimum 8 caractères requis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Soumettre le formulaire...
    console.log({ email, password, project });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <InputV2
        label="Adresse e-mail"
        type="email"
        required
        placeholder="votreemail@exemple.com"
        leadingIcon={<Mail />}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors({ ...errors, email: '' });
        }}
        error={errors.email}
      />

      <InputV2
        label="Mot de passe"
        type="password"
        required
        placeholder="••••••••"
        leadingIcon={<Lock />}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors({ ...errors, password: '' });
        }}
        error={errors.password}
        helpText="Minimum 8 caractères"
      />

      <CustomSelectV2
        label="Premier projet à soutenir"
        options={projectOptions}
        value={project}
        onChange={setProject}
        placeholder="Choisissez un projet..."
      />

      <div className="flex gap-4 pt-4">
        <ButtonV2
          variant="secondary"
          type="button"
          fullWidth
          onClick={() => window.history.back()}
        >
          Annuler
        </ButtonV2>

        <ButtonV2
          variant="primary"
          type="submit"
          fullWidth
        >
          Créer mon compte
        </ButtonV2>
      </div>
    </form>
  );
}
```

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans `/apps/web/src/app/globals.css` :

```css
--color-primary-start: #3B82F6;   /* Bleu */
--color-primary-end: #14B8A6;     /* Turquoise */
--color-accent-start: #FDE74C;    /* Jaune */
--color-accent-end: #FFC700;      /* Or */
--color-ring: #FBBF24;            /* Focus */
```

### Classes Tailwind

Tous les composants acceptent `className` pour personnalisation :

```tsx
<ButtonV2 className="shadow-2xl">Custom</ButtonV2>
<InputV2 className="max-w-sm" />
<CustomSelectV2 className="w-full md:w-1/2" />
```

## 📚 Documentation Complète

- **Guide complet** : `/DESIGN_SYSTEM_V2.md`
- **Démarrage rapide** : `/DESIGN_SYSTEM_V2_QUICKSTART.md`
- **Exemples** : `./example.tsx` (ce dossier)
- **Page de démo** : `http://localhost:3000/design-system-v2`

## ♿ Accessibilité

Tous les composants respectent WCAG 2.1 AA :

- ✅ Navigation clavier
- ✅ ARIA complet
- ✅ Contraste des couleurs
- ✅ Focus visible
- ✅ Screen readers

## 🌓 Dark Mode

Le dark mode est géré automatiquement via la classe `.dark` sur l'élément racine.

```tsx
// Aucune action requise, les composants s'adaptent automatiquement
<ButtonV2>Fonctionne en light et dark mode</ButtonV2>
```

---

**Design System v2.0** - Make the CHANGE
