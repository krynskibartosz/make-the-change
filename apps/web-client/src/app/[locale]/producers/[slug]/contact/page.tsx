import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContactProducerForm from './contact-form'

export default async function ContactProducerPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?redirect=/producers/${slug}/contact`)
  }

  // Fetch producer (name only, from public view)
  const { data: producer, error } = await supabase
    .from('public_producers')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()

  if (error || !producer) {
    notFound()
  }

  return (
    <div className="container max-w-2xl py-12 px-4">
      <Link
        href={`/producers/${producer.slug}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au producteur
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contacter {producer.name}</h1>
        <p className="text-muted-foreground">
          Envoyez un message au producteur. Votre demande sera traitée rapidement.
        </p>
      </div>

      <ContactProducerForm producerId={producer.id} producerName={producer.name} />
    </div>
  )
}
