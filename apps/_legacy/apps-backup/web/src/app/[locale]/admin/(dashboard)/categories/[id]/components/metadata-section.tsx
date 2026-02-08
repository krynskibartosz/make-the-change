'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { RawCategoryData } from '../types/category-form.types';

interface MetadataSectionProps {
  category: RawCategoryData;
}

/**
 * Metadata Section - Display read-only system information
 *
 * Fields:
 * - Created At
 * - Updated At
 */
export function MetadataSection({ category }: MetadataSectionProps) {
  const t = useTranslations('admin.categories');

  return (
    <DetailView.Section
      icon={Clock}
      title={t('sections.metadata')}
      className="col-span-2"
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{t('fields.created_at')}</p>
          <p className="text-sm font-medium">
            {new Date(category.created_at).toLocaleString('fr-FR', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{t('fields.updated_at')}</p>
          <p className="text-sm font-medium">
            {new Date(category.updated_at).toLocaleString('fr-FR', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </p>
        </div>
      </div>
    </DetailView.Section>
  );
}
