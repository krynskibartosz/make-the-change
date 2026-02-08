'use client';

import { type FC, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Info, Tag as TagIcon, Calendar, CalendarX, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';
import { useTranslatableField } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/translatable-field';

import type { ProductFormData } from '../types/product-form.types';
import type { WithAutoSaveProps } from './with-auto-save';

const secondaryCategories = [
  {
    value: 'miels',
    labelKey: 'miels',
    defaultLabel: 'Miels & Apiculture',
    defaultSubtitle: 'Douceur naturelle et pollinisateurs',
    tone: 'text-amber-500',
  },
  {
    value: 'huiles',
    labelKey: 'huiles',
    defaultLabel: 'Huiles & Olives',
    defaultSubtitle: 'Saveurs méditerranéennes',
    tone: 'text-emerald-500',
  },
  {
    value: 'transformes',
    labelKey: 'transformes',
    defaultLabel: 'Produits transformés',
    defaultSubtitle: 'Recettes artisanales premium',
    tone: 'text-primary',
  },
  {
    value: 'epices',
    labelKey: 'epices',
    defaultLabel: 'Épices & Condiments',
    defaultSubtitle: 'Assemblages aromatiques uniques',
    tone: 'text-orange-500',
  },
  {
    value: 'cosmetiques',
    labelKey: 'cosmetiques',
    defaultLabel: 'Cosmétiques naturels',
    defaultSubtitle: 'Soins responsables et durables',
    tone: 'text-rose-500',
  },
  {
    value: 'artisanat',
    labelKey: 'artisanat',
    defaultLabel: 'Artisanat local',
    defaultSubtitle: 'Savoir-faire et pièces uniques',
    tone: 'text-purple-500',
  },
  {
    value: 'saisonniers',
    labelKey: 'saisonniers',
    defaultLabel: 'Produits saisonniers',
    defaultSubtitle: 'Éditions limitées et festivités',
    tone: 'text-teal-500',
  },
  {
    value: 'bio',
    labelKey: 'bio',
    defaultLabel: 'Agriculture biologique',
    defaultSubtitle: 'Certifiés bio & responsables',
    tone: 'text-green-600',
  },
  {
    value: 'equitable',
    labelKey: 'equitable',
    defaultLabel: 'Commerce équitable',
    defaultSubtitle: 'Impact social positif',
    tone: 'text-sky-500',
  },
  {
    value: 'mer',
    labelKey: 'mer',
    defaultLabel: 'Produits de la mer',
    defaultSubtitle: 'Richesses marines durables',
    tone: 'text-blue-500',
  },
];

type TagsInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

const TagsInput: FC<TagsInputProps> = ({ value, onChange }) => {
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setDraft(value.join(', '));
  }, [value]);

  const commit = (raw: string) => {
    const next = raw
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
    onChange(next);
  };

  return (
    <InputV2
      placeholder="tag-1, tag-2, ..."
      value={draft}
      leadingIcon={<TagIcon className="h-4 w-4 text-muted-foreground" />}
      onBlur={event => commit(event.target.value)}
      onChange={event => setDraft(event.target.value)}
    />
  );
};

export const MetadataSection: FC<WithAutoSaveProps> = ({ autoSave }) => {
  const t = useTranslations();
  const { control, formState } = useFormContext<ProductFormData>();

  // Translatable SEO fields with auto-save on blur
  const seoTitleField = useTranslatableField('seo_title', () => autoSave?.saveNow());
  const seoDescriptionField = useTranslatableField('seo_description', () => autoSave?.saveNow());

  const secondaryCategoryOptions = useMemo<SelectOption[]>(
    () =>
      secondaryCategories.map(category => ({
        value: category.value,
        title: t(`admin.products.edit.secondaryCategories.${category.labelKey}`, {
          defaultValue: category.defaultLabel,
        }),
        subtitle: t(
          `admin.products.edit.secondaryCategories.${category.labelKey}_subtitle`,
          { defaultValue: category.defaultSubtitle }
        ),
        icon: <TagIcon className={`h-4 w-4 ${category.tone}`} />,
      })),
    [t]
  );

  return (
    <DetailView.Section
      icon={Info}
      span={2}
      title={t('admin.products.edit.sections.metadata', { defaultValue: 'Métadonnées' })}
    >
      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.products.edit.fields.secondary_category_id', {
            defaultValue: 'Catégorie secondaire',
          })}
        >
          <Controller
            control={control}
            name="secondary_category_id"
            render={({ field }) => (
              <CustomSelect
                name="secondary_category_id"
                id="product-secondary-category"
                className="w-full"
                contextIcon={<TagIcon className="h-5 w-5 text-primary" />}
                value={field.value ?? ''}
                onChange={value => field.onChange(value)}
                options={secondaryCategoryOptions}
                placeholder={t('admin.products.edit.placeholders.secondary_category', {
                  defaultValue: 'Sélectionner une catégorie...',
                })}
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          description={t('admin.products.edit.helpers.tags', {
            defaultValue: 'Séparer par des virgules',
          })}
          label={t('admin.products.edit.fields.tags', { defaultValue: 'Tags' })}
        >
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsInput
                value={Array.isArray(field.value) ? field.value : []}
                onChange={next => field.onChange(next)}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.products.edit.fields.launch_date', {
            defaultValue: 'Date de lancement',
          })}
        >
          <Controller
            control={control}
            name="launch_date"
            render={({ field }) => (
              <InputV2
                type="date"
                leadingIcon={<Calendar className="h-4 w-4 text-primary" />}
                value={field.value ?? ''}
                onChange={event => field.onChange(event.target.value)}
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.discontinue_date', {
            defaultValue: 'Date de retrait',
          })}
        >
          <Controller
            control={control}
            name="discontinue_date"
            render={({ field }) => (
              <InputV2
                type="date"
                leadingIcon={<CalendarX className="h-4 w-4 text-destructive" />}
                value={field.value ?? ''}
                onChange={event => field.onChange(event.target.value)}
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          description={t('admin.products.edit.helpers.seo_title', {
            defaultValue: '60 caractères maximum',
          })}
          label={t('admin.products.edit.fields.seo_title', {
            defaultValue: 'Titre SEO',
          })}
        >
          <InputV2
            maxLength={60}
            leadingIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            error={formState.errors.seo_title?.message}
            value={seoTitleField.value}
            onChange={e => seoTitleField.onChange(e.target.value)}
            onBlur={seoTitleField.onBlur}
            placeholder={
              seoTitleField.isBaseLang
                ? 'Titre optimisé pour les moteurs de recherche'
                : `Traduction ${seoTitleField.language.toUpperCase()}...`
            }
          />
        </DetailView.Field>

        <DetailView.Field
          description={t('admin.products.edit.helpers.seo_description', {
            defaultValue: '160 caractères maximum',
          })}
          label={t('admin.products.edit.fields.seo_description', {
            defaultValue: 'Description SEO',
          })}
        >
          <TextArea
            maxLength={160}
            rows={3}
            value={seoDescriptionField.value}
            onChange={e => seoDescriptionField.onChange(e.target.value)}
            onBlur={seoDescriptionField.onBlur}
            placeholder={
              seoDescriptionField.isBaseLang
                ? 'Description pour les moteurs de recherche'
                : `Traduction ${seoDescriptionField.language.toUpperCase()}...`
            }
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
};
