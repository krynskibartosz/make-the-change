'use client'

import type { FC, ReactNode } from 'react'
import { AdminListItem } from '@/app/[locale]/admin/(dashboard)/components/ui/admin-list-item'
import type { Project } from '@/lib/types/project'
import { ProjectListHeader } from './project-list-header'
import { ProjectListMetadata } from './project-list-metadata'

type ProjectListItemProps = {
  project: Project
  actions?: ReactNode
}

export const ProjectListItem: FC<ProjectListItemProps> = ({ project, actions }) => (
  <AdminListItem
    actions={actions}
    header={<ProjectListHeader project={project} />}
    href={`/admin/projects/${project.id}`}
    metadata={<ProjectListMetadata project={project} />}
  />
)
