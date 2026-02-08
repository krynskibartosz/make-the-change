'use client';

/**
 * Exemple d'utilisation du composant CustomSelect
 *
 * Ce fichier démontre comment utiliser le CustomSelect dans différents contextes :
 * - Sélection simple
 * - Avec formulaire
 * - Avec validation
 * - Options riches avec icônes
 */

import { useState } from 'react';
import {
  Globe,
  Sparkles,
  TreeDeciduous,
  Droplet,
  Leaf,
  Mountain,
  Fish,
  Bird,
} from 'lucide-react';
import { CustomSelect, type SelectOption } from './custom-select';
import { ButtonV2 } from './v2';

export function CustomSelectExample() {
  // État pour le type de projet
  const [projectType, setProjectType] = useState('');

  // État pour la localisation
  const [location, setLocation] = useState('');

  // État pour l'écosystème
  const [ecosystem, setEcosystem] = useState('');

  // Options pour le type de projet
  const projectTypeOptions: SelectOption[] = [
    {
      value: 'ruche',
      title: 'Protéger une ruche',
      subtitle: 'Soutien à l\'apiculture locale et pollinisation',
      icon: <Sparkles className="text-accent" />,
    },
    {
      value: 'arbre',
      title: 'Planter un arbre',
      subtitle: 'Reforestation et captation carbone',
      icon: <TreeDeciduous className="text-success" />,
    },
    {
      value: 'eau',
      title: 'Restauration de cours d\'eau',
      subtitle: 'Protection des écosystèmes aquatiques',
      icon: <Droplet className="text-info" />,
    },
    {
      value: 'biodiversite',
      title: 'Préservation de la biodiversité',
      subtitle: 'Conservation des espèces menacées',
      icon: <Leaf className="text-olive" />,
    },
  ];

  // Options pour la localisation
  const locationOptions: SelectOption[] = [
    {
      value: 'france',
      title: 'France',
      subtitle: 'Projets en territoire français',
      icon: <Mountain className="text-primary" />,
    },
    {
      value: 'belgique',
      title: 'Belgique',
      subtitle: 'Projets en Belgique',
      icon: <Mountain className="text-secondary" />,
    },
    {
      value: 'suisse',
      title: 'Suisse',
      subtitle: 'Projets en Suisse',
      icon: <Mountain className="text-accent" />,
    },
  ];

  // Options pour l'écosystème
  const ecosystemOptions: SelectOption[] = [
    {
      value: 'foret',
      title: 'Forêt',
      subtitle: 'Écosystèmes forestiers',
      icon: <TreeDeciduous className="text-success" />,
    },
    {
      value: 'montagne',
      title: 'Montagne',
      subtitle: 'Écosystèmes montagnards',
      icon: <Mountain className="text-primary" />,
    },
    {
      value: 'riviere',
      title: 'Rivière',
      subtitle: 'Écosystèmes aquatiques',
      icon: <Fish className="text-info" />,
    },
    {
      value: 'prairie',
      title: 'Prairie',
      subtitle: 'Écosystèmes de prairies',
      icon: <Bird className="text-accent" />,
    },
  ];

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire soumis :', {
      projectType,
      location,
      ecosystem,
    });
    alert(`Projet sélectionné :\n\nType: ${projectType}\nLocalisation: ${location}\nÉcosystème: ${ecosystem}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-12 p-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">CustomSelect Component</h1>
        <p className="text-muted-foreground">
          Composant de sélection premium avec options riches (icône + titre + sous-titre)
        </p>
        <div className="rounded-lg border-2 border-border bg-muted/30 p-4">
          <p className="text-sm">
            <strong>Mission :</strong> Remplacer tous les <code className="rounded bg-muted px-2 py-0.5">&lt;select&gt;</code> natifs
            par ce composant customisé
          </p>
        </div>
      </div>

      {/* Section 1 : Sélection Simple */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">1. Sélection Simple</h2>
        <div className="space-y-6 rounded-xl border-2 border-border bg-card p-8">
          <CustomSelect
            name="project_type"
            id="project-type"
            label="Type de projet"
            contextIcon={<Globe className="h-5 w-5" />}
            options={projectTypeOptions}
            value={projectType}
            onChange={setProjectType}
            placeholder="Choisir un type de projet..."
          />

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Valeur sélectionnée :</strong>{' '}
              <code className="rounded bg-background px-2 py-0.5">
                {projectType || 'Aucune'}
              </code>
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 : Formulaire Complet */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">2. Formulaire Complet</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border-2 border-border bg-card p-8"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Créer un nouveau projet</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez les CustomSelect pour configurer votre projet de biodiversité
            </p>
          </div>

          <CustomSelect
            name="project_type_form"
            id="project-type-form"
            label="Type de projet *"
            contextIcon={<Sparkles className="h-5 w-5" />}
            options={projectTypeOptions}
            value={projectType}
            onChange={setProjectType}
            placeholder="Sélectionnez le type de projet..."
          />

          <CustomSelect
            name="location_form"
            id="location-form"
            label="Localisation *"
            contextIcon={<Globe className="h-5 w-5" />}
            options={locationOptions}
            value={location}
            onChange={setLocation}
            placeholder="Sélectionnez la localisation..."
          />

          <CustomSelect
            name="ecosystem_form"
            id="ecosystem-form"
            label="Écosystème *"
            contextIcon={<Leaf className="h-5 w-5" />}
            options={ecosystemOptions}
            value={ecosystem}
            onChange={setEcosystem}
            placeholder="Sélectionnez l'écosystème..."
          />

          <div className="flex gap-4 pt-4">
            <ButtonV2
              variant="secondary"
              type="button"
              fullWidth
              onClick={() => {
                setProjectType('');
                setLocation('');
                setEcosystem('');
              }}
            >
              Réinitialiser
            </ButtonV2>

            <ButtonV2
              variant="primary"
              type="submit"
              fullWidth
              disabled={!projectType || !location || !ecosystem}
            >
              Créer le projet
            </ButtonV2>
          </div>
        </form>
      </section>

      {/* Section 3 : États & Variantes */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">3. États & Variantes</h2>
        <div className="space-y-6 rounded-xl border-2 border-border bg-card p-8">
          <CustomSelect
            name="normal_state"
            id="normal-state"
            label="État Normal"
            contextIcon={<Globe className="h-5 w-5" />}
            options={projectTypeOptions}
            value=""
            onChange={() => {}}
            placeholder="Sélectionnez une option..."
          />

          <CustomSelect
            name="disabled_state"
            id="disabled-state"
            label="État Désactivé"
            contextIcon={<Globe className="h-5 w-5" />}
            options={projectTypeOptions}
            value=""
            onChange={() => {}}
            placeholder="Ce select est désactivé"
            disabled
          />

          <CustomSelect
            name="with_value"
            id="with-value"
            label="Avec Valeur Pré-sélectionnée"
            contextIcon={<Sparkles className="h-5 w-5" />}
            options={projectTypeOptions}
            value="ruche"
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Section 4 : Caractéristiques */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">4. Caractéristiques</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 font-semibold">Accessibilité</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Navigation clavier (↑↓ Enter Escape)</li>
              <li>✅ ARIA complet (role, aria-expanded, etc.)</li>
              <li>✅ Focus visible</li>
              <li>✅ Screen readers</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 font-semibold">UX</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Fermeture au clic extérieur</li>
              <li>✅ Scroll automatique vers option focalisée</li>
              <li>✅ Animations fluides</li>
              <li>✅ Barre de défilement stylisée</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 font-semibold">Design</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Options riches (icône + titre + sous-titre)</li>
              <li>✅ Icône contextuelle</li>
              <li>✅ Checkmark pour sélection</li>
              <li>✅ Dark mode automatique</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-3 font-semibold">Technique</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ Input caché pour formulaires</li>
              <li>✅ TypeScript strict</li>
              <li>✅ Hauteur 52px (design system)</li>
              <li>✅ Border radius 14px</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
