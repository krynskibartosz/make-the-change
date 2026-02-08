'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { PartnerDetailController } from '@/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-detail-controller'
import { adminPartnersApi } from '@/lib/api/admin'
import type { PartnerFormData } from '@/lib/validators/partner'

type PartnerEditClientProps = {
  initialPartner: PartnerFormData & { id: string }
}

export function PartnerEditClient({ initialPartner }: PartnerEditClientProps) {
  const queryClient = useQueryClient()
  const [partnerData, setPartnerData] = useState(initialPartner)
  const update = useMutation({
    mutationFn: (variables: { id: string; patch: Partial<PartnerFormData> }) =>
      adminPartnersApi.update(variables.id, variables.patch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'partners', 'detail', initialPartner.id],
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', 'list'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la sauvegarde')
    },
  })

  const handleSave = async (patch: Partial<PartnerFormData>) => {
    await update.mutateAsync({
      id: initialPartner.id,
      patch,
    })
    setPartnerData((prev) => ({ ...prev, ...patch }))
  }

  return <PartnerDetailController partnerData={partnerData} onSave={handleSave} />
}
