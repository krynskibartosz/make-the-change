'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import { buildTranslationData } from '@make-the-change/shared';
import type { TranslationContextValue } from '../contexts/translation-context';
import {
  partnerFormSchema,
  normalizePartnerFormValues,
  partnerFormToUpdatePayload,
  type PartnerFormData,
  type EnrichedPartnerData,
} from '../types/partner-form.types';

// ============================================================================
// Hook importé du dossier global (même que products)
// ============================================================================
import { useOptimisticAutoSave } from '@/hooks/use-optimistic-autosave';

/**
 * Props for usePartnerFormOptimistic hook
 */
export interface UsePartnerFormOptimisticProps {
  partnerId: string;
  initialData: EnrichedPartnerData | null;
  translationContext: TranslationContextValue;
  debug?: boolean;
}

/**
 * Return type for usePartnerFormOptimistic hook
 */
export interface UsePartnerFormOptimisticReturn {
  form: ReturnType<typeof useForm<PartnerFormData>>;
  autoSave: ReturnType<typeof useOptimisticAutoSave>;
  hasUnsavedChanges: boolean;
}

/**
 * Hook de formulaire optimisé pour l'édition de partenaires avec traductions.
 *
 * Architecture moderne 2025 (alignée avec products):
 * - Auto-save unifié avec debounce intelligent (1500ms)
 * - Flush immédiat au blur via autoSave.saveNow()
 * - Merge partenaire + traductions en une seule transaction
 * - Retry automatique avec backoff exponentiel
 * - Optimistic UI avec cache invalidation
 *
 * @example
 * ```tsx
 * const { form, autoSave } = usePartnerFormOptimistic({
 *   partnerId,
 *   initialData,
 *   translationContext,
 * });
 *
 * // Dans un onChange
 * <Input
 *   onChange={(e) => {
 *     setValue('name', e.target.value);
 *     autoSave.triggerSave();
 *   }}
 *   onBlur={() => autoSave.saveNow()} // Sauvegarde immédiate
 * />
 * ```
 */
export function usePartnerFormOptimistic({
  partnerId,
  initialData,
  translationContext,
  debug = false,
}: UsePartnerFormOptimisticProps): UsePartnerFormOptimisticReturn {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  // Track if form has been initialized
  const isInitializedRef = useRef(false);

  // ============================================================================
  // React Hook Form
  // ============================================================================

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: useMemo(
      () => normalizePartnerFormValues(initialData),
      [initialData]
    ),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  // ============================================================================
  // tRPC Mutations
  // ============================================================================

  const { mutateAsync: updatePartner } = trpc.admin.partners.update.useMutation({
    // Don't invalidate detail_enriched - we already have the latest data locally
    onSettled: () => {
      utils.admin.partners.list.invalidate();
    },
  });

  const { mutateAsync: saveTranslations } = trpc.translations.bulkUpsert.useMutation({
    onSuccess: () => {
      utils.translations.getByEntity.invalidate({
        entity_type: 'producer',
        entity_id: partnerId,
      });
    },
  });

  // ============================================================================
  // Unified Save Function
  // ============================================================================

  const executeSave = useCallback(async () => {
    console.log('🔥 [executeSave] CALLED');

    if (!partnerId) {
      console.warn('[PartnerFormOptimistic] No partnerId, skipping save');
      return;
    }

    try {
      console.log('🚀 [PartnerFormOptimistic] Starting unified save...', { partnerId });

      // Get current form values
      const currentValues = form.getValues();
      console.log('📋 [PartnerFormOptimistic] Form values:', JSON.stringify(currentValues, null, 2));

      // ============================================================================
      // 1. Save Partner Data
      // ============================================================================

      // Convert form data to API payload (handles null conversion, field filtering)
      const dataToSend = partnerFormToUpdatePayload(currentValues);
      console.log('📦 [PartnerFormOptimistic] API payload BEFORE mutation:', JSON.stringify(dataToSend, null, 2));

      const mutationPayload = {
        id: partnerId,
        data: dataToSend,
      };
      console.log('🎯 [PartnerFormOptimistic] Full mutation payload:', JSON.stringify(mutationPayload, null, 2));

      await updatePartner(mutationPayload);

      if (debug) console.log('[PartnerFormOptimistic] Partner data saved ✓');

      // ============================================================================
      // 2. Save Translations (if context available)
      // ============================================================================

      if (translationContext && translationContext.translations) {
        if (debug) console.log('[PartnerFormOptimistic] Translation context available');

        const translationPayload = buildTranslationData(
          'producer',
          partnerId,
          translationContext.translations
        );

        if (debug) {
          console.log('[PartnerFormOptimistic] Translation payload:', {
            count: translationPayload.length,
            payload: translationPayload,
          });
        }

        if (translationPayload.length > 0) {
          await saveTranslations({
            entity_type: 'producer',
            entity_id: partnerId,
            translations: translationPayload,
          });

          translationContext.clearDirty();

          if (debug) console.log('[PartnerFormOptimistic] Translations saved ✓');
        } else {
          if (debug) console.log('[PartnerFormOptimistic] No translations to save');
        }
      } else {
        if (debug) console.log('[PartnerFormOptimistic] No translation context');
      }

      // ============================================================================
      // 3. Reset form dirty state
      // ============================================================================

      form.reset(currentValues, { keepValues: true });

      if (debug) console.log('[PartnerFormOptimistic] Unified save completed successfully ✓');

      // Show success toast
      toast({
        variant: 'success',
        title: `${currentValues.name} • Sauvegardé`,
        description: 'Toutes les modifications ont été enregistrées.',
      });

    } catch (error) {
      if (debug) console.error('[PartnerFormOptimistic] Save failed:', error);
      throw error; // Let useOptimisticAutoSave handle retry logic
    }
  }, [partnerId, form, translationContext, updatePartner, saveTranslations, toast, debug]);

  // ============================================================================
  // Auto-Save Hook
  // ============================================================================

  const autoSave = useOptimisticAutoSave({
    saveFn: executeSave,
    debounceMs: 1500,      // 1.5s debounce (moderne et confortable)
    savedIndicatorMs: 3000, // Affiche "✓ Sauvegardé" pendant 3s
    enableRetry: true,
    maxRetries: 3,
    debug,
  });

  // ============================================================================
  // Initial form setup (only once when data arrives)
  // ============================================================================

  useEffect(() => {
    if (!initialData || isInitializedRef.current) return;

    const normalized = normalizePartnerFormValues(initialData);
    form.reset(normalized);
    isInitializedRef.current = true;

    if (debug) console.log('[PartnerFormOptimistic] Form initialized with data');
  }, [initialData, form, debug]);

  // Watch translation changes and mark dirty
  useEffect(() => {
    if (translationContext?.isDirty) {
      autoSave.triggerSave();
    }
  }, [translationContext?.isDirty, autoSave.triggerSave]);

  // ============================================================================
  // Return
  // ============================================================================

  const hasUnsavedChanges = useMemo(() => {
    return (
      form.formState.isDirty ||
      translationContext?.isDirty ||
      autoSave.status === 'pending' ||
      autoSave.status === 'saving'
    );
  }, [form.formState.isDirty, translationContext?.isDirty, autoSave.status]);

  return {
    form,
    autoSave,
    hasUnsavedChanges,
  };
}
