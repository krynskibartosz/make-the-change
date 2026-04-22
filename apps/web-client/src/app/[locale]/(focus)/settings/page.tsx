import {
  BookOpen,
  ChevronRight,
  HelpCircle,
  Leaf,
  Mail,
  Shield,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'

type SettingsItem = {
  label: string
  href?: string
  icon: LucideIcon
  iconWrapperClassName: string
  iconClassName?: string
}

function SettingsGroup({ title, items }: { title: string; items: SettingsItem[] }) {
  return (
    <section>
      <h3 className="ml-8 mb-1 mt-6 text-[11px] font-medium uppercase tracking-widest text-white/50">
        {title}
      </h3>

      <div className="mx-4 mb-8 overflow-hidden rounded-xl bg-[#1C1C22]">
        {items.map((item, index) => {
          const Icon = item.icon
          const iconClassName = item.iconClassName ?? 'text-white'
          const row = (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.iconWrapperClassName}`}
                >
                  <Icon className={`h-4 w-4 ${iconClassName}`} />
                </div>

                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>

              <ChevronRight className="h-4 w-4 text-white/30" />
            </>
          )

          return (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex w-full items-center justify-between bg-transparent px-6 py-4 transition-colors active:bg-white/5"
                >
                  {row}
                </Link>
              ) : (
                <button
                  type="button"
                  className="flex w-full items-center justify-between bg-transparent px-6 py-4 transition-colors active:bg-white/5"
                >
                  {row}
                </button>
              )}

              {index < items.length - 1 ? <div className="ml-14 border-b border-white/5" /> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function PublicSettingsPage() {
  const ecosystemItems: SettingsItem[] = [
    {
      label: 'Le Blog',
      icon: BookOpen,
      href: '/blog',
      iconWrapperClassName: 'bg-orange-500',
      iconClassName: 'text-white',
    },
    {
      label: 'À propos de Make The Change',
      icon: Leaf,
      href: '/about',
      iconWrapperClassName: 'bg-emerald-500',
      iconClassName: 'text-white',
    },
  ]

  const legalItems: SettingsItem[] = [
    {
      label: "FAQ & Centre d'aide",
      icon: HelpCircle,
      href: '/faq',
      iconWrapperClassName: 'bg-indigo-500',
      iconClassName: 'text-white',
    },
    {
      label: 'Nous contacter',
      icon: Mail,
      href: '/contact',
      iconWrapperClassName: 'bg-blue-400',
      iconClassName: 'text-white',
    },
    {
      label: 'Confidentialité & Conditions',
      icon: Shield,
      href: '/privacy',
      iconWrapperClassName: 'bg-gray-500',
      iconClassName: 'text-white',
    },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] h-[100dvh] w-full flex flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain pb-4 text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/30 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl supports-[backdrop-filter]:bg-black/25">
        <div className="relative flex h-12 items-center justify-center">
          <Link
            href="/"
            aria-label="Fermer"
            className="absolute left-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/5"
          >
            <X className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-bold text-white">Paramètres</h1>
        </div>
      </header>

      <main className="pt-[calc(env(safe-area-inset-top))] mt-20">
        <section>
          <div className="mx-4 mt-4 overflow-hidden rounded-xl bg-white/10">
            <Link
              href="/login"
              className="flex w-full items-center justify-between bg-transparent p-3 transition-colors active:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                  <Shield className="h-7 w-7 text-white/60" />
                </div>

                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">Se connecter</span>
                  <span className="text-sm text-white/50">Accéder à votre compte</span>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-white/30" />
            </Link>
          </div>
        </section>

        <SettingsGroup title="L'ÉCOSYSTÈME" items={ecosystemItems} />
        <SettingsGroup title="ASSISTANCE & LÉGAL" items={legalItems} />
      </main>
    </div>
  )
}
