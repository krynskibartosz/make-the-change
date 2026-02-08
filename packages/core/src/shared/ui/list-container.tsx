import type { FC, PropsWithChildren } from 'react'
import { cn } from './utils'

type ListContainerProps = PropsWithChildren<{
  className?: string
}>

export const ListContainer: FC<ListContainerProps> = ({ children, className }) => (
  <div className={cn('divide-y divide-border/40 dark:divide-border/80', className)}>{children}</div>
)
