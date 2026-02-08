'use client';

import { useEffect, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Folder, Hash, ListTree } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { CategoryFormData } from '../types/category-form.types';
import { trpc } from '@/lib/trpc';

interface EssentialInfoSectionProps {
  autoSave: AutoSaveReturn;
  currentCategoryId: string;
}

/**
 * Essential Info Section - RHF Component for Categories
 *
 * Fields:
 * - Name (with auto-slug generation)
 * - Slug
 * - Description
 * - Parent Category
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function EssentialInfoSection({ autoSave, currentCategoryId }: EssentialInfoSectionProps) {
  const t = useTranslations('admin.categories');
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CategoryFormData>();

  // Fetch all categories for parent selection
  const { data: allCategories } = trpc.admin.categories.list.useQuery({
    activeOnly: false,
  });

  // Watch name for auto-slug generation
  const name = watch('name');

  // Auto-generate slug from name (only if slug is empty)
  useEffect(() => {
    const currentSlug = watch('slug');
    if (!currentSlug && name) {
      const generatedSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

      setValue('slug', generatedSlug, { shouldDirty: true });
      autoSave.markDirty();
    }
  }, [name, watch, setValue, autoSave]);

  // Parent category options (exclude current category and its children)
  const parentOptions = useMemo<SelectOption[]>(() => {
    if (!allCategories) return [];

    // Filter out current category and build options
    const availableCategories = allCategories
      .filter(cat => cat.id !== currentCategoryId && !cat.parent_id)
      .map(cat => ({
        value: cat.id,
        title: cat.name,
        subtitle: cat.slug,
        icon: undefined,
      }));

    // Add "None" option at the beginning
    return [
      {
        value: '',
        title: t('fields.no_parent'),
        subtitle: 'Catégorie racine',
        icon: undefined,
      },
      ...availableCategories,
    ];
  }, [allCategories, currentCategoryId, t]);

  return (
    <DetailView.Section
      icon={Folder}
      title={t('sections.essential_info')}
    >
      <DetailView.FieldGroup layout="grid-2">
        {/* Name */}
        <DetailView.Field
          label={t('fields.name')}
          required
          error={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Folder className="h-4 w-4 text-primary" />}
                placeholder="Nom de la catégorie"
                error={errors.name?.message}
                required
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

        {/* Slug */}
        <DetailView.Field
          label={t('fields.slug')}
          required
          error={errors.slug?.message}
        >
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Hash className="h-4 w-4 text-muted-foreground" />}
                className="font-mono"
                placeholder="nom-de-la-categorie"
                error={errors.slug?.message}
                required
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

        {/* Description - spans 2 columns */}
        <div className="col-span-2">
          <DetailView.Field
            label={t('fields.description')}
            error={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Description de la catégorie..."
                  rows={4}
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
        </div>

        {/* Parent Category */}
        <DetailView.Field
          label={t('fields.parent_category')}
          error={errors.parent_id?.message}
        >
          <Controller
            name="parent_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="parent_id"
                options={parentOptions}
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value || null);
                  autoSave.markDirty();
                  autoSave.saveNow();
                }}
                placeholder="Sélectionner une catégorie parente"
                contextIcon={<ListTree className="h-4 w-4" />}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
