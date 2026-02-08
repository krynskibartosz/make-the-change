import { describe, expect, it } from 'vitest'
import { buildUpdatedSearchParams } from '@/app/[locale]/admin/(dashboard)/components/utils/search-params'

describe('buildUpdatedSearchParams', () => {
  it('removes params when value is undefined, null, empty string, or "all"', () => {
    const current = 'q=hello&status=pending&role=explorateur&page=3'
    const next = buildUpdatedSearchParams(current, {
      q: '',
      status: 'all',
      role: undefined,
    })

    expect(next.get('q')).toBeNull()
    expect(next.get('status')).toBeNull()
    expect(next.get('role')).toBeNull()
  })

  it('resets page to 1 when page is not explicitly updated', () => {
    const current = 'q=hello&page=4'
    const next = buildUpdatedSearchParams(current, { status: 'pending' })
    expect(next.get('page')).toBe('1')
  })

  it('does not reset page when page is explicitly updated', () => {
    const current = 'q=hello&page=4'
    const next = buildUpdatedSearchParams(current, { page: '2' })
    expect(next.get('page')).toBe('2')
  })
})
