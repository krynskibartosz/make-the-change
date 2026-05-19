import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import {
  getCachedPublicProducerBySlug,
  type PublicProducer,
} from './producer-detail-data'
import { ProducerDetails } from './producer-details'

interface ProducerDetailPageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: ProducerDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const producer = await getCachedPublicProducerBySlug(slug)

  if (!producer) {
    return {}
  }

  const heroImage = producer.images[0]

  return {
    title: producer.name_default,
    description: producer.description_default.slice(0, 160),
    openGraph: {
      title: producer.name_default,
      description: producer.description_default.slice(0, 160),
      images: heroImage ? [{ url: heroImage }] : undefined,
    },
  }
}

export default async function ProducerDetailPage({ params }: ProducerDetailPageProps) {
  const { slug } = await params

  const producer = await getCachedPublicProducerBySlug(slug)
  if (!producer) {
    notFound()
  }

  return (
    <FullScreenSlideModal
      title={producer.name_default}
      fallbackHref="/producers"
      headerMode="dynamic"
      contentClassName="overflow-y-auto"
    >
      <ProducerDetails
        producer={producer}
      />
    </FullScreenSlideModal>
  )
}
