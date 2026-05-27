'use client'

import { ChevronDown, ChevronRight, Package, ShoppingBag, Truck } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useState, useTransition } from 'react'
import { Link } from '@/i18n/navigation'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getSellerShippingProfile } from '@/lib/mock/mock-commerce'
import { getLocalizedContent } from '@/lib/utils'
import { addProductToCartAction } from '../_features/mock-commerce-actions'
import { ProductInformationSections } from './_components/product-information-sections'
import { ProductShareButton } from './_components/product-share-button'
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

export function ProductQuickView({ product }: { product: ProductWithRelations }) {
  const locale = useLocale()
  const formats: ProductFormat[] = product.variants?.map((variant) => ({
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
  ]
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat>(
    () => formats.find((format) => format.id === product.id) ?? formats[0]!,
  )
  const [separateShipmentConfirmation, setSeparateShipmentConfirmation] = useState(false)
  const [isPending, startTransition] = useTransition()
  const shipping = getSellerShippingProfile(product.producer_id)
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
  const producerName = product.producer.name_default
  const coverImage = sanitizeImageUrl(selectedFormat.imageUrl)
  const productInformation = {
    ...product.productInformation,
    formatLabel: selectedFormat.label,
  }
  const producerPortrait = product.producer.visualAssets?.portrait
    ? sanitizeImageUrl(product.producer.visualAssets.portrait)
    : null

  function addToCart(confirmSeparateShipment = false) {
    startTransition(async () => {
      const result = await addProductToCartAction(selectedFormat.id, confirmSeparateShipment)
      if (result.ok) {
        window.location.assign(`/${locale}/products/cart`)
        return
      }
      if (result.reason === 'separate_shipping_confirmation') {
        setSeparateShipmentConfirmation(true)
      }
    })
  }

  return (
    <div className="relative flex h-full flex-col bg-[#0B0F15]">
      <div data-modal-scroll-root className="flex-1 overflow-y-auto overscroll-contain pb-28">
        <div className="relative aspect-[4/5] max-h-[440px] w-full overflow-hidden border-b border-white/10 bg-white/5">
          {coverImage ? (
            <img src={coverImage} alt={productName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-16 w-16 text-white/25" aria-hidden="true" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-transparent to-black/40" />
          <div className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))]">
            <ProductShareButton productName={productName} productId={product.id} />
          </div>
        </div>

        <div className="px-4 pt-5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-lime-300/75">
            {product.kind === 'bundle' ? 'Coffret partenaire' : product.category.name_default}
          </p>
          <h1 className="mt-2 text-[28px] font-black leading-tight text-white">{productName}</h1>
          <p className="mt-3 text-[24px] font-black text-white">
            {formatEuro(selectedFormat.euros)}
          </p>
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
              Le partenaire vendeur assure l’expédition, le SAV et les retours. Les conditions
              détaillées sont accessibles avant le paiement simulé.
            </p>
          </section>
        </div>
      </div>

      {separateShipmentConfirmation && (
        <div className="absolute inset-x-4 bottom-24 z-30 rounded-2xl border border-white/10 bg-[#181D24] p-4 shadow-2xl">
          <p className="text-sm font-bold text-white">Expédition séparée</p>
          <p className="mt-1 text-[13px] text-white/55">
            Ce produit sera vendu et expédié séparément par {producerName}. Ses frais de livraison
            et conditions s’appliquent séparément.
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
              Ajouter au panier
            </button>
          </div>
        </div>
      )}

      <footer className="shrink-0 border-t border-white/5 bg-[#0B0F15]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-stretch gap-2">
          {formats.length > 1 ? (
            <label className="relative shrink-0">
              <span className="sr-only">Choisir le format</span>
              <select
                aria-label="Choisir le format"
                value={selectedFormat.id}
                onChange={(event) => {
                  const nextFormat = formats.find((format) => format.id === event.target.value)
                  if (nextFormat) setSelectedFormat(nextFormat)
                }}
                className="h-full min-h-14 appearance-none rounded-2xl border border-white/10 bg-white/[0.05] py-3 pl-4 pr-9 text-sm font-bold text-white"
              >
                {formats.map((format) => (
                  <option key={format.id} value={format.id} className="bg-[#181D24]">
                    {format.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45"
                aria-hidden="true"
              />
            </label>
          ) : null}
          <button
            type="button"
            disabled={isPending}
            onClick={() => addToCart()}
            className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-3 py-4 text-[15px] font-black text-[#0B0F15] disabled:opacity-60"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {isPending ? 'Ajout en cours...' : 'Ajouter au panier'}
          </button>
        </div>
      </footer>
    </div>
  )
}
