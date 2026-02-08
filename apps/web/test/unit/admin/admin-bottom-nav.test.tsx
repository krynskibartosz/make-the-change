import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminBottomNav } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-bottom-nav'

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/admin/orders',
}))

vi.mock('@/components/localized-link', () => ({
  LocalizedLink: ({
    href,
    className,
    children,
  }: {
    href: string
    className?: string
    children: React.ReactNode
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('AdminBottomNav', () => {
  it('renders main admin sections and highlights active item', () => {
    render(<AdminBottomNav />)

    const orders = screen.getByRole('link', { name: /commandes/i })
    expect(orders).toBeInTheDocument()
    expect(orders.className).toContain('text-primary')

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /produits/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projets/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /partenaires/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument()
  })
})
