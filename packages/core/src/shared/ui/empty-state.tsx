import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import type { FC, ReactNode } from 'react'

import { cn } from './utils'

const emptyStateVariants = cva('text-center flex flex-col items-center justify-center', {
  variants: {
    size: {
      sm: 'py-4 min-h-[100px]',
      md: 'py-8 min-h-[200px]',
      lg: 'py-12 min-h-[300px]',
      xl: 'p-10 min-h-[360px]', // Matches the Web "dashed" size roughly
    },
    variant: {
      default: '',
      muted: 'bg-muted/30 rounded-lg',
      card: 'bg-background border rounded-lg shadow-sm',
      dashed:
        'border-border/70 dark:border-border/40 bg-background/70 dark:bg-card/40 rounded-2xl border-2 border-dashed shadow-inner shadow-black/5 backdrop-blur-sm transition-colors',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
})

const iconSizeVariants = cva('text-muted-foreground mx-auto mb-4', {
  variants: {
    size: {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
      xl: 'h-12 w-12', // Matches Web
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type EmptyStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
} & VariantProps<typeof emptyStateVariants>

export const EmptyState: FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  size,
  variant,
}) => (
  <div className={cn(emptyStateVariants({ size, variant }), className)}>
    {Icon && <Icon className={iconSizeVariants({ size })} />}
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {description && (
      <p className="text-muted-foreground dark:text-muted-foreground/80 mb-6 max-w-sm text-sm">
        {description}
      </p>
    )}
    {action && <div>{action}</div>}
  </div>
)
