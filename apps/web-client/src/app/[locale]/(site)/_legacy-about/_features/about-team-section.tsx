import { Button } from '@make-the-change/core/ui'
import { BarChart3, Globe, Sparkles } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'
import type { AboutTeamProps } from './about.types'

export function AboutTeamSection({ title, subtitle, gregory, bartosz }: AboutTeamProps) {
  return (
    <SectionContainer size="lg" className="relative pb-24 lg:pb-32">
      <div className="mb-16 lg:mb-24 text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 lg:mb-6">{title}</h2>
        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="space-y-20 lg:space-y-32">
        {/* Row: Gregory Steisel */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          {/* Image Column */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-[2.5rem] lg:rounded-[3rem] blur-2xl opacity-20 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] border border-border/50 lg:hover:border-primary/50 transition-all duration-500 shadow-xl lg:shadow-2xl bg-muted/20 aspect-[3/4] min-h-[400px] lg:min-h-[500px]">
              <img
                src="/team/greg.png"
                alt="Gregory Steisel"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 filter grayscale brightness-75 lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-60 transition-opacity duration-500" />

              {/* Mobile-only overlay name */}
              <div className="absolute bottom-6 left-6 lg:hidden">
                <h3 className="text-3xl font-black text-marketing-overlay-light">
                  Gregory Steisel
                </h3>
                <p className="text-marketing-overlay-light/80 font-medium">{gregory.role}</p>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 px-2 lg:px-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              {gregory.badge}
            </div>

            <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-none lg:block hidden">
              Gregory <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-marketing-gradient-mid-400">
                Steisel
              </span>
            </h3>

            <div className="text-xl font-medium text-foreground/80 lg:block hidden">
              {gregory.role}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="block mb-4 text-foreground font-semibold italic border-l-4 border-primary pl-4">
                {gregory.quote}
              </span>
              {gregory.bio}
            </p>

            <div className="flex gap-4 pt-2 lg:pt-4">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-border/50 hover:bg-primary hover:text-marketing-overlay-light hover:border-primary transition-all"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/steisel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Gregory Steisel"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-border/50 hover:bg-primary hover:text-marketing-overlay-light hover:border-primary transition-all"
                asChild
              >
                <a
                  href="https://www.wexible.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Site web de Gregory Steisel"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Row: Bartosz Krynski */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          {/* Content Column - BARTOSZ: LEFT on desktop */}
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 px-2 lg:px-0 lg:text-right order-2 lg:order-1">
            <div className="flex lg:justify-end">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-marketing-gradient-mid-500/10 border border-marketing-gradient-mid-500/20 text-marketing-gradient-mid-500 text-sm font-bold uppercase tracking-widest">
                <BarChart3 className="h-4 w-4" />
                {bartosz.badge}
              </div>
            </div>

            <h3 className="text-5xl md:text-6xl font-black tracking-tight leading-none lg:block hidden">
              Bartosz <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-marketing-gradient-mid-400 to-marketing-positive-500">
                Krynski
              </span>
            </h3>

            <div className="text-xl font-medium text-foreground/80 lg:block hidden">
              {bartosz.role}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="block mb-4 text-foreground font-semibold italic lg:border-r-4 lg:border-l-0 border-l-4 border-marketing-gradient-mid-500 pl-4 lg:pl-0 lg:pr-4">
                {bartosz.quote}
              </span>
              {bartosz.bio}
            </p>

            <div className="flex gap-4 pt-2 lg:pt-4 lg:justify-end">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-border/50 hover:bg-marketing-gradient-mid-500 hover:text-marketing-overlay-light hover:border-marketing-gradient-mid-500 transition-all"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/bartosz-krynski/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Bartosz Krynski"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-border/50 hover:bg-marketing-gradient-mid-500 hover:text-marketing-overlay-light hover:border-marketing-gradient-mid-500 transition-all"
                asChild
              >
                <a
                  href="https://github.com/krynskibartosz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub de Bartosz Krynski"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-border/50 hover:bg-marketing-gradient-mid-500 hover:text-marketing-overlay-light hover:border-marketing-gradient-mid-500 transition-all"
                asChild
              >
                <a
                  href="https://bartek-portfolio.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Site web de Bartosz Krynski"
                >
                  <Globe className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Image Column - BARTOSZ: RIGHT on desktop */}
          <div className="w-full lg:w-1/2 relative group order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-bl from-marketing-gradient-mid-400/30 to-transparent rounded-[2.5rem] lg:rounded-[3rem] blur-2xl opacity-20 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] border border-border/50 lg:hover:border-marketing-gradient-mid-400/50 transition-all duration-500 shadow-xl lg:shadow-2xl bg-muted/20 aspect-[3/4] min-h-[400px] lg:min-h-[500px]">
              <img
                src="/team/bart-pc.png"
                alt="Bartosz Krynski"
                className="absolute inset-0 w-full h-full object-cover -rotate-90 scale-[1.35] transition-all duration-700 filter grayscale brightness-75 lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent opacity-60 lg:opacity-0 lg:group-hover:opacity-60 transition-opacity duration-500" />

              {/* Mobile-only overlay name */}
              <div className="absolute bottom-6 left-6 lg:hidden">
                <h3 className="text-3xl font-black text-marketing-overlay-light">
                  Bartosz Krynski
                </h3>
                <p className="text-marketing-overlay-light/80 font-medium">{bartosz.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
