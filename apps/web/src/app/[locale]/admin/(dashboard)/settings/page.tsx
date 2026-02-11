import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { Card, CardDescription, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { Palette, Bell, User, Shield, ChevronRight } from 'lucide-react'
import { LocalizedLink } from '@/components/localized-link'
import { cn } from '@make-the-change/core/shared/utils'

const SETTINGS_SECTIONS = [
  {
    title: 'Apparence',
    description: "Personnalisez l'apparence, le thème et le mode sombre/clair.",
    icon: Palette,
    href: '/admin/settings/appearance',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Notifications',
    description: "Gérez vos préférences de notifications et alertes.",
    icon: Bell,
    href: '#', 
    disabled: true,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'Profil',
    description: "Gérez vos informations personnelles et votre compte.",
    icon: User,
    href: '#',
    disabled: true,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Sécurité',
    description: "Mot de passe, double authentification et sessions.",
    icon: Shield,
    href: '#',
    disabled: true,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
]

export default function SettingsPage() {
  return (
    <AdminPageContainer>
      <AdminPageHeader 
        title="Paramètres" 
        description="Gérez vos préférences d'affichage et la configuration de l'application."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SETTINGS_SECTIONS.map((section) => {
          const Wrapper = section.disabled ? 'div' : LocalizedLink
          
          return (
            <Wrapper
              key={section.title}
              href={section.href as any}
              className={cn(
                "group block h-full transition-all duration-200",
                section.disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <Card className="h-full border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden relative">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-xl", section.bgColor)}>
                      <section.icon className={cn("w-6 h-6", section.color)} />
                    </div>
                    {!section.disabled && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </CardTitle>
                  <CardDescription>
                    {section.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Wrapper>
          )
        })}
      </div>
    </AdminPageContainer>
  )
}
