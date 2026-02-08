'use client';

/**
 * Exemple d'utilisation du Design System v2.0
 *
 * Ce fichier démontre l'utilisation de tous les composants v2.0
 * dans des cas d'usage réels.
 */

import { useState } from 'react';
import { Mail, Lock, Sparkles, TreeDeciduous, Droplet } from 'lucide-react';
import { ButtonV2, InputV2, CustomSelectV2 } from './index';

export function DesignSystemV2Example() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [emailError, setEmailError] = useState('');

  const projectOptions = [
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
    {
      value: 'eau',
      label: 'Restauration de cours d\'eau',
      subtitle: 'Protection des écosystèmes aquatiques',
      icon: <Droplet className="text-info" />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!email.includes('@')) {
      setEmailError('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    setEmailError('');
    console.log('Form submitted:', { email, password, selectedProject });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-12 p-8">
      {/* Section Boutons */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Boutons v2.0</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <ButtonV2 variant="primary">
              Investir dans une ruche
            </ButtonV2>

            <ButtonV2 variant="secondary">
              Voir mes 350 points
            </ButtonV2>

            <ButtonV2 variant="accent">
              En savoir plus
            </ButtonV2>
          </div>

          <div className="flex flex-wrap gap-4">
            <ButtonV2 variant="primary" size="sm">
              Small Button
            </ButtonV2>

            <ButtonV2 variant="secondary" size="lg">
              Large Button
            </ButtonV2>
          </div>

          <div className="flex flex-wrap gap-4">
            <ButtonV2 variant="primary" loading>
              Chargement...
            </ButtonV2>

            <ButtonV2 variant="accent" disabled>
              Disabled
            </ButtonV2>
          </div>

          <ButtonV2 variant="primary" fullWidth>
            Full Width Button
          </ButtonV2>
        </div>
      </section>

      {/* Section Inputs */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Inputs v2.0</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputV2
            label="Adresse e-mail"
            type="email"
            required
            placeholder="votreemail@exemple.com"
            leadingIcon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />

          <InputV2
            label="Mot de passe"
            type="password"
            required
            placeholder="••••••••"
            leadingIcon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helpText="Minimum 8 caractères"
          />

          <InputV2
            label="Email validé"
            type="email"
            value="validé@exemple.com"
            leadingIcon={<Mail />}
            state="success"
            disabled
          />
        </form>
      </section>

      {/* Section Custom Select */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Custom Select v2.0</h2>
        <div className="space-y-6">
          <CustomSelectV2
            label="Choisissez un projet à soutenir"
            options={projectOptions}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Sélectionnez un projet..."
          />

          <div className="rounded-lg border-2 border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Projet sélectionné : <strong>{selectedProject || 'Aucun'}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Section Formulaire Complet */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Formulaire Complet</h2>
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border-2 border-border bg-card p-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rejoignez le mouvement</h3>
            <p className="text-sm text-muted-foreground">
              Créez votre compte et commencez à soutenir des projets de biodiversité.
            </p>
          </div>

          <InputV2
            label="Adresse e-mail"
            type="email"
            required
            placeholder="votreemail@exemple.com"
            leadingIcon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
          />

          <InputV2
            label="Mot de passe"
            type="password"
            required
            placeholder="••••••••"
            leadingIcon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helpText="Minimum 8 caractères avec majuscules et chiffres"
          />

          <CustomSelectV2
            label="Projet initial à soutenir"
            options={projectOptions}
            value={selectedProject}
            onChange={setSelectedProject}
            placeholder="Sélectionnez votre premier projet..."
          />

          <div className="flex gap-4 pt-4">
            <ButtonV2 variant="secondary" type="button" fullWidth>
              Annuler
            </ButtonV2>
            <ButtonV2 variant="primary" type="submit" fullWidth>
              Créer mon compte
            </ButtonV2>
          </div>
        </form>
      </section>
    </div>
  );
}
