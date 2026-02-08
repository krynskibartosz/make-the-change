'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

import {
  buildUserPatch,
  defaultUserDetailValues,
  userDetailFormSchema,
  type UserFormData,
} from '../types/user-form.types';

import type { RouterOutputs } from '@/lib/trpc';

type UserDetailResponse = RouterOutputs['admin']['users']['detail'];

type UseUserFormRHFProps = {
  userId: string;
  initialData?: UserDetailResponse | null;
  autoSaveDelayMs?: number;
};

type UseUserFormRHFReturn = {
  form: ReturnType<typeof useForm<UserFormData>>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isInitialized: boolean;
  lastSavedAt: Date | null;
  saveError: string | null;
  submitNow: () => Promise<void>;
};

const deriveRoleFromLevel = (
  userLevel?: UserFormData['user_level']
): UserFormData['role'] => (userLevel === 'ambassadeur' ? 'admin' : 'user');

const splitName = (fullName?: string | null) => {
  if (!fullName) {
    return { firstName: '', lastName: '' };
  }
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  if (parts.length === 1) {
    return { firstName: parts[0] ?? '', lastName: '' };
  }
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
};

const toPlainObject = <T extends Record<string, unknown>>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

const normalizeFormValues = (
  data?: UserDetailResponse | null
): UserFormData => {
  if (!data) {
    return { ...defaultUserDetailValues };
  }

  const extendedData = data as UserDetailResponse & {
    name?: string | null;
    is_active?: boolean | null;
    phone?: string | null;
    last_login_at?: string | null;
    images?: string[];
    bio?: string | null;
  };

  const { firstName, lastName } = splitName(extendedData.name ?? null);

  return {
    ...defaultUserDetailValues,
    first_name: firstName,
    last_name: lastName,
    email: extendedData.email ?? defaultUserDetailValues.email,
    user_level: extendedData.user_level ?? defaultUserDetailValues.user_level,
    role: deriveRoleFromLevel(extendedData.user_level),
    is_active:
      extendedData.is_active ?? defaultUserDetailValues.is_active ?? true,
    points_balance:
      extendedData.points_balance ?? defaultUserDetailValues.points_balance,
    kyc_status: extendedData.kyc_status ?? defaultUserDetailValues.kyc_status,
    kyc_level: extendedData.kyc_level ?? defaultUserDetailValues.kyc_level,
    phone: extendedData.phone ?? defaultUserDetailValues.phone,
    last_login_at:
      extendedData.last_login_at ?? defaultUserDetailValues.last_login_at,
    images: extendedData.images ?? defaultUserDetailValues.images,
    bio: extendedData.bio ?? defaultUserDetailValues.bio,
  };
};

export const useUserFormRHF = ({
  userId,
  initialData,
  autoSaveDelayMs = 600,
}: UseUserFormRHFProps): UseUserFormRHFReturn => {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const enableAutoSaveRef = useRef(false);
  const lastSubmittedValuesRef = useRef<UserFormData | null>(null);

  const [isInitialized, setIsInitialized] = useState<boolean>(!!initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userDetailFormSchema),
    defaultValues: useMemo(() => normalizeFormValues(initialData), [initialData]),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const { mutateAsync: updateUser } = trpc.admin.users.update.useMutation({
    onSuccess: () => {
      utils.admin.users.detail.invalidate({ userId });
      utils.admin.users.list.invalidate();
    },
  });

  const saveValues = useCallback<SubmitHandler<UserFormData>>(async values => {
    if (!userId) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const patch = buildUserPatch(values);

      await updateUser({
        userId,
        patch,
      });

      lastSubmittedValuesRef.current = toPlainObject(values);
      setLastSavedAt(new Date());

      toast({
        variant: 'success',
        title: 'Utilisateur sauvegardé',
        description: 'Les modifications ont été enregistrées.',
      });

      form.reset(values, { keepValues: true });
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      enableAutoSaveRef.current = false;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la sauvegarde.";
      setSaveError(message);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  }, [form, toast, updateUser, userId]);

  const submitNow = useCallback(async () => {
    await form.handleSubmit(saveValues)();
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

    const subscription = form.watch(async (_value, { name }) => {
      if (name === 'user_level') {
        const level = form.getValues('user_level');
        const derivedRole = deriveRoleFromLevel(level);
        form.setValue('role', derivedRole, { shouldDirty: false });
      }

      if (!enableAutoSaveRef.current) {
        enableAutoSaveRef.current = true;
        return;
      }

      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(async () => {
        const isValid = await form.trigger();
        if (!isValid) {
          return;
        }

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
  }, [autoSaveDelayMs, form, isInitialized, saveValues]);

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
