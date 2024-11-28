import pino, { Logger } from 'pino'
import pretty from 'pino-pretty'
import 'server-only'

import { LOGGER_TYPE } from './type'

type LOG_METHOD = 'file' | 'console'

const destinationPathBase: Record<LOGGER_TYPE, string> = {
  error: './log/app.error.log',
  info: './log/app.info.log',
}

const logMethod = process.env.LOG_METHOD as LOG_METHOD

export const getLogger = (
  type: LOGGER_TYPE,
  destinationPath: Record<LOGGER_TYPE, string> = destinationPathBase,
): Logger<any> => {
  if (logMethod === 'file') {
    const fileTransport = pino.transport({
      target: 'pino-pretty',
      options: {
        destination: destinationPath[type],
      },
    })
    return pino(
      {
        level: process.env.PINO_LOG_LEVEL || type,
        formatters: {
          level: (label: string) => {
            return { level: label.toUpperCase() }
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      fileTransport,
    )
  } else {
    const stream = pretty({
      colorize: true,
    }) as any
    return pino(stream)
  }
}
