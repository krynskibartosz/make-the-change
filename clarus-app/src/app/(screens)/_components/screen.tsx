import type { ReactNode } from 'react'

type ScreenProps = Readonly<{
  title: string
  eyebrow?: string
  children: ReactNode
}>

export function Screen({ title, eyebrow = 'Sparrenlaan', children }: ScreenProps) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-5 py-5 text-foreground">
      <header className="pb-5">
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-semibold leading-tight">{title}</h1>
      </header>

      <div className="flex flex-col gap-4">{children}</div>
    </main>
  )
}
