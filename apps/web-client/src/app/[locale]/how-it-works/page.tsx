import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@make-the-change/core/ui'
import { ArrowRight, Check, CreditCard, Crown, Gift, Leaf, Search, Shield } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { placeholderImages } from '@/lib/placeholder-images'

export default async function HowItWorksPage() {
  const t = await getTranslations('how_it_works')

  return (
    <>
      <PageHero
        badge="Guide"
        title={t('title')}
        description={t('subtitle')}
        hideDescriptionOnMobile
        size="md"
        variant="gradient"
      />

      <SectionContainer size="lg">
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          <Card className="relative min-w-[240px] overflow-hidden border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Search className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('steps.choose.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {t('steps.choose.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="relative min-w-[240px] overflow-hidden border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('steps.invest.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {t('steps.invest.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="relative min-w-[240px] overflow-hidden border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Gift className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('steps.enjoy.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="hidden sm:block text-sm text-muted-foreground">
                {t('steps.enjoy.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Le parcours en images"
        description="Chaque etape est concue pour maximiser l'impact et la transparence."
        hideDescriptionOnMobile
        size="lg"
        variant="muted"
      >
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {[
            {
              title: 'Selectionnez un projet',
              image: placeholderImages.projects[0],
            },
            {
              title: 'Investissez en confiance',
              image: placeholderImages.projects[1],
            },
            {
              title: 'Suivez votre impact',
              image: placeholderImages.projects[2],
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="group min-w-[240px] overflow-hidden border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0"
            >
              <div className="relative h-40 w-full sm:h-44">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer title={t('tiers.title')} size="lg">
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {/* Explorer */}
          <Card className="min-w-[260px] border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Leaf className="h-7 w-7 text-slate-600 dark:text-slate-400" />
              </div>
              <CardTitle>{t('tiers.explorer.title')}</CardTitle>
              <CardDescription className="hidden sm:block">
                {t('tiers.explorer.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <span className="text-4xl font-bold">{t('tiers.explorer.price')}</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Accès à tous les projets
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Suivi de l'impact
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Newsletter mensuelle
                </li>
              </ul>
              <Link href="/register" className="mt-6 block">
                <Button variant="outline" className="w-full">
                  Commencer gratuitement
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Protector */}
          <Card className="relative min-w-[260px] border-primary/50 bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Populaire</Badge>
            </div>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('tiers.protector.title')}</CardTitle>
              <CardDescription className="hidden sm:block">
                {t('tiers.protector.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <span className="text-4xl font-bold">{t('tiers.protector.price')}</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Tout Explorer inclus
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Bonus de points (30-50%)
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Certificat d'investissement
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Accès prioritaire aux projets
                </li>
              </ul>
              <Link href="/projects" className="mt-6 block">
                <Button className="w-full">Voir les projets</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Ambassador */}
          <Card className="min-w-[260px] border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl md:min-w-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Crown className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>{t('tiers.ambassador.title')}</CardTitle>
              <CardDescription className="hidden sm:block">
                {t('tiers.ambassador.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-center">
                <span className="text-4xl font-bold">{t('tiers.ambassador.price')}</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Tout Protecteur inclus
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Points mensuels automatiques
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Événements exclusifs
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Support prioritaire
                </li>
              </ul>
              <Link href="/register" className="mt-6 block">
                <Button variant="outline" className="w-full">
                  Devenir Ambassadeur
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>

      <SectionContainer variant="muted" size="lg">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Prêt à commencer ?</h2>
          <p className="mx-auto mb-8 hidden max-w-2xl text-muted-foreground sm:block">
            Rejoignez des milliers d'investisseurs engagés pour la biodiversité.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Créer mon compte
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explorer les projets
              </Button>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
