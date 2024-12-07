export type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}
