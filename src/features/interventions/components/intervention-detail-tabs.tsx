'use client'

import { useState } from 'react'

export type InterventionDetailTab = {
  id: string
  label: string
  content: React.ReactNode
}

type InterventionDetailTabsProps = {
  tabs: InterventionDetailTab[]
}

export function InterventionDetailTabs({ tabs }: InterventionDetailTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)

  return (
    <div className="flex flex-col w-full">
      <div className="sticky top-0 z-10 w-full overflow-x-auto border-b border-border bg-surfaceElevated/95 backdrop-blur-md">
        <div className="flex min-w-max px-4">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="w-full">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}
