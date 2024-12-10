import { getUseRuntimeConfig } from '@/configs/env'
import { useMutation } from '@tanstack/react-query'
import JSZip from 'jszip'

const fetchBodyImages = async (id: string | string[], token: string) => {
  const width = 600
  const url = getUseRuntimeConfig()

  const queryParams = new URLSearchParams({
    width: width.toString(),
    height: (width * 2).toString()
  }).toString()
  const response = await fetch(`${url}/v2/partner/images/body/${id}?${queryParams}`, {
    headers: {
      Authorization: token,
      Accept: 'application/zip'
    },
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error('Failed to fetch bodies')
  }
  const data = await response.json()
  return data
}

export const useFetchBodyImages = (id: string | string[], token: string) => {
  return useMutation({
    mutationFn: async () => await fetchBodyImages(id, token),
    onSuccess: async (images) => {
      const zip = new JSZip()
      const file = await zip.loadAsync(images)
      return {
        front: await file.file('front.png')?.async('base64'),
        side: await file.file('side.png')?.async('base64'),
        bodyLeanLR: await file.file('body_lean_L_R.svg')?.async('base64'),
        bodyLeanFB: await file.file('body_lean_F_B.svg')?.async('base64'),
        iliacCrestHeight: await file.file('iliac_crest_height.svg')?.async('base64'),
        shoulderHeight: await file.file('shoulder_height.svg')?.async('base64')
      }
    },
    onError: () => {}
  })
}
