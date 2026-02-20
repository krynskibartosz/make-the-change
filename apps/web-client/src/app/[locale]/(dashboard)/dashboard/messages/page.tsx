import { Badge } from '@make-the-change/core/ui'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SentMessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user's sent messages
  const { data: rawMessages } = await supabase
    .from('producer_messages')
    .select(
      `
      id,
      subject,
      message,
      status,
      created_at,
      producer:public_producers!producer_id(name, slug)
    `,
    )
    .order('created_at', { ascending: false })

  type ProducerRef = { name: string | null; slug: string | null }
  type ProducerMessageRow = {
    id: string
    subject: string | null
    message: string | null
    status: string | null
    created_at: string
    producer: ProducerRef[] | ProducerRef | null
  }

  const messages = (rawMessages ?? []) as ProducerMessageRow[]

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages envoyés</h1>
        <p className="text-muted-foreground">Historique de vos messages aux producteurs</p>
      </div>

      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => {
            const producer = Array.isArray(msg.producer) ? msg.producer[0] : msg.producer
            const status = msg.status ?? 'pending'
            const statusConfig =
              status === 'pending'
                ? { label: 'En attente', variant: 'warning' as const }
                : status === 'read'
                  ? { label: 'Lu', variant: 'info' as const }
                  : status === 'replied'
                    ? { label: 'Répondu', variant: 'success' as const }
                    : { label: 'Archivé', variant: 'secondary' as const }

            return (
              <div key={msg.id} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{msg.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      À: {producer?.name || 'Producteur inconnu'} •{' '}
                      {formatDistanceToNow(new Date(msg.created_at), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">{msg.message}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">Aucun message envoyé pour le moment</p>
          <p className="text-sm text-muted-foreground">
            Contactez un producteur depuis sa page pour commencer
          </p>
        </div>
      )}
    </div>
  )
}
