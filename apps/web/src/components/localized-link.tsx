'use client'

import type { ComponentProps } from 'react'
// import Link from 'next/link'
import { Link } from '@/i18n/navigation'

export function LocalizedLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} />
}
