'use client'

import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@make-the-change/core/ui'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import { getProjectDetailCtaLabel } from '../_utils/project-detail-cta'

export type ProjectDetailTabId =
  | 'overview'
  | 'impact'
  | 'producer'
  | 'rewards'
  | 'updates'
  | 'faq'

export type ProjectDetailTab = {
  id: ProjectDetailTabId
  label: string
  content: ReactNode
}

type ProjectDetailTabsProps = {
  tabs: ProjectDetailTab[]
  isFundingClosed: boolean
  isContributionProject: boolean
  closedLabel: string
  contributionCtaLabel: string
  supportCtaLabel: string
}

export function ProjectDetailTabs({
  tabs,
  isFundingClosed,
  isContributionProject,
  closedLabel,
  contributionCtaLabel,
  supportCtaLabel,
}: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailTabId>('overview')
  const tabNavRef = useRef<HTMLElement>(null)
  const ctaLabel = getProjectDetailCtaLabel({
    activeTab,
    isFundingClosed,
    isContributionProject,
    closedLabel,
    contributionCtaLabel,
    supportCtaLabel,
  })

  const handleTabClick = (tabId: ProjectDetailTabId) => {
    setActiveTab(tabId)
    requestAnimationFrame(() => {
      tabNavRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (typeof value === 'string') {
          handleTabClick(value as ProjectDetailTabId)
        }
      }}
    >
      <nav
        ref={tabNavRef}
        data-project-tabs-nav
        aria-label="Navigation du projet"
        className="sticky top-[calc(2.75rem+max(0.75rem,env(safe-area-inset-top)))] z-30 mt-5 border-b border-white/[0.05] bg-[#0B0F15]/55 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:px-5"
      >
        <TabsList className="flex h-auto gap-2 overflow-x-auto rounded-none bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-black transition-colors data-[selected]:bg-lime-400 data-[selected]:text-black data-[selected]:shadow-none text-white/48 hover:bg-white/[0.06] hover:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </nav>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className="mt-0 pb-44 sm:pb-48"
        >
          {tab.content}
        </TabsContent>
      ))}

      <BottomActionBar className="fixed bottom-0 left-0 right-0 z-40 w-full">
        {isFundingClosed ? (
          <Button
            className="h-14 w-full justify-center gap-0 rounded-2xl bg-white/10 text-center text-lg font-black text-muted-foreground hover:bg-white/10 [&_svg]:hidden"
            disabled
          >
            {ctaLabel}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-lime-400 px-4 text-center text-lg font-black text-black shadow-sm transition-transform active:scale-95"
          >
            {ctaLabel}
          </Button>
        )}
      </BottomActionBar>
    </Tabs>
  )
}
