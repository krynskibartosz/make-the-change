'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Mail, Globe } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { PartnerFormData } from '../../types/partner-form.types';

interface ContactSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Contact Section - RHF Component
 *
 * Fields:
 * - Contact Email
 * - Website
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function ContactSection({ autoSave }: ContactSectionProps) {
  const t = useTranslations('admin.partners.edit');
  const {
    control,
    formState: { errors },
  } = useFormContext<PartnerFormData>();

  return (
    <DetailView.Section
      icon={Mail}
      title={t('sections.contact.title')}
    >
      <DetailView.FieldGroup layout="grid-2">
        {/* Contact Email */}
        <DetailView.Field
          label={t('fields.contact_email.label')}
          error={errors.contact_email?.message}
        >
          <Controller
            name="contact_email"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Mail className="h-4 w-4 text-primary" />}
                type="email"
                placeholder={t('fields.contact_email.placeholder')}
                error={errors.contact_email?.message}
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

        {/* Website */}
        <DetailView.Field
          label={t('fields.website.label')}
          error={errors.website?.message}
        >
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Globe className="h-4 w-4 text-primary" />}
                type="url"
                placeholder={t('fields.website.placeholder')}
                error={errors.website?.message}
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
    </DetailView.Section>
  );
}
