'use client'

import { Suspense } from 'react'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { REGISTER_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { RegisterForm } from '@/components/auth/register-form'

export default function InterceptedRegister() {
  return (
    <InterceptedRouteDialog title="Register" contentClassName={REGISTER_MODAL_CONTENT_CLASSNAME}>
      <Suspense fallback={null}>
        <RegisterForm modal />
      </Suspense>
    </InterceptedRouteDialog>
  )
}
