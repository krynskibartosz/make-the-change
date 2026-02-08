'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Search } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { Textarea } from '@/components/ui/textarea';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { BlogPostFormData } from '../types/blog-post-form.types';

interface SeoSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * SEO Section - RHF Component for Blog Posts
 *
 * Fields:
 * - SEO Title
 * - SEO Description
 * - SEO Keywords
 */
export function SeoSection({ autoSave }: SeoSectionProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<BlogPostFormData>();

  return (
    <DetailView.Section icon={Search} title="Optimisation SEO">
      {/* SEO Title */}
      <DetailView.Field
        label="Titre SEO"
        error={errors.seo_title?.message}
        description="Titre optimisé pour les moteurs de recherche (max 200 caractères)"
      >
        <Controller
          name="seo_title"
          control={control}
          render={({ field }) => (
            <InputV2
              {...field}
              value={field.value || ''}
              placeholder={watch('title') || 'Entrez un titre SEO...'}
              onBlur={() => {
                field.onBlur();
                autoSave.saveNow();
              }}
              onChange={(e) => {
                field.onChange(e);
                autoSave.triggerSave();
              }}
            />
          )}
        />
      </DetailView.Field>

      {/* SEO Description */}
      <DetailView.Field
        label="Description SEO"
        error={errors.seo_description?.message}
        description="Description optimisée pour les moteurs de recherche (max 500 caractères)"
      >
        <Controller
          name="seo_description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value || ''}
              className="min-h-[80px]"
              placeholder={watch('excerpt') || 'Entrez une description SEO...'}
              onBlur={() => {
                field.onBlur();
                autoSave.saveNow();
              }}
              onChange={(e) => {
                field.onChange(e);
                autoSave.triggerSave();
              }}
            />
          )}
        />
      </DetailView.Field>

      {/* SEO Keywords */}
      <DetailView.Field
        label="Mots-clés SEO"
        error={errors.seo_keywords?.message}
        description="Mots-clés séparés par des virgules (max 500 caractères)"
      >
        <Controller
          name="seo_keywords"
          control={control}
          render={({ field }) => (
            <InputV2
              {...field}
              value={field.value || ''}
              placeholder="blog, environnement, développement durable, ..."
              onBlur={() => {
                field.onBlur();
                autoSave.saveNow();
              }}
              onChange={(e) => {
                field.onChange(e);
                autoSave.triggerSave();
              }}
            />
          )}
        />
      </DetailView.Field>

      {/* SEO Preview */}
      <div className="bg-surface-3 border-border-subtle mt-4 rounded-lg border p-4">
        <p className="text-text-secondary mb-3 text-xs font-medium uppercase tracking-wide">
          Aperçu Google
        </p>
        <div className="space-y-1">
          <div className="text-accent text-lg font-medium line-clamp-1">
            {watch('seo_title') || watch('title') || 'Titre de l\'article'}
          </div>
          <div className="text-success text-xs">
            https://makethechange.com/blog/{watch('slug') || 'slug-article'}
          </div>
          <div className="text-text-secondary line-clamp-2 text-sm">
            {watch('seo_description') || watch('excerpt') || 'Description de l\'article...'}
          </div>
        </div>
      </div>
    </DetailView.Section>
  );
}
