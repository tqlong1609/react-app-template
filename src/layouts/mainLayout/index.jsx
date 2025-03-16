import DashboardHeader from '@/components/DashboardHeader'
import MainSideBar from '@/components/MainSideBar'

import withAuthGuard from './withAuthGuard'

export const MainLayout = withAuthGuard((props) => {
  const { children } = props
  return (
    <>
      <DashboardHeader />
      {children}
      <MainSideBar />
    </>
  )
})
