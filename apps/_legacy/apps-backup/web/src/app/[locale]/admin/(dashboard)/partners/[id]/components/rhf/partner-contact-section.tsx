'use client';

import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

export const PartnerContactSectionRHF: FC = () => {
  const t = useTranslations();
  const { control, formState } = useFormContext<PartnerFormData>();

  return (
    <DetailView.Section
      icon={Mail}
      title={t('admin.partners.edit.sections.contact', {
        defaultValue: 'Contact & visibilité',
      })}
    >
      <DetailView.Field
        label={t('admin.partners.edit.fields.contact_email', {
          defaultValue: 'Email de contact',
        })}
        required
        error={formState.errors.contact_email?.message}
      >
        <Controller
          control={control}
          name="contact_email"
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              value={field.value ?? ''}
              placeholder={t('admin.partners.edit.placeholders.contact_email', {
                defaultValue: 'contact@partenaire.com',
              })}
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.partners.edit.fields.website', {
          defaultValue: 'Site web',
        })}
        error={formState.errors.website?.message}
      >
        <Controller
          control={control}
          name="website"
          render={({ field }) => (
            <Input
              {...field}
              type="url"
              value={field.value ?? ''}
              placeholder={t('admin.partners.edit.placeholders.website', {
                defaultValue: 'https://partenaire.com',
              })}
            />
          )}
        />
      </DetailView.Field>
    </DetailView.Section>
  );
};

