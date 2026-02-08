'use client';

import { useEffect, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Building2, Hash, Activity, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { PartnerFormData } from '../../types/partner-form.types';

interface EssentialInfoSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Essential Info Section - RHF Component
 *
 * Fields:
 * - Name (with auto-slug generation)
 * - Slug
 * - Status
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function EssentialInfoSection({ autoSave }: EssentialInfoSectionProps) {
  const t = useTranslations('admin.partners.edit');
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PartnerFormData>();

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

  // Status options with icons and descriptions
  const statusOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'active',
        title: t('fields.status.options.active'),
        subtitle: t('fields.status.descriptions.active'),
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      },
      {
        value: 'inactive',
        title: t('fields.status.options.inactive'),
        subtitle: t('fields.status.descriptions.inactive'),
        icon: <XCircle className="h-4 w-4 text-gray-400" />,
      },
      {
        value: 'suspended',
        title: t('fields.status.options.suspended'),
        subtitle: t('fields.status.descriptions.suspended'),
        icon: <PauseCircle className="h-4 w-4 text-amber-500" />,
      },
    ],
    [t]
  );

  return (
    <DetailView.Section
      icon={Building2}
      title={t('sections.essential.title')}
    >
      <DetailView.FieldGroup layout="grid-2">
        {/* Name */}
        <DetailView.Field
          label={t('fields.name.label')}
          required
          error={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Building2 className="h-4 w-4 text-primary" />}
                placeholder={t('fields.name.placeholder')}
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
          label={t('fields.slug.label')}
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
                placeholder={t('fields.slug.placeholder')}
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

        {/* Status */}
        <DetailView.Field
          label={t('fields.status.label')}
          required
          error={errors.status?.message}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="status"
                id="partner-status"
                className="w-full"
                contextIcon={<Activity className="h-5 w-5 text-primary" />}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);
                  autoSave.markDirty();
                  setTimeout(() => autoSave.saveNow(), 0);
                }}
                options={statusOptions}
                placeholder={t('fields.status.placeholder')}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
