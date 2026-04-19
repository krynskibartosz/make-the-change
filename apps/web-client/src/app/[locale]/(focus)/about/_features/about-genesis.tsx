import type { AboutGenesisProps } from './about.types'

/**
 * Parse genesis body and render {keyword} placeholders as bold white spans.
 */
function renderGenesisBody(body: string) {
  const parts = body.split(/(\{[^}]+\})/g)
  return parts.map((part, index) => {
    const match = part.match(/^\{([^}]+)\}$/)
    if (match) {
      return (
        <span key={index} className="font-medium text-white">
          {match[1]}
        </span>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export function AboutGenesis({ title, body }: AboutGenesisProps) {
  return (
    <section className="mx-auto max-w-lg px-6 py-16 text-center">
      <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
      <p className="text-base font-light leading-relaxed text-gray-300">
        {renderGenesisBody(body)}
      </p>
    </section>
  )
}
