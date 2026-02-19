'use client'

import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { LOGIN_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { LoginForm } from '@/components/auth/login-form'

export default function InterceptedLogin() {
  return (
    <InterceptedRouteDialog title="Login" contentClassName={LOGIN_MODAL_CONTENT_CLASSNAME}>
      <LoginForm modal />
    </InterceptedRouteDialog>
  )
}
