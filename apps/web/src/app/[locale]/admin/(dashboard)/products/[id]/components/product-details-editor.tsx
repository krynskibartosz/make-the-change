import { arrayMove } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { Calendar, DollarSign, Globe, Image as ImageIcon, Info, Tag, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FC, type PropsWithChildren, useEffect, useId, useState } from 'react'

import { TagsAutocomplete } from '@/app/[locale]/admin/(dashboard)/components/ui/tags-autocomplete'
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/save-status'
import { EntityGallerySection } from '@/components/admin/gallery'
import { CropModal } from '@/components/admin/media/crop-modal'
import {
  TranslatableInputControlled,
  TranslatableTextAreaControlled,
} from '@/components/admin/translation/translatable-form-components'
import { useImageCrop } from '@/hooks/use-image-crop'
import { uploadProductImage } from '@/lib/api/upload'
import {
  fulfillmentMethodLabels,
  type ProductFormData,
  tierLabels,
} from '@/lib/validators/product'
import type { ProductBlurHash } from '@/types/blur'

import { SimpleInput, SimpleSelect } from './simple-form-components'

type ProductDetailsEditorProps = {
  productData: ProductFormData & { id: string; image_blur_map?: Record<string, ProductBlurHash> }
  onFieldChange: (field: string, value: unknown) => void
  onFieldBlur?: () => void
  saveStatus?: SaveStatus
  pendingChanges: Partial<ProductFormData>
  onSaveAll?: () => void
  categories: Array<{ id: string; name: string }>
  producers: Array<{ id: string; name: string }>
}

// État pour les blur hashes optimisés
type ProductBlurState = {
  imageBlurMap: Record<string, ProductBlurHash>
  stats: {
    totalImages: number
    withBlur: number
    missing: number
    coverage: number
  }
  isLoading: boolean
}

const ProductCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full">{children}</div>
)

const tierOptions = Object.entries(tierLabels).map(([value, label]) => ({
  value,
  label,
}))

const fulfillmentOptions = Object.entries(fulfillmentMethodLabels).map(([value, label]) => ({
  value,
  label,
}))

