'use client'

import { ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { resolveLocationDisplay } from '@/lib/location'
import { getProjectImpactDisplay } from '@/lib/impact-calculator'
import { ProjectThumbnailCard } from '@/app/[locale]/(site)/_features/project-thumbnail-card'

type FeaturedProject = {
  id: string
  slug: string
  type: string | null
  name_default: string | null
  hero_image_url: string | null
  current_funding: number | null
  address_city: string | null
  address_country_code: string | null
}

type FeaturedProjectsListProps = {
  projects: FeaturedProject[]
  viewAllLabel: string
}

const EMPTY_FEATURED_PROJECTS_MESSAGE = 'Aucun projet en vedette pour le moment.'

export function FeaturedProjectsList({ projects, viewAllLabel }: FeaturedProjectsListProps) {
  const locale = useLocale()

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
        const impact = getProjectImpactDisplay({ current_funding: project.current_funding, type: project.type ?? null })
        const impactLabel = impact.value > 0 ? impact.label : undefined
        const locationDisplay = resolveLocationDisplay(
          project.address_country_code,
          project.address_city,
          locale,
        ) ?? undefined

        return (
          <li key={project.id} className="shrink-0">
            <ProjectThumbnailCard
              slug={project.slug}
              title={title}
              imageUrl={imageUrl}
              impactLabel={impactLabel}
              locationDisplay={locationDisplay}
              priority={index === 0}
              type={project.type ?? null}
            />
          </li>
        )
      })}

      <li className="shrink-0">
        <Link
          href="/projects"
          className="w-72 aspect-[4/5] shrink-0 snap-start rounded-3xl border border-lime-500/30 bg-lime-900/10 flex flex-col items-center justify-center gap-3 p-6 text-center group active:scale-[0.98] transition-transform block"
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
