import 'react'

declare module 'react' {
  interface CSSProperties {
    /**
     * Allows any CSS custom property (--variable) in React inline styles
     * without requiring `as React.CSSProperties` type casts.
     *
     * @example
     * <div style={{ '--scroll-progress': 0.5 }} />
     */
    [key: `--${string}`]: string | number | undefined
  }
}
