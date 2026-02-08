'use client'

import { ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { ImageGalleryModal } from '@/app/[locale]/admin/(dashboard)/components/images/image-gallery/image-gallery-modal'
import { ImageUploaderField } from '@/app/[locale]/admin/(dashboard)/components/images/image-uploader/adapters/image-uploader-field'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { ImageMasonry } from '@/components/ui/image-masonry'
import { useToast } from '@/hooks/use-toast'
import type { ProductBlurHash } from '@/types/blur'
import type { ProductFormData } from '../types/product-form.types'
import type { WithAutoSaveProps } from './with-auto-save'

type ImagesSectionProps = {
  productId?: string
  imageBlurMap?: Record<string, ProductBlurHash>
}

type GalleryState = {
  isOpen: boolean
  images: string[]
  initialIndex: number
}

export const ImagesSection: FC<ImagesSectionProps & WithAutoSaveProps> = ({
  productId,
  imageBlurMap = {},
  autoSave,
}) => {
  const t = useTranslations()
  const { control, setValue } = useFormContext<ProductFormData>()
  const images = useWatch({ control, name: 'images' }) ?? []
  const { toast } = useToast()

  const isPersisted = Boolean(productId)

  const [galleryModal, setGalleryModal] = useState<GalleryState>({
    isOpen: false,
    images,
    initialIndex: 0,
  })

  const updateImages = useCallback(
    (next: string[]) => {
      setValue('images', next, { shouldDirty: true, shouldTouch: true })
    },
    [setValue],
  )

  const fieldAdapter = useMemo(
    () => ({
      state: { value: images },
      handleChange: (updater: ((prev: string[]) => string[]) | string[]) => {
        const prev = images
        const next =
          typeof updater === 'function' ? (updater as (prev: string[]) => string[])(prev) : updater
        updateImages(Array.isArray(next) ? next : [])
      },
    }),
    [images, updateImages],
  )

  const handleImageDelete = useCallback(
    async (imageUrl: string, index: number) => {
      if (!productId) return
      try {
        const currentImages = images
        const nextImages = currentImages.filter((_, i) => i !== index)

        let filePath = ''
        const marker = '/storage/v1/object/public/products/'
        if (imageUrl.includes(marker)) {
          const parts = imageUrl.split(marker)
          filePath = parts[1] || ''
        }

        if (filePath) {
          const url = new URL('/api/upload/product-images', window.location.origin)
          url.searchParams.set('path', filePath)
          url.searchParams.set('productId', productId)
          url.searchParams.set('imageUrl', imageUrl)

          const response = await fetch(url.toString(), { method: 'DELETE' })
          if (!response.ok) throw new Error('delete_failed')
          const result = await response.json()
          updateImages(result.images ?? nextImages)
        } else {
          const response = await fetch('/api/upload/product-images', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, images: nextImages }),
          })
          if (!response.ok) throw new Error('delete_failed')
          const result = await response.json()
          updateImages(result.images ?? nextImages)
        }

        toast({
          variant: 'default',
          title: t('common.updated'),
          description: t('admin.products.edit.images.deleted'),
        })
      } catch (error) {
        console.error('❌ Image delete error', error)
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('admin.products.edit.images.delete_error'),
        })
      }
    },
    [images, productId, toast, t, updateImages],
  )

  const handleImageReplace = useCallback(
    (imageUrl: string, index: number) => {
      if (!productId) return
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.style.display = 'none'

      input.addEventListener('change', async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          input.remove()
          return
        }

        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('productId', productId)
          formData.append('oldImageUrl', imageUrl)
          formData.append('imageIndex', String(index))

          const response = await fetch('/api/upload/product-images', {
            method: 'PUT',
            body: formData,
          })

          if (!response.ok) throw new Error('replace_failed')
          const result = await response.json()
          updateImages(result.images ?? images)

          toast({
            variant: 'default',
            title: t('common.updated'),
            description: t('admin.products.edit.images.replaced'),
          })
        } catch (error) {
          console.error('❌ Image replace error', error)
          toast({
            variant: 'destructive',
            title: t('common.error'),
            description: t('admin.products.edit.images.replace_error'),
          })
        } finally {
          input.remove()
        }
      })

      document.body.append(input)
      input.click()
    },
    [images, productId, toast, t, updateImages],
  )

  const handleImagesReorder = useCallback(
    async (_oldIndex: number, _newIndex: number, newImages: string[]) => {
      if (!productId) return
      try {
        const response = await fetch('/api/upload/product-images', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, images: newImages }),
        })

        if (!response.ok) throw new Error('reorder_failed')
        const result = await response.json()
        updateImages(result.images ?? newImages)

        toast({
          variant: 'default',
          title: t('common.updated'),
          description: t('admin.products.edit.images.order_updated'),
        })
      } catch (error) {
        console.error('❌ Image reorder error', error)
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('admin.products.edit.images.order_update_error'),
        })
      }
    },
    [productId, toast, t, updateImages],
  )

  const handleModalClose = useCallback(() => {
    setGalleryModal((prev) => ({ ...prev, isOpen: false }))
  }, [])

  useEffect(() => {
    setGalleryModal((prev) => ({
      ...prev,
      images,
      initialIndex:
        prev.initialIndex >= images.length ? Math.max(0, images.length - 1) : prev.initialIndex,
    }))
  }, [images])

  return (
    <>
      <DetailView.Section
        icon={ImageIcon}
        span={2}
        title={t('admin.products.edit.sections.images')}
      >
        <div className="space-y-6">
          {!isPersisted && (
            <div className="border-border/60 bg-muted/40 text-sm text-muted-foreground rounded-md border border-dashed px-4 py-3">
              {t('admin.products.edit.images.requires_save', {
                defaultValue: 'Enregistrez le produit avant d’ajouter des images.',
              })}
            </div>
          )}

          <ImageMasonry
            className="w-full"
            entityId={productId ?? 'new-product'}
            imageBlurMap={imageBlurMap}
            images={images}
            onImageDelete={isPersisted ? handleImageDelete : undefined}
            onImagePreview={(_, index) =>
              setGalleryModal({
                isOpen: true,
                images,
                initialIndex: index,
              })
            }
            onImageReplace={isPersisted ? handleImageReplace : undefined}
            onImagesReorder={isPersisted ? handleImagesReorder : undefined}
          />

          <ImageUploaderField
            disabled={!productId}
            field={fieldAdapter}
            height="h-48"
            multiple
            onImagesChange={updateImages}
            productId={productId}
            width="w-full"
          />
        </div>
      </DetailView.Section>

      {galleryModal.isOpen && isPersisted && galleryModal.images.length > 0 && (
        <ImageGalleryModal
          imageBlurMap={imageBlurMap}
          images={galleryModal.images}
          initialIndex={galleryModal.initialIndex}
          isOpen={galleryModal.isOpen}
          onClose={handleModalClose}
          onImageDelete={async (imageUrl, index) => {
            await handleImageDelete(imageUrl, index)
            const updatedImages = galleryModal.images.filter((_, i) => i !== index)
            setGalleryModal((prev) => ({
              ...prev,
              images: updatedImages,
              initialIndex:
                index >= updatedImages.length ? Math.max(0, updatedImages.length - 1) : index,
            }))
            if (updatedImages.length === 0) {
              handleModalClose()
            }
          }}
          onImageReplace={(imageUrl, index) => {
            handleImageReplace(imageUrl, index)
            handleModalClose()
          }}
        />
      )}
    </>
  )
}
