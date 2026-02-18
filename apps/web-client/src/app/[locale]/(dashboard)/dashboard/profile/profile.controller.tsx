'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOptimisticAutoSave } from '@/lib/hooks/use-optimistic-auto-save'
import { ProfileView } from './profile.view'
import { 
  profileSchema, 
  passwordSchema, 
  type ProfileFormValues, 
  type PasswordFormValues 
} from './schemas'
import { updateProfile, updatePassword } from './actions'

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
  const [profileStatus, setProfileStatus] = useState<{ error?: string; success?: string }>({})
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
    }
  })

  const autoSave = useOptimisticAutoSave({
    saveFn: async (data: ProfileFormValues) => {
      const result = await updateProfile(data)
      if (result.error) throw new Error(result.error)
    },
    debounceMs: 2000,
  })

  // Watch for changes to trigger markDirty
  useEffect(() => {
    const subscription = profileForm.watch((value) => {
      if (profileForm.formState.isDirty) {
        autoSave.markDirty(value)
      }
    })
    return () => subscription.unsubscribe()
  }, [profileForm.watch, profileForm.formState.isDirty, autoSave.markDirty])

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setProfileStatus({})
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
      confirmPassword: ''
    }
  })

  return (
    <ProfileView
      profileForm={profileForm}
      passwordForm={passwordForm}
      onProfileSubmit={onProfileSubmit}
      onPasswordSubmit={onPasswordSubmit}
      isProfileSubmitting={profileForm.formState.isSubmitting || autoSave.status === 'saving'}
      isPasswordSubmitting={passwordForm.formState.isSubmitting}
      profileStatus={profileStatus}
      passwordStatus={passwordStatus}
      userEmail={userEmail}
      autoSave={autoSave}
      t={t}
    />
  )
}
