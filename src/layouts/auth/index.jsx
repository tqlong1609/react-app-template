import { useEffect } from 'react'

import { ROUTE_PATHS } from '@/configs/router'
import { useAuthContext } from '@/providers/auth'
import { useRouter } from 'next/router'

export const AuthLayout = (props) => {
  const { children } = props
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()

  useEffect(() => {
    if (isAuthenticated) {
      router
        .replace({
          pathname: ROUTE_PATHS.DASHBOARD
        })
        .catch(console.error)
    }
  }, [])

  return children
}
