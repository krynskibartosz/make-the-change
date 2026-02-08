'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { ShieldCheck, ShieldX, ShieldAlert, Clock } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { UserFormData } from '../../types/user-form.types';
import { useMemo } from 'react';

interface KYCSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * KYC Section - User RHF Component
 *
 * Fields:
 * - KYC Status
 * - KYC Level (0-3)
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function KYCSection({ autoSave }: KYCSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserFormData>();

  // KYC Status options
  const kycStatusOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'none',
        title: 'Aucun',
        subtitle: 'Pas de vérification KYC',
        icon: <ShieldX className="h-4 w-4 text-gray-400" />,
      },
      {
        value: 'pending',
        title: 'En attente',
        subtitle: 'Vérification en cours',
        icon: <Clock className="h-4 w-4 text-amber-500" />,
      },
      {
        value: 'verified',
        title: 'Vérifié',
        subtitle: 'KYC approuvé',
        icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
      },
      {
        value: 'rejected',
        title: 'Rejeté',
        subtitle: 'KYC refusé',
        icon: <ShieldAlert className="h-4 w-4 text-red-600" />,
      },
    ],
    []
  );

  return (
    <DetailView.Section icon={ShieldCheck} title="Vérification KYC">
      <DetailView.FieldGroup layout="grid-2">
        {/* KYC Status */}
        <DetailView.Field
          label="Statut KYC"
          required
          error={errors.kyc_status?.message}
        >
          <Controller
            name="kyc_status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="kyc_status"
                id="kyc-status"
                className="w-full"
                contextIcon={<ShieldCheck className="h-5 w-5 text-primary" />}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);
                  autoSave.markDirty();
                  setTimeout(() => autoSave.saveNow(), 0);
                }}
                options={kycStatusOptions}
                placeholder="Sélectionnez le statut KYC"
              />
            )}
          />
        </DetailView.Field>

        {/* KYC Level */}
        <DetailView.Field
          label="Niveau KYC"
          required
          error={errors.kyc_level?.message}
          description="0 = Aucun, 1 = Basic, 2 = Intermédiaire, 3 = Avancé"
        >
          <Controller
            name="kyc_level"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                type="number"
                min="0"
                max="3"
                leadingIcon={<ShieldCheck className="h-4 w-4 text-primary" />}
                placeholder="0"
                error={errors.kyc_level?.message}
                required
                value={field.value?.toString() ?? '0'}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  field.onChange(isNaN(value) ? 0 : value);
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
