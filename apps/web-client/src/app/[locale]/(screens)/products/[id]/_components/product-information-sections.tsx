'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@make-the-change/core/ui'
import type { ProductInformation } from '../../_features/mock-products'

type Props = {
  information: ProductInformation
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

  const defaultOpenSections: string[] = []
  if (hasContents) defaultOpenSections.push('contenu-coffret')
  else if (hasComposition) defaultOpenSections.push('composition')

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
          <Accordion
            type="multiple"
            defaultValue={defaultOpenSections}
          >
            {hasContents ? (
              <AccordionItem value="contenu-coffret" className="border-b border-white/[0.06] last:border-b-0 border-t-0">
                <AccordionTrigger className="flex w-full items-center justify-between py-3.5 text-[13px] font-bold text-white hover:no-underline">
                  Contenu du coffret
                </AccordionTrigger>
                <AccordionContent className="pb-4">
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
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {hasComposition ? (
              <AccordionItem value="composition" className="border-b border-white/[0.06] last:border-b-0 border-t-0">
                <AccordionTrigger className="flex w-full items-center justify-between py-3.5 text-[13px] font-bold text-white hover:no-underline">
                  Composition
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-[13px] font-medium leading-relaxed text-white/65">
                    {information.ingredients}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {information.sensoryNotes?.length ? (
              <AccordionItem value="notes-aromatiques" className="border-b border-white/[0.06] last:border-b-0 border-t-0">
                <AccordionTrigger className="flex w-full items-center justify-between py-3.5 text-[13px] font-bold text-white hover:no-underline">
                  Notes aromatiques
                </AccordionTrigger>
                <AccordionContent className="pb-4">
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
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {information.useInstructions ? (
              <AccordionItem value="utilisation" className="border-b border-white/[0.06] last:border-b-0 border-t-0">
                <AccordionTrigger className="flex w-full items-center justify-between py-3.5 text-[13px] font-bold text-white hover:no-underline">
                  Utilisation
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-[13px] font-medium leading-relaxed text-white/60">
                    {information.useInstructions}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {information.conservation ? (
              <AccordionItem value="conservation" className="border-b border-white/[0.06] last:border-b-0 border-t-0">
                <AccordionTrigger className="flex w-full items-center justify-between py-3.5 text-[13px] font-bold text-white hover:no-underline">
                  Conservation
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-[13px] font-medium leading-relaxed text-white/60">
                    {information.conservation}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {information.precautions?.length ? (
              <AccordionItem value="precautions" className="border-b border-white/[0.06] last:border-b-0 border-t-0">
                <AccordionTrigger className="flex w-full items-center justify-between py-3.5 text-[13px] font-bold text-white hover:no-underline">
                  Précautions
                </AccordionTrigger>
                <AccordionContent className="pb-4">
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
                </AccordionContent>
              </AccordionItem>
            ) : null}

            {information.nutrition ? (
              <AccordionItem value="valeurs-nutritionnelles" className="border-b border-white/[0.06] last:border-b-0 border-t-0">
                <AccordionTrigger className="flex w-full items-center justify-between py-3.5 text-[13px] font-bold text-white hover:no-underline">
                  Valeurs nutritionnelles
                </AccordionTrigger>
                <AccordionContent className="pb-4">
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
                </AccordionContent>
              </AccordionItem>
            ) : null}
          </Accordion>
        </section>
      ) : null}
    </>
  )
}
