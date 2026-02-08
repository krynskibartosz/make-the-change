'use client';

import { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FileText, Hash } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { Textarea } from '@/components/ui/textarea';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { BlogPostFormData } from '../types/blog-post-form.types';

interface EssentialInfoSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Essential Info Section - RHF Component for Blog Posts
 *
 * Fields:
 * - Title (with auto-slug generation)
 * - Slug
 * - Excerpt
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function EssentialInfoSection({ autoSave }: EssentialInfoSectionProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BlogPostFormData>();

  // Watch title for auto-slug generation
  const title = watch('title');

  // Auto-generate slug from title (only if slug is empty)
  useEffect(() => {
    const currentSlug = watch('slug');
    if (!currentSlug && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

      setValue('slug', generatedSlug, { shouldDirty: true });
      autoSave.markDirty();
    }
  }, [title, watch, setValue, autoSave]);

  return (
    <DetailView.Section icon={FileText} title="Informations essentielles">
      <DetailView.FieldGroup layout="grid-2">
        {/* Title */}
        <DetailView.Field
          label="Titre de l'article"
          required
          error={errors.title?.message}
          description="Le titre principal de votre article"
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                placeholder="Entrez le titre de l'article"
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

        {/* Slug */}
        <DetailView.Field
          label="Slug (URL)"
          required
          icon={Hash}
          error={errors.slug?.message}
          description="URL-friendly identifier"
        >
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                placeholder="slug-de-larticle"
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
      </DetailView.FieldGroup>

      {/* Excerpt */}
      <DetailView.Field
        label="Extrait"
        error={errors.excerpt?.message}
        description="Courte description de l'article (max 1000 caractères)"
      >
        <Controller
          name="excerpt"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value || ''}
              className="min-h-[100px]"
              placeholder="Entrez un court extrait de l'article..."
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
    </DetailView.Section>
  );
}
