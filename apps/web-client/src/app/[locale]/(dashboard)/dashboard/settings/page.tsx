import {
  Bell,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Info,
  Leaf,
  Mail,
  ReceiptText,
  Shield,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react'
import { logout } from '@/app/[locale]/(auth)/actions'
import { Link } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentProfile, getCurrentViewer } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'

type SettingsItem = {
  label: string
  href?: string
  icon: LucideIcon
  iconWrapperClassName: string
  iconClassName?: string
  highlight?: boolean
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

                <span className={`text-sm font-medium ${item.highlight ? 'text-lime-400' : 'text-white'}`}>
                  {item.label}
                </span>
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

export default async function SettingsPage() {
  if (isMockDataSource) {
    const [viewer, profile] = await Promise.all([getCurrentViewer(), getCurrentProfile()])

    if (!viewer || !profile) {
      // Render simplified settings page for non-authenticated users
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

    const displayName = profile.displayName || 'Mon profil'
    const userEmail = viewer.email || 'email@exemple.com'
    const userAvatar =
      profile.avatarUrl ||
      'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=240&q=80'

    const accountItems: SettingsItem[] = [
      {
        label: 'Mes contributions & achats',
        icon: ReceiptText,
        href: '/dashboard/investments',
        iconWrapperClassName: 'bg-gray-500/20',
        iconClassName: 'text-white',
      },
      {
        label: 'Notifications',
        icon: Bell,
        href: '/dashboard/settings/notifications',
        iconWrapperClassName: 'bg-red-500',
        iconClassName: 'text-white',
      },
      {
        label: 'Abonnement & Avantages',
        icon: Sparkles,
        href: '/dashboard/subscription',
        iconWrapperClassName: 'bg-lime-500',
        iconClassName: 'text-black',
        highlight: true,
      },
    ]

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
              href="/dashboard/profile"
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
                href="/account"
                className="flex w-full items-center justify-between bg-transparent p-3 transition-colors active:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={userAvatar}
                    alt={`Avatar de ${displayName}`}
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">{displayName}</span>
                    <span className="text-sm text-white/50">{userEmail}</span>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-white/30" />
              </Link>
            </div>
          </section>

          <SettingsGroup title="MON COMPTE" items={accountItems} />
          <SettingsGroup title="L'ÉCOSYSTÈME" items={ecosystemItems} />
          <SettingsGroup title="ASSISTANCE & LÉGAL" items={legalItems} />

          <section>
            <form action={logout} className="mx-4 mt-2 mb-8">
              <button
                type="submit"
                className="w-full rounded-xl bg-white/10 p-4 text-center text-red-500 font-medium transition-colors active:bg-white/20"
              >
                Se déconnecter
              </button>
            </form>
          </section>
        </main>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Render simplified settings page for non-authenticated users
    const ecosystemItems: SettingsItem[] = [
      {
        label: 'Comment ça marche ?',
        icon: Info,
        href: '/faq',
        iconWrapperClassName: 'bg-blue-500',
        iconClassName: 'text-white',
      },
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
                prefetch={false}
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', user.id)
    .single()

  const metadata =
    user.user_metadata && typeof user.user_metadata === 'object' ? user.user_metadata : null
  const metadataFullName =
    metadata && typeof metadata.full_name === 'string' ? metadata.full_name.trim() : ''

  const displayName =
    [profile?.first_name, profile?.last_name]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(' ')
      .trim() ||
    metadataFullName ||
    'Mon profil'

  const userEmail = user.email ?? 'email@exemple.com'
  const userAvatar =
    profile?.avatar_url ||
    'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=240&q=80'

  const accountItems: SettingsItem[] = [
    {
      label: 'Mes contributions & achats',
      icon: ReceiptText,
      href: '/dashboard/investments',
      iconWrapperClassName: 'bg-gray-500/20',
      iconClassName: 'text-white',
    },
    {
      label: 'Notifications',
      icon: Bell,
      href: '/dashboard/settings/notifications',
      iconWrapperClassName: 'bg-red-500',
      iconClassName: 'text-white',
    },
    {
      label: 'Abonnement & Avantages',
      icon: Sparkles,
      href: '/dashboard/subscription',
      iconWrapperClassName: 'bg-lime-500',
      iconClassName: 'text-black',
      highlight: true,
    },
  ]

  const ecosystemItems: SettingsItem[] = [
    {
      label: 'Comment ça marche ?',
      icon: Info,
      href: '/faq',
      iconWrapperClassName: 'bg-blue-500',
      iconClassName: 'text-white',
    },
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
            href="/dashboard/profile"
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
              href="/account"
              className="flex w-full items-center justify-between bg-transparent p-3 transition-colors active:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={userAvatar}
                  alt={`Avatar de ${displayName}`}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">{displayName}</span>
                  <span className="text-sm text-white/50">{userEmail}</span>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-white/30" />
            </Link>
          </div>
        </section>

        <SettingsGroup title="MON COMPTE" items={accountItems} />
        <SettingsGroup title="L'ÉCOSYSTÈME" items={ecosystemItems} />
        <SettingsGroup title="ASSISTANCE & LÉGAL" items={legalItems} />

        <section>
          <form action={logout} className="mx-4 mt-2 mb-8">
            <button
              type="submit"
              className="w-full rounded-xl bg-white/10 p-4 text-center text-red-500 font-medium transition-colors active:bg-white/20"
            >
              Se déconnecter
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
