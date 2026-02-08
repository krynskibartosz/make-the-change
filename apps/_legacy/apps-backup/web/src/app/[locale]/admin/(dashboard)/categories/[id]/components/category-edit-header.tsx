'use client';

import { type FC } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

type CategoryEditHeaderProps = {
  autoSave: AutoSaveReturn;
  hasUnsavedChanges: boolean;
};

/**
 * Category Edit Header Component
 *
 * UX simple et claire:
 * - Statut de sauvegarde automatique (NO MANUAL SAVE BUTTON)
 * - Visual feedback instantané
 */
export const CategoryEditHeader: FC<CategoryEditHeaderProps> = ({
  autoSave,
  hasUnsavedChanges,
}) => {
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
    </div>
  );
};
