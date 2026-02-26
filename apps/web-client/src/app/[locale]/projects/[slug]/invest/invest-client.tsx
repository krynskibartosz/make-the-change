'use client'

import { Badge, Button, Input, Separator } from '@make-the-change/core/ui'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  type LucideIcon,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { cn, formatCurrency } from '@/lib/utils'

interface Project {
  id: string
  slug: string
  name_default: string
  target_budget: number | null
  current_funding: number | null
  hero_image_url?: string | null
}

interface InvestClientProps {
  project: Project
}

const PRESET_AMOUNTS = [50, 100, 250, 500]
type StepState = 'completed' | 'active' | 'disabled'

export function InvestClient({ project }: InvestClientProps) {
  const t = useTranslations('projects.invest_page')
  const router = useRouter()
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)

  const numericAmount = parseFloat(amount) || 0
  const impactTrees = Math.floor(numericAmount / 10)
  const targetBudget = project.target_budget || 0
  const currentFunding = project.current_funding || 0
  const safeTargetBudget = targetBudget > 0 ? targetBudget : 1
  const currentProgress = Math.min((currentFunding / safeTargetBudget) * 100, 100)
  const contributionProgress = Math.min(
    (numericAmount / safeTargetBudget) * 100,
    Math.max(100 - currentProgress, 0),
  )
  const contributionPercent = ((numericAmount / safeTargetBudget) * 100).toFixed(2)

  const currentStep = 1
  const investSteps: Array<{ id: number; label: string; icon: LucideIcon }> = [
    { id: 1, label: t('steps.invest'), icon: TrendingUp },
    { id: 2, label: t('steps.payment'), icon: CreditCard },
    { id: 3, label: t('steps.confirm'), icon: ShieldCheck },
  ]
  const confirmLabel =
    numericAmount > 0
      ? t('confirm_with_amount', { amount: formatCurrency(numericAmount) })
      : t('confirm')
  const isConfirmDisabled = loading || numericAmount < 10

  const handlePresetClick = (value: number) => {
    setAmount(value.toString())
    setSelectedPreset(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    setSelectedPreset(null)
  }

  const handleBack = () => {
    router.push(`/projects/${project.slug}`)
  }

  const handleInvest = async () => {
    if (isConfirmDisabled) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push('/dashboard/investments')
    setLoading(false)
  }

  const getStepState = (stepId: number): StepState => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'disabled'
  }

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/20">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="flex h-full items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-full rounded-none px-4 font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back_to_project')}
          </Button>
          <Badge
            variant="secondary"
            className="mr-4 hidden max-w-[50%] truncate rounded-full border border-border/60 bg-background/80 text-muted-foreground sm:inline-flex"
          >
            {project.name_default}
          </Badge>
        </div>
      </header>

      <div className="fixed inset-x-0 top-16 z-40 h-14 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="grid h-full grid-cols-3">
          {investSteps.map((step) => {
            const stepState = getStepState(step.id)
            const isActive = stepState === 'active'
            const isCompleted = stepState === 'completed'
            const StepIcon = step.icon
            return (
              <div
                key={step.id}
                className={cn(
                  'flex h-full items-center justify-center gap-2 border-r border-border/60 px-2 text-sm font-semibold last:border-r-0',
                  isActive && 'bg-primary/10 text-foreground',
                  isCompleted && 'bg-client-emerald-500/10 text-client-emerald-500',
                  stepState === 'disabled' && 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border',
                    isActive && 'border-primary/40 bg-primary/15 text-primary',
                    isCompleted &&
                      'border-client-emerald-500/30 bg-client-emerald-500/15 text-client-emerald-500',
                    stepState === 'disabled' && 'border-border/60 bg-muted text-muted-foreground',
                  )}
                >
                  <StepIcon className="h-3.5 w-3.5" />
                </span>
                <span className="truncate">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <main className="min-h-screen pb-24 pt-[7.5rem] lg:pb-6 lg:pr-[26rem]">
        <div className="mx-3 space-y-3 md:mx-4 lg:mx-5">
          <section className="border border-border/60 bg-background/70 p-4 md:p-5">
            <div className="space-y-1 pb-4">
              <p className="text-xl font-black tracking-tight">{t('title')}</p>
              <p className="text-sm text-muted-foreground">
                {t('supporting', { project: project.name_default })}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">{t('amount_label')}</p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePresetClick(val)}
                    className={cn(
                      'relative h-12 rounded-lg border text-sm font-bold transition-colors',
                      selectedPreset === val
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/60 bg-background/70 text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {formatCurrency(val)}
                    {selectedPreset === val ? (
                      <span className="absolute -right-2 -top-2 rounded-full bg-primary p-0.5 text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">
                  €
                </span>
                <Input
                  type="number"
                  min="10"
                  step="1"
                  value={amount}
                  placeholder={t('custom_amount_placeholder')}
                  onChange={handleInputChange}
                  className="h-12 border-border/60 bg-background/80 pl-8 text-base font-semibold"
                />
              </div>

              {numericAmount >= 10 ? (
                <div className="flex items-center gap-3 border border-client-emerald-500/25 bg-client-emerald-500/10 px-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-client-emerald-500/20">
                    <TrendingUp className="h-4 w-4 text-client-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-client-emerald-500">{t('impact_title')}</p>
                    <p className="text-xs text-client-emerald-500/90">
                      {t('impact_description', { trees: impactTrees })}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t('goal_label')}</span>
                  <span>{formatCurrency(targetBudget)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary/30" style={{ width: `${currentProgress}%` }} />
                  <div
                    className="relative -mt-2 h-full bg-primary"
                    style={{ left: `${currentProgress}%`, width: `${contributionProgress}%` }}
                  />
                </div>
                {numericAmount > 0 ? (
                  <p className="text-[10px] text-muted-foreground">
                    {t('contribution_add', { percent: contributionPercent })}
                  </p>
                ) : null}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>{t('secure_payment')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t('verified_project')}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <aside className="fixed bottom-0 right-0 top-[7.5rem] z-30 hidden w-[26rem] border-l border-border/70 bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
            <div className="flex items-center gap-2 text-lg font-black tracking-tight">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>{t('confirm')}</span>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/20 bg-primary/10 text-primary"
            >
              {t('steps.confirm')}
            </Badge>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="line-clamp-2 text-muted-foreground">{project.name_default}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('amount_label')}</span>
                <span className="font-bold">{formatCurrency(Math.max(numericAmount, 0))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('impact_title')}</span>
                <span className="font-bold text-client-emerald-500">{impactTrees}</span>
              </div>
              <Separator />
              <div className="flex items-end justify-between">
                <span className="text-lg font-black uppercase tracking-tight">{t('confirm')}</span>
                <div className="text-right">
                  <div className="text-3xl font-black leading-none text-primary">
                    {formatCurrency(Math.max(numericAmount, 0))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button
                className="h-12 w-full border-none bg-linear-to-r from-primary to-client-teal-500 text-base font-bold"
                disabled={isConfirmDisabled}
                onClick={handleInvest}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t('processing')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {confirmLabel}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
              {numericAmount < 10 ? (
                <p className="text-xs font-medium text-muted-foreground">
                  {t('custom_amount_placeholder')}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t('steps.invest')}
            </p>
            <p className="text-lg font-black leading-tight text-foreground">
              {formatCurrency(Math.max(numericAmount, 0))}
            </p>
          </div>
          <Button
            type="button"
            className="h-11 min-w-[180px] border-none bg-linear-to-r from-primary to-client-teal-500 text-sm font-bold"
            disabled={isConfirmDisabled}
            onClick={handleInvest}
          >
            {loading ? t('processing') : t('confirm')}
          </Button>
        </div>
      </div>
    </div>
  )
}
