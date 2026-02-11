'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Coins, User, FileText } from 'lucide-react'
import type { FC } from 'react'
import { cn } from '@make-the-change/core/shared/utils'

type TransactionData = {
  id: string
  delta: number
  reason: string
  reference_type?: string | null
  reference_id?: string | null
  created_at: Date | string | null
  user?: {
    email: string
    first_name?: string | null
    last_name?: string | null
  } | null
}

type TransactionDetailsProps = {
  transaction: TransactionData
}

export const TransactionDetails: FC<TransactionDetailsProps> = ({ transaction }) => {
  const isPositive = transaction.delta > 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Informations Générales</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID</p>
              <p className="text-sm font-mono truncate" title={transaction.id}>{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type de référence</p>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                {transaction.reference_type || 'Aucun'}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">
                  {transaction.created_at 
                    ? format(new Date(transaction.created_at), 'Pp', { locale: fr }) 
                    : '-'}
                </span>
              </div>
            </div>
          </div>
          <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Raison / Description</p>
              <p className="text-sm">{transaction.reason}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mouvement de Points</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Montant</p>
            <p className={cn("text-3xl font-bold", isPositive ? "text-green-600" : "text-red-600")}>
              {isPositive ? '+' : ''}{transaction.delta.toLocaleString()} PTS
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateur</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-4">
            {transaction.user ? (
                <div className="space-y-1">
                    <p className="text-lg font-semibold">
                        {[transaction.user.first_name, transaction.user.last_name].filter(Boolean).join(' ') || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-muted-foreground">{transaction.user.email}</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">Utilisateur introuvable</p>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
