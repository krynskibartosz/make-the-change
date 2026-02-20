'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOptimisticAutoSave } from '@/app/[locale]/(dashboard)/_features/lib/hooks/use-optimistic-auto-save'
import { updatePassword, updateProfile } from './actions'
import { ProfileView } from './profile.view'
import {
  type PasswordFormValues,
  type ProfileFormValues,
  passwordSchema,
  profileSchema,
} from './schemas'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  bio?: string | null
  address_street: string | null
  address_city: string | null
  address_postal_code: string | null
  address_country_code: string | null
}

interface ProfileControllerProps {
  profile: Profile | null
  userEmail: string | undefined
}

export function ProfileController({ profile, userEmail }: ProfileControllerProps) {
  const t = useTranslations('profile')
  const [passwordStatus, setPasswordStatus] = useState<{ error?: string; success?: string }>({})

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      phone: profile?.phone || '',
      address: profile?.address_street || '',
      city: profile?.address_city || '',
      postalCode: profile?.address_postal_code || '',
      country: profile?.address_country_code || '',
      bio: profile?.bio || '',
    },
  })

  const autoSave = useOptimisticAutoSave({
    saveFn: async (data: ProfileFormValues) => {
      const result = await updateProfile(data)
      if (result.error) throw new Error(result.error)
    },
    debounceMs: 2000,
  })
  const { markDirty } = autoSave

  // Watch for changes to trigger markDirty
  useEffect(() => {
    const subscription = profileForm.watch(() => {
      if (profileForm.formState.isDirty) {
        markDirty(profileForm.getValues())
      }
    })
    return () => subscription.unsubscribe()
  }, [profileForm, profileForm.formState.isDirty, markDirty])

  const onProfileSubmit = async (data: ProfileFormValues) => {
    await autoSave.saveNow()
    profileForm.reset(data)
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordStatus({})
    const result = await updatePassword(data)
    setPasswordStatus(result)

    if (result.success) {
      passwordForm.reset()
    }
  }

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  return (
    <ProfileView
      profileForm={profileForm}
      passwordForm={passwordForm}
      onProfileSubmit={onProfileSubmit}
      onPasswordSubmit={onPasswordSubmit}
      isPasswordSubmitting={passwordForm.formState.isSubmitting}
      passwordStatus={passwordStatus}
      userEmail={userEmail}
      autoSave={autoSave}
      t={t}
    />
  )
}
