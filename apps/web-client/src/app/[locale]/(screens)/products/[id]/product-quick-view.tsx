'use client'

import { ChevronRight, ShoppingBag, Sparkles, Truck } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useMemo, useState, useTransition } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getSellerShippingProfile } from '@/lib/mock/mock-commerce'
import { getLocalizedContent } from '@/lib/utils'
import { addProductToCartAction } from '../_features/mock-commerce-actions'
import { ProductGallery } from './_components/product-gallery'
import { ProductInformationSections } from './_components/product-information-sections'
import { ProductRelated } from './_components/product-related'
import { ProductReviews } from './_components/product-reviews'
import type { ProductWithRelations } from './product-detail-data'

export type ProductFormat = {
  id: string
  label: string
  euros: number
  stock: number
  imageUrl: string
}

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(value)

const CREDITS_PER_EUR = 10

export function ProductQuickView({
  product,
  relatedProducts = [],
}: {
  product: ProductWithRelations
  relatedProducts?: ProductWithRelations[]
}) {
  const locale = useLocale()
  const router = useRouter()

  const formats = useMemo<ProductFormat[]>(
    () =>
      product.variants?.map((variant) => ({
        id: variant.id,
        label: variant.format_label,
        euros: variant.price_eur_equivalent,
        stock: variant.stock_quantity,
        imageUrl: variant.image_url ?? product.image_url,
      })) ?? [
        {
          id: product.id,
          label: product.productInformation.formatLabel,
          euros: product.price_eur_equivalent,
          stock: product.stock_quantity,
          imageUrl: product.image_url,
        },
      ],
    [product],
  )

  const [selectedFormat, setSelectedFormat] = useState<ProductFormat>(
    () => formats.find((format) => format.id === product.id) ?? formats[0]!,
  )
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [separateShipmentConfirmation, setSeparateShipmentConfirmation] = useState(false)
  const [isPending, startTransition] = useTransition()

  const shipping = getSellerShippingProfile(product.producer_id)
  const isConfirmationRequired = product.availabilityStatus === 'confirmation_required'
  const producerName = product.producer.name_default

  const baseProductName = getLocalizedContent(product.name_i18n, locale, product.name_default)
  const productName =
    formats.length > 1
      ? `${baseProductName.replace(/\s*250\s?g$/i, '')} ${selectedFormat.label}`
      : baseProductName

  const productDescription = getLocalizedContent(
    product.description_i18n,
    locale,
    product.description_default,
  )
  const shortDescription =
    getLocalizedContent(
      product.short_description_i18n ?? null,
      locale,
      product.short_description_default ?? '',
    ) || null

  const productInformation = useMemo(
    () => ({ ...product.productInformation, formatLabel: selectedFormat.label }),
    [product.productInformation, selectedFormat.label],
  )

  const galleryImages = useMemo(
    () => (product.images.length > 1 ? product.images : [selectedFormat.imageUrl]),
    [product.images, selectedFormat.imageUrl],
  )

  const producerPortrait = product.producer.visualAssets?.portrait
    ? sanitizeImageUrl(product.producer.visualAssets.portrait)
    : null

  const creditsImpact = Math.round(selectedFormat.euros * CREDITS_PER_EUR)

  function addToCart(confirmSeparateShipment = false) {
    startTransition(async () => {
      const result = await addProductToCartAction(selectedFormat.id, confirmSeparateShipment)
      if (result.ok) {
        router.push('/products/cart')
        return
      }
      if (result.reason === 'separate_shipping_confirmation') {
        setSeparateShipmentConfirmation(true)
      }
    })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0B0F15]">
      <div data-modal-scroll-root className="flex-1 overflow-y-auto overscroll-contain pb-36">
        <ProductGallery
          images={galleryImages}
          selectedIndex={selectedMediaIndex}
          onSelect={setSelectedMediaIndex}
          productName={productName}
          productId={product.id}
        />

        <div className="px-4 pt-5">
          <h1 className="text-[28px] font-black leading-tight text-white">{productName}</h1>

          {shortDescription ? (
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/55">
              {shortDescription}
            </p>
          ) : null}

          <p className="mt-3 text-[24px] font-black text-white">
            {formatEuro(selectedFormat.euros)}
          </p>
          {isConfirmationRequired ? (
            <p className="mt-1 text-[11px] font-semibold text-white/45">
              Prix partenaire observé le 27 mai 2026
            </p>
          ) : null}
          {isConfirmationRequired ? (
            <div className="mt-4 rounded-xl border border-amber-200/20 bg-amber-200/[0.06] px-3 py-2.5">
              <p className="text-[12px] font-bold text-amber-100">Disponibilité à confirmer</p>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-amber-100/70">
                {product.availabilityNotice} Ajout au panier simulé.
              </p>
            </div>
          ) : null}

          {formats.length > 1 ? (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-white/40">
                Format
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choisir le format">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    type="button"
                    aria-pressed={format.id === selectedFormat.id}
                    onClick={() => {
                      setSelectedFormat(format)
                      setSelectedMediaIndex(0)
                    }}
                    className={`rounded-xl border px-4 py-2.5 text-[13px] font-bold transition-colors ${
                      format.id === selectedFormat.id
                        ? 'border-lime-300 bg-lime-300/10 text-lime-300'
                        : 'border-white/15 bg-white/[0.04] text-white/70'
                    }`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div
            className={`mt-4 grid ${productInformation.origin ? 'grid-cols-3' : 'grid-cols-2'} divide-x divide-white/[0.08] rounded-xl border border-white/[0.08] bg-white/[0.03] py-3`}
          >
            <div className="px-3">
              <p className="text-[10px] font-bold uppercase text-white/40">Livraison BE</p>
              <p className="mt-1 text-[11px] font-semibold leading-snug text-white/80">
                {shipping?.deliveryLabel ?? 'À confirmer'}
              </p>
            </div>
            {productInformation.origin ? (
              <div className="px-3">
                <p className="text-[10px] font-bold uppercase text-white/40">Origine</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-white/80">
                  {productInformation.origin}
                </p>
              </div>
            ) : null}
            <div className="px-3">
              <p className="text-[10px] font-bold uppercase text-white/40">Retours et SAV</p>
              <p className="mt-1 text-[11px] font-semibold leading-snug text-white/80">
                Avant paiement
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/producers/${product.producer.slug ?? product.producer.id}`}
          className="mt-5 flex items-center gap-3 border-y border-white/5 px-4 py-4"
        >
          {producerPortrait ? (
            <img
              src={producerPortrait}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full border border-white/10 bg-white object-contain p-1"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase text-white/40">Vendu et expédié par</p>
            <p className="mt-1 text-sm font-semibold text-white/85">{producerName} · Belgique</p>
          </div>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
        </Link>

        <div className="mx-4 mt-4 rounded-xl border border-lime-300/20 bg-lime-300/[0.04] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-lime-300" aria-hidden="true" />
              <p className="text-[13px] font-black text-lime-300">
                + {creditsImpact} Credits Impact
              </p>
            </div>
            <button type="button" className="text-[11px] font-semibold text-white/35">
              Comment ça marche →
            </button>
          </div>
          <p className="mt-2 text-[12px] font-medium leading-relaxed text-white/55">
            Chaque achat génère des crédits que tu peux réinvestir dans de nouveaux projets de
            terrain.
          </p>
        </div>

        <div className="space-y-7 px-4 pt-6">
          <section>
            <h2 className="text-base font-black text-white">À propos de ce produit</h2>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-white/65">
              {productDescription}
            </p>
          </section>

          <ProductInformationSections information={productInformation} />

          {shipping && (
            <section className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-lime-300" aria-hidden="true" />
                <h2 className="text-sm font-black text-white">Livraison en Belgique</h2>
              </div>
              <p className="mt-3 text-sm font-medium text-white/65">
                {shipping.deliveryLabel} · offerte dès {formatEuro(shipping.freeThresholdEur)}
              </p>
              {shipping.feeStatus === 'prototype_estimate' && (
                <p className="mt-2 text-[12px] font-medium text-amber-200/75">
                  Frais sous seuil estimés pour le prototype, à confirmer par Ilanga.
                </p>
              )}
            </section>
          )}

          <section>
            <h2 className="text-base font-black text-white">Conditions et retours</h2>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/55">
              Le partenaire vendeur assure l&apos;expédition, le SAV et les retours. Les conditions
              détaillées sont accessibles avant le paiement simulé.
            </p>
          </section>
        </div>

        <ProductReviews />

        <ProductRelated products={relatedProducts} producerName={producerName} />
      </div>

      {separateShipmentConfirmation && (
        <div className="absolute inset-x-4 bottom-24 z-30 rounded-2xl border border-white/10 bg-[#181D24] p-4 shadow-2xl">
          <p className="text-sm font-bold text-white">Expédition séparée</p>
          <p className="mt-1 text-[13px] text-white/55">
            Ce produit sera vendu et expédié séparément par {producerName}. Ses frais de livraison
            et conditions s&apos;appliquent séparément.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setSeparateShipmentConfirmation(false)}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-bold text-white/65"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => addToCart(true)}
              className="flex-1 rounded-xl bg-lime-300 py-3 text-sm font-black text-[#0B0F15]"
            >
              {isConfirmationRequired ? `Simuler l'ajout` : 'Ajouter au panier'}
            </button>
          </div>
        </div>
      )}

      <footer className="shrink-0 border-t border-white/5 bg-[#0B0F15]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mb-2 flex items-end justify-between px-1">
          <p className="text-[11px] font-semibold text-white/48">
            {isConfirmationRequired ? 'Simulation panier' : selectedFormat.label}
          </p>
          <p className="text-lg font-black text-white">{formatEuro(selectedFormat.euros)}</p>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={() => addToCart()}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 px-3 py-4 text-[15px] font-black text-[#0B0F15] disabled:opacity-60"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {isPending
            ? 'Ajout en cours...'
            : isConfirmationRequired
              ? `Simuler l'ajout`
              : 'Ajouter au panier'}
        </button>
      </footer>
    </div>
  )
}
