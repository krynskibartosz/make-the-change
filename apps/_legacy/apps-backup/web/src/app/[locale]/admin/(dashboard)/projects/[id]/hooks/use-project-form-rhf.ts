'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

import {
  defaultProjectValues,
  projectFormSchema,
} from '@/lib/validators/project';

import type { ProjectFormData } from '@/lib/validators/project';

type UseProjectFormRHFProps = {
  projectId: string;
  initialData?: Partial<ProjectFormData> | null;
  autoSaveDelayMs?: number;
};

type UseProjectFormRHFReturn = {
  form: ReturnType<typeof useForm<ProjectFormData>>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isInitialized: boolean;
  lastSavedAt: Date | null;
  saveError: string | null;
  submitNow: () => Promise<void>;
};

const normalizeFormValues = (data?: Partial<ProjectFormData> | null): ProjectFormData => {
  if (!data) {
    return { ...defaultProjectValues };
  }

  return {
    ...defaultProjectValues,
    ...data,
    name: data.name ?? defaultProjectValues.name,
    slug: data.slug ?? defaultProjectValues.slug,
    type: data.type ?? defaultProjectValues.type,
    target_budget: data.target_budget ?? defaultProjectValues.target_budget,
    producer_id: data.producer_id ?? defaultProjectValues.producer_id,
    description: data.description ?? defaultProjectValues.description,
    long_description: data.long_description ?? defaultProjectValues.long_description,
    status: data.status ?? defaultProjectValues.status,
    featured: data.featured ?? defaultProjectValues.featured,
    images: Array.isArray(data.images) ? data.images : defaultProjectValues.images,
  };
};

export const useProjectFormRHF = ({
  projectId,
  initialData,
  autoSaveDelayMs = 600,
}: UseProjectFormRHFProps): UseProjectFormRHFReturn => {
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const lastSubmittedValuesRef = useRef<ProjectFormData | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const enableAutoSaveRef = useRef(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: useMemo(() => normalizeFormValues(initialData), [initialData]),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const [isInitialized, setIsInitialized] = useState<boolean>(!!initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { mutateAsync: updateProject } = trpc.admin.projects.update.useMutation({
    onSuccess: () => {
      utils.admin.projects.byId.invalidate({ id: projectId });
    },
    onSettled: () => {
      utils.admin.projects.list.invalidate();
    },
  });

  const saveValues = useCallback<SubmitHandler<ProjectFormData>>(async values => {
    if (!projectId) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      console.log('[Project Save] Début de la sauvegarde:', { projectId, values });

      // Transformer les strings vides en null pour respecter le schéma API
      const cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      ) as typeof values;

      console.log('[Project Save] Valeurs nettoyées:', cleanedValues);

      const result = await updateProject({ id: projectId, patch: cleanedValues });

      console.log('[Project Save] Sauvegarde réussie:', result);

      lastSubmittedValuesRef.current = values;
      setLastSavedAt(new Date());
      toast({
        variant: 'success',
        title: 'Projet sauvegardé',
        description: 'Les modifications ont été enregistrées automatiquement.',
      });

      form.reset(values, { keepValues: true });
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      // Ne PAS réinitialiser enableAutoSaveRef pour que l'auto-save continue à fonctionner
    } catch (error) {
      console.error('[Project Save] Erreur lors de la sauvegarde:', error);
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
  }, [form, projectId, toast, updateProject]);

  const submitNow = useCallback(async () => {
    console.log('[ProjectForm] submitNow appelé');
    // Sauvegarder directement sans validation stricte
    const currentValues = form.getValues();
    await saveValues(currentValues);
  }, [form, saveValues]);

  useEffect(() => {
    if (!initialData) {
      return;
    }

    const normalized = normalizeFormValues(initialData);
    form.reset(normalized);
    enableAutoSaveRef.current = false;
    setIsInitialized(true);
  }, [form, initialData]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const subscription = form.watch(data => {
      console.log('[ProjectForm] Watch triggered:', data);

      if (!enableAutoSaveRef.current) {
        console.log('[ProjectForm] Premier changement, activation auto-save');
        enableAutoSaveRef.current = true;
        return;
      }

      if (!projectId) return;

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(async () => {
        const isValid = await form.trigger();
        const currentValues = form.getValues();
        const previousValues = lastSubmittedValuesRef.current;

        if (previousValues) {
          const hasChanges = Object.keys(currentValues).some(
            key => currentValues[key as keyof ProjectFormData] !== previousValues[key as keyof ProjectFormData]
          );
          if (!hasChanges) {
            console.log('[Project AutoSave] Aucun changement détecté');
            return;
          }
        }

        if (!isValid) {
          console.warn('[Project AutoSave] Validation échouée, sauvegarde quand même', form.formState.errors);
        }

        console.log('[Project AutoSave] Déclenchement de la sauvegarde automatique');
        await saveValues(currentValues);
      }, autoSaveDelayMs);
    });

    return () => {
      subscription.unsubscribe();
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [autoSaveDelayMs, form, isInitialized, projectId, saveValues]);

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
