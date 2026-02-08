'use client';

import { type FC, useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Image from 'next/image';
import { Camera, Folder } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useToast } from '@/hooks/use-toast';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { CategoryFormData } from '../types/category-form.types';

type CategoryCoverSectionProps = {
  categoryId?: string;
  categoryName?: string;
  autoSave: AutoSaveReturn;
};

/**
 * Category Cover Section - affiche l'image de la catégorie
 * Permet l'upload d'image directement
 */
export const CategoryCoverSection: FC<CategoryCoverSectionProps> = ({
  categoryId,
  categoryName,
  autoSave,
}) => {
  const t = useTranslations();
  const { control, setValue, getValues } = useFormContext<CategoryFormData>();
  const { toast } = useToast();

  const imageUrl = useWatch({ control, name: 'image_url' }) || '';
  const [isUploading, setIsUploading] = useState(false);

  const isPersisted = Boolean(categoryId);

  const uploadToStorage = useCallback(
    async (file: File) => {
      if (!categoryId) return null;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('categoryId', categoryId);
      formData.append('fileName', file.name);
      formData.append('contentType', file.type);

      const response = await fetch('/api/admin/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch (jsonError) {
          console.warn('[category-cover-section] Failed to parse upload error response', jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as { publicUrl: string };
      return data.publicUrl;
    },
    [categoryId]
  );

  const handleImageUpload = useCallback(async (file: File) => {
    if (!categoryId) return;
    try {
      setIsUploading(true);
      const url = await uploadToStorage(file);
      if (!url) return;

      setValue('image_url', url, { shouldDirty: true, shouldTouch: true });
      autoSave.markDirty();
      void autoSave.saveNow();

      toast({
        variant: 'success',
        title: 'Image mise à jour',
        description: 'L\'image de la catégorie a été mise à jour avec succès',
      });
    } catch (error) {
      console.error('❌ image upload error', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de télécharger l\'image',
      });
    } finally {
      setIsUploading(false);
    }
  }, [categoryId, setValue, autoSave, uploadToStorage, toast]);

  return (
    <section className="relative mb-6">
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40">
        {/* Image de la catégorie */}
        {imageUrl ? (
          <Image
            alt={categoryName || 'Catégorie'}
            fill
            className="object-cover"
            priority
            src={imageUrl}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
            <Folder className="h-16 w-16" />
            <span className="text-lg font-medium">
              {isPersisted
                ? 'Aucune image'
                : 'Enregistrez la catégorie pour ajouter une image'}
            </span>
          </div>
        )}

        {/* Breadcrumb Overlay - Top Left */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-6 pb-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/90">
              <Link
                href="/admin/categories"
                className="hover:text-white transition-colors"
              >
                {t('admin.categories.edit.breadcrumbs.categories', {
                  defaultValue: 'Catégories',
                })}
              </Link>
              <span>/</span>
              <span className="text-white font-medium">
                {categoryName || t('admin.categories.edit.breadcrumbs.loading', {
                  defaultValue: 'Chargement...',
                })}
              </span>
            </nav>
          </div>
        </div>

        {/* Bouton Upload - Bottom Right */}
        {isPersisted && (
          <div className="absolute bottom-4 right-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-black/60 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80">
              <Camera className="h-4 w-4" />
              {isUploading ? 'Téléchargement...' : imageUrl ? 'Changer l\'image' : 'Ajouter une image'}
              <input
                accept="image/*"
                className="sr-only"
                disabled={isUploading}
                type="file"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleImageUpload(file);
                    event.target.value = '';
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>
    </section>
  );
};
