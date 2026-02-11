import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ThemeSelection } from '../components/theme-selection'
import { createClient } from '@/lib/supabase/server'
import type { ThemeConfig } from '@make-the-change/core'

export default async function AppearancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let themeConfig: ThemeConfig | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('theme_config')
      .eq('id', user.id)
      .single()
    themeConfig = profile?.theme_config as unknown as ThemeConfig || null
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader 
        title="Apparence" 
        description="Personnalisez l'apparence de l'interface d'administration."
        backHref="/admin/settings"
      />
      
      <div className="space-y-8">
        <Card className="border-0 shadow-none bg-transparent sm:border sm:bg-background/70 sm:shadow-sm sm:backdrop-blur sm:overflow-hidden">
          <CardHeader className="hidden sm:block p-6 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">Thèmes</CardTitle>
            <CardDescription>
              Choisissez le thème qui vous convient.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-8 sm:pt-0">
            <ThemeSelection initialConfig={themeConfig} />
          </CardContent>
        </Card>
      </div>
    </AdminPageContainer>
  )
}
