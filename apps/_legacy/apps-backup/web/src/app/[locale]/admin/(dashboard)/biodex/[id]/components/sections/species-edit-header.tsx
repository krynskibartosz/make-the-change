'use client';

import { type FC } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/admin/language-switcher';
import { useTranslationContext } from '../../contexts/translation-context';

import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

type SpeciesEditHeaderProps = {
  autoSave: AutoSaveReturn;
  hasUnsavedChanges: boolean;
};

/**
 * Species Edit Header Component
 *
 * UX simple et claire (aligné avec partners):
 * - Statut de sauvegarde automatique (NO MANUAL SAVE BUTTON)
 * - Language switcher
 * - Visual feedback instantané
 */
export const SpeciesEditHeader: FC<SpeciesEditHeaderProps> = ({
  autoSave,
  hasUnsavedChanges,
}) => {
  const t = useTranslations('admin.biodex.edit');
  const translationContext = useTranslationContext();

  return (
    <div className="flex flex-row items-center justify-between px-4 py-4 md:px-8">
      {/* Left: Save Status Indicator */}
      <div className="flex items-center gap-2">
        {autoSave.status === 'saving' && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Sauvegarde en cours...</span>
          </div>
        )}
        {autoSave.status === 'saved' && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="h-3 w-3" />
            <span>Sauvegardé</span>
          </div>
        )}
        {autoSave.status === 'pending' && (
          <div className="flex items-center gap-1.5 text-sm text-amber-600">
            <Loader2 className="h-3 w-3" />
            <span>Modification en attente...</span>
          </div>
        )}
        {autoSave.status === 'error' && (
          <div className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>Erreur de sauvegarde</span>
          </div>
        )}
        {autoSave.status === 'pristine' && !hasUnsavedChanges && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Check className="h-3 w-3" />
            <span>Tous les changements sont sauvegardés</span>
          </div>
        )}
      </div>

      {/* Right: Language Switcher */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher translationContext={translationContext} />
      </div>
    </div>
  );
};