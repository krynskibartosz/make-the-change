import { Card, CardContent } from '@make-the-change/core/ui'
import { SectionContainer } from '@/components/ui/section-container'

export default function TermsPage() {
  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10"
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Légal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Conditions</h1>
        </div>

        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-6 text-sm leading-relaxed text-muted-foreground sm:p-8">
            <p>En utilisant Make the CHANGE, vous acceptez nos conditions d’utilisation.</p>
            <p>
              Les contenus, points et classements peuvent évoluer. Nous faisons au mieux pour garder
              une expérience claire, transparente et sécurisée.
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
