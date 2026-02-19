import { Button } from '@make-the-change/core/ui'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type HomeSectionViewAllActionProps = {
  href: string
  label: string
}

export function HomeSectionViewAllAction({ href, label }: HomeSectionViewAllActionProps) {
  return (
    <Link href={href} aria-label={label}>
      <Button
        variant="ghost"
        className="flex items-center text-xs font-bold uppercase tracking-widest"
      >
        {label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  )
}
