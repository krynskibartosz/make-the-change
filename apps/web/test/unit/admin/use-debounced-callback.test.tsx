import { act, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDebouncedCallback } from '@/app/[locale]/admin/(dashboard)/components/hooks/use-debounced-callback'

describe('useDebouncedCallback', () => {
  it('debounces calls and only executes the last invocation', () => {
    vi.useFakeTimers()
    const fn = vi.fn()

    const Test = () => {
      const debounced = useDebouncedCallback((v: string) => fn(v), 200)
      ;(globalThis as unknown as { debounced?: (v: string) => void }).debounced = debounced
      return null
    }

    render(<Test />)

    act(() => {
      ;(globalThis as unknown as { debounced: (v: string) => void }).debounced('a')
      ;(globalThis as unknown as { debounced: (v: string) => void }).debounced('b')
      ;(globalThis as unknown as { debounced: (v: string) => void }).debounced('c')
    })

    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(fn).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')

    vi.useRealTimers()
  })
})
