'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { updateNotifications } from './actions'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { NotificationToggleRow } from '@/components/ui/notification-toggle-row'

type NotificationsClientProps = {
  initial: {
    // Topics
    project_updates: boolean
    product_updates: boolean
    leaderboard: boolean
    marketing: boolean
    academy: boolean
    // Channels
    email: boolean
    push: boolean
    monthly_report: boolean
  }
}

type ToggleKey = 'push' | 'monthly_report' | 'email' | 'project_updates' | 'product_updates' | 'leaderboard' | 'marketing' | 'academy'

export function NotificationsClient({ initial }: NotificationsClientProps) {
  const router = useRouter()
  const [settings, setSettings] = useState(initial)

  useEffect(() => {
    // Hide mobile bottom nav when notifications page is active
    const bottomNav = document.getElementById('mobile-bottom-nav')
    if (bottomNav) {
      bottomNav.style.display = 'none'
    }

    return () => {
      // Restore mobile bottom nav when component unmounts
      if (bottomNav) {
        bottomNav.style.display = ''
      }
    }
  }, [])

  const handleToggle = async (key: ToggleKey) => {
    // Optimistic update
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))

    // Call server action in background
    const formData = new FormData()
    Object.entries(settings).forEach(([k, v]) => {
      if (v) {
        formData.append(k, 'on')
      }
    })

    // Toggle the current key in the form data
    if (!settings[key]) {
      formData.append(key, 'on')
    } else {
      formData.delete(key)
    }

    try {
      await updateNotifications({}, formData)
    } catch (error) {
      // Revert on error
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    }
  }

  const screenHeader = (
    <div className="flex w-full items-center justify-between">
      <button
        onClick={() => router.back()}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        aria-label="Retour"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </button>
      <span className="text-base font-semibold text-white">Notifications</span>
      <div className="w-10" />
    </div>
  )

  return (
    <Screen header={screenHeader}>
      <div className="text-white flex flex-col pb-12">
      {/* Hero */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Préférences</h1>
        <p className="text-gray-400 text-sm">Contrôlez ce que vous recevez et où vous le recevez.</p>
      </div>

      {/* Block 1: Canaux de diffusion */}
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-6 mb-2 mt-2">
        Canaux de diffusion
      </div>
      <div className="mx-6 mb-6 bg-[#1A1F26] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        <NotificationToggleRow
          label="Notifications Push"
          description="Alertes instantanées sur votre téléphone."
          checked={settings.push}
          onCheckedChange={() => handleToggle('push')}
        />
        <div className="border-b border-white/5" />
        <NotificationToggleRow
          label="Rapport mensuel d'impact"
          description="Votre résumé d'impact par email."
          checked={settings.monthly_report}
          onCheckedChange={() => handleToggle('monthly_report')}
        />
        <div className="border-b border-white/5" />
        <NotificationToggleRow
          label="Emails importants"
          description="Mises à jour majeures de la plateforme."
          checked={settings.email}
          onCheckedChange={() => handleToggle('email')}
        />
      </div>

      {/* Block 2: Vos intérêts */}
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-6 mb-2 mt-8">
        Vos intérêts
      </div>
      <div className="mx-6 bg-[#1A1F26] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        <NotificationToggleRow
          label="Mises à jour projets"
          description="Photos, nouvelles et avancées de vos soutiens."
          checked={settings.project_updates}
          onCheckedChange={() => handleToggle('project_updates')}
        />
        <div className="border-b border-white/5" />
        <NotificationToggleRow
          label="Avantages partenaires"
          description="Nouveaux produits, offres limitées et réassorts."
          checked={settings.product_updates}
          onCheckedChange={() => handleToggle('product_updates')}
        />
        <div className="border-b border-white/5" />
        <NotificationToggleRow
          label="Collectif & factions"
          description="Objectifs communs, bravos et activité de la communauté."
          checked={settings.leaderboard}
          onCheckedChange={() => handleToggle('leaderboard')}
        />
        <div className="border-b border-white/5" />
        <NotificationToggleRow
          label="Academy & BioDex"
          description="Nouveaux cours, missions et découvertes."
          checked={settings.academy}
          onCheckedChange={() => handleToggle('academy')}
        />
      </div>
      </div>
    </Screen>
  )
}
