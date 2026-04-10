'use client'

import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function InterceptedForgotPassword() {
  return (
    <FullScreenSlideModal title="Forgot Password" fallbackHref="/login">
      <div className="mx-auto w-full max-w-lg p-4">
        <ForgotPasswordForm />
      </div>
    </FullScreenSlideModal>
  )
}
