'use client';

import { type FC, useMemo, useCallback } from 'react';
import { Package, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';

import {
  AdminDetailHeader,
  AdminDetailActions,
} from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header';
import { useToast } from '@/hooks/use-toast';
import { LanguageSwitcher } from '@/components/admin/language-switcher';
import { useTranslation } from '../contexts/translation-context';

import type { ProductFormData } from '@/app/[locale]/admin/(dashboard)/products/[id]/types/product-form.types';
import type { AutoSaveReturn } from '@/app/[locale]/admin/(dashboard)/products/[id]/hooks/use-optimistic-auto-save';

type ProductEditHeaderProps = {
  autoSave: AutoSaveReturn;
  hasUnsavedChanges: boolean;
};

export const ProductEditHeader: FC<ProductEditHeaderProps> = ({
  autoSave,
  hasUnsavedChanges,
}) => {
  const t = useTranslations();
  const { toast } = useToast();
  const { watch } = useFormContext<ProductFormData>();
  const translationContext = useTranslation();

  const currentData = watch();

  // Modern save status computation (2025 UX)
  const saveStatus = useMemo(() => {
    // Status mapping: useOptimisticAutoSave -> AdminDetailActions
    switch (autoSave.status) {
      case 'saving':
        return {
          type: 'saving' as const,
          message: 'Sauvegarde en cours...',
        };

      case 'error':
        return {
          type: 'error' as const,
          message: autoSave.errorMessage || 'Erreur de sauvegarde',
        };

      case 'pending':
        return {
          type: 'modified' as const,
          message: `${autoSave.pendingChanges} modification${autoSave.pendingChanges > 1 ? 's' : ''} en attente`,
          count: autoSave.pendingChanges,
          fields: ['form'],
        };

      case 'saved':
        const timeStr = autoSave.lastSavedAt?.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return {
          type: 'pristine' as const,
          message: timeStr ? `Sauvegardé à ${timeStr}` : 'Sauvegardé',
        };

      case 'pristine':
      default:
        return {
          type: 'pristine' as const,
          message: hasUnsavedChanges
            ? 'En attente de sauvegarde...'
            : 'Tous les changements sont sauvegardés',
        };
    }
  }, [autoSave.status, autoSave.errorMessage, autoSave.pendingChanges, autoSave.lastSavedAt, hasUnsavedChanges]);

  // Manual save function
  const handleSaveAll = useCallback(async () => {
    if (!currentData?.name) {
      console.warn('[ProductEditHeader] No name in currentData, aborting save');
      return;
    }

    try {
      await autoSave.saveNow();
      toast({
        variant: 'default',
        title: 'Sauvegarde réussie',
        description: 'Toutes les modifications ont été sauvegardées.',
      });
    } catch (error) {
      console.error('[ProductEditHeader] saveNow() failed:', error);
      // Error toast is already handled by useOptimisticAutoSave
    }
  }, [currentData, autoSave, toast]);

  const breadcrumbs = [
    {
      href: '/admin',
      label: t('admin.common.breadcrumbs.dashboard'),
      icon: Home,
    },
    {
      href: '/admin/products',
      label: t('admin.common.breadcrumbs.products'),
      icon: Package,
    },
    { label: currentData?.name || 'Produit' },
  ];

  return (
    <AdminDetailHeader
      breadcrumbs={breadcrumbs}
      title={currentData?.name || 'Produit'}
      actions={
        <div className="flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <AdminDetailActions saveStatus={saveStatus} onSaveAll={handleSaveAll} />
          <LanguageSwitcher translationContext={translationContext} />
        </div>
      }
      productImage={
        currentData?.images && currentData.images.length > 0
          ? currentData.images[0]
          : undefined
      }
      subtitle={`${t('admin.products.edit.subtitle')} • ${
        currentData?.slug || t('admin.products.edit.no_slug')
      }`}
    />
  );
};
