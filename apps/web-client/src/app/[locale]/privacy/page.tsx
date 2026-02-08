import { Card, CardContent } from '@make-the-change/core/ui'
import { SectionContainer } from '@/components/ui/section-container'

export default function PrivacyPage() {
  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Légal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Confidentialité</h1>
        </div>

        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-6 text-sm leading-relaxed text-muted-foreground sm:p-8">
            <p>
              Nous collectons uniquement les informations nécessaires au bon fonctionnement de
              l’application (compte, commandes, suivi d’impact).
            </p>
            <p>
              Nous ne vendons pas vos données. Les informations sensibles ne sont pas affichées sur
              les pages publiques.
            </p>
            <p>
              Pour toute question:{' '}
              <a
                className="text-primary underline-offset-4 hover:underline"
                href="mailto:contact@make-the-change.com"
              >
                contact@make-the-change.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
