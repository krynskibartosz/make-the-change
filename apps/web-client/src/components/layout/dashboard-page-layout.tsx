'use client'

import type { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// --- Root Component ---
type DashboardPageLayoutProps = PropsWithChildren<{
  className?: string
}>

const DashboardPageLayoutRoot = ({ children, className }: DashboardPageLayoutProps) => (
  <div className={cn('space-y-8', className)}>{children}</div>
)

// --- Header Component ---
type HeaderProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const Header = ({ title, description, action, className }: HeaderProps) => (
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

const Content = ({ children, className }: ContentProps) => (
  <div className={cn('space-y-6', className)}>{children}</div>
)

// --- Compound Component Export ---
export const DashboardPageLayout = Object.assign(DashboardPageLayoutRoot, {
  Header,
  Content,
})
