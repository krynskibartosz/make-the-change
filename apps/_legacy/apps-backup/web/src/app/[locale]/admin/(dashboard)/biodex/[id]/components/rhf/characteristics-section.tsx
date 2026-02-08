'use client';

import { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslationContext } from '../../contexts/translation-context';
import type { SpeciesFormData } from '../../types/species-form.types';

export const CharacteristicsSection: FC = () => {
  const t = useTranslations();
  const { currentLanguage } = useTranslationContext();
  const { control } = useFormContext<SpeciesFormData>();

  const translationPath =
    currentLanguage === 'fr' ? '' : `translations.${currentLanguage}.`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">
        {t('admin.biodex.sections.characteristics')}
      </h2>

      <div className="space-y-4">
        <FormField
          control={control}
          name={`${translationPath}size`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.size')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}weight`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.weight')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}habitat`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.habitat')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}behavior`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.behavior')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};