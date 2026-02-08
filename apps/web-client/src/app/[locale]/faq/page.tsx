import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { HelpCircle } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'

const faqs = [
  {
    q: 'Comment fonctionnent les points ?',
    a: 'Vous gagnez des points en soutenant des projets. Vous les utilisez ensuite pour obtenir des produits responsables.',
  },
  {
    q: 'Puis-je suivre mon impact ?',
    a: "Oui. Chaque projet affiche des indicateurs simples et des mises à jour pour suivre l'évolution.",
  },
  {
    q: 'Le paiement se fait comment ?',
    a: 'La V1 propose un checkout en points. Les autres moyens de paiement pourront arriver ensuite.',
  },
  {
    q: 'Je peux modifier mon profil public ?',
    a: 'Oui. Votre profil peut évoluer: avatar, cover, badges et informations affichées.',
  },
]

export default function FaqPage() {
  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Support</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h1>
          </div>
        </div>

        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-3 p-5 sm:p-8">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border bg-background/60 p-4 transition hover:bg-muted/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="font-semibold">{item.q}</span>
                  <Badge variant="secondary" className="rounded-full">
                    +
                  </Badge>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
