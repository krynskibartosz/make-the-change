'use client'

import type { FC, PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// --- Root Component ---
type DashboardPageLayoutProps = PropsWithChildren<{
  className?: string
}>

const DashboardPageLayoutRoot: FC<DashboardPageLayoutProps> = ({ children, className }) => (
  <div className={cn('space-y-8', className)}>{children}</div>
)

// --- Header Component ---
type HeaderProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const Header: FC<HeaderProps> = ({ title, description, action, className }) => (
  <div className={cn('flex items-center justify-between', className)}>
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
)

// --- Content Component ---
type ContentProps = PropsWithChildren<{
  className?: string
}>

const Content: FC<ContentProps> = ({ children, className }) => (
  <div className={cn('space-y-6', className)}>{children}</div>
)

// --- Compound Component Export ---
export const DashboardPageLayout = Object.assign(DashboardPageLayoutRoot, {
  Header,
  Content,
})
