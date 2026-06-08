import type { ReactNode } from 'react'

type InterceptedRouteDialogProps = Readonly<{
  children: ReactNode
}>

export function InterceptedRouteDialog({ children }: InterceptedRouteDialogProps) {
  return (
    <div aria-modal="true" className="fixed inset-0 z-50 bg-background" role="dialog">
      {children}
    </div>
  )
}
