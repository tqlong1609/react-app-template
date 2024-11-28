import { AxiosError, AxiosResponse } from 'axios'

import { getLogger } from './getLogger'

class AxiosErrorExtends extends AxiosError {
  duration = 0
}

const loggerError = getLogger('error')
const loggerInfo = getLogger('info')

const logger = (params: { type: 'error'; error: unknown } | { type: 'info'; response: any }) => {
  if (params.type === 'error') {
    const error: AxiosErrorExtends = params.error as AxiosErrorExtends
    loggerError.error({
      url: error.config?.url,
      payload: {
        params: error.config?.params,
        data: error.config?.data,
      },
      responseTime: error.duration,
      response: {
        status: error.response?.status,
        data: error.response?.data,
      },
    })
  } else {
    const response = params.response as AxiosResponse & { duration: number }
    loggerInfo.info({
      url: response.config.url,
      payload: {
        params: response.config.params,
        data: response.config.data,
      },
      responseTime: response.duration,
      response: response.data,
    })
  }
}

export default logger
