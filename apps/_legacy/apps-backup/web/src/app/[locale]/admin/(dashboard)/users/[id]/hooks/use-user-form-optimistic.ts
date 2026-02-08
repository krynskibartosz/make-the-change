'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import {
  userDetailFormSchema,
  normalizeUserFormValues,
  userFormToUpdatePayload,
  type UserFormData,
  type EnrichedUserData,
} from '../types/user-form.types';
import { useOptimisticAutoSave } from '@/hooks/use-optimistic-autosave';

/**
 * Props for useUserFormOptimistic hook
 */
export interface UseUserFormOptimisticProps {
  userId: string;
  initialData: EnrichedUserData | null;
  debug?: boolean;
}

/**
 * Return type for useUserFormOptimistic hook
 */
export interface UseUserFormOptimisticReturn {
  form: ReturnType<typeof useForm<UserFormData>>;
  autoSave: ReturnType<typeof useOptimisticAutoSave>;
  hasUnsavedChanges: boolean;
}

/**
 * Hook de formulaire optimisé pour l'édition d'utilisateurs.
 *
 * Architecture moderne 2025 (alignée avec partners et products):
 * - Auto-save unifié avec debounce intelligent (1500ms)
 * - Flush immédiat au blur via autoSave.saveNow()
 * - Retry automatique avec backoff exponentiel
 * - Optimistic UI avec cache invalidation
 *
 * @example
 * ```tsx
 * const { form, autoSave } = useUserFormOptimistic({
 *   userId,
 *   initialData,
 * });
 *
 * // Dans un onChange
 * <Input
 *   onChange={(e) => {
 *     setValue('email', e.target.value);
 *     autoSave.triggerSave();
 *   }}
 *   onBlur={() => autoSave.saveNow()} // Sauvegarde immédiate
 * />
 * ```
 */
export function useUserFormOptimistic({
  userId,
  initialData,
  debug = false,
}: UseUserFormOptimisticProps): UseUserFormOptimisticReturn {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  // Track if form has been initialized
  const isInitializedRef = useRef(false);

  // ============================================================================
  // React Hook Form
  // ============================================================================

  const form = useForm<UserFormData>({
    resolver: zodResolver(userDetailFormSchema),
    defaultValues: useMemo(
      () => normalizeUserFormValues(initialData),
      [initialData]
    ),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  // ============================================================================
  // tRPC Mutations
  // ============================================================================

  const { mutateAsync: updateUser } = trpc.admin.users.update.useMutation({
    onSettled: () => {
      utils.admin.users.list.invalidate();
    },
  });

  // ============================================================================
  // Unified Save Function
  // ============================================================================

  const executeSave = useCallback(async () => {
    console.log('🔥 [executeSave] CALLED');

    if (!userId) {
      console.warn('[UserFormOptimistic] No userId, skipping save');
      return;
    }

    try {
      console.log('🚀 [UserFormOptimistic] Starting unified save...', { userId });

      // Get current form values
      const currentValues = form.getValues();
      console.log('📋 [UserFormOptimistic] Form values:', JSON.stringify(currentValues, null, 2));

      // ============================================================================
      // 1. Save User Data
      // ============================================================================

      // Convert form data to API payload (handles null conversion, field filtering)
      const dataToSend = userFormToUpdatePayload(currentValues);
      console.log('📦 [UserFormOptimistic] API payload BEFORE mutation:', JSON.stringify(dataToSend, null, 2));

      const mutationPayload = {
        userId,
        patch: dataToSend,
      };
      console.log('🎯 [UserFormOptimistic] Full mutation payload:', JSON.stringify(mutationPayload, null, 2));

      await updateUser(mutationPayload);

      if (debug) console.log('[UserFormOptimistic] User data saved ✓');

      // ============================================================================
      // 2. Reset form dirty state
      // ============================================================================

      form.reset(currentValues, { keepValues: true });

      if (debug) console.log('[UserFormOptimistic] Unified save completed successfully ✓');

      // Show success toast
      toast({
        variant: 'success',
        title: `${currentValues.email} • Sauvegardé`,
        description: 'Toutes les modifications ont été enregistrées.',
      });

    } catch (error) {
      if (debug) console.error('[UserFormOptimistic] Save failed:', error);
      throw error; // Let useOptimisticAutoSave handle retry logic
    }
  }, [userId, form, updateUser, toast, debug]);

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

    const normalized = normalizeUserFormValues(initialData);
    form.reset(normalized);
    isInitializedRef.current = true;

    if (debug) console.log('[UserFormOptimistic] Form initialized with data');
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
