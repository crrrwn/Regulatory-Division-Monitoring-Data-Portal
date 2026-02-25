import React from 'react'

/**
 * React Error Boundary - catches runtime errors and prevents full app crash.
 * Shows a fallback UI instead of a blank/white screen when something goes wrong.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f5] p-6 text-center">
          <div className="max-w-md w-full rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg p-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
              <iconify-icon icon="mdi:alert-circle" width="32" className="text-amber-600"></iconify-icon>
            </div>
            <h1 className="text-xl font-bold text-[#1e4d2b] mb-2">Something went wrong</h1>
            <p className="text-sm text-[#5c7355] mb-6">
              The page encountered an unexpected error. Please refresh or go back to the dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 bg-[#1e4d2b] text-white rounded-xl font-semibold text-sm hover:bg-[#153019] transition-colors"
              >
                Refresh Page
              </button>
              <a
                href="/dashboard"
                className="px-4 py-2.5 bg-[#b8a066] text-[#153019] rounded-xl font-semibold text-sm hover:bg-[#d4c4a0] transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
