'use client'

import type { FC } from 'react'

const PartnerLoading: FC = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
    <div className="h-7 w-48 admin-skeleton mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-64 admin-skeleton rounded-xl" />
      <div className="h-64 admin-skeleton rounded-xl" />
    </div>
  </div>
)

export default PartnerLoading
