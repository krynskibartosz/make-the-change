'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Project } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

interface ProjectContextState {
  projects: Project[]
  activeProjectId: string | null
  activeProject: Project | null
  setActiveProjectId: (id: string) => void
  isReady: boolean
}

const ProjectContext = createContext<ProjectContextState | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function loadProjects() {
      const projs = await mockClarusRepository.getProjects()
      setProjects(projs)
      // Par défaut, on sélectionne le premier projet
      const firstProj = projs[0]
      if (firstProj && !activeProjectId) {
        setActiveProjectId(firstProj.id)
      }
      setIsReady(true)
    }
    loadProjects()
  }, [activeProjectId])

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
