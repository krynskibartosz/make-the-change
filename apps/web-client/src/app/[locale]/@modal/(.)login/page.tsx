'use client'

import { Suspense } from 'react'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import {
  DARK_APP_MODAL_CLASSNAME,
  LOGIN_MODAL_CONTENT_CLASSNAME,
} from '@/app/[locale]/@modal/_components/modal-content-presets'
import { LoginForm } from '@/app/[locale]/(auth)/_components/login-form'

export default function InterceptedLogin() {
  return (
    <InterceptedRouteDialog
      title="Login"
      className={DARK_APP_MODAL_CLASSNAME}
      contentClassName={LOGIN_MODAL_CONTENT_CLASSNAME}
    >
      <Suspense fallback={null}>
        <LoginForm modal />
      </Suspense>
    </InterceptedRouteDialog>
  )
}
