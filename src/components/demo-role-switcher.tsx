'use client'

import { useRole, type AppRole } from '@/lib/role-context'
import { Settings2 } from 'lucide-react'
import { toast } from '@/lib/hooks/use-toast'

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
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
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
