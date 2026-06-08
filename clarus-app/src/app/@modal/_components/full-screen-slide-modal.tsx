import type { ReactNode } from 'react'

type FullScreenSlideModalProps = Readonly<{
  title: string
  children: ReactNode
}>

export function FullScreenSlideModal({ title, children }: FullScreenSlideModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-5">
        <header className="border-b border-border pb-4">
          <p className="text-sm font-medium text-muted-foreground">Sparrenlaan</p>
          <h1 className="mt-1 text-2xl font-semibold leading-tight">{title}</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 py-5">{children}</div>
      </div>
    </div>
  )
}
