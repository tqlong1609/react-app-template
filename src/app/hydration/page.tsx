import { getUsers } from '@/utils/api-requests'
import { dehydrate } from '@tanstack/query-core'
import { HydrationBoundary, QueryClient } from '@tanstack/react-query'

import ListUsers from './list-users'

export default async function Hydation() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['hydrate-users'],
    queryFn: () => getUsers(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListUsers />
    </HydrationBoundary>
  )
}
