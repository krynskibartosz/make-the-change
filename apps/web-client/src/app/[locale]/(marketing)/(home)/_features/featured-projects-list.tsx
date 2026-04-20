'use client'

import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import {
  formatImpact,
  ProjectThumbnailCard,
} from '@/app/[locale]/(marketing)/_features/project-thumbnail-card'

type FeaturedProject = {
  id: string
  slug: string
  name_default: string | null
  hero_image_url: string | null
  current_funding: number | null
}

type FeaturedProjectsListProps = {
  projects: FeaturedProject[]
  viewAllLabel: string
}

const EMPTY_FEATURED_PROJECTS_MESSAGE = 'Aucun projet en vedette pour le moment.'

export function FeaturedProjectsList({ projects, viewAllLabel }: FeaturedProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">{EMPTY_FEATURED_PROJECTS_MESSAGE}</p>
      </div>
    )
  }

  return (
    <ul className="m-0 flex list-none gap-4 overflow-x-auto p-0 px-6 pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {projects.map((project, index) => {
        const title = (project.name_default || 'Projet').replace(' 2024', '')
        const imageUrl = sanitizeImageUrl(project.hero_image_url) ?? null
        const impactLabel = formatImpact(project.current_funding)

        return (
          <li key={project.id} className="shrink-0">
            <ProjectThumbnailCard
              slug={project.slug}
              title={title}
              imageUrl={imageUrl}
              impactLabel={impactLabel}
              priority={index === 0}
            />
          </li>
        )
      })}

      <li className="shrink-0">
        <Link
          href="/projects"
          className="relative w-[70vw] max-w-[260px] aspect-square shrink-0 snap-start rounded-3xl overflow-hidden border border-lime-500/30 bg-lime-900/10 flex flex-col items-center justify-center gap-3 p-6 text-center group active:scale-[0.98] transition-transform block"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/20 text-lime-400 transition-transform group-hover:translate-x-1">
            <ArrowRight size={22} />
          </div>
          <span className="text-sm font-bold text-lime-400 leading-snug">{viewAllLabel}</span>
        </Link>
      </li>
    </ul>
  )
}
