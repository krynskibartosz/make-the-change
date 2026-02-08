import { Suspense } from 'react'
import { ProjectsClient } from './projects-client'

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Chargement...</div>}>
        <ProjectsClient />
      </Suspense>
    </div>
  )
}
