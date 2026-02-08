'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { UserDetailController } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-detail-controller'
import { adminUsersApi } from '@/lib/api/admin'

type UserData = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  user_level: 'explorateur' | 'protecteur' | 'ambassadeur'
  kyc_status: 'pending' | 'light' | 'complete' | 'rejected'
  address_country_code?: string | null
}

type UserEditClientProps = {
  initialUser: UserData
}

export function UserEditClient({ initialUser }: UserEditClientProps) {
  const queryClient = useQueryClient()
  const [userData, setUserData] = useState(initialUser)

  const update = useMutation({
    mutationFn: (variables: { id: string; patch: Partial<UserData> }) =>
      adminUsersApi.update(variables.id, variables.patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'detail', initialUser.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la sauvegarde')
    },
  })

  const handleSave = async (patch: Partial<UserData>) => {
    await update.mutateAsync({ id: initialUser.id, patch })
    setUserData((prev) => ({ ...prev, ...patch }))
  }

  return <UserDetailController userData={userData} onSave={handleSave} />
}
