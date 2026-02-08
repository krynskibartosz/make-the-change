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

export const MediaSection: FC = () => {
  const t = useTranslations();
  const { currentLanguage } = useTranslationContext();
  const { control } = useFormContext<SpeciesFormData>();

  const translationPath =
    currentLanguage === 'fr' ? '' : `translations.${currentLanguage}.`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">
        {t('admin.biodex.sections.media')}
      </h2>

      <div className="space-y-4">
        <FormField
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.image_url')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.thumbnail_url')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} type="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}image_credit`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.image_credit')}</FormLabel>
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