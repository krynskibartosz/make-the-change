'use client';

import {
  type FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/supabase/client';

import type { ProjectFormData } from '@/lib/validators/project';

type ProjectCoverSectionRHFProps = {
  projectId?: string;
  projectName?: string;
};

export const ProjectCoverSectionRHF: FC<ProjectCoverSectionRHFProps> = ({
  projectId,
  projectName,
}) => {
  const t = useTranslations();
  const { control, setValue } = useFormContext<ProjectFormData>();
  const { toast } = useToast();

  const images = useWatch({ control, name: 'images' }) ?? [];

  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const coverImage = images[0] ?? null;
  const avatarImage = images[1] ?? null;
  const galleryImages = images.slice(2);

  const isPersisted = Boolean(projectId);

  const persistImages = useCallback(
    (cover: string | null, avatar: string | null, gallery: string[]) => {
      const next = [] as string[];
      if (cover) next.push(cover);
      if (avatar) next.push(avatar);
      gallery.forEach(url => next.push(url));
      setValue('images', next, { shouldDirty: true, shouldTouch: true });
    },
    [setValue]
  );

  const ensureGallery = useCallback(
    (imgs: string[]) => imgs.filter(Boolean),
    []
  );

  const uploadToSupabase = useCallback(
    async (file: File) => {
      if (!projectId) return null;
      const path = `${projectId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('project-images')
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage
        .from('project-images')
        .getPublicUrl(path);
      return data.publicUrl;
    },
    [projectId]
  );

  const handleCoverUpload = useCallback(async (file: File) => {
    if (!projectId) return;
    try {
      setIsCoverUploading(true);
      const url = await uploadToSupabase(file);
      if (!url) return;
      persistImages(url, avatarImage, galleryImages);
      toast({
        variant: 'success',
        title: t('admin.projects.edit.cover.updated', {
          defaultValue: 'Couverture mise à jour',
        }),
      });
    } catch (error) {
      console.error('❌ cover upload error', error);
      toast({
        variant: 'destructive',
        title: t('admin.projects.edit.cover.error', {
          defaultValue: 'Échec de la mise à jour de la couverture',
        }),
      });
    } finally {
      setIsCoverUploading(false);
    }
  }, [avatarImage, galleryImages, persistImages, projectId, t, toast, uploadToSupabase]);

  const handleAvatarUpload = useCallback(async (file: File) => {
    if (!projectId) return;
    try {
      setIsAvatarUploading(true);
      const url = await uploadToSupabase(file);
      if (!url) return;
      persistImages(coverImage, url, galleryImages);
      toast({
        variant: 'success',
        title: t('admin.projects.edit.avatar.updated', {
          defaultValue: 'Photo du projet mise à jour',
        }),
      });
    } catch (error) {
      console.error('❌ avatar upload error', error);
      toast({
        variant: 'destructive',
        title: t('admin.projects.edit.avatar.error', {
          defaultValue: 'Impossible de mettre à jour la photo',
        }),
      });
    } finally {
      setIsAvatarUploading(false);
    }
  }, [coverImage, galleryImages, persistImages, projectId, t, toast, uploadToSupabase]);

  const removeCover = useCallback(() => {
    persistImages(null, avatarImage, galleryImages);
  }, [avatarImage, galleryImages, persistImages]);

  const removeAvatar = useCallback(() => {
    persistImages(coverImage, null, galleryImages);
  }, [coverImage, galleryImages, persistImages]);

  const coverActions = useMemo(() => {
    if (!isPersisted) {
      return null;
    }

    return (
      <div className="absolute bottom-4 right-4 flex gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-black/60 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80">
          <Camera className="h-4 w-4" />
          {isCoverUploading
            ? t('common.loading', { defaultValue: 'En cours…' })
            : t('admin.projects.edit.cover.change', {
                defaultValue: 'Modifier la couverture',
              })}
          <input
            accept="image/*"
            className="sr-only"
            disabled={isCoverUploading}
            type="file"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file) {
                void handleCoverUpload(file);
                event.target.value = '';
              }
            }}
          />
        </label>
        {coverImage && (
          <button
            className="inline-flex items-center gap-2 rounded-md bg-black/60 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80"
            onClick={removeCover}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            {t('admin.projects.edit.cover.remove', {
              defaultValue: 'Supprimer',
            })}
          </button>
        )}
      </div>
    );
  }, [handleCoverUpload, isCoverUploading, isPersisted, removeCover, coverImage, t]);

  const avatarActions = useMemo(() => {
    if (!isPersisted) {
      return null;
    }
    return (
      <label className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90">
        {isAvatarUploading ? (
          <Camera className="h-4 w-4 animate-pulse" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
        <input
          accept="image/*"
          className="sr-only"
          disabled={isAvatarUploading}
          type="file"
          onChange={event => {
            const file = event.target.files?.[0];
            if (file) {
              void handleAvatarUpload(file);
              event.target.value = '';
            }
          }}
        />
      </label>
    );
  }, [handleAvatarUpload, isAvatarUploading, isPersisted]);

  const avatarRemoveButton = useMemo(() => {
    if (!isPersisted || !avatarImage) {
      return null;
    }
    return (
      <button
        className="mt-2 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        onClick={removeAvatar}
        type="button"
      >
        <Trash2 className="h-3 w-3" />
        {t('admin.projects.edit.avatar.remove', {
          defaultValue: 'Retirer la photo',
        })}
      </button>
    );
  }, [avatarImage, isPersisted, removeAvatar, t]);

  return (
    <section className="relative mb-6">
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 md:h-96">
        {coverImage ? (
          <Image
            alt="Project cover"
            fill
            className="object-cover"
            priority
            src={coverImage}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
            <Camera className="h-10 w-10" />
            <span className="text-sm font-medium">
              {isPersisted
                ? t('admin.projects.edit.cover.placeholder', {
                    defaultValue: 'Ajoutez une image de couverture',
                  })
                : t('admin.projects.edit.cover.placeholder_disabled', {
                    defaultValue: 'Enregistrez le projet pour ajouter une couverture',
                  })}
            </span>
          </div>
        )}

        {/* Breadcrumb Overlay - Top Left */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-6 pb-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/90">
              <Link
                href="/admin/projects"
                className="hover:text-white transition-colors"
              >
                {t('admin.projects.edit.breadcrumbs.projects', {
                  defaultValue: 'Projets',
                })}
              </Link>
              <span>/</span>
              <span className="text-white font-medium">
                {projectName || t('admin.projects.edit.breadcrumbs.loading', {
                  defaultValue: 'Chargement...',
                })}
              </span>
            </nav>
          </div>
        </div>

        {coverActions}
      </div>

      <div className="relative mx-auto -mt-16 flex w-full max-w-6xl flex-col items-start gap-4 px-4 md:-mt-20 md:flex-row md:items-end md:gap-6 md:px-8">
        <div className="relative h-32 w-32 shrink-0 rounded-full border-4 border-background bg-background shadow-xl md:h-40 md:w-40">
          {avatarImage ? (
            <Image
              alt="Project avatar"
              className="rounded-full object-cover"
              fill
              src={avatarImage}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
              <Camera className="h-8 w-8" />
            </div>
          )}

          {avatarActions}
        </div>
      </div>
    </section>
  );
};
