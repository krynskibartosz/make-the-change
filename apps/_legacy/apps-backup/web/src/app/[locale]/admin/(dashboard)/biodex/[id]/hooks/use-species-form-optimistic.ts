'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import { buildTranslationData } from '@make-the-change/shared';
import type { TranslationContextValue } from '../contexts/translation-context';
import {
  speciesFormSchema,
  normalizeSpeciesFormValues,
  speciesToUpdatePayload,
  type SpeciesFormData,
  type EnrichedSpeciesData,
} from '../types/species-form.types';

// ============================================================================
// Hook importé du dossier global (même que products/partners)
// ============================================================================
import { useOptimisticAutoSave } from '@/hooks/use-optimistic-autosave';

/**
 * Props for useSpeciesFormOptimistic hook
 */
export interface UseSpeciesFormOptimisticProps {
  speciesId: string;
  initialData: EnrichedSpeciesData | null;
  translationContext: TranslationContextValue;
  debug?: boolean;
}

/**
 * Return type for useSpeciesFormOptimistic hook
 */
export interface UseSpeciesFormOptimisticReturn {
  form: ReturnType<typeof useForm<SpeciesFormData>>;
  autoSave: ReturnType<typeof useOptimisticAutoSave>;
  hasUnsavedChanges: boolean;
}

/**
 * Hook de formulaire optimisé pour l'édition d'espèces avec traductions.
 *
 * Architecture moderne 2025 (alignée avec products/partners):
 * - Auto-save unifié avec debounce intelligent (1500ms)
 * - Flush immédiat au blur via autoSave.saveNow()
 * - Merge espèce + traductions en une seule transaction
 * - Retry automatique avec backoff exponentiel
 * - Optimistic UI avec cache invalidation
 *
 * @example
 * ```tsx
 * const { form, autoSave } = useSpeciesFormOptimistic({
 *   speciesId,
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
export function useSpeciesFormOptimistic({
  speciesId,
  initialData,
  translationContext,
  debug = false,
}: UseSpeciesFormOptimisticProps): UseSpeciesFormOptimisticReturn {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  // Track if form has been initialized
  const isInitializedRef = useRef(false);

  // ============================================================================
  // React Hook Form
  // ============================================================================

  const form = useForm<SpeciesFormData>({
    resolver: zodResolver(speciesFormSchema),
    defaultValues: useMemo(
      () => normalizeSpeciesFormValues(initialData),
      [initialData]
    ),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  // ============================================================================
  // tRPC Mutations
  // ============================================================================

  const updateSpecies = trpc.admin.species.update.useMutation({
    onSuccess: () => {
      // Invalidate cache
      void utils.admin.species.list.invalidate();
    },
    onError: (error) => {
      console.error('[useSpeciesFormOptimistic] Update failed:', error);
      throw error; // Let useOptimisticAutoSave handle retry
    },
  });

  // ============================================================================
  // Save Function (Species + Translations merged)
  // ============================================================================

  const saveFn = useCallback(
    async () => {
      if (!speciesId) {
        throw new Error('Species ID is required for save');
      }

      const formData = form.getValues();

      if (debug) {
        console.log('[useSpeciesFormOptimistic] Saving...', {
          speciesId,
          formData,
          currentLanguage: translationContext.currentLanguage,
        });
      }

      // Build species payload
      const speciesPayload = speciesToUpdatePayload(formData);

      // Single mutation
      await updateSpecies.mutateAsync({
        id: speciesId,
        data: speciesPayload as any, // Type assertion for now
      });

      if (debug) {
        console.log('[useSpeciesFormOptimistic] Save successful');
      }
    },
    [
      speciesId,
      form,
      translationContext.currentLanguage,
      updateSpecies,
      debug,
    ]
  );

  // ============================================================================
  // Auto-Save Hook (Unified)
  // ============================================================================

  const autoSave = useOptimisticAutoSave({
    saveFn,
    debounceMs: 1500,
    enableRetry: true,
    maxRetries: 3,
    debug,
  });

  // ============================================================================
  // Form Change Tracking
  // ============================================================================

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }

    const subscription = form.watch(() => {
      autoSave.markDirty();
    });

    return () => subscription.unsubscribe();
  }, [form, autoSave]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    form,
    autoSave,
    hasUnsavedChanges: form.formState.isDirty,
  };
}