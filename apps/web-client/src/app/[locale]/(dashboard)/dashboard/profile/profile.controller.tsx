'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setProfileStatus({})
    const result = await updateProfile(data)
    setProfileStatus(result)
    
    // On success, we keep the form values as they are now synced
    // Optional: reset({ ...data }) to reset dirty state
    if (result.success) {
      profileForm.reset(data)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setPasswordStatus({})
    const result = await updatePassword(data)
    setPasswordStatus(result)
    
    if (result.success) {
      passwordForm.reset()
    }
  }

  return (
    <ProfileView
      profileForm={profileForm}
      passwordForm={passwordForm}
      onProfileSubmit={onProfileSubmit}
      onPasswordSubmit={onPasswordSubmit}
      isProfileSubmitting={profileForm.formState.isSubmitting}
      isPasswordSubmitting={passwordForm.formState.isSubmitting}
      profileStatus={profileStatus}
      passwordStatus={passwordStatus}
      userEmail={userEmail}
      t={t}
    />
  )
}
