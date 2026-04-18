'use client'

import { useEffect } from 'react'
import { upsertClientPersistedMockOrder } from '@/lib/mock/mock-order-history'
import type { MockOrderRecord } from '@/lib/mock/mock-member-data'

type PersistMockOrderProps = {
  viewerId: string
  order: MockOrderRecord
}

export function PersistMockOrder({ viewerId, order }: PersistMockOrderProps) {
  useEffect(() => {
    upsertClientPersistedMockOrder(viewerId, order)
  }, [order, viewerId])

  return null
}
