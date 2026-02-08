'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { MapPin, Home, Mail as MailIcon, Globe as GlobeIcon } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { PartnerFormData } from '../../types/partner-form.types';

interface AddressSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Address Section - RHF Component
 *
 * Fields:
 * - Street Address
 * - City
 * - Postal Code
 * - Country
 *
 * Validation:
 * If any address field is filled, city and country are required
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function AddressSection({ autoSave }: AddressSectionProps) {
  const t = useTranslations('admin.partners.edit');
  const {
    control,
    formState: { errors },
  } = useFormContext<PartnerFormData>();

  return (
    <DetailView.Section
      icon={MapPin}
      title={t('sections.address.title')}
    >
      {/* Street Address - Full width */}
      <DetailView.Field
        label={t('fields.address_street.label')}
        error={errors.address_street?.message}
      >
        <Controller
          name="address_street"
          control={control}
          render={({ field }) => (
            <InputV2
              {...field}
              leadingIcon={<Home className="h-4 w-4 text-primary" />}
              placeholder={t('fields.address_street.placeholder')}
              error={errors.address_street?.message}
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

      <DetailView.FieldGroup layout="grid-2">
        {/* City */}
        <DetailView.Field
          label={t('fields.address_city.label')}
          error={errors.address_city?.message}
        >
          <Controller
            name="address_city"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<MapPin className="h-4 w-4 text-primary" />}
                placeholder={t('fields.address_city.placeholder')}
                error={errors.address_city?.message}
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

        {/* Postal Code */}
        <DetailView.Field
          label={t('fields.address_postal_code.label')}
          error={errors.address_postal_code?.message}
        >
          <Controller
            name="address_postal_code"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<MailIcon className="h-4 w-4 text-primary" />}
                placeholder={t('fields.address_postal_code.placeholder')}
                error={errors.address_postal_code?.message}
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
      </DetailView.FieldGroup>

      {/* Country - Full width */}
      <DetailView.Field
        label={t('fields.address_country.label')}
        error={errors.address_country?.message}
      >
        <Controller
          name="address_country"
          control={control}
          render={({ field }) => (
            <InputV2
              {...field}
              leadingIcon={<GlobeIcon className="h-4 w-4 text-primary" />}
              placeholder={t('fields.address_country.placeholder')}
              error={errors.address_country?.message}
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
    </DetailView.Section>
  );
}
