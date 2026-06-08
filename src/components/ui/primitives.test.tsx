import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Badge } from './badge'
import { Button, IconButton } from './button'
import { Card } from './card'
import { ChoiceChip, StatusChip } from './chip'
import { InfoRow } from './info-row'
import { Input } from './input'
import { MetricCard } from './metric-card'
import { NumberStepper } from './number-stepper'
import { SegmentedControl } from './segmented-control'
import { StickyActionBar } from './sticky-action-bar'
import { Textarea } from './textarea'

describe('Clarus UI primitives', () => {
  it('renders touch-sized action primitives with token-backed variants', () => {
    const markup = renderToStaticMarkup(
      <>
        <Button>Enregistrer</Button>
        <IconButton aria-label="Fermer">x</IconButton>
        <StickyActionBar primaryAction={<Button>Ajouter intervention</Button>} />
      </>,
    )

    expect(markup).toContain('min-h-[var(--size-primary-button)]')
    expect(markup).toContain('size-[var(--size-icon-button)]')
    expect(markup).toContain('pb-[max(env(safe-area-inset-bottom),0.75rem)]')
    expect(markup).toContain('Ajouter intervention')
  })

  it('renders cards, badges and chips without relying on color alone', () => {
    const markup = renderToStaticMarkup(
      <Card>
        <Badge tone="warning">Supplement</Badge>
        <StatusChip status="to_check" />
        <ChoiceChip selected>Toiture</ChoiceChip>
      </Card>,
    )

    expect(markup).toContain('border-border')
    expect(markup).toContain('Supplement')
    expect(markup).toContain('A verifier')
    expect(markup).toContain('aria-pressed="true"')
  })

  it('renders labeled form controls with help and error descriptions', () => {
    const markup = renderToStaticMarkup(
      <>
        <Input error="Titre requis" help="Visible dans le journal" label="Titre" name="title" />
        <Textarea help="Note libre" label="Note" name="note" />
        <NumberStepper ariaLabel="Nombre d'heures" onChange={() => undefined} value={2} />
      </>,
    )

    expect(markup).toContain('Titre')
    expect(markup).toContain('Titre requis')
    expect(markup).toContain('Visible dans le journal')
    expect(markup).toContain('min-h-[var(--size-input)]')
    expect(markup).toContain('min-h-[var(--size-textarea)]')
    expect(markup).toContain('aria-label="Nombre d&#x27;heures"')
  })

  it('renders dashboard rows and segmented filters with explicit active state', () => {
    const markup = renderToStaticMarkup(
      <>
        <MetricCard label="Heures" value="24h30" />
        <InfoRow label="Zone" value="Cuisine" />
        <SegmentedControl
          ariaLabel="Filtre journal"
          onValueChange={() => undefined}
          options={[
            { label: 'Tout', value: 'all' },
            { label: 'A verifier', value: 'to_check' },
          ]}
          value="to_check"
        />
      </>,
    )

    expect(markup).toContain('font-mono')
    expect(markup).toContain('Cuisine')
    expect(markup).toContain('aria-label="Filtre journal"')
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).toContain('A verifier')
  })
})
