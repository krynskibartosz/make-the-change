'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, CreditCard, User, TrendingUp } from 'lucide-react'
import type { FC } from 'react'

type InvestmentData = {
  id: string
  amount_points: number
  amount_eur_equivalent?: string | number | null
  status?: string | null
  created_at: Date | string | null
  project?: {
    name_default: string
    slug: string
  } | null
  user?: {
    email: string
    first_name?: string | null
    last_name?: string | null
  } | null
}

type InvestmentDetailsProps = {
  investment: InvestmentData
}

export const InvestmentDetails: FC<InvestmentDetailsProps> = ({ investment }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Informations Générales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="text-sm font-mono truncate" title={investment.id}>{investment.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                {investment.status || 'Inconnu'}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">
                  {investment.created_at 
                    ? format(new Date(investment.created_at), 'Pp', { locale: fr }) 
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Montant</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Points Investis</p>
              <p className="text-2xl font-bold">{investment.amount_points?.toLocaleString() ?? 0} PTS</p>
            </div>
            {investment.amount_eur_equivalent && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Équivalent EUR</p>
                <p className="text-2xl font-bold">{Number(investment.amount_eur_equivalent).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projet</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
            {investment.project ? (
                <div className="space-y-1">
                    <p className="text-lg font-semibold">{investment.project.name_default}</p>
                    <p className="text-sm text-muted-foreground">Slug: {investment.project.slug}</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Projet introuvable</p>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Investisseur</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
            {investment.user ? (
                <div className="space-y-1">
                    <p className="text-lg font-semibold">
                        {[investment.user.first_name, investment.user.last_name].filter(Boolean).join(' ') || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-muted-foreground">{investment.user.email}</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Utilisateur introuvable</p>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
