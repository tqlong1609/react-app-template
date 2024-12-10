import { BodyDetail } from '@/commons/measurements.types'
import { getUseRuntimeConfig } from '@/configs/env'
import { useQuery } from '@tanstack/react-query'
import camelcaseKeys from 'camelcase-keys'
import { API_QUERY_KEYS } from './keys'

export const useFetchBody = (id: string | string[], token: string) => {
  const url = `${getUseRuntimeConfig()}/v3/partner/bodies/${id}`
  const params = {
    headers: {
      Authorization: token
    }
  }

  return useQuery<BodyDetail, Error>({
    queryKey: [API_QUERY_KEYS.BODY, id],
    queryFn: async () => {
      const response = await fetch(url, params)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const fetchedData = await response.json()
      const transformedData = camelcaseKeys(fetchedData, { deep: true })
      return transformedData as BodyDetail
    },
    retry: false,
    enabled: !!token && !!id
  })
}

