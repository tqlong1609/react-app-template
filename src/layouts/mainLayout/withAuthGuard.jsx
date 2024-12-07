import { useEffect, useRef, useState } from 'react'

import { useAuthContext } from '@/providers/auth'
import { useRouter } from 'next/router'

export default function withAuthGuard(Component) {
  function WrappedComponent(props) {
    const router = useRouter()
    const { isAuthenticated } = useAuthContext()
    const ignore = useRef(false)
    const [isAuthChecked, setIsAuthChecked] = useState(false)

    useEffect(() => {
      if (!router.isReady) {
        return
      }

      if (ignore.current) {
        return
      }

      ignore.current = true

      if (!isAuthenticated) {
        router
          .replace({
            pathname: '/guest/signin',
            query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
          })
          .catch(console.error)
      } else {
        setIsAuthChecked(true)
      }
    }, [router.isReady])

    if (!isAuthChecked) {
      return null
    }

    return <Component {...props} />
  }

  return WrappedComponent
}
