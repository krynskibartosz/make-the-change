import { cva, type VariantProps } from 'class-variance-authority'
import type { FC, HTMLAttributes } from 'react'

import { cn } from '../utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success: 'border-transparent bg-success text-success-foreground hover:bg-success/90',
        warning: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/90',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/90',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeColor = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'orange'

export type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    color?: BadgeColor
  }

const colorToVariant: Record<BadgeColor, BadgeProps['variant']> = {
  green: 'success',
  red: 'destructive',
  yellow: 'warning',
  blue: 'info',
  gray: 'secondary',
  orange: 'warning',
}

export const Badge: FC<BadgeProps> = ({ className, variant, color, ...props }) => {
  const resolvedVariant = variant ?? (color ? colorToVariant[color] : undefined)
  return <div className={cn(badgeVariants({ variant: resolvedVariant }), className)} {...props} />
}

export { badgeVariants }
