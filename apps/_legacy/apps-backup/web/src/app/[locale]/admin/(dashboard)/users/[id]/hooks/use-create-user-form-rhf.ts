'use client';

import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

import {
  defaultUserCreateValues,
  type UserCreateFormData,
  userCreateFormSchemaRHF,
} from '../types/user-form.types';

const mapCreatePayload = (values: UserCreateFormData) => ({
  email: values.email,
  password: values.password,
  user_level: values.user_level,
  points_balance: values.points_balance,
  kyc_status: values.kyc_status,
  send_welcome_email: values.send_welcome_email,
  is_active: values.is_active,
  raw_user_meta_data: {
    firstName: values.first_name?.trim() || undefined,
    lastName: values.last_name?.trim() || undefined,
    country: values.country,
    avatarUrl: values.avatar_url?.trim() || undefined,
    coverUrl: values.cover_url?.trim() || undefined,
    bio: values.bio?.trim() || undefined,
  },
});

export const useCreateUserFormRHF = () => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? 'fr';

  const form = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateFormSchemaRHF),
    defaultValues: defaultUserCreateValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const { mutateAsync: createUser, isPending } =
    trpc.admin.users.create.useMutation();

  const onSubmit = useCallback<SubmitHandler<UserCreateFormData>>(async values => {
    try {
      const payload = mapCreatePayload(values);
      const created = await createUser(payload);

      toast({
        variant: 'success',
        title: 'Utilisateur créé',
        description: "Le compte a été créé avec succès.",
      });

      router.push(`/${locale}/admin/users/${created.id}`);
    } catch (error) {
      console.error('❌ User creation failed', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de création',
        description: "Impossible de créer l'utilisateur.",
      });
    }
  }, [createUser, locale, router, toast]);

  const submitNow = useCallback(async () => {
    await form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);

  return {
    form,
    submitNow,
    isSubmitting: form.formState.isSubmitting || isPending,
  };
};
