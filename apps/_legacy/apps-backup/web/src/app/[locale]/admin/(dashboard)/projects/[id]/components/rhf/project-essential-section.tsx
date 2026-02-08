'use client';

import { type FC, useEffect, useMemo, useRef } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Info, Hash, Lightbulb, Activity, Star, CheckCircle, XCircle, PauseCircle, Sprout, TreeDeciduous, Grape } from 'lucide-react';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import { InputV2 } from '@/components/ui/input-v2';
import { ToggleCard } from '@/components/ui/toggle-card';
import type { ProjectFormData } from '@/lib/validators/project';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .replaceAll(/[^\da-z]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

export const ProjectEssentialSectionRHF: FC = () => {
  const t = useTranslations();
  const { control, setValue, formState } = useFormContext<ProjectFormData>();

  const slugAutoRef = useRef('');
  const slugManuallyEditedRef = useRef(false);

  const nameValue = useWatch({ control, name: 'name' });
  const slugValue = useWatch({ control, name: 'slug' });

  useEffect(() => {
    const nextAutoSlug = nameValue ? slugify(nameValue) : '';
    const currentSlug = slugValue ?? '';
    const wasAutoSlug = currentSlug === slugAutoRef.current || currentSlug === '';

    slugAutoRef.current = nextAutoSlug;

    if (wasAutoSlug && !slugManuallyEditedRef.current) {
      setValue('slug', nextAutoSlug, { shouldDirty: true, shouldValidate: true });
      slugManuallyEditedRef.current = false;
    }
  }, [nameValue, setValue, slugValue]);

  useEffect(() => {
    if (slugValue === slugAutoRef.current) {
      slugManuallyEditedRef.current = false;
      return;
    }

    if (slugValue && slugValue !== slugAutoRef.current) {
      slugManuallyEditedRef.current = true;
      return;
    }

    if (!slugValue) {
      slugManuallyEditedRef.current = false;
    }
  }, [slugValue]);

  // Type options with icons and descriptions
  const typeOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'beehive',
        title: t('admin.projects.type.beehive'),
        subtitle: t('admin.projects.type_descriptions.beehive'),
        icon: <Sprout className="h-4 w-4 text-amber-600" />,
      },
      {
        value: 'olive_tree',
        title: t('admin.projects.type.olive_tree'),
        subtitle: t('admin.projects.type_descriptions.olive_tree'),
        icon: <TreeDeciduous className="h-4 w-4 text-green-600" />,
      },
      {
        value: 'vineyard',
        title: t('admin.projects.type.vineyard'),
        subtitle: t('admin.projects.type_descriptions.vineyard'),
        icon: <Grape className="h-4 w-4 text-purple-600" />,
      },
    ],
    [t]
  );

  // Status options with icons and descriptions
  const statusOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'active',
        title: t('admin.projects.statuses.active'),
        subtitle: t('admin.projects.status_descriptions.active'),
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      },
      {
        value: 'funded',
        title: t('admin.projects.statuses.funded'),
        subtitle: t('admin.projects.status_descriptions.funded'),
        icon: <CheckCircle className="h-4 w-4 text-blue-600" />,
      },
      {
        value: 'closed',
        title: t('admin.projects.statuses.closed'),
        subtitle: t('admin.projects.status_descriptions.closed'),
        icon: <XCircle className="h-4 w-4 text-gray-400" />,
      },
      {
        value: 'suspended',
        title: t('admin.projects.statuses.suspended'),
        subtitle: t('admin.projects.status_descriptions.suspended'),
        icon: <PauseCircle className="h-4 w-4 text-amber-500" />,
      },
    ],
    [t]
  );

  return (
    <DetailView.Section
      icon={Info}
      title={t('admin.projects.edit.sections.essential', {
        defaultValue: 'Informations essentielles',
      })}
    >
      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.projects.edit.fields.name', { defaultValue: 'Nom du projet' })}
          required
          error={formState.errors.name?.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Lightbulb className="h-4 w-4 text-primary" />}
                value={field.value ?? ''}
                placeholder={t('admin.projects.edit.placeholders.name', {
                  defaultValue: 'Ex: Programme ruches urbaines',
                })}
                error={formState.errors.name?.message}
                required
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.projects.edit.fields.slug', { defaultValue: 'Slug' })}
          required
          error={formState.errors.slug?.message}
        >
          <Controller
            control={control}
            name="slug"
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Hash className="h-4 w-4 text-muted-foreground" />}
                className="font-mono"
                value={field.value ?? ''}
                placeholder={t('admin.projects.edit.placeholders.slug', {
                  defaultValue: 'ex-programme-ruches',
                })}
                error={formState.errors.slug?.message}
                required
                onChange={event => {
                  const next = event.target.value;
                  field.onChange(next);
                  slugManuallyEditedRef.current = next !== slugAutoRef.current;
                }}
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.projects.edit.fields.type', { defaultValue: 'Type de projet' })}
          required
          error={formState.errors.type?.message}
        >
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <CustomSelect
                name="type"
                id="project-type"
                className="w-full"
                contextIcon={<Lightbulb className="h-5 w-5 text-primary" />}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);
                }}
                options={typeOptions}
                placeholder={t('admin.projects.edit.placeholders.type', {
                  defaultValue: 'Sélectionner un type…',
                })}
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.projects.edit.fields.status', { defaultValue: 'Statut' })}
          error={formState.errors.status?.message}
        >
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <CustomSelect
                name="status"
                id="project-status"
                className="w-full"
                contextIcon={<Activity className="h-5 w-5 text-primary" />}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);
                }}
                options={statusOptions}
                placeholder={t('admin.projects.edit.placeholders.status', {
                  defaultValue: 'Sélectionner un statut…',
                })}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>

      <Controller
        control={control}
        name="featured"
        render={({ field }) => (
          <ToggleCard
            id="project-featured"
            label={t('admin.projects.edit.fields.featured', {
              defaultValue: 'Projet mis en avant',
            })}
            icon={<Star className="h-6 w-6 text-gray-400" />}
            isChecked={field.value ?? false}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
    </DetailView.Section>
  );
};

