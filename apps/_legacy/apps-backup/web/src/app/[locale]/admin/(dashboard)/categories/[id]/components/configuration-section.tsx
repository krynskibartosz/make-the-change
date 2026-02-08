'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Settings, ArrowUpDown, Eye } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { InlineToggle } from '@/components/ui/inline-toggle';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { CategoryFormData } from '../types/category-form.types';

interface ConfigurationSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Configuration Section - RHF Component for Categories
 *
 * Fields:
 * - Sort Order
 * - Is Active
 */
export function ConfigurationSection({ autoSave }: ConfigurationSectionProps) {
  const t = useTranslations('admin.categories');
  const {
    control,
    formState: { errors },
  } = useFormContext<CategoryFormData>();

  return (
    <DetailView.Section
      icon={Settings}
      title={t('sections.configuration')}
    >
      <DetailView.FieldGroup layout="grid-2">
        {/* Sort Order */}
        <DetailView.Field
          label={t('fields.sort_order')}
          error={errors.sort_order?.message}
        >
          <Controller
            name="sort_order"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                type="number"
                leadingIcon={<ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
                placeholder="0"
                error={errors.sort_order?.message}
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
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

        {/* Is Active */}
        <DetailView.Field
          label={t('fields.is_active')}
        >
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <InlineToggle
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    autoSave.markDirty();
                    autoSave.saveNow();
                  }}
                />
                <div className="flex items-center gap-2">
                  <Eye className={`h-4 w-4 ${field.value ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className="text-sm">
                    {field.value ? t('visibility.visible') : t('visibility.hidden')}
                  </span>
                </div>
              </div>
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
