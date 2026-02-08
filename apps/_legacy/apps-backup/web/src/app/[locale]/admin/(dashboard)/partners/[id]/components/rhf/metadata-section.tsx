'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';
import { TranslatableField } from '@/components/admin/translatable-field';
import { useTranslationContext } from '../../contexts/translation-context';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { PartnerFormData } from '../../types/partner-form.types';

interface MetadataSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Metadata Section - RHF Component
 *
 * Fields:
 * - Description (translatable)
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function MetadataSection({ autoSave }: MetadataSectionProps) {
  const t = useTranslations('admin.partners.edit');
  const {
    control,
    formState: { errors },
  } = useFormContext<PartnerFormData>();

  const translationContext = useTranslationContext();

  return (
    <DetailView.Section
      icon={FileText}
      title={t('sections.metadata.title')}
    >
      {/* Description - Translatable */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-foreground text-sm font-medium">
            {t('fields.description.label')}
          </label>
          <TranslatableField
            fieldName="description"
            translationContext={translationContext}
          />
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <TextArea
                {...field}
                value={String(field.value || '')}
                placeholder={t('fields.description.placeholder')}
                rows={6}
                maxLength={2000}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  autoSave.markDirty();
                }}
                onBlur={(e) => {
                  field.onBlur();
                  autoSave.saveNow();
                }}
              />
              {errors.description && (
                <p className="text-destructive flex items-center gap-1 text-xs">
                  <span>⚠️</span>
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {field.value?.length || 0} / 2000 caractères
              </p>
            </div>
          )}
        />
      </div>
    </DetailView.Section>
  );
}
