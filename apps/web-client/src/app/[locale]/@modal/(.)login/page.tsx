'use client'

import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@make-the-change/core/ui'
import { LoginForm } from '@/components/auth/login-form'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function InterceptedLogin() {
    const router = useRouter()

    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent className="sm:max-w-[425px] p-0 bg-transparent border-none shadow-none">
                <VisuallyHidden>
                    <DialogTitle>Login</DialogTitle>
                </VisuallyHidden>
                <LoginForm />
            </DialogContent>
        </Dialog>
    )
}
