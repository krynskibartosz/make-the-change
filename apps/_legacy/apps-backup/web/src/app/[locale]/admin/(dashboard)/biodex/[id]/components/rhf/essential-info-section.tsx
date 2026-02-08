'use client';

import { type FC } from 'react';
import { useTranslations } from 'next-intl';

import { type SpeciesFormData } from '../../types/species-form.types';
import {
  FormTextField,
  FormTextArea,
} from '@/app/[locale]/admin/(dashboard)/components/form';
import { useFormContext } from '@/app/[locale]/admin/(dashboard)/components/form/form-context';
import { useTranslationContext } from '../../contexts/translation-context';

export const EssentialInfoSection: FC = () => {
  const t = useTranslations();
  const { currentLanguage } = useTranslationContext();
  const form = useFormContext<SpeciesFormData>();

  const translationPath =
    currentLanguage === 'fr' ? '' : `translations.${currentLanguage}.`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">
        {t('admin.biodex.sections.essential_info')}
      </h2>

      <div className="space-y-4">
        <form.Field
          name={`${translationPath}name`}
          children={() => (
            <FormTextField
              label={t('admin.biodex.fields.name')}
              placeholder={t('admin.biodex.placeholders.name')}
              required
            />
          )}
        />

        <form.Field
          name={`${translationPath}scientific_name`}
          children={() => (
            <FormTextField
              label={t('admin.biodex.fields.scientific_name')}
              placeholder={t('admin.biodex.placeholders.scientific_name')}
            />
          )}
        />

        <form.Field
          name={`${translationPath}description`}
          children={() => (
            <FormTextArea
              label={t('admin.biodex.fields.description')}
              placeholder={t('admin.biodex.placeholders.description')}
              rows={4}
              required
            />
          )}
        />
      </div>
    </section>
  );
};