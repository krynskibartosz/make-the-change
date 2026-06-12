'use client'

import { Map } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { FullScreenSlideModal } from '@/app/@modal/_components/full-screen-slide-modal'
import type { Plan } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { SmartPlanClient } from './smart-plan-client'

export function PlansGalleryClient() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await mockClarusRepository.getPlans()
      setPlans(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">Chargement des plans...</div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <Map className="mb-4 h-12 w-12 opacity-20" />
        <p>Aucun plan disponible</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelectedPlan(plan)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-sm text-left transition-transform duration-200 active:scale-[0.98]"
          >
            <div className="aspect-video w-full overflow-hidden bg-muted">
              {/* Using a standard img tag for simplicity in the mockup */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={plan.url}
                alt={plan.title}
                className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
            </div>
            <div className="flex flex-col p-4">
              <h3 className="font-semibold text-foreground line-clamp-1">{plan.title}</h3>
              {plan.description && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {plan.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedPlan && (
        <FullScreenSlideModal
          title={selectedPlan.title}
          headerMode="close"
          onClose={() => setSelectedPlan(null)}
        >
          <SmartPlanClient plan={selectedPlan} />
        </FullScreenSlideModal>
      )}
    </>
  )
}
