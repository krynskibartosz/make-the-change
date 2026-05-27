import type { ProductInformation } from '../../_features/mock-products'

type Props = {
  information: ProductInformation
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-white/[0.06] py-3 last:border-b-0">
      <dt className="shrink-0 text-[12px] font-semibold text-white/45">{label}</dt>
      <dd className="text-right text-[13px] font-semibold leading-relaxed text-white/80">
        {value}
      </dd>
    </div>
  )
}

export function ProductInformationSections({ information }: Props) {
  return (
    <>
      <section>
        <h2 className="text-base font-black text-white">Informations produit</h2>
        <dl className="mt-3 border-y border-white/[0.06]">
          <FactRow label="Format" value={information.formatLabel} />
          {information.origin ? <FactRow label="Origine" value={information.origin} /> : null}
          {information.ingredients ? (
            <FactRow label="Composition" value={information.ingredients} />
          ) : null}
          {information.packaging ? (
            <FactRow label="Conditionnement" value={information.packaging} />
          ) : null}
          {information.certification ? (
            <FactRow label="Repère" value={information.certification} />
          ) : null}
        </dl>
      </section>

      {information.sensoryNotes?.length ? (
        <section>
          <h2 className="text-base font-black text-white">Notes aromatiques</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {information.sensoryNotes.map((note) => (
              <span
                key={note}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-bold text-white/75"
              >
                {note}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {information.contents?.length ? (
        <section>
          <h2 className="text-base font-black text-white">Contenu du coffret</h2>
          <ul className="mt-3 space-y-2 text-[13px] font-medium leading-relaxed text-white/65">
            {information.contents.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-lime-300" aria-hidden="true">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {information.conservation || information.useInstructions ? (
        <section className="space-y-4">
          {information.useInstructions ? (
            <div>
              <h2 className="text-base font-black text-white">Utilisation</h2>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/60">
                {information.useInstructions}
              </p>
            </div>
          ) : null}
          {information.conservation ? (
            <div>
              <h2 className="text-base font-black text-white">Conservation</h2>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/60">
                {information.conservation}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {information.precautions?.length ? (
        <section className="border-l-2 border-amber-200/45 pl-3">
          <h2 className="text-sm font-black text-white">À savoir</h2>
          {information.precautions.map((precaution) => (
            <p
              key={precaution}
              className="mt-2 text-[12px] font-medium leading-relaxed text-white/60"
            >
              {precaution}
            </p>
          ))}
        </section>
      ) : null}

      {information.nutrition ? (
        <details className="group border-y border-white/[0.06] py-4">
          <summary className="cursor-pointer list-none text-base font-black text-white">
            Valeurs nutritionnelles
            <span className="float-right text-sm font-semibold text-white/40 group-open:hidden">
              +
            </span>
            <span className="float-right hidden text-sm font-semibold text-white/40 group-open:inline">
              -
            </span>
          </summary>
          <p className="mt-2 text-[11px] font-medium text-white/40">Pour 100 g</p>
          <dl className="mt-3">
            <FactRow
              label="Énergie"
              value={`${information.nutrition.energy_kj} kJ / ${information.nutrition.energy_kcal} kcal`}
            />
            <FactRow label="Matières grasses" value={`${information.nutrition.fat_g} g`} />
            <FactRow label="dont saturées" value={`${information.nutrition.saturated_fat_g} g`} />
            <FactRow label="Glucides" value={`${information.nutrition.carbs_g} g`} />
            <FactRow label="dont sucres" value={`${information.nutrition.sugars_g} g`} />
            <FactRow label="Protéines" value={`${information.nutrition.protein_g} g`} />
            <FactRow label="Sel" value={`${information.nutrition.salt_g} g`} />
          </dl>
        </details>
      ) : null}
    </>
  )
}
