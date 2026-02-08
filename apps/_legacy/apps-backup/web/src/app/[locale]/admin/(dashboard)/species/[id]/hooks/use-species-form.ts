'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { type AdminFormApi, createAdminForm } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { type Species, createSpeciesSchema, updateSpeciesSchema } from '@make-the-change/api/validators/species';

type UseSpeciesFormConfig = {
  initialData?: Partial<Species>;
  speciesId?: string;
};

type UseSpeciesFormReturn = {
  form: AdminFormApi;
  submitNow: () => Promise<void>;
};

export const useSpeciesForm = ({ 
  initialData,
  speciesId 
}: UseSpeciesFormConfig = {}): UseSpeciesFormReturn => {
  const { toast } = useToast();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'fr';

  const { mutateAsync: createSpecies } = trpc.admin.species.create.useMutation();
  const { mutateAsync: updateSpecies } = trpc.admin.species.update.useMutation();

  const form = createAdminForm({
    defaultValues: {
      name: '',
      description: '',
      image_url: undefined,
      icon_url: undefined,
      is_active: true,
      ...initialData,
    },
    validationSchema: speciesId ? updateSpeciesSchema : createSpeciesSchema,
    onSubmit: async (values) => {
      try {
        if (speciesId) {
          await updateSpecies({ id: speciesId, data: values });
          toast({
            title: 'Species updated',
            description: 'The species has been updated successfully.',
          });
        } else {
          const created = await createSpecies(values);
          toast({
            title: 'Species created',
            description: 'The species has been created successfully.',
          });
        }
      } catch (error) {
        console.error('Failed to save species:', error);
        toast({
          variant: 'destructive',
          title: 'Error saving species',
          description: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
        throw error; // Re-throw to trigger form error state
      }
    },
    autoSave: true,
    autoSaveDebounceMs: 500,
  });

  const submitNow = useCallback(async () => {
    try {
      await form.handleSubmit();
    } catch (error) {
      // Error already handled in onSubmit
    }
  }, [form]);

  return {
    form,
    submitNow,
  };
};