'use client';

import { useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Calendar, Eye, FileText } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { BlogPostFormData } from '../types/blog-post-form.types';

interface PublicationSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Publication Section - RHF Component for Blog Posts
 *
 * Fields:
 * - Status (draft, published, archived)
 * - Publication Date
 * - Cover Image URL
 */
export function PublicationSection({ autoSave }: PublicationSectionProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<BlogPostFormData>();

  const statusOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'draft',
        title: 'Brouillon',
        subtitle: 'Non visible publiquement',
        icon: <FileText className="h-4 w-4 text-warning" />,
      },
      {
        value: 'published',
        title: 'Publié',
        subtitle: 'Visible publiquement',
        icon: <Eye className="h-4 w-4 text-success" />,
      },
      {
        value: 'archived',
        title: 'Archivé',
        subtitle: 'Archivé et non visible',
        icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      },
    ],
    []
  );

  return (
    <DetailView.Section icon={Calendar} title="Publication">
      <DetailView.FieldGroup layout="grid-2">
        {/* Status */}
        <DetailView.Field
          label="Statut"
          required
          error={errors.status?.message}
          description="Statut de publication de l'article"
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="status"
                contextIcon={<FileText className="h-5 w-5" />}
                options={statusOptions}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  autoSave.triggerSave();
                  autoSave.saveNow();
                }}
              />
            )}
          />
        </DetailView.Field>

        {/* Publication Date */}
        <DetailView.Field
          label="Date de publication"
          icon={Calendar}
          error={errors.published_at?.message}
          description="Date de publication (optionnel)"
        >
          <Controller
            name="published_at"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                value={field.value || ''}
                type="datetime-local"
                onBlur={() => {
                  field.onBlur();
                  autoSave.saveNow();
                }}
                onChange={(e) => {
                  field.onChange(e.target.value || null);
                  autoSave.triggerSave();
                }}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>

      {/* Cover Image */}
      <DetailView.Field
        label="Image de couverture"
        error={errors.cover_image_url?.message}
        description="URL de l'image de couverture"
      >
        <Controller
          name="cover_image_url"
          control={control}
          render={({ field }) => (
            <InputV2
              {...field}
              value={field.value || ''}
              type="url"
              placeholder="https://example.com/image.jpg"
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

      {/* Preview Cover Image */}
      {watch('cover_image_url') && (
        <div className="mt-4">
          <p className="text-text-secondary mb-2 text-sm font-medium">Aperçu</p>
          <div className="border-border-subtle overflow-hidden rounded-lg border">
            <img
              alt="Cover preview"
              className="h-48 w-full object-cover"
              src={watch('cover_image_url') || ''}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </DetailView.Section>
  );
}
