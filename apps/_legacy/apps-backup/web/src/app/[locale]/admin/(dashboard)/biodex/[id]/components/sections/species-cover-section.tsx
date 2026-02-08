'use client';

import { type FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Camera, Bug } from 'lucide-react';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import type { SpeciesFormData } from '../../types/species-form.types';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

type SpeciesCoverSectionProps = {
  speciesId?: string;
  speciesName?: string;
  autoSave: AutoSaveReturn;
};

/**
 * Species Cover Section - displays cover image + icon
 * 
 * TODO: Implement Supabase upload like partners
 * For now, simplified version
 */
export const SpeciesCoverSection: FC<SpeciesCoverSectionProps> = ({
  speciesId,
  speciesName,
  autoSave,
}) => {
  const t = useTranslations();
  const { control } = useFormContext<SpeciesFormData>();
  const images = useWatch({ control, name: 'images' }) ?? [];

  const coverImage = images[0] ?? null;
  const iconImage = images[1] ?? null;

  return (
    <section className="relative h-[300px] overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      {/* Cover Image */}
      {coverImage ? (
        <Image
          fill
          alt={speciesName ?? 'Cover'}
          className="object-cover"
          sizes="100vw"
          src={coverImage}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Camera className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

      {/* Breadcrumb overlay */}
      <div className="absolute top-4 left-4 z-10">
        <Breadcrumb
          items={[
            {
              label: t('admin.biodex.title'),
              href: '/admin/biodex',
            },
            {
              label: speciesName || t('admin.biodex.new_species'),
              href: `/admin/biodex/${speciesId}`,
            },
          ]}
        />
      </div>

      {/* Icon Image - Absolute positioned on bottom right */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-xl">
          {iconImage ? (
            <Image
              fill
              alt="Icon"
              className="object-cover"
              sizes="96px"
              src={iconImage}
            />
          ) : (
            <div className="bg-primary/10 flex h-full w-full items-center justify-center">
              <Bug className="h-10 w-10 text-primary" />
            </div>
          )}
        </div>
      </div>

      {/* TODO: Add upload buttons */}
    </section>
  );
};