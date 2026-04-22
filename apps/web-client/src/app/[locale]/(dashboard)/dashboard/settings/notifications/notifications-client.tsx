'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { updateNotifications } from './actions'

type NotificationsClientProps = {
  initial: {
    // Topics
    project_updates: boolean
    product_updates: boolean
    leaderboard: boolean
    marketing: boolean
    // Channels
    email: boolean
    push: boolean
    monthly_report: boolean
  }
}

type ToggleKey = 'push' | 'monthly_report' | 'email' | 'project_updates' | 'product_updates' | 'leaderboard' | 'marketing'

function ToggleSwitch({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-lime-400' : 'bg-white/10'
        }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full transition duration-200 ease-in-out ${checked ? 'translate-x-5 bg-[#0B0F15]' : 'translate-x-0 bg-white'
          }`}
      />
    </button>
  )
}

function SettingRow({
  title,
  description,
  checked,
  onToggle,
}: {
  title: string
  description: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4 bg-transparent active:bg-white/[0.02] transition-colors">
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h3 className="text-base font-medium text-white mb-0.5">{title}</h3>
        <span className="text-xs text-gray-500 leading-snug">{description}</span>
      </div>
      <ToggleSwitch checked={checked} onToggle={onToggle} />
    </div>
  )
}

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
        formData.append(k, k)
      }
    })

    // Toggle the current key in the form data
    if (!settings[key]) {
      formData.append(key, key)
    }

    try {
      await updateNotifications(formData)
    } catch (error) {
      // Revert on error
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white flex flex-col pb-12">
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-4 flex items-center bg-[#0B0F15]/80 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <span className="flex-1 text-center text-base font-semibold text-white">Notifications</span>
        <div className="w-10" />
      </div>

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
        <SettingRow
          title="Notifications Push"
          description="Alertes instantanées sur votre téléphone."
          checked={settings.push}
          onToggle={() => handleToggle('push')}
        />
        <div className="border-b border-white/5" />
        <SettingRow
          title="Résumé Mensuel"
          description="Votre rapport d'impact par email."
          checked={settings.monthly_report}
          onToggle={() => handleToggle('monthly_report')}
        />
        <div className="border-b border-white/5" />
        <SettingRow
          title="Email"
          description="Mises à jour majeures de la plateforme."
          checked={settings.email}
          onToggle={() => handleToggle('email')}
        />
      </div>

      {/* Block 2: Vos intérêts */}
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-6 mb-2 mt-8">
        Vos intérêts
      </div>
      <div className="mx-6 bg-[#1A1F26] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
        <SettingRow
          title="Mises à jour Projets"
          description="Photos et avancées de vos investissements."
          checked={settings.project_updates}
          onToggle={() => handleToggle('project_updates')}
        />
        <div className="border-b border-white/5" />
        <SettingRow
          title={"Récompenses"}
          description="Nouveaux produits et réassorts limités."
          checked={settings.product_updates}
          onToggle={() => handleToggle('product_updates')}
        />
        <div className="border-b border-white/5" />
        <SettingRow
          title="Classement & Collectif"
          description="Votre rang et les actions de la communauté."
          checked={settings.leaderboard}
          onToggle={() => handleToggle('leaderboard')}
        />
      </div>
    </div>
  )
}
