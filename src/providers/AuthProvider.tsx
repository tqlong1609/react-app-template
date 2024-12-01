import { Context, createContext, ReactNode, useContext, useEffect, useState } from 'react'

import LoadingLayout from '@/components/LoadingLayout'
import Auth, { awsAmplifyConfig } from '@/configs/aws-amplify'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

type AuthContextType = {
  isAuthenticated: boolean
  logUserIn: ({ userId, password }: { userId: string; password: string }) => void
  logUserOut: () => void
  user: {
    id: string
    email: string
  } | null
  isLoading: boolean
}

type AuthContextPropsType = {
  children: ReactNode
}

const AuthContext: Context<AuthContextType | null> = createContext<AuthContextType | null>(null)

const publicRoutes = ['/guest/signin']

const isRoutePublic = (pathname: string) => {
  return publicRoutes.includes(pathname)
}

export const AuthProvider = ({ children }: AuthContextPropsType) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  useEffect(() => {
    awsAmplifyConfig()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const response = await Auth.currentAuthenticatedUser()
        setUser({
          id: response.username,
          email: response.attributes.email
        })
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/guest/signin')
    } else if (isAuthenticated) {
      if (isRoutePublic(pathname) || pathname === '/') {
        router.push('/member/dashboard')
      } else {
        router.push(pathname)
      }
    }
  }, [isAuthenticated, pathname, router])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (!isLoading && !isReady) {
      timeoutId = setTimeout(() => {
        setIsReady(true)
      }, 50)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [isLoading])

  const logUserIn = ({ userId, password }: { userId: string; password: string }) => {
    Auth.signIn({
      username: userId,
      password
    })
      .then(() => {
        setIsAuthenticated(true)
      })
      .catch((error) => {
        console.error('Error signing in:', error)
      })
  }

  const logUserOut = () => {
    Auth.signOut()
      .then(() => {
        setIsAuthenticated(false)
      })
      .catch((error) => {
        console.error('Error signing out:', error)
      })
  }

  if (isLoading || !isReady) {
    return <LoadingLayout />
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, logUserIn, logUserOut, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. Make sure you are rendering AuthProvider at the top level of your application.'
    )
  }

  return context
}
