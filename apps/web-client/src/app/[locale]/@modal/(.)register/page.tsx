'use client'

import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@make-the-change/core/ui'
import { RegisterForm } from '@/components/auth/register-form'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function InterceptedRegister() {
    const router = useRouter()

    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent className="sm:max-w-[425px] md:max-w-lg p-0 bg-transparent border-none shadow-none">
                <VisuallyHidden>
                    <DialogTitle>Register</DialogTitle>
                </VisuallyHidden>
                <RegisterForm />
            </DialogContent>
        </Dialog>
    )
}
