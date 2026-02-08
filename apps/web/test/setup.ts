import '@testing-library/jest-dom/vitest'

// jsdom does not implement matchMedia; many responsive components rely on it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Some UI primitives rely on ResizeObserver.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

;(globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver = ResizeObserverMock
