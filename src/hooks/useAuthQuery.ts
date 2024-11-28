import { useAuth } from '@/providers/AuthProvider'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

const useAuthQuery = (options: UseQueryOptions) => {
  const { logUserOut } = useAuth()
  const query = useQuery(options)
  if (query.error) {
    if (query.error.message === 'Unauthorized') {
      logUserOut()
    }
  }
  return query
}

export default useAuthQuery
