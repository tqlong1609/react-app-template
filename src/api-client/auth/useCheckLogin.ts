import { useEffect } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { AuthService } from '@/services'
import { useQuery } from '@tanstack/react-query'

export const useCheckLogin = () => {
  const { logUserOut } = useAuth()
  const { data, error, isFetching, isError } = useQuery({
    queryKey: ['checkLogin'],
    queryFn: async () => {
      return new AuthService().checkLogin()
    },
    refetchOnWindowFocus: false,
    retry: false,
  })

  useEffect(() => {
    if (isError) {
      logUserOut()
    }
  }, [isError])

  return { data, error, isFetching, isError }
}
