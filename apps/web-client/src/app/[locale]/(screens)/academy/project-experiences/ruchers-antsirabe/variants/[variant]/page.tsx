import { notFound } from 'next/navigation'
import { AntsirabeVariantShell } from '../../_components/antsirabe-variant-shell'
import { getAntsirabeCourseVariant } from '../../_lib/antsirabe-course-variants'

type AntsirabeVariantPageProps = {
  params: Promise<{ variant: string }>
}

export default async function AntsirabeVariantPage({ params }: AntsirabeVariantPageProps) {
  const { variant: variantId } = await params
  const variant = getAntsirabeCourseVariant(variantId)

  if (!variant) {
    notFound()
  }

  return <AntsirabeVariantShell variant={variant} />
}
