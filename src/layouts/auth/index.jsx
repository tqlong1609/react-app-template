import { useEffect } from 'react'

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
          pathname: '/'
        })
        .catch(console.error)
    }
  }, [])

  return children
}
