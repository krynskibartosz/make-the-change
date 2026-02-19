'use client'

import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { LoginForm } from '@/components/auth/login-form'

export default function InterceptedLogin() {
  return (
    <InterceptedRouteDialog
      title="Login"
      contentClassName="overflow-hidden p-0 !bg-background/95 sm:w-[calc(100vw-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-[425px] sm:rounded-[28px] sm:border sm:border-border/60 sm:shadow-[0_25px_100px_hsl(var(--marketing-overlay-dark)/0.5)] sm:backdrop-blur-2xl"
    >
      <LoginForm modal />
    </InterceptedRouteDialog>
  )
}
