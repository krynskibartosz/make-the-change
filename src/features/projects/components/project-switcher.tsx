'use client'

import { Building2, CheckCircle2, ChevronDown, MapPin } from 'lucide-react'
import { useState } from 'react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { useProject } from '@/lib/project-context'

export function ProjectSwitcher() {
  const { projects, activeProject, setActiveProjectId, isReady } = useProject()
  const [isOpen, setIsOpen] = useState(false)

  if (!isReady || !activeProject) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 bg-surface-elevated hover:bg-border/50 border border-border px-3 py-1.5 rounded-full transition-colors"
      >
        <MapPin className="size-3.5 text-primary" />
        <span className="text-sm font-bold truncate max-w-[150px]">{activeProject.name}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Changer de chantier">
        <div className="flex flex-col gap-2">
          {projects.map((project) => {
            const isActive = project.id === activeProject.id
            return (
              <button
                key={project.id}
                onClick={() => {
                  setActiveProjectId(project.id)
                  setIsOpen(false)
                }}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-surface hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center flex-none ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-elevated text-muted-foreground'
                    }`}
                  >
                    <Building2 className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`font-bold text-base ${isActive ? 'text-primary' : 'text-foreground'}`}
                    >
                      {project.name}
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {project.address}
                    </span>
                  </div>
                </div>
                {isActive && <CheckCircle2 className="size-5 text-primary flex-none ml-2" />}
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </>
  )
}
