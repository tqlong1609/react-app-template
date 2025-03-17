import { useEffect, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import Loader from '@/components/Loader'
import { Auth } from 'aws-amplify'
import { useRouter } from 'next/router'

const allowedRoutes = [
  '/member/bodies/[id]/diagnosis',
  '/member/bodies/[id]/postural',
  '/member/bodies/[id]/postural/[typeId]'
]

const ALLOW_USER_GROUP = 'mbd_layout:mrb1'

const ProtectedRoute = ({ component: Component }) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)
  const router = useRouter()
  const { showBoundary } = useErrorBoundary()

  const currentPath = router.pathname

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'] || []

        const hasRequiredGroup = userGroups.includes(ALLOW_USER_GROUP)
        const isAllowedRoute = Object.values(allowedRoutes).includes(currentPath)

        if (!hasRequiredGroup || !isAllowedRoute) {
          throw new Error(' アクセス権限が無いため表示できません。')
        }
        setIsAllowed(true)
      } catch (error: any) {
        setIsAllowed(false)
        showBoundary({ statusCode: 403, message: error.message })
      }
    }
    checkPermissions()
  }, [location, router])

  if (isAllowed === null) return <Loader />
  return isAllowed ? <Component /> : null
}

export default ProtectedRoute
