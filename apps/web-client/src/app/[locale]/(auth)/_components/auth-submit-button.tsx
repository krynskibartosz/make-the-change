import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

type AuthSubmitButtonProps = {
  loading: boolean
  children: ReactNode
}

export function AuthSubmitButton({ loading, children }: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
      loading={loading}
    >
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}
