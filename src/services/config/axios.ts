import axiosLib, { AxiosError, AxiosInstance, AxiosResponse, isAxiosError } from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

function isDevelopment() {
  return !process.env['NODE_ENV'] || process.env['NODE_ENV'] === 'development'
}

function isHaveToMock() {
  return process.env['NEXT_PUBLIC_IS_MOCK']
}

const MOCK_API = {
  DELAY_RESPONSE_MOCK_API: 500,
}
const axiosInstance = axiosLib.create()
const axiosMockInstance = axiosLib.create()
const axiosMockAdapterInstance = new AxiosMockAdapter(axiosMockInstance, {
  delayResponse: MOCK_API.DELAY_RESPONSE_MOCK_API,
})

const axios = (isMockApi = false) => {
  return isHaveToMock() || (isMockApi && isDevelopment()) ? axiosMockInstance : axiosInstance
}

const isCancel = (error: unknown): boolean => {
  return axiosLib.isCancel(error)
}

export const getAxiosNormalInstance = () => axiosInstance

export { axios, axiosMockInstance, axiosMockAdapterInstance, isDevelopment, isCancel, isAxiosError }

export type { AxiosResponse, AxiosInstance, AxiosError }
