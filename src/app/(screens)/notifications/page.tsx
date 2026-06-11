'use client'

import { useRouter } from 'next/navigation'
import { Bell, ChevronLeft, CheckCircle2, AlertTriangle, MessageSquare, Info } from 'lucide-react'
import { useRole } from '@/lib/role-context'

export default function NotificationsPage() {
  const router = useRouter()
  const { role } = useRole()

  const notificationsByRole = {
    ouvrier: [
      { id: 1, title: 'Nouvelle tâche assignée', desc: 'Christophe a ajouté "Vérification placo (Zone A)" à votre liste.', time: 'Il y a 10 min', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
      { id: 2, title: 'Dépense validée', desc: 'Votre ticket Repas (15.50€) a été approuvé.', time: 'Il y a 2h', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ],
    chef: [
      { id: 1, title: 'Commentaire Direction', desc: 'Grégory: "Peux-tu vérifier le surcoût de la VMC ?"', time: 'Il y a 5 min', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { id: 2, title: 'Validation requise', desc: 'Hubert a déclaré 4h sur la Dépose Fenêtres.', time: 'Il y a 1h', icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
    ],
    admin: [
      { id: 1, title: 'Alerte Rentabilité', desc: 'La marge sur la Démolition passe sous les 15%.', time: 'Il y a 10 min', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
      { id: 2, title: 'Facture en attente', desc: 'Fournisseur Bricoman : 1250€ (Urgent)', time: 'Hier', icon: Info, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ],
    client: [
      { id: 1, title: 'Nouveau Rapport', desc: 'Le rapport hebdomadaire vulgarisé est disponible.', time: 'Il y a 2h', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
      { id: 2, title: 'Action requise', desc: 'L\'équipe a besoin de votre validation pour la couleur du carrelage.', time: 'Il y a 1j', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ]
  }

  const notifs = notificationsByRole[role] || []

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground animate-in slide-in-from-right-8">
      <header className="sticky top-0 z-30 flex items-center justify-between pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-surface-elevated transition-colors">
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="size-5" /> Notifications
        </h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {notifs.map(n => {
            const Icon = n.icon
            return (
              <div key={n.id} className="flex gap-4 p-4 rounded-2xl bg-surface border border-border/50 active:bg-surface-elevated transition-colors cursor-pointer">
                <div className={`shrink-0 flex items-center justify-center size-10 rounded-full ${n.bg}`}>
                  <Icon className={`size-5 ${n.color}`} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="font-semibold text-sm leading-tight text-foreground">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{n.desc}</p>
                </div>
              </div>
            )
          })}
          {notifs.length === 0 && (
            <p className="text-center text-muted-foreground text-sm mt-8">Aucune nouvelle notification.</p>
          )}
        </div>
      </div>
    </main>
  )
}
