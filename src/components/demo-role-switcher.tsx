'use client'

import { useRole, type AppRole } from '@/lib/role-context'
import { Settings2, Bell } from 'lucide-react'
import { toast } from '@/lib/hooks/use-toast'
import Link from 'next/link'

const ROLES: { id: AppRole; label: string; toastMsg: string }[] = [
  { id: 'ouvrier', label: 'Hubert (Ouvrier)', toastMsg: 'Connecté en tant que Hubert. Interface simplifiée activée.' },
  { id: 'chef', label: 'Christophe (Chef)', toastMsg: 'Connecté en tant que Christophe. Mode Modération actif.' },
  { id: 'admin', label: 'Grégory (Admin)', toastMsg: 'Connecté en tant que Grégory. Dashboard financier prêt.' },
  { id: 'client', label: 'Martin (Client)', toastMsg: 'Connecté en tant que Martin. Vue portail client.' },
]

export function DemoRoleSwitcher() {
  const { role, setRole, isReady } = useRole()

  if (!isReady) return null

  const handleCycleRole = () => {
    const currentIndex = ROLES.findIndex(r => r.id === role)
    const nextIndex = (currentIndex + 1) % ROLES.length
    const nextRole = ROLES[nextIndex]!
    
    setRole(nextRole.id)
    
    // Fausse notification pour simuler un vrai changement de contexte lors d'une démo
    toast({
      title: 'Changement de compte',
      description: nextRole.toastMsg,
      variant: 'info',
    })
  }

  const currentRoleLabel = ROLES.find(r => r.id === role)?.label || role

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
      <Link 
        href="/notifications" 
        className="relative flex items-center justify-center size-8 rounded-full bg-surface border border-border/50 text-foreground hover:scale-105 active:scale-95 transition-all shadow-md"
      >
        <Bell className="size-4" />
        <span className="absolute top-0 right-0 flex size-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full size-2.5 bg-primary"></span>
        </span>
      </Link>
      
      <button
        onClick={handleCycleRole}
        className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border border-border/20 hover:scale-105 active:scale-95 transition-all"
        title="Widget de Démo : Cliquez pour changer de rôle"
      >
        <Settings2 className="size-3" />
        {currentRoleLabel}
      </button>
    </div>
  )
}
