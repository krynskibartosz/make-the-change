import { Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'

export default function ContactPage() {
  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Support</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Contact</h1>
          </div>
        </div>

        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">
              Une question ? Écrivez-nous et nous vous répondrons rapidement.
            </p>

            <a
              href="mailto:contact@make-the-change.com"
              className="flex items-center justify-between gap-3 rounded-2xl border bg-background/60 p-4 transition hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">contact@make-the-change.com</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </a>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:contact@make-the-change.com?subject=Support%20Make%20the%20CHANGE">
                  Envoyer un email
                </a>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/faq">Voir la FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
