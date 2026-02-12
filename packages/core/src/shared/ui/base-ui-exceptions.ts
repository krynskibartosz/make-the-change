export type BaseUiIntentionalException = {
  component: string
  file: string
  reason: string
  decisionDate: string
}

export const BASE_UI_INTENTIONAL_EXCEPTIONS: readonly BaseUiIntentionalException[] = [
  {
    component: 'DataCard',
    file: 'next/data-card.tsx',
    reason:
      'Composite clickable card pattern with nested interactive zones, not modeled as a direct Base UI primitive.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'DataListItem',
    file: 'next/data-list-item.tsx',
    reason:
      'Composite list-item interaction with delegated action area and keyboard routing, not a direct Base UI primitive.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'Card',
    file: 'card.tsx',
    reason: 'Presentation/layout container without equivalent Base UI primitive.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'Badge',
    file: 'base/badge.tsx',
    reason: 'Pure presentation token component without equivalent Base UI primitive.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'Skeleton',
    file: 'skeleton.tsx',
    reason: 'Loading placeholder presentation component.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'EmptyState',
    file: 'empty-state.tsx',
    reason: 'Screen composition and layout helper, not an interaction primitive.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'ListContainer',
    file: 'list-container.tsx',
    reason: 'Structural list composition component.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'DetailView',
    file: 'detail-view.tsx',
    reason: 'Page layout composition without direct Base UI equivalent.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'ThemePreview',
    file: 'theme-preview.tsx',
    reason: 'Visualization-only component.',
    decisionDate: '2026-02-12',
  },
  {
    component: 'ThemePalette',
    file: 'theme-palette.tsx',
    reason: 'Visualization/layout helper component.',
    decisionDate: '2026-02-12',
  },
] as const

export const BASE_UI_RAW_INTERACTIVE_ALLOWLIST = [
  'next/data-card.tsx',
  'next/data-list-item.tsx',
] as const
