'use client'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@make-the-change/core/ui'
import { Calendar, MapPin, Search, Target, TrendingUp, ArrowRight } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn, formatPoints, formatCurrency } from '@/lib/utils'

interface Project {
  id: string
  slug: string
  name_default: string
  description_default: string
  target_budget: number | null
  current_funding: number | null
  address_city: string | null
  address_country_code: string | null
  featured: boolean
  launch_date: string | null
  status: string
  hero_image_url: string | null
}

interface ProjectsClientProps {
  projects: any[] // Using any for now to avoid strict type issues with Supabase result, but ideally should match Project
  initialStatus: string
  initialSearch: string
}

export function ProjectsClient({ projects, initialStatus, initialSearch }: ProjectsClientProps) {
  const t = useTranslations('projects')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        updateFilters(search, status)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search, initialSearch, status])

  const updateFilters = (newSearch: string, newStatus: string) => {
    const params = new URLSearchParams()
    if (newSearch) params.set('search', newSearch)
    if (newStatus && newStatus !== 'all') params.set('status', newStatus)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    updateFilters(search, newStatus)
  }

  const calculateProgress = (current: number | null, target: number | null) => {
    if (!target || target === 0) return 0
    return Math.min(((current || 0) / target) * 100, 100)
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl shadow-sm border">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('filter.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: t('filter.status.all') },
            { id: 'active', label: t('filter.status.active') },
            { id: 'completed', label: t('filter.status.completed') },
          ].map((option) => (
            <Button
              key={option.id}
              variant={status === option.id ? 'default' : 'outline'}
              onClick={() => handleStatusChange(option.id)}
              className="whitespace-nowrap"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed">
          <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-2xl font-bold mb-2">{t('empty')}</h2>
          <p className="text-muted-foreground max-w-md">
            {t('filter.empty_description')}
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearch('')
              setStatus('all')
              updateFilters('', 'all')
            }}
            className="mt-6"
          >
            {t('filter.reset_filters')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const progress = calculateProgress(project.current_funding, project.target_budget)
            
            return (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 border-muted bg-card">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.hero_image_url ? (
                      <img
                        src={project.hero_image_url}
                        alt={project.name_default}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary/20">
                        <Target className="h-16 w-16" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      {project.featured && (
                        <Badge variant="secondary" className="font-bold shadow-sm backdrop-blur-md bg-white/90">
                          {t('filter.featured')}
                        </Badge>
                      )}
                      <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                        className="font-bold shadow-sm backdrop-blur-md"
                      >
                        {project.status === 'active' ? t('filter.status.active') : project.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                        {project.name_default}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1 text-primary" />
                        {project.address_city && project.address_country_code ? (
                          <span>{project.address_city}, {project.address_country_code}</span>
                        ) : (
                          <span>{t('filter.location.unspecified')}</span>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
                      {project.description_default}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-muted-foreground">{t('filter.progress.label')}</span>
                        <span className="text-primary">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground pt-1">
                        <span>{formatCurrency(project.current_funding || 0)} {t('filter.progress.collected')}</span>
                        <span>{t('filter.progress.goal')} {formatCurrency(project.target_budget || 0)}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-2 group-hover:bg-primary/90">
                      {t('filter.cta')}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
