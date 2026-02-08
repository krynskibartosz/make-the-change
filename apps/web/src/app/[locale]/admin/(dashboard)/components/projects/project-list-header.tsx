'use client'
import { getInitials } from '@make-the-change/core/shared/utils'
import { Badge } from '@make-the-change/core/ui'
import { Star } from 'lucide-react'
import type { FC } from 'react'
import type { Project } from '@/lib/types/project'

type ProjectListHeaderProps = {
  project: Project
}

export const ProjectListHeader: FC<ProjectListHeaderProps> = ({ project }) => (
  <div className="flex items-center gap-2 md:gap-3">
    {}
    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
      {getInitials(project.name)}
    </div>

    <div className="flex items-center gap-2 flex-1 min-w-0">
      <h3 className="text-base font-medium text-foreground truncate">{project.name}</h3>

      <Badge color={project.status === 'active' ? 'green' : 'gray'}>{project.status}</Badge>

      {project.featured && <Star className="w-4 h-4 text-yellow-500" />}
    </div>
  </div>
)
