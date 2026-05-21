'use client'

import dynamic from 'next/dynamic'

export const AtlasPrototypeLoader = dynamic(
  () => import('./prototype/atlas-app').then((mod) => mod.AtlasPrototypeClient),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 grid min-h-[100dvh] place-items-center bg-[#04060a] text-[#eae3d2]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f4d889] border-t-transparent" />
      </div>
    ),
  },
)
