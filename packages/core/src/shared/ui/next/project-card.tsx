'use client'

import { ArrowRight, Target } from 'lucide-react'
import Image from 'next/image'
import { type FC, type ReactNode, useState } from 'react'
import { cn } from '../utils'
import { DataCard } from './data-card'
import {
  DataListItem,
  DataListItemActions,
  DataListItemContent,
  DataListItemHeader,
} from './data-list-item'
import type {
  ProjectCardBadge,
  ProjectCardBadgeTone,
  ProjectCardContext,
  ProjectCardModel,
  ProjectCardProps,
  ProjectCardView,
} from './project-card.types'

const gridCardClasses: Record<ProjectCardContext, string> = {
  admin: 'h-full rounded-2xl p-4 md:p-5',
  clientCatalog:
    'h-full rounded-3xl border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:p-5',
  clientHome:
    'h-full overflow-hidden rounded-3xl border-border bg-card p-3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-4',
}

const titleClasses: Record<ProjectCardContext, string> = {
  admin: 'text-lg font-semibold leading-tight tracking-tight text-foreground',
  clientCatalog: 'text-xl font-black tracking-tight text-foreground',
  clientHome:
    'text-base font-medium leading-tight text-foreground transition-colors group-hover:text-primary',
}

const subtitleClasses: Record<ProjectCardContext, string> = {
  admin: 'mt-1 text-xs font-medium text-muted-foreground/80',
  clientCatalog: 'mt-1 text-xs font-medium text-muted-foreground/80',
  clientHome: 'mt-1 text-xs font-medium text-muted-foreground/80',
}

const descriptionClasses: Record<ProjectCardContext, string> = {
  admin: 'line-clamp-2 text-xs leading-relaxed text-muted-foreground',
  clientCatalog: 'line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground',
  clientHome: 'line-clamp-2 text-sm text-muted-foreground',
}

const footerClasses: Record<ProjectCardContext, string> = {
  admin: 'mt-3 border-t border-border/70 pt-3 text-sm font-medium text-muted-foreground',
  clientCatalog:
    'mt-3 border-t border-border/70 pt-3 text-sm font-black uppercase tracking-wide text-primary',
  clientHome:
    'mt-2 border-t border-border/60 pt-2 text-xs font-semibold uppercase tracking-wide text-primary',
}

const badgeToneClasses: Record<ProjectCardBadgeTone, string> = {
  primary: 'bg-primary/90 text-primary-foreground',
  danger: 'bg-destructive/90 text-destructive-foreground',
  neutral: 'bg-background/90 text-foreground backdrop-blur',
  success: 'bg-success/90 text-success-foreground',
  warning: 'bg-warning/90 text-warning-foreground',
}

const listContainerClasses: Record<ProjectCardContext, string> = {
  admin: '',
  clientCatalog: '',
  clientHome: '',
}

const getMediaContainerClasses = (context: ProjectCardContext, view: ProjectCardView) => {
  if (view === 'list') {
    return 'relative h-10 w-10 overflow-hidden rounded-md border border-border/60 bg-muted/30 flex-shrink-0'
  }

  switch (context) {
    case 'admin':
      return 'relative mb-4 h-36 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/30'
    case 'clientHome':
      return 'relative mb-3 aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary/20'
    default:
      return 'relative mb-4 aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted/40'
  }
}

const formatPercent = (value: number) => `${Math.round(Math.max(0, Math.min(100, value)))}%`

const formatEuro = (value: number) => `€${value.toFixed(2)}`

const resolveProgress = (model: ProjectCardModel): number | null => {
  if (model.progressPercent !== null && model.progressPercent !== undefined) {
    return Math.max(0, Math.min(100, model.progressPercent))
  }

  if (
    model.currentFundingEuro !== null &&
    model.currentFundingEuro !== undefined &&
    model.targetBudgetEuro !== null &&
    model.targetBudgetEuro !== undefined &&
    model.targetBudgetEuro > 0
  ) {
    return Math.max(0, Math.min(100, (model.currentFundingEuro / model.targetBudgetEuro) * 100))
  }

  return null
}

const buildLegacyBadges = (
  model: ProjectCardModel,
  labels: {
    featuredLabel?: string
    activeLabel?: string
    fundedLabel?: string
  },
): ProjectCardBadge[] => {
  const badges: ProjectCardBadge[] = []

  if (model.featured && labels.featuredLabel) {
    badges.push({
      id: 'legacy-featured',
      label: labels.featuredLabel,
      tone: 'primary',
    })
  }

  const status = model.status?.toLowerCase()

  if (status === 'active') {
    badges.push({
      id: 'legacy-active',
      label: labels.activeLabel || model.status || 'active',
      tone: 'success',
    })
  } else if (status === 'funded' || status === 'completed') {
    badges.push({
      id: 'legacy-funded',
      label: labels.fundedLabel || model.status || status,
      tone: 'primary',
    })
  } else if (status === 'archived') {
    badges.push({
      id: 'legacy-archived',
      label: model.status || status,
      tone: 'warning',
    })
  } else if (status === 'draft') {
    badges.push({
      id: 'legacy-draft',
      label: model.status || status,
      tone: 'neutral',
    })
  }

  return badges
}

