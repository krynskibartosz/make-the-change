'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { User, Mail, Shield, Activity, CheckCircle, XCircle } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { UserFormData } from '../../types/user-form.types';
import { useMemo } from 'react';

interface EssentialInfoSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Essential Info Section - User RHF Component
 *
 * Fields:
 * - First Name
 * - Last Name
 * - Email
 * - User Level
 * - Active Status
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function EssentialInfoSection({ autoSave }: EssentialInfoSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserFormData>();

  // User level options
  const userLevelOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'explorateur',
        title: 'Explorateur',
        subtitle: 'Niveau 1 - Exploration gratuite',
        icon: <User className="h-4 w-4 text-blue-600" />,
      },
      {
        value: 'protecteur',
        title: 'Protecteur',
        subtitle: 'Niveau 2 - Investissements €50-150',
        icon: <Shield className="h-4 w-4 text-green-600" />,
      },
      {
        value: 'ambassadeur',
        title: 'Ambassadeur',
        subtitle: 'Niveau 3 - Abonnements €180-320',
        icon: <Activity className="h-4 w-4 text-purple-600" />,
      },
    ],
    []
  );

  // Active status options
  const activeStatusOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: 'true',
        title: 'Actif',
        subtitle: 'L\'utilisateur peut se connecter',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      },
      {
        value: 'false',
        title: 'Inactif',
        subtitle: 'L\'utilisateur ne peut pas se connecter',
        icon: <XCircle className="h-4 w-4 text-gray-400" />,
      },
    ],
    []
  );

  return (
    <DetailView.Section icon={User} title="Informations essentielles">
      <DetailView.FieldGroup layout="grid-2">
        {/* First Name */}
        <DetailView.Field
          label="Prénom"
          error={errors.first_name?.message}
        >
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<User className="h-4 w-4 text-primary" />}
                placeholder="Prénom de l'utilisateur"
                error={errors.first_name?.message}
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

        {/* Last Name */}
        <DetailView.Field
          label="Nom"
          error={errors.last_name?.message}
        >
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                leadingIcon={<User className="h-4 w-4 text-primary" />}
                placeholder="Nom de l'utilisateur"
                error={errors.last_name?.message}
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

        {/* Email */}
        <DetailView.Field
          label="Email"
          required
          error={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputV2
                {...field}
                type="email"
                leadingIcon={<Mail className="h-4 w-4 text-primary" />}
                placeholder="email@example.com"
                error={errors.email?.message}
                required
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

        {/* User Level */}
        <DetailView.Field
          label="Niveau utilisateur"
          required
          error={errors.user_level?.message}
        >
          <Controller
            name="user_level"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="user_level"
                id="user-level"
                className="w-full"
                contextIcon={<Shield className="h-5 w-5 text-primary" />}
                value={field.value ?? ''}
                onChange={(value) => {
                  field.onChange(value);
                  autoSave.markDirty();
                  setTimeout(() => autoSave.saveNow(), 0);
                }}
                options={userLevelOptions}
                placeholder="Sélectionnez le niveau"
              />
            )}
          />
        </DetailView.Field>

        {/* Active Status */}
        <DetailView.Field
          label="Statut du compte"
          required
          error={errors.is_active?.message}
        >
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="is_active"
                id="user-active-status"
                className="w-full"
                contextIcon={<Activity className="h-5 w-5 text-primary" />}
                value={field.value ? 'true' : 'false'}
                onChange={(value) => {
                  field.onChange(value === 'true');
                  autoSave.markDirty();
                  setTimeout(() => autoSave.saveNow(), 0);
                }}
                options={activeStatusOptions}
                placeholder="Sélectionnez le statut"
              />
            )}
          />
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
