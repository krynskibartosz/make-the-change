'use client';

import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';

import type { ProjectFormData } from '@/lib/validators/project';

const numberOrUndefined = (value: string) => {
  if (value.trim() === '') return undefined;
  const next = Number(value);
  return Number.isNaN(next) ? undefined : next;
};

export const ProjectFundingSectionRHF: FC = () => {
  const t = useTranslations();
  const { control, formState } = useFormContext<ProjectFormData>();

  return (
    <DetailView.Section
      icon={DollarSign}
      title={t('admin.projects.edit.sections.funding', {
        defaultValue: 'Financement & configuration',
      })}
    >
      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.projects.edit.fields.target_budget', {
            defaultValue: 'Budget cible (€)',
          })}
          required
          error={formState.errors.target_budget?.message}
        >
          <Controller
            control={control}
            name="target_budget"
            render={({ field }) => (
              <InputV2
                leadingIcon={<DollarSign className="h-4 w-4 text-primary" />}
                type="number"
                min={0}
                value={field.value === undefined ? '' : String(field.value)}
                onChange={event => field.onChange(numberOrUndefined(event.target.value) ?? 0)}
                error={formState.errors.target_budget?.message}
                required
              />
            )}
          />
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.projects.edit.fields.producer_id', {
            defaultValue: 'Producteur associé',
          })}
          required
          error={formState.errors.producer_id?.message}
        >
          <Controller
            control={control}
            name="producer_id"
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<DollarSign className="h-4 w-4 text-primary" />}
                value={field.value ?? ''}
                placeholder={t('admin.projects.edit.placeholders.producer_id', {
                  defaultValue: 'Identifiant du producteur…',
                })}
                error={formState.errors.producer_id?.message}
                required
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
};

