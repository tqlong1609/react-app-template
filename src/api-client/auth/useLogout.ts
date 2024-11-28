import { useAuth } from '@/providers/AuthProvider'
import { AuthService } from '@/services'
import { useMutation } from '@tanstack/react-query'

export const useLogout = () => {
  const { logUserOut } = useAuth()

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: async () => {
      return new AuthService().logout()
    },
  })

  const onLogout = () => {
    mutate()
    logUserOut()
  }

  return [onLogout, { isPending, data, error }] as const
}
