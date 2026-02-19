'use client'

import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { REGISTER_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { RegisterForm } from '@/components/auth/register-form'

export default function InterceptedRegister() {
  return (
    <InterceptedRouteDialog title="Register" contentClassName={REGISTER_MODAL_CONTENT_CLASSNAME}>
      <RegisterForm modal />
    </InterceptedRouteDialog>
  )
}
