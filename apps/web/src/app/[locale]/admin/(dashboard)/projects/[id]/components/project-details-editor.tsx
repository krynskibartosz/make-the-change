'use client'

import { arrayMove } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { DollarSign, Globe, ImageIcon, Info, Type } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'

import { EntityCoverSection } from '@/components/admin/cover'
import { EntityGallerySection } from '@/components/admin/gallery'
import { CropModal } from '@/components/admin/media'
import {
  TranslatableInputControlled,
  TranslatableTextAreaControlled,
} from '@/components/admin/translation/translatable-form-components'
import { useImageCrop } from '@/hooks/use-image-crop'
import { uploadProjectImage } from '@/lib/api/upload'
import {
  type ProjectFormData,
  projectStatusLabels,
  projectTypeLabels,
} from '@/lib/validators/project'
import { SimpleInput, SimpleSelect } from './simple-form-components'
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/save-status'

type ProjectDetailsEditorProps = {
  projectData: ProjectFormData & { id: string }
  onFieldChange: (field: string, value: unknown) => void
  onFieldBlur?: () => void
  saveStatus?: SaveStatus
  pendingChanges: Partial<ProjectFormData>
  onSaveAll?: () => void
}

const ProjectCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full">{children}</div>
)

const typeOptions = Object.entries(projectTypeLabels).map(([value, label]) => ({
  value,
  label,
}))

const statusOptions = Object.entries(projectStatusLabels).map(([value, label]) => ({
  value,
  label,
}))

