'use client';

import {
  type FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Image from 'next/image';
import { Camera, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useToast } from '@/hooks/use-toast';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

import type { PartnerFormData } from '../../types/partner-form.types';

type PartnerCoverSectionProps = {
  partnerId?: string;
  partnerName?: string;
  autoSave: AutoSaveReturn;
};

/**
 * Partner Cover Section - displays cover image + avatar
 *
 * Image structure:
 * - images[0] = cover image (banner)
 * - images[1] = avatar image (profile picture)
 *
 * Bucket: configurable via NEXT_PUBLIC_SUPABASE_STORAGE_PRODUCER_BUCKET (default: producer-images)
 */
export const PartnerCoverSection: FC<PartnerCoverSectionProps> = ({
  partnerId,
  partnerName,
  autoSave,
}) => {
  const t = useTranslations();
  const { control, setValue, getValues } = useFormContext<PartnerFormData>();
  const { toast } = useToast();

  const images = useWatch({ control, name: 'images' }) ?? [];

  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const coverImage = images[0] ?? null;
  const avatarImage = images[1] ?? null;

  const isPersisted = Boolean(partnerId);

  const persistImages = useCallback(
    (cover: string | null, avatar: string | null) => {
      const current = (getValues('images') ?? []) as string[];
      const next = [...current];

      if (cover) {
        next[0] = cover;
      }

      if (avatar) {
        next[1] = avatar;
      } else if (next.length > 1 && !next[1] && cover) {
        // If avatar removed, ensure array does not keep empty slot
        next.splice(1, 1);
      }

      const normalized = next.filter((value): value is string => Boolean(value && value.trim()));

      setValue('images', normalized, { shouldDirty: true, shouldTouch: true });
      autoSave.markDirty();
      void autoSave.saveNow();
    },
    [autoSave, getValues, setValue]
  );

  const uploadToStorage = useCallback(
    async (file: File, variant: 'cover' | 'avatar') => {
      if (!partnerId) return null;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('partnerId', partnerId);
      formData.append('fileName', file.name);
      formData.append('contentType', file.type);
      formData.append('variant', variant);

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
          console.warn('[partner-cover-section] Failed to parse upload error response', jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as { publicUrl: string };
      return data.publicUrl;
    },
    [partnerId]
  );

  const handleCoverUpload = useCallback(async (file: File) => {
    if (!partnerId) return;
    try {
      setIsCoverUploading(true);
      const url = await uploadToStorage(file, 'cover');
      if (!url) {
        return;
      }
      persistImages(url, avatarImage);
      toast({
        variant: 'success',
        title: t('admin.partners.edit.cover.updated', {
          defaultValue: 'Couverture mise à jour',
        }),
      });
    } catch (error) {
      console.error('❌ cover upload error', error);
      toast({
        variant: 'destructive',
        title: t('admin.partners.edit.cover.error', {
          defaultValue: 'Échec de la mise à jour de la couverture',
        }),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsCoverUploading(false);
    }
  }, [avatarImage, persistImages, partnerId, t, toast, uploadToStorage]);

  const handleAvatarUpload = useCallback(async (file: File) => {
    if (!partnerId) return;
    try {
      setIsAvatarUploading(true);
      const url = await uploadToStorage(file, 'avatar');
      if (!url) {
        return;
      }
      persistImages(coverImage, url);
      toast({
        variant: 'success',
        title: t('admin.partners.edit.avatar.updated', {
          defaultValue: 'Photo du partenaire mise à jour',
        }),
      });
    } catch (error) {
      console.error('❌ avatar upload error', error);
      toast({
        variant: 'destructive',
        title: t('admin.partners.edit.avatar.error', {
          defaultValue: 'Impossible de mettre à jour la photo',
        }),
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsAvatarUploading(false);
    }
  }, [coverImage, persistImages, partnerId, t, toast, uploadToStorage]);

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
            : t('admin.partners.edit.cover.change', {
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
      </div>
    );
  }, [handleCoverUpload, isCoverUploading, isPersisted, t]);

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

  return (
    <section className="relative mb-6">
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 md:h-96">
        {coverImage ? (
          <Image
            alt="Partner cover"
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
                ? t('admin.partners.edit.cover.placeholder', {
                    defaultValue: 'Ajoutez une image de couverture',
                  })
                : t('admin.partners.edit.cover.placeholder_disabled', {
                    defaultValue: 'Enregistrez le partenaire pour ajouter une couverture',
                  })}
            </span>
          </div>
        )}

        {/* Breadcrumb Overlay - Top Left */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-6 pb-12">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/90">
              <Link
                href="/admin/partners"
                className="hover:text-white transition-colors"
              >
                {t('admin.partners.edit.breadcrumbs.partners', {
                  defaultValue: 'Partenaires',
                })}
              </Link>
              <span>/</span>
              <span className="text-white font-medium">
                {partnerName || t('admin.partners.edit.breadcrumbs.loading', {
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
              alt="Partner avatar"
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