const resolveBadges = (
  model: ProjectCardModel,
  labels: {
    featuredLabel?: string
    activeLabel?: string
    fundedLabel?: string
  },
): ProjectCardBadge[] => {
  if (model.badges !== undefined) {
    return (model.badges ?? []).filter((badge) => badge.label.trim().length > 0)
  }

  return buildLegacyBadges(model, labels)
}

const ProjectMedia: FC<{
  context: ProjectCardContext
  view: ProjectCardView
  model: ProjectCardModel
  featuredLabel?: string
  activeLabel?: string
  fundedLabel?: string
  topRight?: ReactNode
  mediaOverlay?: ReactNode
}> = ({
  context,
  view,
  model,
  featuredLabel,
  activeLabel,
  fundedLabel,
  topRight,
  mediaOverlay,
}) => {
    const imageSrc = model.image?.src ?? undefined
    const imageAlt = model.image?.alt || model.title
    const blurDataURL = model.image?.blurDataURL ?? undefined
    const [imageFailed, setImageFailed] = useState(false)
    const hasImage = !!imageSrc && !imageFailed
    const badges = resolveBadges(model, {
      featuredLabel,
      activeLabel,
      fundedLabel,
    })

    return (
      <div className={getMediaContainerClasses(context, view)}>
        {hasImage ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={!!model.imagePriority}
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Target className="h-10 w-10 text-muted-foreground/25" />
          </div>
        )}

        {view === 'grid' && badges.length > 0 && (
          <div className="absolute left-3 top-3 z-20 flex flex-col gap-2 pointer-events-none">
            {badges.map((badge) => (
              <span
                key={badge.id}
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-bold',
                  badgeToneClasses[badge.tone || 'neutral'],
                )}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {view === 'grid' && topRight && (
          <div className="absolute right-3 top-3 z-20 pointer-events-auto" data-card-action>
            {topRight}
          </div>
        )}
        {view === 'grid' && mediaOverlay && (
          <div
            className="absolute inset-0 z-20 pointer-events-none [&>*]:pointer-events-auto"
            data-card-action
          >
            {mediaOverlay}
          </div>
        )}
      </div>
    )
  }

const ProjectMeta: FC<{
  model: ProjectCardModel
  metaChips?: ReactNode
}> = ({ model, metaChips }) => {
  const hasDefaultMeta =
    !!model.projectType || !!model.producerName || !!model.locationLabel || !!model.launchDateLabel

  if (!hasDefaultMeta && !metaChips) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2 pointer-events-auto">
      {model.projectType && <span className="badge-subtle">{model.projectType}</span>}
      {model.producerName && <span className="tag-subtle">{model.producerName}</span>}
      {model.locationLabel && (
        <span className="inline-flex items-center rounded-md border border-muted/60 bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
          {model.locationLabel}
        </span>
      )}
      {model.launchDateLabel && (
        <span className="inline-flex items-center rounded-md border border-muted/60 bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
          {model.launchDateLabel}
        </span>
      )}
      {metaChips && (
        <div className="contents" data-card-action>
          {metaChips}
        </div>
      )}
    </div>
  )
}

const ProjectProgress: FC<{
  context: ProjectCardContext
  model: ProjectCardModel
  progressLabel?: string
  fundedLabel?: string
  goalLabel?: string
}> = ({ context, model, progressLabel, fundedLabel, goalLabel }) => {
  const progress = resolveProgress(model)
  const hasCurrentFunding =
    model.currentFundingEuro !== null &&
    model.currentFundingEuro !== undefined &&
    model.currentFundingEuro >= 0
  const hasTargetFunding =
    model.targetBudgetEuro !== null &&
    model.targetBudgetEuro !== undefined &&
    model.targetBudgetEuro > 0

  if (progress === null && !hasCurrentFunding && !hasTargetFunding) {
    return null
  }

  return (
    <div className={cn('space-y-2', context === 'clientHome' ? 'pt-1' : 'pt-2')}>
      {progress !== null && (
        <>
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
            {progressLabel ? <span>{progressLabel}</span> : <span />}
            <span className="text-primary">{formatPercent(progress)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/70">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      {(hasCurrentFunding || hasTargetFunding) && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {hasCurrentFunding && (
            <span className="font-medium">
              {formatEuro(model.currentFundingEuro || 0)} {fundedLabel || ''}
            </span>
          )}
          {hasTargetFunding && (
            <span>
              {goalLabel || ''} {formatEuro(model.targetBudgetEuro || 0)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

const ProjectCardGrid: FC<ProjectCardProps> = ({
  context,
  model,
  labels,
  slots,
  className,
  testId,
}) => {
  const hasFooter = !!slots?.footerActions || labels.viewLabel.trim().length > 0

  return (
    <div data-testid={testId} className="h-full">
      <DataCard
        href={model.href}
        className={cn(gridCardClasses[context], className)}
        linkAriaLabel={model.title || labels.viewLabel}
      >
        <ProjectMedia
          context={context}
          view="grid"
          model={model}
          featuredLabel={labels.featuredLabel}
          activeLabel={labels.activeLabel}
          fundedLabel={labels.fundedLabel}
          topRight={slots?.topRight}
          mediaOverlay={slots?.mediaOverlay}
        />

        <DataCard.Header className={cn('mb-2', context === 'admin' && 'mb-3')}>
          <div className="flex w-full items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className={titleClasses[context]}>{model.title}</h3>
              {model.subtitle && <p className={subtitleClasses[context]}>{model.subtitle}</p>}
            </div>
          </div>
        </DataCard.Header>

        <DataCard.Content className={cn('mb-0 gap-3', context === 'admin' && 'gap-2')}>
          {model.description && <p className={descriptionClasses[context]}>{model.description}</p>}

          <ProjectProgress
            context={context}
            model={model}
            progressLabel={labels.progressLabel}
            fundedLabel={labels.fundedLabel}
            goalLabel={labels.goalLabel}
          />

          <ProjectMeta model={model} metaChips={slots?.metaChips} />
        </DataCard.Content>

        {hasFooter && (
          <DataCard.Footer className={footerClasses[context]}>
            {labels.viewLabel.trim() && (
              <span className="inline-flex items-center gap-2">
                {labels.viewLabel}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
            {slots?.footerActions && (
              <div className="contents" data-card-action>
                {slots.footerActions}
              </div>
            )}
          </DataCard.Footer>
        )}
      </DataCard>
    </div>
  )
}

const ProjectCardList: FC<ProjectCardProps> = ({
  context,
  model,
  labels,
  slots,
  className,
  testId,
}) => {
  const hasFooter = !!slots?.footerActions || labels.viewLabel.trim().length > 0
  const badges = resolveBadges(model, {
    featuredLabel: labels.featuredLabel,
    activeLabel: labels.activeLabel,
    fundedLabel: labels.fundedLabel,
  })

  return (
    <div data-testid={testId} className={listContainerClasses[context]}>
      <DataListItem
        href={model.href}
        className={className}
        linkAriaLabel={model.title || labels.viewLabel}
      >
        <DataListItemHeader>
          <div className="flex items-center gap-3">
            <ProjectMedia
              context={context}
              view="list"
              model={model}
              featuredLabel={labels.featuredLabel}
              activeLabel={labels.activeLabel}
              fundedLabel={labels.fundedLabel}
            />
            <div className="min-w-0 flex-1">
              <h3 className={titleClasses[context]}>{model.title}</h3>
              {model.subtitle && <p className={subtitleClasses[context]}>{model.subtitle}</p>}
              {badges.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {badges.map((badge) => (
                    <span
                      key={badge.id}
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        badgeToneClasses[badge.tone || 'neutral'],
                      )}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {slots?.topRight && (
              <div className="pointer-events-auto" data-card-action>
                {slots.topRight}
              </div>
            )}
          </div>
        </DataListItemHeader>

        <DataListItemContent>
          <div className="space-y-2">
            {model.description && (
              <p className={descriptionClasses[context]}>{model.description}</p>
            )}
            <ProjectProgress
              context={context}
              model={model}
              progressLabel={labels.progressLabel}
              fundedLabel={labels.fundedLabel}
              goalLabel={labels.goalLabel}
            />
            <ProjectMeta model={model} metaChips={slots?.metaChips} />
          </div>
        </DataListItemContent>

        {hasFooter && (
          <DataListItemActions>
            <div className="flex w-full items-center justify-between gap-3">
              {labels.viewLabel.trim() && (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {labels.viewLabel}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
              {slots?.footerActions && (
                <div className="contents" data-card-action>
                  {slots.footerActions}
                </div>
              )}
            </div>
          </DataListItemActions>
        )}
      </DataListItem>
    </div>
  )
}

export const ProjectCard: FC<ProjectCardProps> = ({ view = 'grid', ...props }) => {
  if (view === 'list') {
    return <ProjectCardList view={view} {...props} />
  }

  return <ProjectCardGrid view={view} {...props} />
}
