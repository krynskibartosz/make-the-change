'use client';

import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

export const PartnerAddressSectionRHF: FC = () => {
  const t = useTranslations();
  const { control } = useFormContext<PartnerFormData>();

  return (
    <DetailView.Section
      icon={MapPin}
      title={t('admin.partners.edit.sections.address', {
        defaultValue: 'Coordonnées géographiques',
      })}
    >
      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.partners.edit.fields.address_street', {
            defaultValue: 'Rue',
          })}
        >
          <Controller
            control={control}
            name="address_street"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('admin.partners.edit.placeholders.address_street', {
                  defaultValue: '12 rue des Abeilles',
                })}
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.partners.edit.fields.address_city', {
            defaultValue: 'Ville',
          })}
        >
          <Controller
            control={control}
            name="address_city"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('admin.partners.edit.placeholders.address_city', {
                  defaultValue: 'Antananarivo',
                })}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.partners.edit.fields.address_postal_code', {
            defaultValue: 'Code postal',
          })}
        >
          <Controller
            control={control}
            name="address_postal_code"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('admin.partners.edit.placeholders.address_postal_code', {
                  defaultValue: '101',
                })}
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.partners.edit.fields.address_country', {
            defaultValue: 'Pays',
          })}
        >
          <Controller
            control={control}
            name="address_country"
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                placeholder={t('admin.partners.edit.placeholders.address_country', {
                  defaultValue: 'France',
                })}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
};

