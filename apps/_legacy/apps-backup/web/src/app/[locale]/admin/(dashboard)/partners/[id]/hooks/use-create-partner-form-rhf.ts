'use client';

import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

import {
  defaultPartnerValues,
  partnerFormSchema,
} from '@make-the-change/api/validators/partner';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

type UseCreatePartnerFormRHFReturn = {
  form: ReturnType<typeof useForm<PartnerFormData>>;
  submitNow: () => Promise<void>;
};

export const useCreatePartnerFormRHF = (): UseCreatePartnerFormRHFReturn => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'fr';

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: defaultPartnerValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const { mutateAsync: createPartner } = trpc.admin.partners.create.useMutation();

  const onSubmit = useCallback<SubmitHandler<PartnerFormData>>(async values => {
    try {
      const created = await createPartner(values);

      toast({
        variant: 'success',
        title: 'Partenaire créé',
        description: 'Le partenaire a été enregistré avec succès.',
      });

      router.push(`/${locale}/admin/partners/${created.id}`);
    } catch (error) {
      console.error('❌ Partner creation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de création',
        description:
          error instanceof Error
            ? error.message
            : "Impossible de créer le partenaire. Veuillez réessayer.",
      });
    }
  }, [createPartner, locale, router, toast]);

  const submitNow = useCallback(async () => {
    await form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  return {
    form,
    submitNow,
  };
};

