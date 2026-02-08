import { Suspense } from 'react'
import { ProjectDetailClient } from '../project-detail-client'

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Chargement...</div>}>
        <ProjectDetailClient slug={params} />
      </Suspense>
    </div>
  )
}