const ProjectDetailsEditor: React.FC<ProjectDetailsEditorProps> = ({
  projectData,
  onFieldChange,
  onFieldBlur,
}) => {
  const [isGalleryUploading, setIsGalleryUploading] = useState(false)

  // Image Crop Hook for Cover/Avatar
  const imageCrop = useImageCrop({
    onCropSuccess: async (dataUrl, type) => {
      // Pour Hero et Avatar, on envoie directement le dataUrl qui sera uploadé par le serveur
      // ou géré comme vous le souhaitez. Ici on met à jour le champ correspondant.
      if (type === 'hero') {
        onFieldChange('hero_image', dataUrl)
      } else if (type === 'avatar') {
        onFieldChange('avatar_image', dataUrl)
      } else if (type === 'gallery') {
         // Pour la galerie, on doit uploader l'image
         // Convert DataURL to Blob/File for upload
         try {
           const response = await fetch(dataUrl)
           const blob = await response.blob()
           const file = new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' })
   
           setIsGalleryUploading(true)
           const result = await uploadProjectImage(file, projectData.id)
   
           if (result.url) {
             const currentImages = [...(projectData.images || [])]
             onFieldChange('images', [...currentImages, result.url])
           }
         } catch (error) {
           console.error('Upload failed:', error)
         } finally {
           setIsGalleryUploading(false)
         }
      }
    }
  })

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    // Utiliser le crop pour la première image si une seule image est sélectionnée
    if (files.length === 1) {
      await imageCrop.selectImage('gallery', files)
    } else {
      setIsGalleryUploading(true)
      try {
        const currentImages = [...(projectData.images || [])]
        const newImages = [...currentImages]
  
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (!file) continue
          const result = await uploadProjectImage(file, projectData.id)
  
          if (result.url) {
            newImages.push(result.url)
          } else if (result.images) {
            // Cas où l'API retourne plusieurs images (si supporté)
            newImages.push(...result.images)
          }
        }
  
        onFieldChange('images', newImages)
      } catch (error) {
        console.error('Upload failed:', error)
      } finally {
        setIsGalleryUploading(false)
      }
    }
  }

  const contentSections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: Info,
      content: (
        <div className="space-y-4">
          <TranslatableInputControlled
            name="name"
            required
            label="Nom du projet"
            placeholder="Nom du projet"
            value={projectData.name}
            onChange={(value) => onFieldChange('name', value)}
            onBlur={onFieldBlur}
          />

          <SimpleInput
            label="Slug"
            required
            placeholder="slug-du-projet"
            value={projectData.slug}
            onChange={(value) => onFieldChange('slug', value)}
            onBlur={onFieldBlur}
          />

          <SimpleSelect
            label="Type de projet"
            options={typeOptions}
            placeholder="Sélectionner un type"
            value={projectData.type}
            onChange={(value) => onFieldChange('type', value)}
          />

          <TranslatableTextAreaControlled
            name="description"
            label="Description courte"
            placeholder="Description courte du projet..."
            rows={3}
            value={projectData.description || ''}
            onChange={(value) => onFieldChange('description', value)}
            onBlur={onFieldBlur}
          />

          <TranslatableTextAreaControlled
            name="long_description"
            label="Description détaillée"
            placeholder="Description détaillée du projet..."
            rows={6}
            value={projectData.long_description || ''}
            onChange={(value) => onFieldChange('long_description', value)}
            onBlur={onFieldBlur}
          />
        </div>
      ),
    },
    {
      id: 'funding',
      title: 'Financement & Configuration',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <SimpleInput
            label="Budget cible (€)"
            required
            placeholder="1000"
            type="number"
            value={projectData.target_budget.toString()}
            onChange={(value) => onFieldChange('target_budget', Number.parseInt(value, 10) || 0)}
            onBlur={onFieldBlur}
          />

          <SimpleInput
            label="ID Producteur"
            required
            placeholder="ID du producteur"
            value={projectData.producer_id}
            onChange={(value) => onFieldChange('producer_id', value)}
            onBlur={onFieldBlur}
          />

          <SimpleSelect
            label="Statut"
            options={statusOptions}
            placeholder="Sélectionner un statut"
            value={projectData.status}
            onChange={(value) => onFieldChange('status', value)}
          />
        </div>
      ),
    },
    {
      id: 'seo',
      title: 'SEO & Méta-données',
      icon: Type,
      content: (
        <div className="space-y-4">
          <TranslatableInputControlled
            name="seo_title"
            label="Titre SEO"
            placeholder="Titre pour les moteurs de recherche"
            value={projectData.seo_title || ''}
            onChange={(value) => onFieldChange('seo_title', value)}
            onBlur={onFieldBlur}
          />
          <TranslatableTextAreaControlled
            name="seo_description"
            label="Description SEO"
            placeholder="Description pour les résultats de recherche"
            rows={3}
            value={projectData.seo_description || ''}
            onChange={(value) => onFieldChange('seo_description', value)}
            onBlur={onFieldBlur}
          />
        </div>
      ),
    },
    {
      id: 'images',
      title: 'Images',
      icon: ImageIcon,
      content: (
        <EntityGallerySection
          images={projectData.images || []}
          onUpload={handleGalleryUpload}
          isProcessing={isGalleryUploading}
          onRemove={(index) => {
            const currentImages = [...(projectData.images || [])]
            currentImages.splice(index, 1)
            onFieldChange('images', currentImages)
          }}
          onReorder={(oldIndex, newIndex) => {
            const newImages = arrayMove(projectData.images || [], oldIndex, newIndex)
            onFieldChange('images', newImages)
          }}
          variant="plain"
        />
      ),
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cover Section */}
      <div className="mb-8">
        <EntityCoverSection
          heroImage={projectData.hero_image}
          avatarImage={projectData.avatar_image}
          onHeroUpload={(files) => imageCrop.selectImage('hero', files)}
          onAvatarUpload={(files) => imageCrop.selectImage('avatar', files)}
          onHeroRemove={() => onFieldChange('hero_image', null)}
          onAvatarRemove={() => onFieldChange('avatar_image', null)}
          isHeroLoading={imageCrop.isLoading.hero || (imageCrop.isSaving && imageCrop.cropTask?.type === 'hero')}
          isAvatarLoading={imageCrop.isLoading.avatar || (imageCrop.isSaving && imageCrop.cropTask?.type === 'avatar')}
          disabled={imageCrop.isSaving}
          enableCondensed={false}
        />
      </div>

      <ProjectCardsGrid>
        {contentSections.map((section) => (
          <Card
            key={section.id}
            className={`transition-all duration-200 hover:shadow-lg ${
              section.id === 'images' ? 'md:col-span-2' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border border-primary/20">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="!pt-4">{section.content}</CardContent>
          </Card>
        ))}
      </ProjectCardsGrid>

      {/* Crop Modal */}
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

export { ProjectDetailsEditor }
export type { ProjectDetailsEditorProps }
