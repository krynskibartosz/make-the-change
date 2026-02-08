import type { AutoSaveReturn } from '../hooks/use-optimistic-auto-save'

/**
 * Props for components that support auto-save functionality
 */
export interface WithAutoSaveProps {
  autoSave?: AutoSaveReturn
}
