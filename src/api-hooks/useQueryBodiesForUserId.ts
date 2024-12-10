import { Body } from '@/commons/measurements.types'
import { getUseRuntimeConfig } from '@/configs/env'
import { useQuery } from '@tanstack/react-query'
import camelcaseKeys from 'camelcase-keys'
import { API_QUERY_KEYS } from './keys'

type BodiesInfo = {
  pageInfo: {
    totalPage: number
    currentPage: number
    totalCount: number
  }
  bodies: Body[]
}

const fetchBodiesForUserId = async (token: string, userId: string) => {
  const url = getUseRuntimeConfig()
  const queryParams = new URLSearchParams({
    page: '1',
    per_page: '999',
    order: 'new',
    user_id: userId
  }).toString()
  const response = await fetch(`${url}/v2/partner/bodies?${queryParams}`, {
    headers: { Authorization: token },
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch bodies')
  }
  const data = await response.json()
  return camelcaseKeys(data, { deep: true })
}

export const useFetchBodiesForUserId = (token: string, userId: string) => {
  return useQuery<BodiesInfo, Error>({
    queryKey: [API_QUERY_KEYS.BODIES_FOR_USER_ID, userId],
    queryFn: () => fetchBodiesForUserId(token, userId),
    enabled: !!token && !!userId,
    retry: false
  })
}
