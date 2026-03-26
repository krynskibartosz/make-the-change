'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'

type FeaturedProject = {
  id: string
  slug: string
  name_default: string | null
  description_default: string | null
  hero_image_url: string | null
  target_budget: number | null
  current_funding: number | null
}

type FeaturedProjectsListProps = {
  projects: FeaturedProject[]
  supportLabel: string
  collectedLabel: string
  goalLabel: string
  viewAllLabel: string
}

const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const EMPTY_FEATURED_PROJECTS_MESSAGE = 'Aucun projet en vedette pour le moment.'

const toProgressPercent = (current: number | null, target: number | null): number => {
  if (!target || target <= 0) return 0
  return Math.max(0, Math.min(100, Math.round(((current || 0) / target) * 100)))
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 },
}

function FeaturedProjectCard({
  project,
  supportLabel,
  collectedLabel,
  goalLabel,
  priority,
}: {
  project: FeaturedProject
  supportLabel: string
  collectedLabel: string
  goalLabel: string
  priority: boolean
}) {
  const prefersReducedMotion = useReducedMotion()
  const title = (project.name_default || 'Projet').replace(' 2024', '')
  const description = project.description_default || ''
  const imageSrc =
    sanitizeImageUrl(project.hero_image_url) ||
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80'
  const progress = toProgressPercent(project.current_funding, project.target_budget)
  const collected = euroFormatter.format(project.current_funding || 0)
  const target = euroFormatter.format(project.target_budget || 0)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full min-h-[460px] snap-start flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:border-border/80 dark:shadow-none"
      prefetch={priority}
    >
      <div className="relative h-[42%] min-h-[180px] w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col flex-grow p-5">
        <h3 className="min-h-[3.5rem] line-clamp-2 text-left text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-2 line-clamp-2 text-left text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-4 flex flex-col gap-3 w-full border-t border-border/10 dark:border-transparent">
          <div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/70">
              {prefersReducedMotion ? (
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              ) : (
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                />
              )}
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-foreground">
                {collected} {collectedLabel}
              </span>
              <span className="text-muted-foreground/70">
                {goalLabel} {target}
              </span>
            </div>
          </div>

          <span className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors group-hover:bg-primary/90">
             {supportLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedProjectsList({
  projects,
  supportLabel,
  collectedLabel,
  goalLabel,
  viewAllLabel,
}: FeaturedProjectsListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/80 bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">{EMPTY_FEATURED_PROJECTS_MESSAGE}</p>
      </div>
    )
  }

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      className="m-0 flex list-none gap-4 overflow-x-auto p-0 px-6 pb-2 snap-x snap-mandatory scrollbar-hide"
    >
      {projects.map((project, index) => (
        <motion.li key={project.id} variants={itemVariants} className="w-[85%] shrink-0 sm:w-[70%] lg:w-[32%]">
          <FeaturedProjectCard
            project={project}
            supportLabel={supportLabel}
            collectedLabel={collectedLabel}
            goalLabel={goalLabel}
            priority={index === 0}
          />
        </motion.li>
      ))}
      <motion.li variants={itemVariants} className="w-[85%] shrink-0 snap-center sm:w-[70%] lg:w-[32%]">
        <Link
          href="/projects"
          className="group flex h-full min-h-[460px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all duration-200 active:scale-95
            border-lime-300 bg-lime-50/50 text-lime-800 hover:bg-lime-100 hover:text-lime-900 active:bg-lime-200
            dark:border-lime-500/50 dark:bg-lime-900/10 dark:text-foreground dark:hover:bg-lime-900/20 dark:active:bg-lime-900/30"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:translate-x-2
            bg-lime-200 text-lime-700
            dark:bg-lime-500/20 dark:text-lime-500">
            <ArrowRight size={28} />
          </div>
          <span className="text-center text-lg font-bold">
            {viewAllLabel}
          </span>
        </Link>
      </motion.li>
    </motion.ul>
  )
}
