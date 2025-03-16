import { getUseRuntimeConfig } from '@/configs/env'
import { useQuery } from '@tanstack/react-query'
import camelcaseKeys from 'camelcase-keys'

type PartnerAttributes = {
  id: string
  logoUrl: string
  name: string
}

const fetchPartnerAttributes = async (token: string) => {
  const url = getUseRuntimeConfig()
  const response = await fetch(`${url}/v2/partner/attributes`, {
    headers: { Authorization: token }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch partner attributes')
  }
  const data = await response.json()
  return camelcaseKeys(data, { deep: true })
}

const usePartnerAttributes = (token) => {
  // Query for partner attributes
  return useQuery<PartnerAttributes, Error>({
    queryKey: ['partnerAttributes', token],
    queryFn: () => fetchPartnerAttributes(token as string),
    enabled: !!token,
    retry: false
  })
}

export default usePartnerAttributes
