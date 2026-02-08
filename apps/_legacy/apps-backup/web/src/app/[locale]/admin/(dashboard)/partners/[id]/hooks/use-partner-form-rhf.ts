'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

import {
  defaultPartnerValues,
  partnerFormSchema,
} from '@make-the-change/api/validators/partner';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

type UsePartnerFormRHFProps = {
  partnerId: string;
  initialData?: Partial<PartnerFormData> | null;
  autoSaveDelayMs?: number;
};

type UsePartnerFormRHFReturn = {
  form: ReturnType<typeof useForm<PartnerFormData>>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isInitialized: boolean;
  lastSavedAt: Date | null;
  saveError: string | null;
  submitNow: () => Promise<void>;
};

const normalizeFormValues = (data?: Partial<PartnerFormData> | null): PartnerFormData => {
  if (!data) {
    return { ...defaultPartnerValues };
  }

  return {
    ...defaultPartnerValues,
    ...data,
    name: data.name ?? defaultPartnerValues.name,
    slug: data.slug ?? defaultPartnerValues.slug,
    contact_email: data.contact_email ?? defaultPartnerValues.contact_email,
    website: data.website ?? defaultPartnerValues.website,
    description: data.description ?? defaultPartnerValues.description,
    status: data.status ?? defaultPartnerValues.status,
    address_street: data.address_street ?? defaultPartnerValues.address_street,
    address_city: data.address_city ?? defaultPartnerValues.address_city,
    address_postal_code:
      data.address_postal_code ?? defaultPartnerValues.address_postal_code,
    address_country: data.address_country ?? defaultPartnerValues.address_country,
  };
};

export const usePartnerFormRHF = ({
  partnerId,
  initialData,
  autoSaveDelayMs = 600,
}: UsePartnerFormRHFProps): UsePartnerFormRHFReturn => {
  const { toast } = useToast();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const enableAutoSaveRef = useRef(false);
  const lastSubmittedValuesRef = useRef<PartnerFormData | null>(null);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: useMemo(() => normalizeFormValues(initialData), [initialData]),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const [isInitialized, setIsInitialized] = useState<boolean>(!!initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { mutateAsync: updatePartner } = trpc.admin.partners.update.useMutation();

  const saveValues = useCallback<SubmitHandler<PartnerFormData>>(async values => {
    if (!partnerId) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      await updatePartner({ id: partnerId, data: values });

      lastSubmittedValuesRef.current = values;
      setLastSavedAt(new Date());
      toast({
        variant: 'success',
        title: 'Partenaire sauvegardé',
        description: 'Les modifications ont été enregistrées automatiquement.',
      });

      form.reset(values, { keepValues: true });
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      enableAutoSaveRef.current = false;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur lors de la sauvegarde.';
      setSaveError(message);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  }, [form, partnerId, toast, updatePartner]);

  const submitNow = useCallback(async () => {
    await form.handleSubmit(saveValues)();
  }, [form, saveValues]);

  useEffect(() => {
    if (!initialData) {
      return;
    }
    form.reset(normalizeFormValues(initialData));
    enableAutoSaveRef.current = false;
    setIsInitialized(true);
  }, [form, initialData]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const subscription = form.watch(() => {
      if (!enableAutoSaveRef.current) {
        enableAutoSaveRef.current = true;
        return;
      }

      if (!partnerId) return;

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(async () => {
        const isValid = await form.trigger();
        if (!isValid) return;

        const currentValues = form.getValues();
        const previousValues = lastSubmittedValuesRef.current;
        if (
          previousValues &&
          JSON.stringify(previousValues) === JSON.stringify(currentValues)
        ) {
          return;
        }

        await saveValues(currentValues);
      }, autoSaveDelayMs);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveDelayMs, form, isInitialized, partnerId, saveValues]);

  return {
    form,
    isSaving,
    hasUnsavedChanges: form.formState.isDirty,
    isInitialized,
    lastSavedAt,
    saveError,
    submitNow,
  };
};

