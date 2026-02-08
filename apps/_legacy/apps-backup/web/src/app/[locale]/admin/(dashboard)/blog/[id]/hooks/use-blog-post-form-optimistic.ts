'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import { useOptimisticAutoSave } from '@/hooks/use-optimistic-autosave';
import {
  blogPostFormSchema,
  normalizeBlogPostFormValues,
  blogPostFormToUpdatePayload,
  type BlogPostFormData,
  type RawBlogPostData,
} from '../types/blog-post-form.types';

/**
 * Props for useBlogPostFormOptimistic hook
 */
export interface UseBlogPostFormOptimisticProps {
  postId: string;
  initialData: RawBlogPostData | null;
  debug?: boolean;
}

/**
 * Return type for useBlogPostFormOptimistic hook
 */
export interface UseBlogPostFormOptimisticReturn {
  form: ReturnType<typeof useForm<BlogPostFormData>>;
  autoSave: ReturnType<typeof useOptimisticAutoSave>;
  hasUnsavedChanges: boolean;
}

/**
 * Hook de formulaire optimisé pour l'édition d'articles de blog.
 *
 * Architecture moderne 2025 (alignée avec categories/partners/biodex):
 * - Auto-save unifié avec debounce intelligent (1500ms)
 * - Flush immédiat au blur via autoSave.saveNow()
 * - Retry automatique avec backoff exponentiel
 * - Optimistic UI avec cache invalidation
 *
 * @example
 * ```tsx
 * const { form, autoSave } = useBlogPostFormOptimistic({
 *   postId,
 *   initialData,
 * });
 *
 * // Dans un onChange
 * <Input
 *   onChange={(e) => {
 *     setValue('title', e.target.value);
 *     autoSave.triggerSave();
 *   }}
 *   onBlur={() => autoSave.saveNow()} // Sauvegarde immédiate
 * />
 * ```
 */
export function useBlogPostFormOptimistic({
  postId,
  initialData,
  debug = false,
}: UseBlogPostFormOptimisticProps): UseBlogPostFormOptimisticReturn {
  const utils = trpc.useUtils();
  const { toast } = useToast();

  // Track if form has been initialized
  const isInitializedRef = useRef(false);

  // ============================================================================
  // React Hook Form
  // ============================================================================

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: useMemo(
      () => normalizeBlogPostFormValues(initialData),
      [initialData]
    ),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  // ============================================================================
  // tRPC Mutations
  // ============================================================================

  const { mutateAsync: updatePost } = trpc.admin.blogPosts.update.useMutation({
    // Invalidate list views after update
    onSettled: () => {
      utils.admin.blogPosts.list.invalidate();
      utils.admin.blogPosts.listPaginated.invalidate();
    },
  });

  // ============================================================================
  // Unified Save Function
  // ============================================================================

  const executeSave = useCallback(async () => {
    if (debug) console.log('🔥 [BlogPostFormOptimistic] executeSave CALLED');

    if (!postId) {
      console.warn('[BlogPostFormOptimistic] No postId, skipping save');
      return;
    }

    try {
      if (debug) console.log('🚀 [BlogPostFormOptimistic] Starting save...', { postId });

      // Get current form values
      const currentValues = form.getValues();
      if (debug) console.log('📋 [BlogPostFormOptimistic] Form values:', JSON.stringify(currentValues, null, 2));

      // Convert form data to API payload
      const dataToSend = blogPostFormToUpdatePayload(currentValues);
      if (debug) console.log('📦 [BlogPostFormOptimistic] API payload:', JSON.stringify(dataToSend, null, 2));

      // Execute update mutation
      await updatePost({
        id: postId,
        patch: dataToSend,
      });

      if (debug) console.log('[BlogPostFormOptimistic] Post data saved ✓');

      // Reset form dirty state
      form.reset(currentValues, { keepValues: true });

      if (debug) console.log('[BlogPostFormOptimistic] Save completed successfully ✓');

      // Show success toast
      toast({
        variant: 'success',
        title: `${currentValues.title} • Sauvegardé`,
        description: 'Toutes les modifications ont été enregistrées.',
      });

    } catch (error) {
      if (debug) console.error('[BlogPostFormOptimistic] Save failed:', error);
      throw error; // Let useOptimisticAutoSave handle retry logic
    }
  }, [postId, form, updatePost, toast, debug]);

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

    const normalized = normalizeBlogPostFormValues(initialData);
    form.reset(normalized);
    isInitializedRef.current = true;

    if (debug) console.log('[BlogPostFormOptimistic] Form initialized with data');
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
