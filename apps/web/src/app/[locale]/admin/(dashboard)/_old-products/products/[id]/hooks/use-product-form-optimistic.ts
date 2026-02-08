'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { buildTranslationData } from '@make-the-change/shared'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc'

import {
  defaultProductValues,
  type ProductFormData,
  productFormSchema,
} from '../types/product-form.types'

import { useOptimisticAutoSave } from './use-optimistic-auto-save'

// ============================================================================
// Types
// ============================================================================

type TranslationContextValue = {
  translations: Record<string, { fr: string; en: string; nl: string }>
  translatableFields: string[]
  isDirty: boolean
  clearDirty: () => void
}

type UseProductFormOptimisticProps = {
  productId: string
  initialData?: Partial<ProductFormData> | null
  translationContext: TranslationContextValue | null
  debug?: boolean
}

type UseProductFormOptimisticReturn = {
  form: ReturnType<typeof useForm<ProductFormData>>
  autoSave: ReturnType<typeof useOptimisticAutoSave>
  hasUnsavedChanges: boolean
}

// ============================================================================
// Utilities
// ============================================================================

const normalizeFormValues = (data?: Partial<ProductFormData> | null): ProductFormData => {
  if (!data) {
    return { ...defaultProductValues }
  }

  return {
    ...defaultProductValues,
    ...data,
    name: data.name ?? defaultProductValues.name,
    slug: data.slug ?? defaultProductValues.slug,
    category_id: data.category_id ?? defaultProductValues.category_id,
    producer_id: data.producer_id ?? defaultProductValues.producer_id ?? '',
    short_description: data.short_description ?? defaultProductValues.short_description,
    description: data.description ?? defaultProductValues.description,
    price_points: data.price_points ?? defaultProductValues.price_points,
    price_eur_equivalent: data.price_eur_equivalent ?? undefined,
    stock_quantity: data.stock_quantity ?? defaultProductValues.stock_quantity,
    min_tier: data.min_tier ?? defaultProductValues.min_tier,
    fulfillment_method: data.fulfillment_method ?? defaultProductValues.fulfillment_method,
    is_active: data.is_active ?? defaultProductValues.is_active,
    featured: data.featured ?? defaultProductValues.featured,
    is_hero_product: data.is_hero_product ?? defaultProductValues.is_hero_product,
    stock_management: data.stock_management ?? defaultProductValues.stock_management,
    images: Array.isArray(data.images) ? data.images : defaultProductValues.images,
    tags: Array.isArray(data.tags) ? data.tags : defaultProductValues.tags,
    allergens: Array.isArray(data.allergens) ? data.allergens : defaultProductValues.allergens,
    certifications: Array.isArray(data.certifications)
      ? data.certifications
      : defaultProductValues.certifications,
    variants: data.variants ?? defaultProductValues.variants,
    metadata: data.metadata ?? defaultProductValues.metadata,
    nutrition_facts: data.nutrition_facts ?? defaultProductValues.nutrition_facts,
    seasonal_availability: data.seasonal_availability ?? defaultProductValues.seasonal_availability,
    origin_country: data.origin_country ?? defaultProductValues.origin_country,
    partner_source: data.partner_source ?? defaultProductValues.partner_source,
    launch_date: data.launch_date ?? defaultProductValues.launch_date,
    discontinue_date: data.discontinue_date ?? defaultProductValues.discontinue_date,
    seo_title: data.seo_title ?? defaultProductValues.seo_title,
    seo_description: data.seo_description ?? defaultProductValues.seo_description,
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook de formulaire optimisé pour l'édition de produits avec traductions.
 *
 * Architecture moderne 2025:
 * - Auto-save unifié avec debounce intelligent (1500ms)
 * - Flush immédiat au blur via autoSave.saveNow()
 * - Merge produit + traductions en une seule transaction
 * - Retry automatique avec backoff exponentiel
 * - Optimistic UI avec cache invalidation
 *
 * @example
 * ```tsx
 * const { form, autoSave } = useProductFormOptimistic({
 *   productId,
 *   initialData,
 *   translationContext,
 * });
 *
 * // Dans un onChange
 * <Input
 *   onChange={(e) => {
 *     setValue('name', e.target.value);
 *     autoSave.markDirty();
 *   }}
 *   onBlur={() => autoSave.saveNow()} // Sauvegarde immédiate
 * />
 * ```
 */
export function useProductFormOptimistic({
  productId,
  initialData,
  translationContext,
  debug = false,
}: UseProductFormOptimisticProps): UseProductFormOptimisticReturn {
  const utils = trpc.useUtils()
  const { toast } = useToast()

  // Track if form has been initialized to prevent re-syncing on every initialData change
  const isInitializedRef = useRef(false)

  // ============================================================================
  // React Hook Form
  // ============================================================================

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: useMemo(() => normalizeFormValues(initialData), [initialData]),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  })

  // ============================================================================
  // tRPC Mutations
  // ============================================================================

  const { mutateAsync: updateProduct } = trpc.admin.products.update.useMutation({
    // Don't invalidate detail_enriched - we already have the latest data locally
    // Invalidating would cause a refetch which triggers form.reset() which causes
    // all the refs to be out of sync and triggers infinite save loops
    onSettled: () => {
      utils.admin.products.list.invalidate()
    },
  })

  const { mutateAsync: saveTranslations } = trpc.translations.bulkUpsert.useMutation({
    onSuccess: () => {
      utils.translations.getByEntity.invalidate({
        entity_type: 'product',
        entity_id: productId,
      })
    },
  })

  // ============================================================================
  // Unified Save Function
  // ============================================================================

  const executeSave = useCallback(async () => {
    if (!productId) {
      if (debug) console.warn('[ProductFormOptimistic] No productId, skipping save')
      return
    }

    try {
      if (debug) console.log('[ProductFormOptimistic] Starting unified save...', { productId })

      // Get current form values
      const currentValues = form.getValues()

      if (debug) console.log('[ProductFormOptimistic] Form values:', currentValues)

      // ============================================================================
      // 1. Save Product Data
      // ============================================================================

      // Transform empty strings to null for API schema
      const cleanedValues = Object.fromEntries(
        Object.entries(currentValues).map(([key, value]) => [key, value === '' ? null : value]),
      ) as typeof currentValues

      if (debug) console.log('[ProductFormOptimistic] Cleaned values:', cleanedValues)

      await updateProduct({
        id: productId,
        patch: cleanedValues,
      })

      if (debug) console.log('[ProductFormOptimistic] Product data saved ✓')

      // ============================================================================
      // 2. Save Translations (if context available)
      // ============================================================================

      if (translationContext && translationContext.translations) {
        if (debug) console.log('[ProductFormOptimistic] Translation context available')

        const translationPayload = buildTranslationData(
          'product',
          productId,
          translationContext.translations,
        )

        if (debug) {
          console.log('[ProductFormOptimistic] Translation payload:', {
            count: translationPayload.length,
            payload: translationPayload,
          })
        }

        if (translationPayload.length > 0) {
          await saveTranslations({
            entity_type: 'product',
            entity_id: productId,
            translations: translationPayload,
          })

          translationContext.clearDirty()

          if (debug) console.log('[ProductFormOptimistic] Translations saved ✓')
        } else {
          if (debug) console.log('[ProductFormOptimistic] No translations to save')
        }
      } else {
        if (debug) console.log('[ProductFormOptimistic] No translation context')
      }

      // ============================================================================
      // 3. Reset form dirty state
      // ============================================================================

      form.reset(currentValues, { keepValues: true })

      if (debug) console.log('[ProductFormOptimistic] Unified save completed successfully ✓')

      // Show success toast (only for manual saves, not auto-save)
      toast({
        variant: 'success',
        title: `${currentValues.name} • Sauvegardé`,
        description: 'Toutes les modifications ont été enregistrées.',
      })
    } catch (error) {
      if (debug) console.error('[ProductFormOptimistic] Save failed:', error)
      throw error // Let useOptimisticAutoSave handle retry logic
    }
  }, [productId, form, translationContext, updateProduct, saveTranslations, toast, debug])

  // ============================================================================
  // Auto-Save Hook
  // ============================================================================

  const autoSave = useOptimisticAutoSave({
    saveFn: executeSave,
    debounceMs: 1500, // 1.5s debounce (moderne et confortable)
    savedIndicatorMs: 3000, // Affiche "✓ Sauvegardé" pendant 3s
    enableRetry: true,
    maxRetries: 3,
    debug,
  })

  // ============================================================================
  // Initial form setup (only once when data arrives)
  // ============================================================================

  // Only reset form ONCE when initialData first arrives, not on every change
  // This prevents re-syncing issues when the data comes back from the server
  // after a save, which would cause the refs in fields to be out of sync
  useEffect(() => {
    if (!initialData || isInitializedRef.current) return

    const normalized = normalizeFormValues(initialData)
    form.reset(normalized)
    isInitializedRef.current = true

    if (debug) console.log('[ProductFormOptimistic] Form initialized with data')
  }, [initialData, form, debug])

  // NOTE: We don't need a global watch() that calls markDirty() anymore!
  // Each field now handles its own blur logic with value comparison.
  // The global watch was causing infinite loops because:
  // 1. User changes field
  // 2. watch() triggers → markDirty()
  // 3. Auto-save executes
  // 4. form.reset() is called
  // 5. watch() triggers AGAIN → checks isDirty (still true) → markDirty() AGAIN
  // 6. Infinite loop!
  //
  // With per-field onBlur + value comparison, we don't need this global watcher.

  useEffect(() => {
    // Watch translation changes and mark dirty
    if (translationContext?.isDirty) {
      autoSave.markDirty()
    }
  }, [translationContext?.isDirty, autoSave.markDirty]) // ← Seulement markDirty

  // ============================================================================
  // Return
  // ============================================================================

  const hasUnsavedChanges = useMemo(() => {
    return (
      form.formState.isDirty ||
      translationContext?.isDirty ||
      autoSave.status === 'pending' ||
      autoSave.status === 'saving'
    )
  }, [form.formState.isDirty, translationContext?.isDirty, autoSave.status])

  return {
    form,
    autoSave,
    hasUnsavedChanges,
  }
}
