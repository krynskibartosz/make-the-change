'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { FileText, Coins, Calendar } from 'lucide-react';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { InputV2 } from '@/components/ui/input-v2';
import { Textarea } from '@/components/ui/textarea';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';
import type { UserFormData } from '../../types/user-form.types';

interface MetadataSectionProps {
  autoSave: AutoSaveReturn;
}

/**
 * Metadata Section - User RHF Component
 *
 * Fields:
 * - Bio
 * - Points Balance
 * - Last Login (read-only)
 *
 * Auto-save triggers:
 * - Field change (debounced 1500ms)
 * - Field blur (immediate via autoSave.saveNow())
 */
export function MetadataSection({ autoSave }: MetadataSectionProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<UserFormData>();

  return (
    <DetailView.Section icon={FileText} title="Métadonnées" span={2}>
      <DetailView.FieldGroup layout="column">
        {/* Bio */}
        <DetailView.Field
          label="Biographie"
          error={errors.bio?.message}
          description="280 caractères maximum"
        >
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Quelques mots sur l'utilisateur..."
                error={errors.bio?.message}
                maxLength={280}
                rows={3}
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

        <DetailView.FieldGroup layout="grid-2">
          {/* Points Balance */}
          <DetailView.Field
            label="Solde de points"
            required
            error={errors.points_balance?.message}
          >
            <Controller
              name="points_balance"
              control={control}
              render={({ field }) => (
                <InputV2
                  {...field}
                  type="number"
                  min="0"
                  leadingIcon={<Coins className="h-4 w-4 text-primary" />}
                  placeholder="0"
                  error={errors.points_balance?.message}
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

          {/* Last Login (Read-only) */}
          <DetailView.Field
            label="Dernière connexion"
            description="Lecture seule"
          >
            <Controller
              name="last_login_at"
              control={control}
              render={({ field }) => (
                <InputV2
                  {...field}
                  leadingIcon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                  placeholder="Jamais connecté"
                  disabled
                  readOnly
                />
              )}
            />
          </DetailView.Field>
        </DetailView.FieldGroup>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
}
