'use client';

import { type FC, useRef, useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FileText, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';
import { useTranslatableField } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/translatable-field';

import type { ProductFormData } from '@/app/[locale]/admin/(dashboard)/products/[id]/types/product-form.types';
import type { WithAutoSaveProps } from './with-auto-save';

export const ProductDetailsSection: FC<WithAutoSaveProps> = ({ autoSave }) => {
  const t = useTranslations();
  const { control, formState } = useFormContext<ProductFormData>();

  // Translatable fields with auto-save on blur
  const shortDescriptionField = useTranslatableField('short_description', () => autoSave?.saveNow());
  const descriptionField = useTranslatableField('description', () => autoSave?.saveNow());

  const pricePoints = useWatch({ control, name: 'price_points' }) ?? 0;
  const descriptionValue = useWatch({ control, name: 'description' }) ?? '';
  const originCountryValue = useWatch({ control, name: 'origin_country' }) ?? '';

  // Store initial value for origin_country
  const originCountryInitialRef = useRef<string>('');
  useEffect(() => {
    if (originCountryInitialRef.current === '' && originCountryValue) {
      originCountryInitialRef.current = originCountryValue;
    }
  }, [originCountryValue]);

  return (
    <DetailView.Section icon={FileText} title={t('admin.products.edit.sections.details', { defaultValue: 'Détails du produit' })}>
      <DetailView.Field
        label={t('admin.products.edit.fields.short_description', { defaultValue: 'Description courte' })}
        error={formState.errors.short_description?.message}
      >
        <TextArea
          value={String(shortDescriptionField.value || '')}
          onChange={e => shortDescriptionField.onChange(e.target.value)}
          onBlur={shortDescriptionField.onBlur}
          rows={3}
          maxLength={200}
          placeholder={
            shortDescriptionField.isBaseLang
              ? t('admin.products.edit.placeholders.shortDescription', {
                  defaultValue: 'Une description concise du produit...',
                })
              : `Traduction ${shortDescriptionField.language.toUpperCase()}...`
          }
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.products.edit.fields.description', { defaultValue: 'Description détaillée' })}
        error={formState.errors.description?.message}
      >
        <TextArea
          value={String(descriptionField.value || '')}
          onChange={e => descriptionField.onChange(e.target.value)}
          onBlur={descriptionField.onBlur}
          rows={6}
          maxLength={2000}
          placeholder={
            descriptionField.isBaseLang
              ? t('admin.products.edit.placeholders.description', {
                  defaultValue: 'Description complète du produit, ses avantages, son origine...',
                })
              : `Traduction ${descriptionField.language.toUpperCase()}...`
          }
        />
      </DetailView.Field>

      {pricePoints > 1000 && descriptionValue.trim().length === 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          ℹ️ {t('admin.products.edit.messages.premiumDescriptionRequired', {
            defaultValue: 'Une description détaillée est requise pour les produits premium (>1000 points).'
          })}
        </div>
      )}

      <DetailView.Field
        label={t('admin.products.edit.fields.origin_country', { defaultValue: "Pays d'origine" })}
        error={formState.errors.origin_country?.message}
        >
          <Controller
            name="origin_country"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Globe className="h-4 w-4 text-primary" />}
                error={formState.errors.origin_country?.message}
                value={field.value ?? ''}
                placeholder={t('admin.products.edit.placeholders.originCountry', { defaultValue: 'France' })}
                onBlur={() => {
                  field.onBlur();
                  // Only save if the value has actually changed
                  const currentValue = field.value ?? '';
                  if (currentValue !== originCountryInitialRef.current) {
                    originCountryInitialRef.current = currentValue; // Update initial value after triggering save
                    autoSave?.saveNow();
                  }
                }}
              />
            )}
          />
        </DetailView.Field>
    </DetailView.Section>
  );
};
