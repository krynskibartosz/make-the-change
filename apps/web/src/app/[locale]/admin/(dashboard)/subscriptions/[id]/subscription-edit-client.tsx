'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { SubscriptionDetailController } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-controller'
import { adminSubscriptionsApi } from '@/lib/api/admin'
import type { Subscription } from '@/lib/types/subscription'

type SubscriptionEditClientProps = {
  initialSubscription: Subscription
}

export function SubscriptionEditClient({ initialSubscription }: SubscriptionEditClientProps) {
  const queryClient = useQueryClient()
  const [subscriptionData, setSubscriptionData] = useState(initialSubscription)

  const update = useMutation({
    mutationFn: (variables: { id: string; patch: Partial<Subscription> }) =>
      adminSubscriptionsApi.update(variables.id, variables.patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subscriptions'] })
      queryClient.invalidateQueries({
        queryKey: ['admin', 'subscriptions', 'detail', initialSubscription.id],
      })
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error)
    },
  })

  const handleSave = async (patch: Partial<Subscription>) => {
    await update.mutateAsync({ id: initialSubscription.id!, patch })
    setSubscriptionData((prev) => ({ ...prev, ...patch }))
  }

  return <SubscriptionDetailController subscriptionData={subscriptionData} onSave={handleSave} />
}
