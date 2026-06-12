'use client'

import type React from 'react'
import { createContext, useContext, useState } from 'react'
import type { Project } from '@/lib/domain'

interface ProjectContextState {
  projects: Project[]
  activeProjectId: string | null
  activeProject: Project | null
  setActiveProjectId: (id: string) => void
  isReady: boolean
}

const ProjectContext = createContext<ProjectContextState | undefined>(undefined)

export function ProjectProvider({
  children,
  initialProjects,
}: {
  children: React.ReactNode
  initialProjects: Project[]
}) {
  const [projects, _setProjects] = useState<Project[]>(initialProjects)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    initialProjects.length > 0 ? initialProjects[0]?.id || null : null,
  )
  const [isReady, _setIsReady] = useState(true)

  const activeProject = projects.find((p) => p.id === activeProjectId) || null

  return (
    <ProjectContext.Provider
      value={{ projects, activeProjectId, activeProject, setActiveProjectId, isReady }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
