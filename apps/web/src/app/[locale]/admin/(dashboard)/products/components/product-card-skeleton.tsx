import {
  DataCard,
  DataListItem,
  DataListItemActions,
  DataListItemContent,
  DataListItemHeader,
} from '@make-the-change/core/ui/next'
import type { FC } from 'react'

export const ProductCardSkeleton: FC = () => (
  <DataCard>
    <DataCard.Header>
      <DataCard.Title>
        <div className="flex items-center gap-3">
          {/* Image du produit */}
          <div className="w-12 h-12 bg-muted animate-pulse [border-radius:var(--radius-surface)] flex-shrink-0" />

          {/* Titre et badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <div className="w-32 h-5 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
              <div className="w-12 h-4 bg-muted animate-pulse [border-radius:var(--radius-pill)]" />
              <div className="w-4 h-4 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
            </div>
          </div>
        </div>
      </DataCard.Title>
    </DataCard.Header>

    <DataCard.Content>
      {/* Points et stock */}
      <div className="flex items-center gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
          <div className="w-16 h-3 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
          <div className="w-20 h-3 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
        </div>
      </div>

      {/* Badges des catégories */}
      <div className="flex flex-wrap gap-2 mt-2">
        <div className="w-16 h-6 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-20 h-6 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-18 h-6 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
      </div>
    </DataCard.Content>

    <DataCard.Footer>
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <div className="w-8 h-8 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-8 h-8 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-8 h-8 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-12 h-8 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
      </div>
    </DataCard.Footer>
  </DataCard>
)

export const ProductListSkeleton: FC = () => (
  <DataListItem>
    <DataListItemHeader>
      {/* Skeleton du ProductListHeader */}
      <div className="flex items-center gap-3">
        {/* Image du produit */}
        <div className="w-10 h-10 bg-muted animate-pulse [border-radius:var(--radius-surface)] flex-shrink-0" />

        {/* Titre et informations principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-40 h-5 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
            <div className="w-12 h-4 bg-muted animate-pulse [border-radius:var(--radius-pill)]" />
            <div className="w-4 h-4 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
          </div>
          <div className="w-24 h-3 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
        </div>

        {/* Prix */}
        <div className="flex-shrink-0">
          <div className="w-16 h-6 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        </div>
      </div>
    </DataListItemHeader>

    <DataListItemContent>
      {/* Skeleton du ProductListMetadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
            <div className="w-20 h-3 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
            <div className="w-16 h-3 bg-muted animate-pulse [border-radius:var(--radius-xs)]" />
          </div>
        </div>

        {/* Badges des catégories */}
        <div className="flex flex-wrap gap-1">
          <div className="w-16 h-5 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
          <div className="w-20 h-5 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
          <div className="w-18 h-5 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        </div>
      </div>
    </DataListItemContent>

    <DataListItemActions>
      {/* Skeleton des actions */}
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <div className="w-8 h-7 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-8 h-7 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-8 h-7 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
        <div className="w-12 h-7 bg-muted animate-pulse [border-radius:var(--radius-sm)]" />
      </div>
    </DataListItemActions>
  </DataListItem>
)
