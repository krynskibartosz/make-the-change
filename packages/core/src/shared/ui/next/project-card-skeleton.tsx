import type { FC } from 'react'
import { cn } from '../utils'
import { DataCard } from './data-card'
import {
  DataListItem,
  DataListItemActions,
  DataListItemContent,
  DataListItemHeader,
} from './data-list-item'
import type { ProjectCardSkeletonProps } from './project-card.types'

const gridSkeletonClasses = {
  admin: 'h-full rounded-2xl p-4 md:p-5',
  clientCatalog: 'h-full rounded-3xl p-4 md:p-5',
  clientHome: 'h-full rounded-3xl p-3 md:p-4',
}

const mediaSkeletonClasses = {
  admin: 'mb-4 h-36 rounded-xl',
  clientCatalog: 'mb-4 aspect-square rounded-xl',
  clientHome: 'mb-3 aspect-[4/5] rounded-lg',
}

const GridSkeleton: FC<ProjectCardSkeletonProps> = ({ context, className }) => (
  <DataCard className={cn(gridSkeletonClasses[context], className)}>
    <div className={cn('w-full animate-pulse bg-muted', mediaSkeletonClasses[context])} />

    <DataCard.Header className="mb-2">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </DataCard.Header>

    <DataCard.Content className="mb-0 space-y-2">
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-2 space-y-2">
        <div className="h-2 w-full animate-pulse rounded bg-muted" />
        <div className="flex justify-between gap-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <div className="h-6 w-16 animate-pulse rounded bg-muted" />
        <div className="h-6 w-20 animate-pulse rounded bg-muted" />
      </div>
    </DataCard.Content>

    <DataCard.Footer className="mt-3 border-t border-border/70 pt-3">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-8 w-24 animate-pulse rounded bg-muted" />
    </DataCard.Footer>
  </DataCard>
)

const ListSkeleton: FC<ProjectCardSkeletonProps> = ({ className }) => (
  <DataListItem className={className}>
    <DataListItemHeader>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-md bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </DataListItemHeader>

    <DataListItemContent>
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-2 w-full animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </DataListItemContent>

    <DataListItemActions>
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </DataListItemActions>
  </DataListItem>
)

export const ProjectCardSkeleton: FC<ProjectCardSkeletonProps> = ({ view = 'grid', ...props }) => {
  if (view === 'list') {
    return <ListSkeleton view={view} {...props} />
  }

  return <GridSkeleton view={view} {...props} />
}
