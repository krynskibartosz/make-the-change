import React from 'react'
import { beforeEach, vi } from 'vitest'

export const routerPushMock = vi.fn()
export const routerRefreshMock = vi.fn()
export const pathnameMock = vi.fn()
export const searchParamsMock = vi.fn()

beforeEach(() => {
  routerPushMock.mockReset()
  routerRefreshMock.mockReset()
  pathnameMock.mockReset()
  searchParamsMock.mockReset()
  pathnameMock.mockReturnValue('/products')
  searchParamsMock.mockReturnValue(new URLSearchParams())
})

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: routerPushMock,
      refresh: routerRefreshMock,
      prefetch: vi.fn(),
      replace: vi.fn(),
    }),
    usePathname: () => pathnameMock(),
    useSearchParams: () => searchParamsMock(),
  }
})

vi.mock('next/link', () => {
  return {
    default: ({
      href,
      children,
      ...props
    }: {
      href: string | { pathname?: string }
      children: React.ReactNode
      className?: string
      tabIndex?: number
      'aria-label'?: string
    }) => {
      const resolvedHref = typeof href === 'string' ? href : href.pathname || '#'
      return React.createElement('a', { href: resolvedHref, ...props }, children)
    },
  }
})

vi.mock('next/image', () => {
  return {
    default: ({
      src,
      alt,
      fill: _fill,
      priority: _priority,
      blurDataURL: _blurDataURL,
      unoptimized: _unoptimized,
      ...props
    }: {
      src: string
      alt: string
      fill?: boolean
      priority?: boolean
      blurDataURL?: string
      unoptimized?: boolean
      [key: string]: unknown
    }) =>
      React.createElement('img', {
        src,
        alt,
        ...props,
      }),
  }
})
