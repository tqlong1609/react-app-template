import PropTypes from 'prop-types'
import { createContext, useContext, useEffect, useReducer, useRef } from 'react'

import Auth, { awsAmplifyConfig } from '@/configs/aws-amplify'

export type AuthState = {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    email: string
  } | null
  signIn: ({ username, password }: { username: string; password: string }) => Promise<any>
  signOut: () => Promise<any>
}

export const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
} as const

export type AuthAction =
  | { type: typeof HANDLERS.INITIALIZE; payload?: { user: AuthState['user'] } }
  | { type: typeof HANDLERS.SIGN_IN; payload: { user: AuthState['user'] } }
  | { type: typeof HANDLERS.SIGN_OUT; payload?: undefined }

export const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve()
}

export const handlers: {
  [K in (typeof HANDLERS)[keyof typeof HANDLERS]]: (
    state: AuthState,
    action: AuthAction
  ) => AuthState
} = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload?.user

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user
          }
        : {
            isLoading: false
          })
    }
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload?.user

    return {
      ...state,
      isAuthenticated: true,
      user: user !== undefined ? user : null,
      isLoading: false
    }
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    }
  }
}

export const reducer = (state: AuthState, action: AuthAction): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state

export const AuthContext = createContext<AuthState>(initialState)

export interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const initialized = useRef(false)

  useEffect(() => {
    awsAmplifyConfig()
  }, [])

  const initialize = async () => {
    if (initialized.current) {
      return
    }

    initialized.current = true

    try {
      const response = await Auth.currentAuthenticatedUser()
      const payload = {
        user: {
          id: response.username,
          email: response.attributes.email
        }
      }

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: payload
      })
    } catch (error) {
      dispatch({
        type: HANDLERS.INITIALIZE
      })
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  const signIn = async ({ username, password }: { username: string; password: string }) => {
    try {
      const response = await Auth.signIn({
        username,
        password
      })

      const payload = {
        user: {
          id: response.username,
          email: response.attributes.email
        }
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: payload
      })

      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const signOut = () => {
    return Auth.signOut()
      .then(() => {
        dispatch({
          type: HANDLERS.SIGN_OUT
        })
      })
      .catch((error) => {
        console.error('Error signing out:', error)
        return Promise.reject(error)
      })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node
}

export const AuthConsumer = AuthContext.Consumer

export const useAuthContext = () => useContext<AuthState>(AuthContext)
