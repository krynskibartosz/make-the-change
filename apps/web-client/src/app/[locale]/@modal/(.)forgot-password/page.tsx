'use client'

import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@make-the-change/core/ui'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function InterceptedForgotPassword() {
    const router = useRouter()

    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent className="sm:max-w-[425px] md:max-w-lg p-0 bg-transparent border-none shadow-none">
                <VisuallyHidden>
                    <DialogTitle>Forgot Password</DialogTitle>
                </VisuallyHidden>
                <ForgotPasswordForm />
            </DialogContent>
        </Dialog>
    )
}
