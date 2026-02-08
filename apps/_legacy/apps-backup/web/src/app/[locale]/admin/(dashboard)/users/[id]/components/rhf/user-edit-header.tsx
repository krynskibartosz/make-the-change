'use client';

import { type FC } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

type UserEditHeaderProps = {
  autoSave: AutoSaveReturn;
  hasUnsavedChanges: boolean;
};

/**
 * User Edit Header Component
 *
 * UX simple et claire:
 * - Statut de sauvegarde automatique (NO MANUAL SAVE BUTTON)
 * - Visual feedback instantané
 * - Matches partner edit header pattern for consistency
 */
export const UserEditHeader: FC<UserEditHeaderProps> = ({
  autoSave,
  hasUnsavedChanges,
}) => {
  const t = useTranslations('admin.users.edit.autoSave');

  return (
    <div className="flex flex-row items-center justify-between px-4 py-4 md:px-8">
      {/* Left: Save Status Indicator */}
      <div className="flex items-center gap-2">
        {autoSave.status === 'saving' && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{t('saving')}</span>
          </div>
        )}
        {autoSave.status === 'saved' && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <Check className="h-3 w-3" />
            <span>{t('saved')}</span>
          </div>
        )}
        {autoSave.status === 'pending' && (
          <div className="flex items-center gap-1.5 text-sm text-amber-600">
            <Loader2 className="h-3 w-3" />
            <span>{t('pending')}</span>
          </div>
        )}
        {autoSave.status === 'error' && (
          <div className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>{t('error')}</span>
          </div>
        )}
        {autoSave.status === 'pristine' && !hasUnsavedChanges && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Check className="h-3 w-3" />
            <span>{t('pristine')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
