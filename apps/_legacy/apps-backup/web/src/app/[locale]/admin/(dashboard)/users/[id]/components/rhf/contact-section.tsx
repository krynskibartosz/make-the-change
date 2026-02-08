'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Phone } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { UserFormData } from '../../types/user-form.types';

interface ContactSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Contact Section - User RHF Component
 *
 * Fields:
 * - Phone
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function ContactSection({ autoSave }: ContactSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserFormData>();

  return (
    <DetailView.Section icon={Phone} title="Contact">
      <DetailView.FieldGroup layout="column">
        {/* Phone */}
        <DetailView.Field
          label="Téléphone"
          error={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<Phone className="h-4 w-4 text-primary" />}
                type="tel"
                placeholder="+33 6 12 34 56 78"
                error={errors.phone?.message}
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
