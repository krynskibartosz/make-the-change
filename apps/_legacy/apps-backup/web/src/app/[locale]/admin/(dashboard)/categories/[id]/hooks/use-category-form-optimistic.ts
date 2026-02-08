'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import { useOptimisticAutoSave } from '@/hooks/use-optimistic-autosave';
import {
  categoryFormSchema,
  normalizeCategoryFormValues,
  categoryFormToUpdatePayload,
  type CategoryFormData,
  type RawCategoryData,
} from '../types/category-form.types';

/**
 * Props for useCategoryFormOptimistic hook
 */
export interface UseCategoryFormOptimisticProps {
  categoryId: string;
  initialData: RawCategoryData | null;
  debug?: boolean;
}

/**
 * Return type for useCategoryFormOptimistic hook
 */
export interface UseCategoryFormOptimisticReturn {
  form: ReturnType<typeof useForm<CategoryFormData>>;
  autoSave: ReturnType<typeof useOptimisticAutoSave>;
  hasUnsavedChanges: boolean;
}

/**
 * Hook de formulaire optimisé pour l'édition de catégories.
 *
 * Architecture moderne 2025 (alignée avec partners/biodex):
 * - Auto-save unifié avec debounce intelligent (1500ms)
 * - Flush immédiat au blur via autoSave.saveNow()
 * - Retry automatique avec backoff exponentiel
 * - Optimistic UI avec cache invalidation
 *
 * @example
 * ```tsx
 * const { form, autoSave } = useCategoryFormOptimistic({
 *   categoryId,
 *   initialData,
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
export function useCategoryFormOptimistic({
  categoryId,
  initialData,
  debug = false,
}: UseCategoryFormOptimisticProps): UseCategoryFormOptimisticReturn {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  // Track if form has been initialized
  const isInitializedRef = useRef(false);

  // ============================================================================
  // React Hook Form
  // ============================================================================

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: useMemo(
      () => normalizeCategoryFormValues(initialData),
      [initialData]
    ),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  // ============================================================================
  // tRPC Mutations
  // ============================================================================

  const { mutateAsync: updateCategory } = trpc.admin.categories.update.useMutation({
    // Invalidate list views after update
    onSettled: () => {
      utils.admin.categories.list.invalidate();
      utils.admin.categories.listPaginated.invalidate();
    },
  });

  // ============================================================================
  // Unified Save Function
  // ============================================================================

  const executeSave = useCallback(async () => {
    if (debug) console.log('🔥 [CategoryFormOptimistic] executeSave CALLED');

    if (!categoryId) {
      console.warn('[CategoryFormOptimistic] No categoryId, skipping save');
      return;
    }

    try {
      if (debug) console.log('🚀 [CategoryFormOptimistic] Starting save...', { categoryId });

      // Get current form values
      const currentValues = form.getValues();
      if (debug) console.log('📋 [CategoryFormOptimistic] Form values:', JSON.stringify(currentValues, null, 2));

      // Convert form data to API payload
      const dataToSend = categoryFormToUpdatePayload(currentValues);
      if (debug) console.log('📦 [CategoryFormOptimistic] API payload:', JSON.stringify(dataToSend, null, 2));

      // Execute update mutation
      await updateCategory({
        id: categoryId,
        patch: dataToSend,
      });

      if (debug) console.log('[CategoryFormOptimistic] Category data saved ✓');

      // Reset form dirty state
      form.reset(currentValues, { keepValues: true });

      if (debug) console.log('[CategoryFormOptimistic] Save completed successfully ✓');

      // Show success toast
      toast({
        variant: 'success',
        title: `${currentValues.name} • Sauvegardé`,
        description: 'Toutes les modifications ont été enregistrées.',
      });

    } catch (error) {
      if (debug) console.error('[CategoryFormOptimistic] Save failed:', error);
      throw error; // Let useOptimisticAutoSave handle retry logic
    }
  }, [categoryId, form, updateCategory, toast, debug]);

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

    const normalized = normalizeCategoryFormValues(initialData);
    form.reset(normalized);
    isInitializedRef.current = true;

    if (debug) console.log('[CategoryFormOptimistic] Form initialized with data');
  }, [initialData, form, debug]);

  // ============================================================================
  // Return
  // ============================================================================

  const hasUnsavedChanges = useMemo(() => {
    return (
      form.formState.isDirty ||
      autoSave.status === 'pending' ||
      autoSave.status === 'saving'
    );
  }, [form.formState.isDirty, autoSave.status]);

  return {
    form,
    autoSave,
    hasUnsavedChanges,
  };
}
