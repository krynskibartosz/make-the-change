'use client'

import type { Database } from '@make-the-change/core/database-types'
import { Card, CardContent, CardHeader, CardTitle, DataList } from '@make-the-change/core/ui'
import { FolderOpen } from 'lucide-react'
import type { FC } from 'react'
import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header'
import { LocalizedLink } from '@/components/localized-link'
import { cn } from '@make-the-change/core/shared/utils'

import type { Project } from '@/lib/types/project'

// type Project = Database['public']['Views']['projects']['Row']

type ProjectsClientProps = {
  initialProjects: {
    items: Project[]
    total: number
  }
}

export const ProjectsClient: FC<ProjectsClientProps> = ({ initialProjects }) => {
  const projects = initialProjects.items

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <h1 className="text-xl font-bold">Mes Projets</h1>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        <DataList
          items={projects}
          variant="grid"
          isLoading={false}
          getItemKey={(p) => p.id || ''}
          renderSkeleton={() => <div className="h-64 bg-muted/20 animate-pulse rounded-xl" />}
          emptyState={{
            icon: FolderOpen,
            title: 'Aucun projet',
            description: "Vous n'avez pas encore de projets.",
          }}
          renderItem={(project: Project) => (
            <LocalizedLink key={project.id} href={`/partner/projects/${project.id}`}>
              <Card className="glass-card hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">
                    {project.name_default || 'Projet sans nom'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description_default || 'Aucune description'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full font-medium",
                        project.status === 'active'
                          ? 'bg-success/20 text-success'
                          : project.status === 'draft'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-warning/20 text-warning-foreground'
                      )}
                    >
                      {project.status || 'draft'}
                    </span>
                    {project.funding_progress && (
                      <span className="text-muted-foreground">
                        {Math.round(Number(project.funding_progress) * 100)}% financé
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </LocalizedLink>
          )}
        />
      </AdminPageLayout.Content>
    </AdminPageLayout>
  )
}
