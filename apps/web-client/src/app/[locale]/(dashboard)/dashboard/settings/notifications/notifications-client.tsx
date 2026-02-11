'use client'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CheckboxWithLabel,
} from '@make-the-change/core/ui'
import { cn } from '@make-the-change/core/shared/utils'
import { Check, Mail, Package, Trophy, Zap, Bell, ShieldCheck, Radio } from 'lucide-react'
import { useActionState } from 'react'
import { type NotificationState, updateNotifications } from './actions'

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

export function NotificationsClient({ initial }: NotificationsClientProps) {
  const [state, formAction, isPending] = useActionState<NotificationState, FormData>(
    updateNotifications,
    {},
  )

  const notificationTypes = [
    {
      id: 'project_updates',
      label: 'Updates projets',
      description: 'Nouvelles photos, milestones et nouvelles étapes de vos investissements.',
      icon: Zap,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      id: 'product_updates',
      label: 'Actus boutique',
      description: 'Soyez informé des nouveaux produits et des réassorts exclusifs.',
      icon: Package,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      id: 'leaderboard',
      label: 'Classement & Gamification',
      description: 'Suivez votre progression et vos changements de rang dans la communauté.',
      icon: Trophy,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      id: 'marketing',
      label: 'Newsletter & Offres',
      description: 'Conseils personnalisés, annonces et offres partenaires (optionnel).',
      icon: Mail,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ]

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Centre de Notifications</h1>
        </div>
        <p className="text-muted-foreground font-medium ml-11">
          Personnalisez votre expérience et restez informé de ce qui compte pour vous.
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        <Card className="border bg-background/70 shadow-xl backdrop-blur-md overflow-hidden">
          <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-6 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-xl font-bold">Préférences de réception</CardTitle>
                <CardDescription className="text-sm">Contrôlez la fréquence et le type de messages reçus.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {state.error || state.success ? (
              <div className="px-6 pt-6 sm:px-8">
                {state.error && (
                  <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 animate-in zoom-in-95">
                    {state.error}
                  </div>
                )}
                {state.success && (
                  <div className="flex items-center gap-3 rounded-xl bg-client-emerald-500/10 p-4 text-sm text-client-emerald-600 font-bold border border-client-emerald-500/20 animate-in zoom-in-95">
                    <div className="bg-client-emerald-500 text-client-white rounded-full p-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    {state.success}
                  </div>
                )}
              </div>
            ) : null}

            {/* Channels Section */}
            <div className="p-6 sm:p-8 border-b border-border/50 space-y-5">
               <div className="flex items-center gap-2 mb-4">
                  <Radio className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Canaux de diffusion</h3>
               </div>
               
               <div className="grid gap-4 sm:grid-cols-2">
                <CheckboxWithLabel
                  name="notify_email"
                  defaultChecked={initial.email}
                  label="Email"
                  description="Recevoir les alertes importantes par email."
                />
                <CheckboxWithLabel
                  name="notify_push"
                  defaultChecked={initial.push}
                  label="Notifications Push"
                  description="Recevoir les notifications sur votre navigateur/mobile."
                />
                <CheckboxWithLabel
                  name="notify_monthly"
                  defaultChecked={initial.monthly_report}
                  label="Rapport mensuel d'impact"
                  description="Un résumé complet de votre contribution chaque mois."
                />
              </div>
            </div>

            {/* Topics Section */}
            <div className="divide-y divide-border/50">
              <div className="px-6 pt-6 sm:px-8 flex items-center gap-2">
                 <Trophy className="h-4 w-4 text-primary" />
                 <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sujets d'intérêt</h3>
              </div>
              
              {notificationTypes.map((type) => (
                <label
                  key={type.id}
                  htmlFor={type.id}
                  className="flex items-start gap-4 p-6 sm:p-8 transition-all hover:bg-muted/40 cursor-pointer group"
                >
                  <div className={cn("p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110 duration-300", type.bgColor)}>
                    <type.icon className={cn("h-6 w-6", type.color)} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-bold leading-none group-hover:text-primary transition-colors">
                      {type.label}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {type.description}
                    </p>
                  </div>
                  <div className="pt-1">
                    <Checkbox
                      id={type.id}
                      name={type.id}
                      defaultChecked={(initial as any)[type.id]}
                      className="h-6 w-6 rounded-lg border-2 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all shadow-sm"
                    />
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-inner">
          <div className="text-sm text-muted-foreground font-medium">
            Vos modifications sont appliquées instantanément après l'enregistrement.
          </div>
          <Button 
            type="submit" 
            loading={isPending} 
            className="w-full sm:w-auto px-10 py-6 text-base font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Enregistrer les choix
          </Button>
        </div>
      </form>
    </div>
  )
}
