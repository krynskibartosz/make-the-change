'use client';

import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

import {
  defaultProjectValues,
  projectFormSchema,
} from '@/lib/validators/project';

import type { ProjectFormData } from '@/lib/validators/project';

type UseCreateProjectFormRHFReturn = {
  form: ReturnType<typeof useForm<ProjectFormData>>;
  submitNow: () => Promise<void>;
};

export const useCreateProjectFormRHF = (): UseCreateProjectFormRHFReturn => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'fr';

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultProjectValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const { mutateAsync: createProject } = trpc.admin.projects.create.useMutation();

  const onSubmit = useCallback<SubmitHandler<ProjectFormData>>(async values => {
    try {
      const created = await createProject(values);

      toast({
        variant: 'success',
        title: 'Projet créé',
        description: 'Le projet a été enregistré avec succès.',
      });

      router.push(`/${locale}/admin/projects/${created.id}`);
    } catch (error) {
      console.error('❌ Project creation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de création',
        description:
          error instanceof Error
            ? error.message
            : "Impossible de créer le projet. Veuillez réessayer.",
      });
    }
  }, [createProject, locale, router, toast]);

  const submitNow = useCallback(async () => {
    await form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  return {
    form,
    submitNow,
  };
};

