import { AxiosRequestConfig, GenericAbortSignal, isAxiosError } from 'axios'
import { z } from 'zod'

import { axios, AxiosInstance, AxiosResponse, isCancel } from './config/axios'

const UNKNOWN_ERROR = 'Unexpected Error Occurred'

interface IServices {
  readonly url: string
  abortController?: AbortController
  cancelRequest(): void
  isCancel(error: unknown): boolean
  axios: (isMockApi?: boolean) => AxiosInstance
  fetchApi<T extends z.Schema, K = z.infer<T>>(params: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    url: string
    schema: T
    data?: any
    params?: RequestInit
    headers?: AxiosRequestConfig['headers']
    signal?: GenericAbortSignal
    transformResponse?: (response: z.infer<T>) => K
    isMockApi?: boolean
  }): Promise<{ data: K; cookie: string | undefined }>
}

export abstract class Services implements IServices {
  abstract readonly url: string
  abstract abortController?: AbortController
  axios: (isMockApi?: boolean) => AxiosInstance

  constructor() {
    this.axios = axios
  }

  isCancel(error: unknown): boolean {
    return isCancel(error)
  }

  cancelRequest(): void {
    if (this.abortController) {
      this.abortController.abort()
    }
  }

  getCookie = (cookie: string | undefined): AxiosRequestConfig['headers'] => {
    return {
      Cookie: `Authorization=${cookie}`,
    }
  }

  onError = (error: any) => {
    if (this.isCancel(error)) {
      // Handle other error
      throw error
    } else if (isAxiosError(error)) {
      if (error.status === 401) {
        throw new Error('Unauthorized')
      }
      throw new Error(
        error.response
          ? error.response.data.error || error.response.data.message || error.response.statusText
          : UNKNOWN_ERROR,
      )
    }
    throw new Error(UNKNOWN_ERROR)
  }

  async fetchApi<Input = any, Schema extends z.Schema = any, Output = z.infer<Schema>>({
    method,
    url,
    schema,
    params,
    data,
    headers = {},
    signal,
    transformResponse,
    isMockApi,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    url: string
    schema: Schema
    data?: AxiosRequestConfig<Input>['data']
    params?: Input
    headers?: AxiosRequestConfig['headers']
    signal?: GenericAbortSignal
    transformResponse?: (response: z.infer<Schema>) => Output
    isMockApi?: boolean
  }): Promise<{ data: Output | any; cookie: string | undefined }> {
    try {
      const response: AxiosResponse<Schema> = await this.axios(isMockApi)({
        method,
        url,
        data,
        params,
        headers,
        signal,
        withCredentials: true,
      })
      const cookie = response.headers['set-cookie']?.[0]
      const dataResponse = schema.safeParse(response.data)
      if (dataResponse.success) {
        const transformedData = transformResponse
          ? transformResponse(dataResponse.data)
          : dataResponse.data
        return {
          data: transformedData,
          cookie: cookie,
        }
      } else {
        console.error('ERROR_ZOD', dataResponse.error)
        return {
          data: response.data,
          cookie: cookie,
        }
      }
    } catch (error) {
      throw this.onError(error)
    }
  }
}
