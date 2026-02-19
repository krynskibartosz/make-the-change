import type { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type MarketingCtaBandProps = {
  badge?: ReactNode
  title: ReactNode
  description?: ReactNode
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  footer?: ReactNode
  tone?: 'dark' | 'primary'
  className?: string
}

const toneClasses = {
  dark: '!bg-card !text-foreground shadow-2xl shadow-foreground/10 border border-border',
  primary: 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30',
}

export const MarketingCtaBand: FC<MarketingCtaBandProps> = ({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  footer,
  tone = 'dark',
  className,
}) => (
  <section
    aria-label="Call to action"
    className={cn(
      'relative isolate overflow-hidden rounded-[3rem] p-12 md:p-24',
      toneClasses[tone],
      className,
    )}
  >
    <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-grain" />
    </div>

    <div className="absolute -top-[40%] -right-[20%] h-[80%] w-[80%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]" aria-hidden="true" />
    <div className="absolute -bottom-[40%] -left-[20%] h-[80%] w-[80%] rounded-full bg-secondary/20 blur-[120px] mix-blend-screen animate-pulse duration-[6000ms]" aria-hidden="true" />

    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiL2Q+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" aria-hidden="true" />

    <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
      {badge ? (
        <div className="mb-8 bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full border border-border  px-5 py-2 backdrop-blur-md">
          {badge}
        </div>
      ) : null}

      <h2 className="mb-8 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
        {title}
      </h2>

      {description ? (
        <p className="mx-auto mb-12 max-w-2xl text-xl md:text-2xl font-medium leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}

      {primaryAction || secondaryAction ? (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}

      {footer ? <footer className="pt-12">{footer}</footer> : null}
    </div>
  </section>
)
