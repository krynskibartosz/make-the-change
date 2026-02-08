'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Image as ImageIcon } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { CategoryFormData } from '../types/category-form.types';

interface ImageSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Image Section - RHF Component for Categories
 *
 * Fields:
 * - Image URL
 */
export function ImageSection({ autoSave }: ImageSectionProps) {
  const t = useTranslations('admin.categories');
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CategoryFormData>();

  const imageUrl = watch('image_url');

  return (
    <DetailView.Section
      icon={ImageIcon}
      title={t('sections.image')}
    >
      <DetailView.FieldGroup layout="column">
        {/* Image URL */}
        <DetailView.Field
          label={t('fields.image_url')}
          error={errors.image_url?.message}
        >
          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <div className="space-y-3">
                <InputV2
                  {...field}
                  type="url"
                  leadingIcon={<ImageIcon className="h-4 w-4 text-muted-foreground" />}
                  placeholder="https://example.com/image.jpg"
                  error={errors.image_url?.message}
                  onChange={(e) => {
                    field.onChange(e);
                    autoSave.markDirty();
                  }}
                  onBlur={(e) => {
                    field.onBlur();
                    autoSave.saveNow();
                  }}
                />
                
                {/* Image Preview */}
                {imageUrl && (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Aperçu de la catégorie"
                      className="h-32 w-32 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
