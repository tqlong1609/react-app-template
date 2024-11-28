import { useAuth } from '@/providers/AuthProvider'
import { AuthService } from '@/services'
import { useMutation } from '@tanstack/react-query'

type Inputs = {
  username: string
  password: string
}

export const useLogin = () => {
  const { logUserIn } = useAuth()

  const { mutate, isPending, data, error } = useMutation({
    mutationFn: async (data: Inputs) => {
      return new AuthService().login({
        email: data.username,
        password: data.password,
      })
    },
  })

  const onLogin = (params: {
    data: Inputs
    onError?: (error: Error) => void
    onSuccess?: (data: any) => void
  }) => {
    const { data, onError, onSuccess } = params
    mutate(data, {
      onError: (error) => {
        onError?.(error)
      },
      onSuccess: (data) => {
        onSuccess?.(data)
        logUserIn()
      },
    })
  }

  return [onLogin, { isPending, data, error }] as const
}
