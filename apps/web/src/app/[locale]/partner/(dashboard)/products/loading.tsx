'use client'

import type { FC } from 'react'

const PartnerProductsLoading: FC = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
    <div className="h-8 w-40 admin-skeleton mb-6" />
    <div className="flex gap-4 mb-6">
      <div className="h-10 w-64 admin-skeleton rounded-xl" />
      <div className="h-10 w-32 admin-skeleton rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 admin-skeleton rounded-xl" />
      ))}
    </div>
  </div>
)

export default PartnerProductsLoading
