'use client'

import { type FC, useState } from 'react'

import { SubscriptionBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-breadcrumbs'
import { SubscriptionCompactHeader } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-compact-header'
import { SubscriptionDetailLayout } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-detail-layout'
import { SubscriptionDetailsEditor } from '@/app/[locale]/admin/(dashboard)/subscriptions/[id]/components/subscription-details-editor'
import type { Subscription } from '@/lib/types/subscription'

type SubscriptionDetailControllerProps = {
  subscriptionData: Subscription
  onSave: (patch: Partial<Subscription>) => Promise<void>
}

export const SubscriptionDetailController: FC<SubscriptionDetailControllerProps> = ({
  subscriptionData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingData, setPendingData] = useState<Partial<Subscription>>({})

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({})
    }
    setIsEditing(editing)
  }

  const handleDataChange = (data: Partial<Subscription>) => {
    setPendingData((prev) => ({ ...prev, ...data }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const patch: Partial<Subscription> = {}
      const keys = [
        'plan_type',
        'billing_frequency',
        'monthly_points_allocation',
        'monthly_price',
        'annual_price',
        'bonus_percentage',
        'status',
        'cancel_at_period_end',
      ] as const

      for (const key of keys) {
        if (
          key in pendingData &&
          pendingData[key] !== undefined &&
          subscriptionData[key] !== pendingData[key]
        ) {
          // @ts-expect-error - TS doesn't fully understand that pendingData[key] matches the type of patch[key]
          patch[key] = pendingData[key]
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch)
        setPendingData({})
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const displayData = { ...subscriptionData, ...pendingData }

  return (
    <SubscriptionDetailLayout
      breadcrumbs={<SubscriptionBreadcrumbs subscription={subscriptionData} />}
      content={
        <SubscriptionDetailsEditor
          isEditing={isEditing}
          subscription={displayData}
          onChange={handleDataChange}
        />
      }
      header={
        <SubscriptionCompactHeader
          hasChanges={Object.keys(pendingData).length > 0}
          isEditing={isEditing}
          isSaving={isSaving}
          subscription={displayData}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
        />
      }
    />
  )
}
