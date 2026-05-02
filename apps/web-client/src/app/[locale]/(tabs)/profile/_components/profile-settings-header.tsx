import { Settings } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function ProfileSettingsHeader({ href = '/profile/settings' }: { href?: string }) {
  return (
    <div className="mx-auto flex h-12 w-full max-w-3xl items-center justify-end">
      <Link
        href={href}
        aria-label="Paramètres"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </Link>
    </div>
  )
}