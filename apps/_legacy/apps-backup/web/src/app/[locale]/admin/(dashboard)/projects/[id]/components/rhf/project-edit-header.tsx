'use client';

import { type FC } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

type ProjectEditHeaderRHFProps = {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onManualSave: () => Promise<void>;
  lastSavedAt?: Date | null;
  errorMessage?: string | null;
};

/**
 * Project Edit Header Component
 *
 * Simple UX matching partner page:
 * - Auto-save status indicator (NO MANUAL SAVE BUTTON)
 * - Visual feedback
 * - Minimal and clean
 */
export const ProjectEditHeaderRHF: FC<ProjectEditHeaderRHFProps> = ({
  isSaving,
  hasUnsavedChanges,
  lastSavedAt,
  errorMessage,
}) => {
  return (
    <div className="flex flex-row items-center justify-between px-4 py-4 md:px-8">
      {/* Left: Save Status Indicator */}
      <div className="flex items-center gap-2">
        {isSaving && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Sauvegarde en cours...</span>
          </div>
        )}
        {!isSaving && errorMessage && (
          <div className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>Erreur de sauvegarde</span>
          </div>
        )}
        {!isSaving && !errorMessage && hasUnsavedChanges && (
          <div className="flex items-center gap-1.5 text-sm text-amber-600">
            <Loader2 className="h-3 w-3" />
            <span>Modification en attente...</span>
          </div>
        )}
        {!isSaving && !errorMessage && !hasUnsavedChanges && lastSavedAt && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="h-3 w-3" />
            <span>
              Sauvegardé à{' '}
              {lastSavedAt.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
        {!isSaving && !errorMessage && !hasUnsavedChanges && !lastSavedAt && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Check className="h-3 w-3" />
            <span>Tous les changements sont sauvegardés</span>
          </div>
        )}
      </div>

      {/* Right: Could add language switcher or other actions here */}
      <div className="flex items-center gap-3">
        {/* Reserved for future actions */}
      </div>
    </div>
  );
};
