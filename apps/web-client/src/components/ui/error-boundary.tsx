'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Ignore transformAlgorithm errors as they're known Next.js 16 issues
    if (error.message.includes('transformAlgorithm') || error.message.includes('kState')) {
      console.warn('Ignoring known Next.js 16 transformAlgorithm error')
      return
    }
  }

  render() {
    if (this.state.hasError) {
      // If it's a transformAlgorithm error, just render children normally
      if (this.state.error?.message.includes('transformAlgorithm') || this.state.error?.message.includes('kState')) {
        return this.props.children
      }

      // For other errors, show a fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
