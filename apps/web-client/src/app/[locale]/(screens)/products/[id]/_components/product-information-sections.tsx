'use client'

import { useState, type ReactNode } from 'react'
import type { ProductInformation } from '../../_features/mock-products'

type Props = {
  information: ProductInformation
}

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5"
        aria-expanded={isOpen}
      >
        <span className="text-[13px] font-bold text-white">{title}</span>
        <span className="text-[11px] font-semibold text-white/40" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen ? <div className="pb-4">{children}</div> : null}
    </div>
  )
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/[0.06] py-2.5 last:border-b-0">
      <dt className="text-[10px] font-bold uppercase tracking-wide text-white/40">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-semibold leading-relaxed text-white/80">{value}</dd>
    </div>
  )
}

export function ProductInformationSections({ information }: Props) {
  const hasContents = !!information.contents?.length
  const hasComposition = !!information.ingredients
  const hasSecondary =
    hasContents ||
    hasComposition ||
    !!information.sensoryNotes?.length ||
    !!information.useInstructions ||
    !!information.conservation ||
    !!information.precautions?.length ||
    !!information.nutrition

  return (
    <>
      <section>
        <h2 className="text-base font-black text-white">Informations produit</h2>
        <dl className="mt-3">
          <FactRow label="Format" value={information.formatLabel} />
          {information.origin ? <FactRow label="Origine" value={information.origin} /> : null}
          {information.packaging ? (
            <FactRow label="Conditionnement" value={information.packaging} />
          ) : null}
          {information.certification ? (
            <FactRow label="Repère qualité" value={information.certification} />
          ) : null}
        </dl>
        <p className="mt-2 text-[11px] text-white/30">
          Vérifié via{' '}
          <a
            href={information.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {information.sourceLabel}
          </a>{' '}
          · {information.verifiedAt}
        </p>
      </section>

      {hasSecondary ? (
        <section className="border-t border-white/[0.06]">
          {hasContents ? (
            <AccordionSection title="Contenu du coffret" defaultOpen>
              <ul className="space-y-2 text-[13px] font-medium leading-relaxed text-white/65">
                {information.contents!.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-lime-300" aria-hidden="true">
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionSection>
          ) : null}

          {hasComposition ? (
            <AccordionSection title="Composition" defaultOpen={!hasContents}>
              <p className="text-[13px] font-medium leading-relaxed text-white/65">
                {information.ingredients}
              </p>
            </AccordionSection>
          ) : null}

          {information.sensoryNotes?.length ? (
            <AccordionSection title="Notes aromatiques">
              <div className="flex flex-wrap gap-2">
                {information.sensoryNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-bold text-white/75"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </AccordionSection>
          ) : null}

          {information.useInstructions ? (
            <AccordionSection title="Utilisation">
              <p className="text-[13px] font-medium leading-relaxed text-white/60">
                {information.useInstructions}
              </p>
            </AccordionSection>
          ) : null}

          {information.conservation ? (
            <AccordionSection title="Conservation">
              <p className="text-[13px] font-medium leading-relaxed text-white/60">
                {information.conservation}
              </p>
            </AccordionSection>
          ) : null}

          {information.precautions?.length ? (
            <AccordionSection title="Précautions">
              <div className="space-y-2 border-l-2 border-amber-200/45 pl-3">
                {information.precautions.map((precaution) => (
                  <p
                    key={precaution}
                    className="text-[12px] font-medium leading-relaxed text-white/60"
                  >
                    {precaution}
                  </p>
                ))}
              </div>
            </AccordionSection>
          ) : null}

          {information.nutrition ? (
            <AccordionSection title="Valeurs nutritionnelles">
              <p className="mb-3 text-[11px] font-medium text-white/40">Pour 100 g</p>
              <dl>
                <FactRow
                  label="Énergie"
                  value={`${information.nutrition.energy_kj} kJ / ${information.nutrition.energy_kcal} kcal`}
                />
                <FactRow label="Matières grasses" value={`${information.nutrition.fat_g} g`} />
                <FactRow
                  label="dont saturées"
                  value={`${information.nutrition.saturated_fat_g} g`}
                />
                <FactRow label="Glucides" value={`${information.nutrition.carbs_g} g`} />
                <FactRow label="dont sucres" value={`${information.nutrition.sugars_g} g`} />
                <FactRow label="Protéines" value={`${information.nutrition.protein_g} g`} />
                <FactRow label="Sel" value={`${information.nutrition.salt_g} g`} />
              </dl>
            </AccordionSection>
          ) : null}
        </section>
      ) : null}
    </>
  )
}