const ProductDetailsEditor: React.FC<ProductDetailsEditorProps> = ({
  productData,
  onFieldChange,
  categories,
  producers,
}) => {
  const t = useTranslations()
  const [isUploading, setIsUploading] = useState(false)

  // Hook de gestion du crop d'image
  const imageCrop = useImageCrop({
    maxSizeGallery: 5 * 1024 * 1024, // 5MB
    onCropSuccess: async (dataUrl, type) => {
      // Convert DataURL to Blob/File for upload
      try {
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const file = new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' })

        setIsUploading(true)
        const result = await uploadProductImage(file, productData.id)

        if (result.url) {
          const currentImages = [...(productData.images || [])]
          onFieldChange('images', [...currentImages, result.url])
        }
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
        setIsUploading(false)
      }
    },
  })

  // État pour les blur hashes du nouveau système DB
  const [_blurState, setBlurState] = useState<ProductBlurState>({
    imageBlurMap: {},
    stats: { totalImages: 0, withBlur: 0, missing: 0, coverage: 100 },
    isLoading: false,
  })

  const tagsId = useId()
  const allergensId = useId()
  const certificationsId = useId()

  useEffect(() => {
    if (!productData.id) return
    const images = Array.isArray(productData.images) ? productData.images : []
    const map = productData.image_blur_map || {}
    const withBlur = Object.keys(map).length
    const totalImages = images.length
    const missing = Math.max(0, totalImages - withBlur)
    const coverage = totalImages === 0 ? 100 : Math.round((withBlur / totalImages) * 100)

    setBlurState({
      imageBlurMap: map,
      stats: {
        totalImages,
        withBlur,
        missing,
        coverage,
      },
      isLoading: false,
    })
  }, [productData.id, productData.images, productData.image_blur_map])

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    // Utiliser le crop pour la première image si une seule image est sélectionnée
    // Sinon, upload direct pour le bulk (à améliorer plus tard pour supporter le bulk crop)
    if (files.length === 1) {
      await imageCrop.selectImage('gallery', files)
    } else {
      setIsUploading(true)
      try {
        const currentImages = [...(productData.images || [])]
        const newImages = [...currentImages]

        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (!file) continue
          const result = await uploadProductImage(file, productData.id)

          if (result.url) {
            newImages.push(result.url)
          }
        }

        onFieldChange('images', newImages)
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const contentSections = [
    {
      id: 'general',
      title: t('admin.products.edit.sections.general'),
      icon: Info,
      content: (
        <div className="space-y-4">
          <div>
            <TranslatableInputControlled
              required
              name="name"
              label={t('admin.products.edit.fields.name')}
              placeholder={t('admin.products.edit.placeholders.name')}
              value={productData.name}
              onChange={(value) => onFieldChange('name', value)}
            />
          </div>

          <div>
            <SimpleInput
              required
              label={t('admin.products.edit.fields.slug')}
              placeholder={t('admin.products.edit.placeholders.slug')}
              value={productData.slug}
              onChange={(value) => onFieldChange('slug', value)}
            />
          </div>

          <div>
            <TranslatableTextAreaControlled
              name="short_description"
              label={t('admin.products.edit.fields.short_description')}
              rows={3}
              value={productData.short_description || ''}
              placeholder={t('admin.products.edit.placeholders.short_description')}
              onChange={(value) => onFieldChange('short_description', value)}
            />
          </div>

          <div>
            <TranslatableTextAreaControlled
              name="description"
              label={t('admin.products.edit.fields.description')}
              placeholder={t('admin.products.edit.placeholders.description')}
              rows={6}
              value={productData.description || ''}
              onChange={(value) => onFieldChange('description', value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SimpleSelect
              label={t('admin.products.edit.fields.category_id')}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder={t('admin.products.edit.placeholders.category_id')}
              value={productData.category_id || ''}
              onChange={(value) => onFieldChange('category_id', value)}
            />

            <SimpleSelect
              label={t('admin.products.edit.fields.producer_id')}
              options={producers.map((p) => ({ value: p.id, label: p.name }))}
              placeholder={t('admin.products.edit.placeholders.producer_id')}
              value={productData.producer_id || ''}
              onChange={(value) => onFieldChange('producer_id', value)}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'pricing',
      title: t('admin.products.edit.sections.pricing'),
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div>
            <SimpleInput
              required
              label={t('admin.products.edit.fields.price_points')}
              placeholder="100"
              type="number"
              value={productData.price_points?.toString() || ''}
              onChange={(value) => onFieldChange('price_points', Number.parseInt(value, 10) || 0)}
            />
          </div>

          <div>
            <SimpleInput
              label={t('admin.products.edit.fields.stock_quantity')}
              placeholder="0"
              type="number"
              value={productData.stock_quantity?.toString() || ''}
              onChange={(value) => onFieldChange('stock_quantity', Number.parseInt(value, 10) || 0)}
            />
          </div>

          <div>
            <SimpleSelect
              label={t('admin.products.edit.fields.min_tier')}
              options={tierOptions}
              placeholder={t('admin.products.edit.placeholders.min_tier')}
              value={productData.min_tier}
              onChange={(value) => onFieldChange('min_tier', value)}
            />
          </div>

          <div>
            <SimpleSelect
              label={t('admin.products.edit.fields.fulfillment_method')}
              options={fulfillmentOptions}
              value={productData.fulfillment_method}
              placeholder={t('admin.products.edit.placeholders.fulfillment_method')}
              onChange={(value) => onFieldChange('fulfillment_method', value)}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'logistics',
      title: t('admin.products.edit.sections.logistics'),
      icon: Globe,
      content: (
        <div className="space-y-4">
          <SimpleInput
            label={t('admin.products.edit.fields.origin_country')}
            placeholder="FR"
            value={productData.origin_country || ''}
            onChange={(value) => onFieldChange('origin_country', value)}
          />
          <SimpleInput
            label={t('admin.products.edit.fields.partner_source')}
            placeholder="direct"
            value={productData.partner_source || ''}
            onChange={(value) => onFieldChange('partner_source', value)}
          />
          <SimpleInput
            label={t('admin.products.edit.fields.weight_grams')}
            type="number"
            placeholder="500"
            value={productData.weight_grams?.toString() || ''}
            onChange={(value) => onFieldChange('weight_grams', Number.parseInt(value, 10) || 0)}
          />
        </div>
      ),
    },
    {
      id: 'seo',
      title: t('admin.products.edit.sections.seo'),
      icon: Type,
      content: (
        <div className="space-y-4">
          <TranslatableInputControlled
            name="seo_title"
            label={t('admin.products.edit.fields.seo_title')}
            placeholder={t('admin.products.edit.placeholders.seo_title')}
            value={productData.seo_title || ''}
            onChange={(value) => onFieldChange('seo_title', value)}
          />
          <TranslatableTextAreaControlled
            name="seo_description"
            label={t('admin.products.edit.fields.seo_description')}
            placeholder={t('admin.products.edit.placeholders.seo_description')}
            rows={3}
            value={productData.seo_description || ''}
            onChange={(value) => onFieldChange('seo_description', value)}
          />
        </div>
      ),
    },
    {
      id: 'attributes',
      title: t('admin.products.edit.sections.attributes'),
      icon: Tag,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor={tagsId} className="text-sm font-medium">
              {t('admin.products.edit.fields.tags')}
            </label>
            <TagsAutocomplete
              id={tagsId}
              value={Array.isArray(productData.tags) ? productData.tags : []}
              onChange={(tags) => onFieldChange('tags', tags)}
              suggestions={['Bio', 'Local', 'Artisanal', 'Vegan', 'Sans gluten']}
              placeholder={t('admin.products.edit.placeholders.tags')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor={allergensId} className="text-sm font-medium">
              {t('admin.products.edit.fields.allergens')}
            </label>
            <TagsAutocomplete
              id={allergensId}
              value={Array.isArray(productData.allergens) ? productData.allergens : []}
              onChange={(allergens) => onFieldChange('allergens', allergens)}
              suggestions={[
                'gluten',
                'lactose',
                'nuts',
                'peanuts',
                'eggs',
                'fish',
                'soy',
                'sesame',
              ]}
              placeholder="Ajouter un allergène..."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor={certificationsId} className="text-sm font-medium">
              {t('admin.products.edit.fields.certifications')}
            </label>
            <TagsAutocomplete
              id={certificationsId}
              value={Array.isArray(productData.certifications) ? productData.certifications : []}
              onChange={(certs) => onFieldChange('certifications', certs)}
              suggestions={['bio', 'fair_trade', 'vegan', 'gluten_free', 'demeter']}
              placeholder="Ajouter une certification..."
            />
          </div>
        </div>
      ),
    },
    {
      id: 'lifecycle',
      title: t('admin.products.edit.sections.lifecycle'),
      icon: Calendar,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimpleInput
            type="date"
            label={t('admin.products.edit.fields.launch_date')}
            value={(productData.launch_date ?? '').split('T')[0] ?? ''}
            onChange={(value) => onFieldChange('launch_date', value)}
          />
          <SimpleInput
            type="date"
            label={t('admin.products.edit.fields.discontinue_date')}
            value={(productData.discontinue_date ?? '').split('T')[0] ?? ''}
            onChange={(value) => onFieldChange('discontinue_date', value)}
          />
        </div>
      ),
    },
    {
      id: 'images',
      title: t('admin.products.edit.sections.images'),
      icon: ImageIcon,
      content: (
        <EntityGallerySection
          images={productData.images || []}
          onUpload={handleGalleryUpload}
          isProcessing={isUploading}
          onRemove={(index) => {
            const newImages = [...(productData.images || [])]
            newImages.splice(index, 1)
            onFieldChange('images', newImages)
          }}
          onReorder={(oldIndex, newIndex) => {
            const newImages = arrayMove(productData.images || [], oldIndex, newIndex)
            onFieldChange('images', newImages)
          }}
          variant="plain"
        />
      ),
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      <ProductCardsGrid>
        {contentSections.map((section) => (
          <Card
            key={section.id}
            className={`transition-all duration-200 hover:shadow-lg ${
              section.id === 'images' ? 'md:col-span-2' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg border border-primary/20">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="!pt-4">{section.content}</CardContent>
          </Card>
        ))}
      </ProductCardsGrid>

      {/* Modale de Crop */}
      <CropModal
        image={imageCrop.cropTask}
        crop={imageCrop.crop}
        zoom={imageCrop.zoom}
        rotation={imageCrop.rotation}
        isSaving={imageCrop.isSaving}
        onCropChange={imageCrop.setCrop}
        onZoomChange={imageCrop.setZoom}
        onRotationChange={imageCrop.setRotation}
        onCropComplete={(croppedArea, croppedAreaPixels) => {
          imageCrop.setCroppedAreaPixels(croppedAreaPixels)
        }}
        onConfirm={imageCrop.confirmCrop}
        onCancel={imageCrop.cancelCrop}
      />
    </div>
  )
}

export { ProductDetailsEditor }
export type { ProductDetailsEditorProps }
