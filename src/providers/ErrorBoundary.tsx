import { ErrorInfo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import ErrorFallback from '@/components/ErrorLayout'

export default function ErrorBoundaryWrapper(props: any) {
  const logError = (error: Error, info: ErrorInfo) => {
    // Do something with the error, e.g. log to an external API
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {props.children}
    </ErrorBoundary>
  )
}
