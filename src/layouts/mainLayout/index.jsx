import withAuthGuard from './withAuthGuard'

export const MainLayout = withAuthGuard((props) => {
  const { children } = props
  return children
})
