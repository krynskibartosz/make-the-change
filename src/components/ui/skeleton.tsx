import { cn } from '@/lib/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[var(--radius-card)] bg-surface-elevated/50', className)}
      {...props}
    />
  )
}

export { Skeleton }
