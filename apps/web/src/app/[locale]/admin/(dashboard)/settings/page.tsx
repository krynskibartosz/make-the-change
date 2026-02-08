'use client'

import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ThemeSelection } from './components/theme-selection'

export default function SettingsPage() {
  return (
    <AdminPageContainer>
      <AdminPageHeader 
        title="Paramètres" 
        description="Gérez vos préférences d'affichage et la configuration de l'application."
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Apparence</CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'interface d'administration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelection />
          </CardContent>
        </Card>
      </div>
    </AdminPageContainer>
  )
}
