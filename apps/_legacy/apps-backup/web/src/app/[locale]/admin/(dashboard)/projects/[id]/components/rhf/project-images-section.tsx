'use client';

import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { ImageGalleryModal } from '@/app/[locale]/admin/(dashboard)/components/images/image-gallery/image-gallery-modal';
import { ImageUploader } from '@/app/[locale]/admin/(dashboard)/components/images/image-uploader/components/image-uploader';
import { ImageMasonry } from '@/components/ui/image-masonry';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase/client';

import type { ProjectFormData } from '@/lib/validators/project';
import type { ProductBlurHash } from '@/types/blur';

type GalleryState = {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
};

type ProjectImagesSectionRHFProps = {
  projectId?: string;
  imageBlurMap?: Record<string, ProductBlurHash>;
};

export const ProjectImagesSectionRHF: FC<ProjectImagesSectionRHFProps> = ({
  projectId,
  imageBlurMap = {},
}) => {
  const t = useTranslations();
  const { control, setValue } = useFormContext<ProjectFormData>();
  const { toast } = useToast();

  const images = useWatch({ control, name: 'images' }) ?? [];
  const coverImage = images[0] ?? null;
  const avatarImage = images[1] ?? null;
  const galleryImages = useMemo(() => images.slice(2), [images]);
  const [gallery, setGallery] = useState<GalleryState>({
    isOpen: false,
    images: galleryImages,
    initialIndex: 0,
  });

  const isPersisted = Boolean(projectId);

  const updateImages = useCallback(
    (next: string[]) => {
      setValue('images', next, { shouldDirty: true, shouldTouch: true });
    },
    [setValue]
  );

  useEffect(() => {
    setGallery(prev => {
      // Only update if images array actually changed
      const imagesChanged =
        prev.images.length !== galleryImages.length ||
        prev.images.some((img, i) => img !== galleryImages[i]);

      if (!imagesChanged) return prev;

      return {
        ...prev,
        images: galleryImages,
        initialIndex:
          prev.initialIndex >= galleryImages.length
            ? Math.max(0, galleryImages.length - 1)
            : prev.initialIndex,
      };
    });
  }, [galleryImages]);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!projectId) return;

      const path = `${projectId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('project-images')
        .upload(path, file, { upsert: true });

      if (error) {
        console.error('❌ Upload image project', error);
        toast({
          variant: 'destructive',
          title: t('admin.projects.edit.images.upload_error', {
            defaultValue: 'Erreur lors de l’upload',
          }),
          description: error.message,
        });
        return;
      }

      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(path);

      const nextImages = [...images, data.publicUrl];
      updateImages(nextImages);
      toast({
        variant: 'success',
        title: t('admin.projects.edit.images.uploaded', {
          defaultValue: 'Image ajoutée',
        }),
      });
    },
    [images, projectId, toast, t, updateImages]
  );

  const handleDelete = useCallback(
    async (imageUrl: string, index: number) => {
      if (!projectId) return;

      const marker = '/project-images/';
      const path = imageUrl.includes(marker)
        ? imageUrl.split(marker)[1]
        : `${projectId}/${imageUrl.split('/').pop()}`;

      if (path) {
        const { error } = await supabase.storage
          .from('project-images')
          .remove([path]);
        if (error) {
          console.error('❌ Remove image project', error);
          toast({
            variant: 'destructive',
            title: t('admin.projects.edit.images.delete_error', {
              defaultValue: 'Impossible de supprimer l’image',
            }),
            description: error.message,
          });
          return;
        }
      }

      const absoluteIndex = index + 2;
      const nextImages = images.filter((_, i) => i !== absoluteIndex);
      updateImages(nextImages);
      toast({
        variant: 'default',
        title: t('admin.projects.edit.images.deleted', {
          defaultValue: 'Image supprimée',
        }),
      });
    },
    [images, projectId, toast, t, updateImages]
  );

  const handleReorder = useCallback(
    async (oldIndex: number, newIndex: number, newImages: string[]) => {
      if (!projectId) return;
      if (oldIndex === newIndex) return;
      const reordered = [
        coverImage,
        avatarImage,
        ...newImages,
      ].filter((img): img is string => Boolean(img));
      updateImages(reordered);
      toast({
        variant: 'default',
        title: t('admin.projects.edit.images.order_updated', {
          defaultValue: 'Ordre des images mis à jour',
        }),
      });
    },
    [projectId, t, updateImages]
  );

  const handleModalClose = useCallback(() => {
    setGallery(prev => ({ ...prev, isOpen: false }));
  }, []);

  const imageUploader = useMemo(() => (
    <ImageUploader
      disabled={!isPersisted}
      multiple={false}
      onImageSelect={async file => {
        if (file) {
          await handleUpload(file);
        }
      }}
      width="w-full"
      height="h-48"
    />
  ), [handleUpload, isPersisted]);

  return (
    <>
      <DetailView.Section
        icon={ImageIcon}
        span={2}
        title={t('admin.projects.edit.sections.images', {
          defaultValue: 'Galerie du projet',
        })}
      >
        <div className="space-y-6">
          {!isPersisted && (
            <div className="border-border/60 bg-muted/30 text-sm text-muted-foreground rounded-md border border-dashed px-4 py-3">
              {t('admin.projects.edit.images.requires_save', {
                defaultValue: 'Créez le projet avant d’ajouter des images.',
              })}
            </div>
          )}

          <ImageMasonry
            className="w-full"
            entityId={projectId ?? 'new-project'}
            imageBlurMap={imageBlurMap}
            images={galleryImages}
            onImageDelete={isPersisted ? handleDelete : undefined}
            onImagePreview={(_, index) =>
              setGallery({ isOpen: true, images: galleryImages, initialIndex: index })
            }
            onImageReplace={undefined}
            onImagesReorder={isPersisted ? handleReorder : undefined}
          />

          {imageUploader}
        </div>
      </DetailView.Section>

      {gallery.isOpen && gallery.images.length > 0 && (
        <ImageGalleryModal
          imageBlurMap={imageBlurMap}
          images={gallery.images}
          initialIndex={gallery.initialIndex}
          isOpen={gallery.isOpen}
          onClose={handleModalClose}
          onImageDelete={isPersisted ? handleDelete : undefined}
        />
      )}
    </>
  );
};
