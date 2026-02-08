'use client'

import { type FC, useState } from 'react'

import { UserBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-breadcrumbs'
import { UserCompactHeader } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-compact-header'
import { UserDetailLayout } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-detail-layout'
import { UserDetailsEditor } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-details-editor'

type UserData = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  user_level: 'explorateur' | 'protecteur' | 'ambassadeur'
  kyc_status: 'pending' | 'light' | 'complete' | 'rejected'
  address_country_code?: string | null
}

type UserDetailControllerProps = {
  userData: UserData
  onSave: (patch: Partial<UserData>) => Promise<void>
}

export const UserDetailController: FC<UserDetailControllerProps> = ({ userData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingData, setPendingData] = useState<Partial<UserData>>({})

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({})
    }
    setIsEditing(editing)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const patch: Partial<UserData> = {}
      const keys = [
        'email',
        'first_name',
        'last_name',
        'user_level',
        'kyc_status',
        'address_country_code',
      ] as const

      for (const key of keys) {
        const newValue = pendingData[key]
        if (newValue !== undefined && userData[key] !== newValue) {
          ;(patch as any)[key] = newValue
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch)
      }

      setIsEditing(false)
      setPendingData({})
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const displayData = {
    ...userData,
    ...pendingData,
    first_name: userData.first_name || undefined,
    last_name: userData.last_name || undefined,
    address_country_code: userData.address_country_code || undefined,
  }

  return (
    <UserDetailLayout
      toolbar={<div />}
      content={
        <UserDetailsEditor
          isEditing={isEditing}
          isSaving={isSaving}
          userData={displayData}
          onSave={async (data) => {
            const patch: Partial<UserData> = {}
            const keys = [
              'email',
              'first_name',
              'last_name',
              'user_level',
              'kyc_status',
              'address_country_code',
            ] as const

            for (const key of keys) {
              const newValue = data[key]
              if (newValue !== undefined && userData[key] !== newValue) {
                ;(patch as any)[key] = newValue
              }
            }

            if (Object.keys(patch).length > 0) {
              await onSave(patch)
            }
            setIsEditing(false)
          }}
        />
      }
      header={
        <>
          <UserBreadcrumbs userData={userData} />
          <UserCompactHeader
            isEditing={isEditing}
            isSaving={isSaving}
            userData={displayData}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
          />
        </>
      }
    />
  )
}
