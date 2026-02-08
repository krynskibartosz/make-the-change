'use client';

import { type FC, useEffect, useMemo, useRef } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Building2, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { CardRadioGroup } from '@/components/CardRadioGroup';

import { partnerStatusLabels } from '@make-the-change/api/validators/partner';
import type { PartnerFormData } from '@make-the-change/api/validators/partner';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const PartnerEssentialSectionRHF: FC = () => {
  const t = useTranslations();
  const { control, setValue, formState } = useFormContext<PartnerFormData>();

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

  const statusOptions = useMemo(
    () => [
      {
        value: 'active',
        title: t('admin.partners.edit.fields.status.options.active', {
          defaultValue: partnerStatusLabels.active,
        }),
        subtitle: t('admin.partners.edit.fields.status.descriptions.active', {
          defaultValue: 'Le partenaire est opérationnel et visible',
        }),
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      },
      {
        value: 'inactive',
        title: t('admin.partners.edit.fields.status.options.inactive', {
          defaultValue: partnerStatusLabels.inactive,
        }),
        subtitle: t('admin.partners.edit.fields.status.descriptions.inactive', {
          defaultValue: 'Le partenaire est désactivé temporairement',
        }),
        icon: <XCircle className="h-4 w-4 text-gray-500" />,
      },
      {
        value: 'suspended',
        title: t('admin.partners.edit.fields.status.options.suspended', {
          defaultValue: partnerStatusLabels.suspended,
        }),
        subtitle: t('admin.partners.edit.fields.status.descriptions.suspended', {
          defaultValue: 'Le partenaire est suspendu (problème en cours)',
        }),
        icon: <PauseCircle className="h-4 w-4 text-orange-600" />,
      },
    ],
    [t]
  );

  return (
    <DetailView.Section
      icon={Building2}
      title={t('admin.partners.edit.sections.essential', {
        defaultValue: 'Informations essentielles',
      })}
    >
      <DetailView.Field
        label={t('admin.partners.edit.fields.name', { defaultValue: 'Nom du partenaire' })}
        required
        error={formState.errors.name?.message}
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('admin.partners.edit.placeholders.name', {
                defaultValue: 'Ex: Coopérative Ilanga',
              })}
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.partners.edit.fields.slug', { defaultValue: 'Slug' })}
        required
        error={formState.errors.slug?.message}
      >
        <Controller
          control={control}
          name="slug"
          render={({ field }) => (
            <Input
              {...field}
              className="font-mono"
              value={field.value ?? ''}
              placeholder={t('admin.partners.edit.placeholders.slug', {
                defaultValue: 'ex-cooperative-ilanga',
              })}
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
        label={t('admin.partners.edit.fields.status.label', { defaultValue: 'Statut' })}
        required
        error={formState.errors.status?.message}
      >
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <CardRadioGroup
              legend=""
              name="status"
              options={statusOptions}
              selectedValue={field.value ?? ''}
              onChange={(value: string) => field.onChange(value)}
            />
          )}
        />
      </DetailView.Field>
    </DetailView.Section>
  );
};

