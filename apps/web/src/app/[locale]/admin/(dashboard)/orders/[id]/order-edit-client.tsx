'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { OrderDetailController } from '@/app/[locale]/admin/(dashboard)/orders/[id]/components/order-detail-controller'
import { adminOrdersApi } from '@/lib/api/admin'

type OrderData = {
  id: string
  customerName: string
  email: string
  status: 'pending' | 'paid' | 'processing' | 'in_transit' | 'completed' | 'closed'
  createdAt: string
  total: number
  items: { productId: string; name: string; quantity: number; price: number }[]
  shippingAddress: string
}

type OrderEditClientProps = {
  initialOrder: OrderData
}

export function OrderEditClient({ initialOrder }: OrderEditClientProps) {
  const queryClient = useQueryClient()
  const [orderData, setOrderData] = useState(initialOrder)

  const update = useMutation({
    mutationFn: (variables: { id: string; patch: Partial<OrderData> }) => {
      const payload: Record<string, unknown> = {}
      if (variables.patch.status) payload.status = variables.patch.status
      if (variables.patch.shippingAddress !== undefined) {
        payload.shipping_address = variables.patch.shippingAddress
      }
      return adminOrdersApi.update(variables.id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', 'detail', initialOrder.id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', 'list'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error)
    },
  })

  const handleSave = async (patch: Partial<OrderData>) => {
    await update.mutateAsync({ id: initialOrder.id, patch })
    setOrderData((prev) => ({ ...prev, ...patch }))
  }

  return <OrderDetailController orderData={orderData} onSave={handleSave} />
}
