'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { Textarea } from '@/components/ui/textarea';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { CategoryFormData } from '../types/category-form.types';

interface SeoSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * SEO Section - RHF Component for Categories
 *
 * Fields:
 * - SEO Title
 * - SEO Description
 */
export function SeoSection({ autoSave }: SeoSectionProps) {
  const t = useTranslations('admin.categories');
  const {
    control,
    formState: { errors },
  } = useFormContext<CategoryFormData>();

  return (
    <DetailView.Section
      icon={Search}
      title={t('sections.seo')}
    >
      <DetailView.FieldGroup layout="column">
        {/* SEO Title */}
        <DetailView.Field
          label={t('fields.seo_title')}
          error={errors.seo_title?.message}
        >
          <Controller
            name="seo_title"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Search className="h-4 w-4 text-muted-foreground" />}
                placeholder="Titre SEO optimisé"
                error={errors.seo_title?.message}
                onChange={(e) => {
                  field.onChange(e);
                  autoSave.markDirty();
                }}
                onBlur={(e) => {
                  field.onBlur();
                  autoSave.saveNow();
                }}
              />
            )}
          />
        </DetailView.Field>

        {/* SEO Description */}
        <DetailView.Field
          label={t('fields.seo_description')}
          error={errors.seo_description?.message}
        >
          <Controller
            name="seo_description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Description SEO pour les moteurs de recherche..."
                rows={3}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  field.onChange(e);
                  autoSave.markDirty();
                }}
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                  field.onBlur();
                  autoSave.saveNow();
                }}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
