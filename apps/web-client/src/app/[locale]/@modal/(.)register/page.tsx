'use client'

import { Suspense } from 'react'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import {
  DARK_APP_MODAL_CLASSNAME,
  REGISTER_MODAL_CONTENT_CLASSNAME,
} from '@/app/[locale]/@modal/_components/modal-content-presets'
import { RegisterForm } from '@/app/[locale]/(auth)/_components/register-form'

export default function InterceptedRegister() {
  return (
    <InterceptedRouteDialog
      title="Register"
      className={DARK_APP_MODAL_CLASSNAME}
      contentClassName={REGISTER_MODAL_CONTENT_CLASSNAME}
    >
      <Suspense fallback={null}>
        <RegisterForm modal />
      </Suspense>
    </InterceptedRouteDialog>
  )
}
