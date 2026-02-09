'use client'

import { investment } from '@make-the-change/core'
import { Badge, Button, Card, CardContent, Progress } from '@make-the-change/core/ui'
import { ArrowLeft, ArrowRight, Leaf, MapPin, Share2, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getRandomProjectImage } from '@/lib/placeholder-images'
import { cn, formatPoints } from '@/lib/utils'
import { ProjectTimeline, type ProjectUpdate } from '@/features/investment/project-timeline'

type Species = {
  id: string
  name: string | null
  scientific_name: string | null
  content_levels: any
}

type Project = {
  id: string
  slug: string
  type: investment.InvestmentType
  name_default: string | null
  description_default: string | null
  long_description_default: string | null
  status: string | null
  featured: boolean | null
  target_budget: number | null
  current_funding: number | null
  impact_metrics: {
    carbon_offset?: number
    area_protected?: number
    biodiversity_score?: number
  } | null
  hero_image_url: string | null
  gallery_image_urls: string[] | null
  address_city: string | null
  address_country_code: string | null
}

const typeLabels: Record<investment.InvestmentType, string> = {
  beehive: 'Biodiversité',
  olive_tree: 'Agroforesterie',
  vineyard: 'Terroir durable',
}

export default function ProjectClient({
  project,
  updates = [],
  species,
}: {
  project: Project
  updates?: ProjectUpdate[]
  species?: Species | null
}) {
  const t = useTranslations('projects')
  const [_copied, setCopied] = useState(false)

  const imageUrl =
    project.hero_image_url ||
    project.gallery_image_urls?.[0] ||
    getRandomProjectImage(project.name_default?.length || 0)

  const location = [project.address_city, project.address_country_code].filter(Boolean).join(', ')

  const rules = investment.getInvestmentRules(project.type)
  const minAmount = rules?.min_amount ?? 50
  const bonusPct = rules?.expected_bonus ?? 0

  const fundingProgress = useMemo(() => {
    if (!project.target_budget || !project.current_funding) return 0
    if (project.target_budget <= 0) return 0
    return Math.min((project.current_funding / project.target_budget) * 100, 100)
  }, [project.target_budget, project.current_funding])

  const share = async () => {
    try {
      const url = window.location.href
      if (navigator.share) {
        await navigator.share({
          title: project.name_default || 'Projet',
          url,
        })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top bar (app-like) */}
      <div className="fixed left-0 right-0 top-0 z-40 px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Button asChild variant="glass" size="icon" aria-label="Retour">
            <Link href="/projects">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="glass" size="icon" onClick={share} aria-label="Partager">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[34vh] w-full overflow-hidden bg-muted sm:h-[44vh]">
        <img
          src={imageUrl}
          alt={project.name_default || 'Projet'}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-3xl px-5 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full">
                <Leaf className="mr-1 h-3 w-3" />
                {typeLabels[project.type]}
              </Badge>
              {project.status ? (
                <Badge variant="secondary" className="rounded-full">
                  {project.status}
                </Badge>
              ) : null}
              {project.featured ? (
                <Badge variant="secondary" className="rounded-full">
                  Sélection
                </Badge>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              {project.name_default || 'Projet'}
            </h1>

            {location ? (
              <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{location}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl space-y-6 px-5 pt-6">
        {/* Summary */}
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-5 sm:p-8">
            {project.description_default ? (
              <p className="text-base leading-relaxed text-muted-foreground">
                {project.description_default}
              </p>
            ) : null}

            {project.target_budget ? (
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Financement</span>
                  <span className="font-semibold tabular-nums">{Math.round(fundingProgress)}%</span>
                </div>
                <div className="mt-3">
                  <Progress value={fundingProgress} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatPoints(Number(project.current_funding || 0))}€</span>
                  <span>Objectif: {formatPoints(Number(project.target_budget || 0))}€</span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Impact */}
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Impact</p>
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">CO2</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {project.impact_metrics?.carbon_offset ?? 120}t
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Surface</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {project.impact_metrics?.area_protected ?? 50}ha
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Score</p>
                <p className="mt-2 text-2xl font-semibold tabular-nums">
                  {project.impact_metrics?.biodiversity_score ?? 82}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biodex Levels */}
        {species && species.content_levels && (
          <Card className="border bg-background/70 shadow-sm backdrop-blur">
            <CardContent className="space-y-4 p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{t('biodex_levels')}</p>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-4">
                {Object.entries(species.content_levels as Record<string, any>).map(
                  ([level, content]) => (
                    <div key={level} className="rounded-lg border bg-muted/30 p-4">
                      <h4 className="font-semibold capitalize text-primary">
                        {content.title || level}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">{content.description}</p>
                      {content.unlocked_at_level !== undefined && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Niveau {content.unlocked_at_level}
                        </Badge>
                      )}
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Updates */}
        <ProjectTimeline updates={updates} />
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">À partir de</p>
            <p className="truncate text-base font-semibold text-foreground tabular-nums">
              {minAmount}€ <span className="text-muted-foreground">• +{bonusPct}%</span>
            </p>
          </div>
          <Button asChild className={cn('flex-1')}>
            <Link href={`/projects/${project.slug}/invest`}>
              Investir
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
