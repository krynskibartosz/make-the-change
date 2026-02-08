'use client'

import type { FC } from 'react'
import { FormProvider } from 'react-hook-form'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { AdminDetailLayout } from '@/components/admin/admin-detail-layout'
import type { ProductBlurHash } from '@/types/blur'
import { useTranslation } from '../contexts/translation-context'
import { useProductFormOptimistic } from '../hooks/use-product-form-optimistic'
import type { ProductFormData } from '../types/product-form.types'
import {
  EssentialInfoSection,
  ImagesSection,
  MetadataSection,
  PricingStatusSection,
  ProductDetailsSection,
} from '.'
import { ProductEditHeader } from './product-edit-header'

interface ProductFormWrapperProps {
  productId: string
  initialData: Partial<ProductFormData> | null
  imageBlurMap: Record<string, ProductBlurHash>
}

/**
 * Product form wrapper with modern optimistic auto-save (2025 UX).
 *
 * Features:
 * - Unified auto-save (product + translations merged)
 * - 1.5s debounce with immediate flush on blur
 * - Retry logic with exponential backoff
 * - Optimistic UI with visual feedback
 */
export const ProductFormWrapper: FC<ProductFormWrapperProps> = ({
  productId,
  initialData,
  imageBlurMap,
}) => {
  // Get translation context
  const translationContext = useTranslation()

  // Use optimistic form hook (new 2025 architecture)
  const { form, autoSave, hasUnsavedChanges } = useProductFormOptimistic({
    productId,
    initialData,
    translationContext,
    debug: process.env.NODE_ENV === 'development',
  })

  return (
    <FormProvider {...form}>
      <form
        className="contents"
        onSubmit={(event) => {
          event.preventDefault()
          void autoSave.saveNow()
        }}
      >
        <AdminDetailLayout
          headerContent={
            <ProductEditHeader autoSave={autoSave} hasUnsavedChanges={hasUnsavedChanges} />
          }
        >
          <DetailView gridCols={2} spacing="md" variant="cards">
            <EssentialInfoSection autoSave={autoSave} />
            <PricingStatusSection autoSave={autoSave} />

            <ImagesSection imageBlurMap={imageBlurMap} productId={productId} autoSave={autoSave} />

            <ProductDetailsSection autoSave={autoSave} />

            <MetadataSection autoSave={autoSave} />
          </DetailView>
        </AdminDetailLayout>
      </form>
    </FormProvider>
  )
}
