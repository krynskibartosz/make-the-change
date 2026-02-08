'use client';

import { type FC } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';
import { type SelectOption } from '@/app/[locale]/admin/(dashboard)/components/form/fields/select-field';
import { TextField } from '@/app/[locale]/admin/(dashboard)/components/form/fields/text-field';
import { TextAreaField } from '@/app/[locale]/admin/(dashboard)/components/form/fields/textarea-field';
import { SelectField } from '@/app/[locale]/admin/(dashboard)/components/form/fields/select-field';
import type { SpeciesFormData } from '../types';

export const EssentialInfoSection: FC = () => {
  const t = useTranslations();
  const form = useFormContext();

  const statusOptions: SelectOption[] = [
    { value: 'true', label: t('admin.species.form.fields.status.options.active') },
    { value: 'false', label: t('admin.species.form.fields.status.options.inactive') }
  ];

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">
          {t('admin.species.form.sections.essential_info.title')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('admin.species.form.sections.essential_info.description')}
        </p>
      </div>
      
      <div className="space-y-4">
        <form.Field name="name">
          {({ form, field }) => (
            <TextField
              label={t('admin.species.form.fields.name.label')}
              placeholder={t('admin.species.form.fields.name.placeholder')}
              required
              form={form}
              field={field}
            />
          )}
        </form.Field>

        <form.Field name="description">
          {({ form, field }) => (
            <TextAreaField
              label={t('admin.species.form.fields.description.label')}
              placeholder={t('admin.species.form.fields.description.placeholder')}
              form={form}
              field={field}
            />
          )}
        </form.Field>

        <form.Field name="image_url">
          {({ form, field }) => (
            <TextField
              label={t('admin.species.form.fields.image_url.label')}
              placeholder={t('admin.species.form.fields.image_url.placeholder')}
              type="url"
              form={form}
              field={field}
            />
          )}
        </form.Field>

        <form.Field name="icon_url">
          {({ form, field }) => (
            <TextField
              label={t('admin.species.form.fields.icon_url.label')}
              placeholder={t('admin.species.form.fields.icon_url.placeholder')}
              type="url"
              form={form}
              field={field}
            />
          )}
        </form.Field>

        <form.Field name="is_active">
          {({ form, field }) => (
            <SelectField
              label={t('admin.species.form.fields.status.label')}
              options={statusOptions}
              form={form}
              field={field}
            />
          )}
        </form.Field>
      </div>
    </div>
  );
};