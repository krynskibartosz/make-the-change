'use client'

import { LocalizedLink } from '@/components/localized-link'
import { ArrowLeft } from 'lucide-react'
import type { FC, PropsWithChildren } from 'react'

type AdminPageHeaderProps = {
  title?: string
  description?: string
  backHref?: string
  className?: string
} & PropsWithChildren

export const AdminPageHeader: FC<AdminPageHeaderProps> = ({
  title,
  description,
  backHref,
  children,
  className = '',
}) => (
  <div
    className={`flex flex-col gap-4 mb-6 ${className}`}
  >
    {backHref && (
      <div>
        <LocalizedLink
          href={backHref as any}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </LocalizedLink>
      </div>
    )}
    
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {(title || description) && (
        <div>
          {title && <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{title}</h1>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {children && <div className="flex items-center gap-2 flex-wrap ml-auto">{children}</div>}
    </div>
  </div>
)
