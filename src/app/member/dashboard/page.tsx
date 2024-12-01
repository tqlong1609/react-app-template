'use client'

import { useAuth } from '@/providers/AuthProvider'

export default function DashboardPage() {
  const { logUserOut } = useAuth()
  return (
    <div>
      <button onClick={logUserOut}>ログアウト</button>
    </div>
  )
}
