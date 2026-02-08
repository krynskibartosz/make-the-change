'use client'

import { Button } from '@make-the-change/core/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ContactProducerForm({
  producerId,
  producerName,
}: {
  producerId: string
  producerName: string
}) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const inputsDisabled = loading || isAuthenticated !== true

  useEffect(() => {
    let mounted = true
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return
        setIsAuthenticated(!!data.user)
      })
      .catch(() => {
        if (!mounted) return
        setIsAuthenticated(false)
      })

    return () => {
      mounted = false
    }
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim() || !message.trim()) {
      alert('Veuillez remplir tous les champs')
      return
    }

    if (isAuthenticated !== true) {
      alert('Vous devez être connecté pour envoyer un message.')
      return
    }

    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('producer_messages').insert({
        producer_id: producerId,
        sender_user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
      })

      if (error) throw error

      alert('Message envoyé avec succès !')
      router.push('/dashboard/messages')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue'
      alert(`Erreur: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-2xl p-6">
      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Sujet
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 border border-border rounded-xl bg-background"
          placeholder="Objet de votre message"
          maxLength={200}
          disabled={inputsDisabled}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">{subject.length}/200 caractères</p>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-border rounded-xl bg-background min-h-[200px]"
          placeholder={`Votre message à ${producerName}...`}
          maxLength={2000}
          disabled={inputsDisabled}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">{message.length}/2000 caractères</p>
      </div>

      <Button type="submit" disabled={inputsDisabled} className="w-full">
        {loading ? 'Envoi en cours...' : 'Envoyer le message'}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Votre email et nom complet seront transmis au producteur pour qu'il puisse vous répondre.
      </p>
    </form>
  )
}
