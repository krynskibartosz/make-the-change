import { Suspense } from 'react'
import { InvestClient } from './invest-client'

export default function InvestPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Chargement...</div>}>
        <InvestClient slug={params} />
      </Suspense>
    </div>
  )
}
